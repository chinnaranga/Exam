export interface CandidateSessionSubmission {
  sessionId: string;
  candidateId: string;
  candidateName?: string;
  examId: string;
  ipAddress: string;
  answers: Record<string | number, { selectedOption: number | string; answeredAt: number }>;
}

export interface CandidatePairComparison {
  candidateA: string;
  candidateB: string;
  sessionA: string;
  sessionB: string;
  compositeSimilarityScore: number; // 0.0 to 1.0 (or 0-100%)
  sharedIp: boolean;
  ipAddress: string;
  identicalWrongAnswersCount: number;
  identicalWrongQuestions: Array<{ questionId: string | number; wrongAnswer: string | number }>;
  synchronizedAnswerCount: number; // submitted within <= 3 seconds of each other
  isSuspectedCollusion: boolean;
  collusionRationale: string[];
}

export interface CollusionCluster {
  clusterId: string;
  candidates: string[];
  sessionIds: string[];
  averageSimilarity: number;
  primaryRiskFactors: string[];
}

export interface CrossCandidateSimilarityReport {
  examId: string;
  generatedAt: number;
  totalCandidatesAnalyzed: number;
  pairwiseComparisonsCount: number;
  suspectedCollusionPairs: CandidatePairComparison[];
  collusionClusters: CollusionCluster[];
  sharedIpGroups: Record<string, string[]>; // ip -> candidateIds
}

export class CrossCandidateAnalysisEngine {
  /**
   * Compares all candidate submissions for an exam to detect identical wrong answers,
   * synchronized timing, shared IPs, and collusion clusters.
   */
  public analyzeExamCohort(
    examId: string,
    submissions: CandidateSessionSubmission[],
    correctAnswers: Record<string | number, number | string>
  ): CrossCandidateSimilarityReport {
    const pairs: CandidatePairComparison[] = [];
    const sharedIpGroups: Record<string, string[]> = {};

    // 1. Group by IP address
    for (const sub of submissions) {
      if (!sharedIpGroups[sub.ipAddress]) {
        sharedIpGroups[sub.ipAddress] = [];
      }
      sharedIpGroups[sub.ipAddress].push(sub.candidateId);
    }

    // 2. Pairwise Analysis (O(N^2))
    for (let i = 0; i < submissions.length; i++) {
      for (let j = i + 1; j < submissions.length; j++) {
        const subA = submissions[i];
        const subB = submissions[j];

        const comparison = this.comparePair(subA, subB, correctAnswers);
        if (comparison.compositeSimilarityScore > 0.35 || comparison.isSuspectedCollusion || comparison.sharedIp) {
          pairs.push(comparison);
        }
      }
    }

    // Sort pairs by similarity descending
    pairs.sort((a, b) => b.compositeSimilarityScore - a.compositeSimilarityScore);

    // 3. Cluster formation using connected components / graph clustering
    const clusters = this.findCollusionClusters(pairs.filter((p) => p.isSuspectedCollusion));

    return {
      examId,
      generatedAt: Date.now(),
      totalCandidatesAnalyzed: submissions.length,
      pairwiseComparisonsCount: (submissions.length * (submissions.length - 1)) / 2,
      suspectedCollusionPairs: pairs.filter((p) => p.isSuspectedCollusion),
      collusionClusters: clusters,
      sharedIpGroups: Object.fromEntries(
        Object.entries(sharedIpGroups).filter(([_, cands]) => cands.length > 1)
      ),
    };
  }

  /**
   * Compares two candidate sessions across answers, wrong answers, timing, and IP.
   */
  public comparePair(
    subA: CandidateSessionSubmission,
    subB: CandidateSessionSubmission,
    correctAnswers: Record<string | number, number | string>
  ): CandidatePairComparison {
    const keysA = Object.keys(subA.answers);
    const keysB = Object.keys(subB.answers);
    const commonQuestions = keysA.filter((q) => keysB.includes(q));

    let identicalAnswersCount = 0;
    let identicalWrongCount = 0;
    let synchronizedCount = 0;
    const identicalWrongQuestions: Array<{ questionId: string | number; wrongAnswer: string | number }> = [];
    const rationale: string[] = [];

    const isSharedIp = subA.ipAddress === subB.ipAddress && subA.ipAddress !== '127.0.0.1';
    if (isSharedIp) {
      rationale.push(`Shared network IP address (${subA.ipAddress}) during simultaneous testing.`);
    }

    for (const q of commonQuestions) {
      const ansA = subA.answers[q];
      const ansB = subB.answers[q];
      const correct = correctAnswers[q];

      if (ansA.selectedOption === ansB.selectedOption) {
        identicalAnswersCount++;

        // Check if both got it WRONG with the EXACT same incorrect answer
        if (correct !== undefined && ansA.selectedOption !== correct) {
          identicalWrongCount++;
          identicalWrongQuestions.push({
            questionId: q,
            wrongAnswer: ansA.selectedOption,
          });
        }
      }

      // Synchronized timing: answered within 3 seconds of each other
      if (Math.abs(ansA.answeredAt - ansB.answeredAt) <= 3000) {
        synchronizedCount++;
      }
    }

    const totalCommon = Math.max(1, commonQuestions.length);
    const answerSimilarityRatio = identicalAnswersCount / totalCommon;
    const wrongAnswerSimilarityRatio = totalCommon > 0 ? identicalWrongCount / totalCommon : 0;
    const timingSyncRatio = totalCommon > 0 ? synchronizedCount / totalCommon : 0;

    // Weight the composite similarity
    let compositeScore = (
      answerSimilarityRatio * 0.35 +
      wrongAnswerSimilarityRatio * 0.35 +
      timingSyncRatio * 0.20 +
      (isSharedIp ? 0.10 : 0.0)
    );
    compositeScore = Math.min(1.0, compositeScore);

    if (identicalWrongCount >= 3) {
      rationale.push(`Selected identical wrong answers on ${identicalWrongCount} distinct questions.`);
    }
    if (timingSyncRatio >= 0.5 && synchronizedCount >= 3) {
      rationale.push(`Submitted ${synchronizedCount} answers in lockstep within 3 seconds of each other.`);
    }

    const isSuspectedCollusion = compositeScore >= 0.65 || (identicalWrongCount >= 3 && isSharedIp);

    return {
      candidateA: subA.candidateId,
      candidateB: subB.candidateId,
      sessionA: subA.sessionId,
      sessionB: subB.sessionId,
      compositeSimilarityScore: Math.round(compositeScore * 100) / 100,
      sharedIp: isSharedIp,
      ipAddress: subA.ipAddress,
      identicalWrongAnswersCount: identicalWrongCount,
      identicalWrongQuestions,
      synchronizedAnswerCount: synchronizedCount,
      isSuspectedCollusion,
      collusionRationale: rationale,
    };
  }

  /**
   * Group collusion pairs into clusters using graph connected components.
   */
  private findCollusionClusters(pairs: CandidatePairComparison[]): CollusionCluster[] {
    const adj: Map<string, Set<string>> = new Map();
    const candidateSessionMap: Map<string, string> = new Map();
    const pairMap: Map<string, CandidatePairComparison> = new Map();

    for (const p of pairs) {
      if (!adj.has(p.candidateA)) adj.set(p.candidateA, new Set());
      if (!adj.has(p.candidateB)) adj.set(p.candidateB, new Set());

      adj.get(p.candidateA)!.add(p.candidateB);
      adj.get(p.candidateB)!.add(p.candidateA);

      candidateSessionMap.set(p.candidateA, p.sessionA);
      candidateSessionMap.set(p.candidateB, p.sessionB);

      const pairKey = [p.candidateA, p.candidateB].sort().join('::');
      pairMap.set(pairKey, p);
    }

    const visited: Set<string> = new Set();
    const clusters: CollusionCluster[] = [];
    let clusterIdx = 1;

    for (const node of adj.keys()) {
      if (!visited.has(node)) {
        const clusterMembers: string[] = [];
        const queue = [node];
        visited.add(node);

        while (queue.length > 0) {
          const current = queue.shift()!;
          clusterMembers.push(current);

          for (const neighbor of adj.get(current) || []) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push(neighbor);
            }
          }
        }

        if (clusterMembers.length >= 2) {
          // Calculate average similarity within the cluster
          let totalSim = 0;
          let count = 0;
          const riskFactors = new Set<string>();

          for (let i = 0; i < clusterMembers.length; i++) {
            for (let j = i + 1; j < clusterMembers.length; j++) {
              const pairKey = [clusterMembers[i], clusterMembers[j]].sort().join('::');
              const pair = pairMap.get(pairKey);
              if (pair) {
                totalSim += pair.compositeSimilarityScore;
                count++;
                pair.collusionRationale.forEach((r) => riskFactors.add(r));
              }
            }
          }

          clusters.push({
            clusterId: `CLUSTER_COL_${clusterIdx++}`,
            candidates: clusterMembers,
            sessionIds: clusterMembers.map((c) => candidateSessionMap.get(c) || c),
            averageSimilarity: count > 0 ? Math.round((totalSim / count) * 100) / 100 : 0.7,
            primaryRiskFactors: Array.from(riskFactors),
          });
        }
      }
    }

    return clusters;
  }
}

export const crossCandidateAnalysisEngine = new CrossCandidateAnalysisEngine();

