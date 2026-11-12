export interface KeystrokeMutation {
  type: 'INSERT' | 'DELETE' | 'PASTE' | 'BACKSPACE';
  textSnippet?: string;
  charCount: number;
  timestamp: number;
  cursorPosition?: number;
}

export interface EssayRevisionSnapshot {
  version: number;
  timestamp: number;
  content: string;
  authorAction: string;
  deltaCharCount: number;
}

export interface EssayIntegrityAnalysis {
  essayId: string;
  sessionId: string;
  candidateId: string;
  totalCharacters: number;
  totalWords: number;
  pasteRatio: number; // 0.0 to 1.0
  pasteBurstsCount: number; // instances of >= 50 chars pasted in one event
  typingCadence: {
    medianIkiMs: number;
    ikiVariance: number;
    estimatedWpm: number;
    backspaceRatio: number;
    isCadenceNatural: boolean;
  };
  aiTextIndicator: {
    suspicionScore: number; // 0 to 100
    flagLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    isProof: false; // MANDATORY: AI-text detection is NEVER proof
    advisoryNote: string; // Explains human review only
    metrics: {
      estimatedPerplexity: number;
      burstinessScore: number;
      repeatedPhraseRatio: number;
    };
  };
  revisionHistory: EssayRevisionSnapshot[];
  isFlaggedForReview: boolean;
  reviewReasons: string[];
}

export class EssayIntegrityEngine {
  /**
   * Analyzes an essay answer along with keystroke mutations and revisions.
   */
  public analyzeEssay(
    essayId: string,
    sessionId: string,
    candidateId: string,
    finalText: string,
    mutations: KeystrokeMutation[],
    ikis: number[] = []
  ): EssayIntegrityAnalysis {
    const totalChars = finalText.length;
    const words = finalText.trim().split(/\s+/).filter(Boolean);
    const totalWords = words.length;

    // 1. Calculate Paste Ratio & Large Paste Bursts
    let pastedChars = 0;
    let pasteBurstsCount = 0;

    for (const m of mutations) {
      if (m.type === 'PASTE') {
        pastedChars += m.charCount;
        if (m.charCount >= 50) {
          pasteBurstsCount++;
        }
      }
    }

    const pasteRatio = totalChars > 0 ? Math.min(1.0, pastedChars / totalChars) : 0.0;

    // 2. Typing Cadence Analysis
    const validIkis = ikis.filter((i) => i > 20 && i < 2000); // filter noise
    let medianIkiMs = 120;
    let ikiVariance = 30;

    if (validIkis.length > 0) {
      const sorted = [...validIkis].sort((a, b) => a - b);
      medianIkiMs = sorted[Math.floor(sorted.length / 2)];
      const mean = validIkis.reduce((acc, v) => acc + v, 0) / validIkis.length;
      ikiVariance = Math.round(
        Math.sqrt(validIkis.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / validIkis.length)
      );
    }

    // Backspace / Revision frequency
    const backspaces = mutations.filter((m) => m.type === 'BACKSPACE' || m.type === 'DELETE').length;
    const backspaceRatio = mutations.length > 0 ? backspaces / mutations.length : 0.1;
    const estimatedWpm = medianIkiMs > 0 ? Math.round((60000 / (medianIkiMs * 5))) : 40;

    // Natural typing has moderate variance and non-zero backspace usage
    const isCadenceNatural = (ikiVariance > 15 || validIkis.length === 0) && (backspaceRatio > 0.02 || totalChars < 50);

    // 3. Reconstruct Revision History Replay
    const revisionHistory = this.buildRevisionReplay(mutations, finalText);

    // 4. AI-Text Detection Heuristic (Statistical Perplexity & Burstiness)
    const aiIndicator = this.evaluateAiTextHeuristic(finalText, words);

    // 5. Evaluate if essay should be flagged for human review
    const reviewReasons: string[] = [];
    if (pasteRatio > 0.40) {
      reviewReasons.push(`Excessive paste ratio: ${(pasteRatio * 100).toFixed(1)}% of essay content was pasted.`);
    }
    if (pasteBurstsCount > 0) {
      reviewReasons.push(`${pasteBurstsCount} sudden text paste burst(s) exceeding 50 characters.`);
    }
    if (!isCadenceNatural && totalChars > 150) {
      reviewReasons.push('Abnormally uniform typing cadence with zero backspace corrections.');
    }
    if (aiIndicator.suspicionScore > 70) {
      // Keep weight low per mandate
      reviewReasons.push(`Automated stylistic anomaly flag (${aiIndicator.suspicionScore}% similarity to generative phrasing) - Human Review Only.`);
    }

    const isFlaggedForReview = reviewReasons.length > 0;

    return {
      essayId,
      sessionId,
      candidateId,
      totalCharacters: totalChars,
      totalWords,
      pasteRatio: Math.round(pasteRatio * 100) / 100,
      pasteBurstsCount,
      typingCadence: {
        medianIkiMs,
        ikiVariance,
        estimatedWpm,
        backspaceRatio: Math.round(backspaceRatio * 100) / 100,
        isCadenceNatural,
      },
      aiTextIndicator: aiIndicator,
      revisionHistory,
      isFlaggedForReview,
      reviewReasons,
    };
  }

  /**
   * Builds an incremental snapshot sequence allowing proctors to "replay" essay writing.
   */
  public buildRevisionReplay(
    mutations: KeystrokeMutation[],
    finalText: string
  ): EssayRevisionSnapshot[] {
    const snapshots: EssayRevisionSnapshot[] = [];
    let currentText = '';
    let version = 1;

    // Add initial state
    snapshots.push({
      version: version++,
      timestamp: mutations.length > 0 ? mutations[0].timestamp - 1000 : Date.now(),
      content: '',
      authorAction: 'INIT',
      deltaCharCount: 0,
    });

    for (let i = 0; i < mutations.length; i++) {
      const m = mutations[i];

      if (m.type === 'INSERT') {
        currentText += (m.textSnippet || ' ');
      } else if (m.type === 'PASTE') {
        currentText += (m.textSnippet || `[PASTED_${m.charCount}_CHARS]`);
      } else if (m.type === 'BACKSPACE' || m.type === 'DELETE') {
        currentText = currentText.slice(0, Math.max(0, currentText.length - m.charCount));
      }

      // Record snapshot periodically (every 5 mutations or on large paste)
      if (i % 5 === 0 || m.type === 'PASTE' || i === mutations.length - 1) {
        snapshots.push({
          version: version++,
          timestamp: m.timestamp,
          content: currentText,
          authorAction: m.type,
          deltaCharCount: m.charCount,
        });
      }
    }

    // Ensure final state matches
    if (snapshots[snapshots.length - 1]?.content !== finalText) {
      snapshots.push({
        version: version++,
        timestamp: Date.now(),
        content: finalText,
        authorAction: 'FINAL_SUBMISSION',
        deltaCharCount: finalText.length - currentText.length,
      });
    }

    return snapshots;
  }

  /**
   * Statistical stylistic heuristic estimating linguistic repetition & uniformity.
   * MANDATORY POLICY: Output is labeled with isProof = false and advisory note.
   */
  private evaluateAiTextHeuristic(text: string, words: string[]): {
    suspicionScore: number;
    flagLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    isProof: false;
    advisoryNote: string;
    metrics: { estimatedPerplexity: number; burstinessScore: number; repeatedPhraseRatio: number };
  } {
    if (words.length < 30) {
      return {
        suspicionScore: 0,
        flagLevel: 'LOW',
        isProof: false,
        advisoryNote: 'Advisory signal only. Sample too short for stylistic pattern analysis. Reviewer discretion required.',
        metrics: { estimatedPerplexity: 100, burstinessScore: 50, repeatedPhraseRatio: 0 },
      };
    }

    // 1. Measure sentence length variance (burstiness: humans vary sentence lengths widely)
    const sentences = text.split(/[.!?]+/).map((s) => s.trim().split(/\s+/).length).filter((len) => len > 2);
    let burstinessScore = 50;
    if (sentences.length >= 3) {
      const meanLen = sentences.reduce((a, b) => a + b, 0) / sentences.length;
      const variance = Math.sqrt(sentences.reduce((a, b) => a + Math.pow(b - meanLen, 2), 0) / sentences.length);
      // Low variance in sentence length is characteristic of synthetic text
      burstinessScore = Math.max(0, Math.min(100, Math.round(100 - (variance * 8))));
    }

    // 2. Vocabulary repetition ratio (unique words vs total words)
    const uniqueWords = new Set(words.map((w) => w.toLowerCase())).size;
    const vocabDiversity = uniqueWords / words.length;

    // 3. Formulaic transitional phrases typical of LLMs
    const FORMULAIC_PATTERNS = [
      /in conclusion/i,
      /furthermore/i,
      /moreover/i,
      /it is crucial to/i,
      /delve into/i,
      /tapestry of/i,
      /testament to/i,
      /plays a pivotal role/i,
      /comprehensive understanding/i,
      /navigate the landscape/i,
    ];
    let formulaicCount = 0;
    for (const pattern of FORMULAIC_PATTERNS) {
      if (pattern.test(text)) formulaicCount++;
    }

    // Composite heuristic score
    let suspicionScore = Math.round((burstinessScore * 0.4) + (formulaicCount * 12) + ((1 - vocabDiversity) * 40));
    suspicionScore = Math.max(0, Math.min(100, suspicionScore));

    const flagLevel = suspicionScore >= 75 ? 'HIGH' : suspicionScore >= 50 ? 'MEDIUM' : 'LOW';

    return {
      suspicionScore,
      flagLevel,
      isProof: false, // Strict requirement
      advisoryNote: 'Advisory signal only. AI-text detection carries known false-positive rates on ESL and technical authors and must NEVER be used as autonomous proof or grounds for automated disqualification.',
      metrics: {
        estimatedPerplexity: Math.max(10, 100 - suspicionScore),
        burstinessScore,
        repeatedPhraseRatio: Math.round((1 - vocabDiversity) * 100) / 100,
      },
    };
  }
}

export const essayIntegrityEngine = new EssayIntegrityEngine();
