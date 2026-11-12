import {
  RubricDefinition,
  RubricEvaluationEntry,
  RubricEvaluationResult,
} from './questionTypes';

export class RubricGradingService {
  private rubrics: Map<string, RubricDefinition> = new Map();

  constructor() {
    this.seedDefaultRubrics();
  }

  public registerRubric(rubric: RubricDefinition): void {
    this.rubrics.set(rubric.id, rubric);
  }

  public getRubric(rubricId: string): RubricDefinition | undefined {
    return this.rubrics.get(rubricId);
  }

  /**
   * Evaluates a subjective submission against a structured rubric.
   */
  public evaluateSubmission(
    rubricId: string,
    evaluations: Array<{ criterionId: string; selectedLevelId: string; comment?: string }>,
    graderId: string,
    generalFeedback?: string
  ): RubricEvaluationResult {
    const rubric = this.rubrics.get(rubricId);
    if (!rubric) {
      throw new Error(`Rubric with ID "${rubricId}" not found.`);
    }

    let totalScore = 0;
    let maxScore = 0;
    const criteriaResults: RubricEvaluationEntry[] = [];

    for (const criterion of rubric.criteria) {
      const weight = criterion.weight ?? 1.0;
      const criterionMax = criterion.maxPoints * weight;
      maxScore += criterionMax;

      const evalItem = evaluations.find((e) => e.criterionId === criterion.id);
      if (!evalItem) {
        throw new Error(`Criterion "${criterion.name}" (${criterion.id}) was not evaluated.`);
      }

      const level = criterion.levels.find((l) => l.id === evalItem.selectedLevelId);
      if (!level) {
        throw new Error(`Level "${evalItem.selectedLevelId}" not found for criterion "${criterion.name}".`);
      }

      const pointsAwarded = Math.round(level.points * weight * 100) / 100;
      totalScore += pointsAwarded;

      criteriaResults.push({
        criterionId: criterion.id,
        selectedLevelId: level.id,
        pointsAwarded,
        comment: evalItem.comment,
      });
    }

    const finalTotal = Math.round(totalScore * 100) / 100;
    const finalMax = Math.round(maxScore * 100) / 100;
    const percentage = finalMax > 0 ? Math.round((finalTotal / finalMax) * 100) : 0;

    return {
      rubricId,
      graderId,
      evaluatedAt: Date.now(),
      totalScore: finalTotal,
      maxScore: finalMax,
      percentage,
      criteriaResults,
      generalFeedback,
    };
  }

  private seedDefaultRubrics() {
    const essayRubric: RubricDefinition = {
      id: 'rubric_essay_standard',
      title: 'Standard Academic Essay & Architecture Rubric',
      description: 'Evaluates technical depth, structure, evidence, and clarity.',
      criteria: [
        {
          id: 'crit_technical_accuracy',
          name: 'Technical Accuracy & Depth',
          maxPoints: 10,
          weight: 1.0,
          levels: [
            { id: 'tech_exemplary', label: 'Exemplary', points: 10, description: 'Comprehensive domain understanding, thorough edge-case analysis.' },
            { id: 'tech_proficient', label: 'Proficient', points: 7.5, description: 'Sound technical reasoning with minor conceptual gaps.' },
            { id: 'tech_developing', label: 'Developing', points: 5, description: 'Partial comprehension; significant technical inaccuracies.' },
            { id: 'tech_inadequate', label: 'Inadequate', points: 2, description: 'Fundamental misunderstanding of core principles.' },
          ],
        },
        {
          id: 'crit_structure_logic',
          name: 'Structural Organization & Logic',
          maxPoints: 5,
          weight: 1.0,
          levels: [
            { id: 'struct_exemplary', label: 'Exemplary', points: 5, description: 'Cohesive narrative, clear transitions, structured conclusions.' },
            { id: 'struct_proficient', label: 'Proficient', points: 3.5, description: 'Logical organization with minor structural lapses.' },
            { id: 'struct_developing', label: 'Developing', points: 2, description: 'Disorganized flow; difficult to follow arguments.' },
            { id: 'struct_inadequate', label: 'Inadequate', points: 1, description: 'Lacks cohesive structure.' },
          ],
        },
        {
          id: 'crit_evidence_citations',
          name: 'Empirical Evidence & Implementation Details',
          maxPoints: 5,
          weight: 1.0,
          levels: [
            { id: 'evid_exemplary', label: 'Exemplary', points: 5, description: 'Concrete code references, benchmark data, or architectural precedents.' },
            { id: 'evid_proficient', label: 'Proficient', points: 3.5, description: 'Relevant examples provided with moderate detail.' },
            { id: 'evid_developing', label: 'Developing', points: 2, description: 'Vague or unsupported assertions.' },
            { id: 'evid_inadequate', label: 'Inadequate', points: 0.5, description: 'No examples or empirical evidence.' },
          ],
        },
      ],
    };

    const fileUploadRubric: RubricDefinition = {
      id: 'rubric_file_upload_project',
      title: 'Project File & Artifact Verification Rubric',
      description: 'Evaluates submitted PDF reports or diagrams.',
      criteria: [
        {
          id: 'crit_specification_compliance',
          name: 'Specification & Format Compliance',
          maxPoints: 10,
          levels: [
            { id: 'spec_full', label: 'Fully Compliant', points: 10, description: 'Meets all structural guidelines, schema definitions, and format limits.' },
            { id: 'spec_minor_divergence', label: 'Minor Divergence', points: 7, description: 'Minor non-breaking deviation from required layout.' },
            { id: 'spec_non_compliant', label: 'Non-Compliant', points: 3, description: 'Fails to adhere to major requirements.' },
          ],
        },
      ],
    };

    this.registerRubric(essayRubric);
    this.registerRubric(fileUploadRubric);
  }
}

export const rubricGradingService = new RubricGradingService();
export default rubricGradingService;
