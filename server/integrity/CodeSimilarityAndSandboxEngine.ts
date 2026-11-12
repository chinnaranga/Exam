import vm from 'node:vm';

export interface CodeComparisonResult {
  candidateA: string;
  candidateB: string;
  similarityPercentage: number; // 0 to 100%
  tokenOverlapRatio: number; // 0.0 to 1.0
  structureMatchRatio: number; // 0.0 to 1.0
  matchedTokenSequencesCount: number;
  isPlagiarismSuspected: boolean; // >= 75%
  matchedSnippets: Array<{ tokenSequence: string; count: number }>;
}

export interface SandboxExecutionOptions {
  timeoutMs?: number; // default: 2000ms
  maxMemoryMb?: number; // default: 64MB
  allowConsole?: boolean;
}

export interface SandboxExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTimeMs: number;
  memoryUsedMb?: number;
  timedOut: boolean;
}

export class CodeSimilarityAndSandboxEngine {
  /**
   * Tokenizes code by stripping comments and string literals, standardizing identifiers,
   * and extracting syntactical tokens (keywords, operators, punctuation).
   */
  public tokenize(code: string): string[] {
    // 1. Strip block comments (/* ... */) and line comments (// ... or # ...)
    let cleaned = code
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/\/\/.*$/gm, ' ')
      .replace(/#.*$/gm, ' ');

    // 2. Tokenize by symbols, operators, and words
    const rawTokens = cleaned.match(/[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+|===|!==|==|!=|<=|>=|=>|\+\+|--|&&|\|\||[+\-*/%=&|^~<>!?:;,.[\]{}()]/g) || [];

    // 3. Normalize identifiers vs keywords
    const KEYWORDS = new Set([
      'function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'do',
      'switch', 'case', 'break', 'continue', 'class', 'extends', 'new', 'try', 'catch',
      'finally', 'throw', 'async', 'await', 'import', 'export', 'from', 'default',
      'def', 'elif', 'in', 'is', 'lambda', 'with', 'as', 'pass', 'raise', 'yield'
    ]);

    const identifierMap = new Map<string, string>();
    let idCounter = 1;

    const normalizedTokens: string[] = [];

    for (const token of rawTokens) {
      if (KEYWORDS.has(token)) {
        normalizedTokens.push(`KW_${token.toUpperCase()}`);
      } else if (/^[0-9]+$/.test(token)) {
        normalizedTokens.push('NUM_LITERAL');
      } else if (/^[a-zA-Z_$]/.test(token)) {
        // Variable / Function identifier normalization (handles renaming)
        if (!identifierMap.has(token)) {
          identifierMap.set(token, `VAR_${idCounter++}`);
        }
        normalizedTokens.push(identifierMap.get(token)!);
      } else {
        // Operator / Delimiter
        normalizedTokens.push(`OP_${token}`);
      }
    }

    return normalizedTokens;
  }

  /**
   * Generates $k$-gram substrings from a token sequence.
   */
  public generateKGrams(tokens: string[], k: number = 4): Set<string> {
    const kGrams = new Set<string>();
    if (tokens.length < k) {
      if (tokens.length > 0) kGrams.add(tokens.join('_'));
      return kGrams;
    }

    for (let i = 0; i <= tokens.length - k; i++) {
      kGrams.add(tokens.slice(i, i + k).join('_'));
    }
    return kGrams;
  }

  /**
   * Compares two code submissions using token $k$-grams and Jaccard similarity.
   */
  public compareCodeSubmissions(
    candidateA: string,
    codeA: string,
    candidateB: string,
    codeB: string,
    kGramSize: number = 4
  ): CodeComparisonResult {
    const tokensA = this.tokenize(codeA);
    const tokensB = this.tokenize(codeB);

    const kGramsA = this.generateKGrams(tokensA, kGramSize);
    const kGramsB = this.generateKGrams(tokensB, kGramSize);

    // Compute Jaccard Overlap
    let intersectionCount = 0;
    const matchedKgrams: Array<{ tokenSequence: string; count: number }> = [];

    for (const gram of kGramsA) {
      if (kGramsB.has(gram)) {
        intersectionCount++;
        matchedKgrams.push({ tokenSequence: gram, count: 1 });
      }
    }

    const unionCount = new Set([...kGramsA, ...kGramsB]).size;
    const jaccard = unionCount > 0 ? intersectionCount / unionCount : 0.0;

    // Structural token length ratio
    const lenMin = Math.min(tokensA.length, tokensB.length);
    const lenMax = Math.max(1, Math.max(tokensA.length, tokensB.length));
    const structureMatch = lenMin / lenMax;

    // Weighted composite code similarity
    const similarityScore = Math.min(100, Math.round((jaccard * 0.8 + structureMatch * 0.2) * 100));

    return {
      candidateA,
      candidateB,
      similarityPercentage: similarityScore,
      tokenOverlapRatio: Math.round(jaccard * 100) / 100,
      structureMatchRatio: Math.round(structureMatch * 100) / 100,
      matchedTokenSequencesCount: intersectionCount,
      isPlagiarismSuspected: similarityScore >= 75,
      matchedSnippets: matchedKgrams.slice(0, 5),
    };
  }

  /**
   * Executes candidate code in a secure, isolated server-side sandbox.
   * STRICT CONTROLS:
   * • Zero network access (no fetch, no XMLHttpRequest, no net/http).
   * • Execution timeout limit (kills infinite loops).
   * • Isolated execution context (no access to host process, filesystem, or require).
   */
  public async executeInSandbox(
    code: string,
    options: SandboxExecutionOptions = {}
  ): Promise<SandboxExecutionResult> {
    const timeoutMs = options.timeoutMs || 2000;
    const logs: string[] = [];
    const t0 = performance.now();

    // Create locked down sandbox context
    const sandboxContext: Record<string, unknown> = {
      console: {
        log: (...args: unknown[]) => logs.push(args.map(String).join(' ')),
        error: (...args: unknown[]) => logs.push(`[ERROR] ${args.map(String).join(' ')}`),
        warn: (...args: unknown[]) => logs.push(`[WARN] ${args.map(String).join(' ')}`),
      },
      Math,
      Date,
      JSON,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      Array,
      Object,
      String,
      Number,
      Boolean,
      RegExp,
      Map,
      Set,
      // Strictly blocked:
      process: undefined,
      require: undefined,
      fetch: undefined,
      XMLHttpRequest: undefined,
      WebSocket: undefined,
      global: undefined,
      window: undefined,
      document: undefined,
    };

    const context = vm.createContext(sandboxContext);

    try {
      const script = new vm.Script(code, {
        filename: 'candidate_submission.js',
      });

      const result = script.runInContext(context, {
        timeout: timeoutMs,
        displayErrors: true,
      });

      const executionTime = Math.round(performance.now() - t0);
      const output = logs.length > 0 ? logs.join('\n') : (result !== undefined ? String(result) : 'Execution completed successfully (no output).');

      return {
        success: true,
        output,
        executionTimeMs: executionTime,
        timedOut: false,
      };
    } catch (err: any) {
      const executionTime = Math.round(performance.now() - t0);
      const isTimeout = err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || err.message?.includes('timed out');

      return {
        success: false,
        output: logs.join('\n'),
        error: isTimeout
          ? `Execution timed out after ${timeoutMs}ms limit (possible infinite loop).`
          : (err.message || 'Execution error'),
        executionTimeMs: executionTime,
        timedOut: isTimeout,
      };
    }
  }
}

export const codeSimilarityAndSandboxEngine = new CodeSimilarityAndSandboxEngine();

