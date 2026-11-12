import React from 'react';
import { MatchingQuestion } from './MatchingQuestion';
import { OrderingQuestion } from './OrderingQuestion';
import { FillInTheBlankQuestion } from './FillInTheBlankQuestion';
import { NumericQuestion } from './NumericQuestion';
import { MathEquationQuestion } from './MathEquationQuestion';
import { ImageHotspotQuestion } from './ImageHotspotQuestion';
import { CaseStudyQuestion } from './CaseStudyQuestion';
import { FileUploadQuestion } from './FileUploadQuestion';
import { AudioVideoQuestion } from './AudioVideoQuestion';

export interface QuestionData {
  id: string;
  type: string;
  stem: string;
  points?: number;
  options?: { id: string; text: string }[];
  matchingConfig?: {
    premises: { id: string; text: string }[];
    responses: { id: string; text: string }[];
  };
  orderingConfig?: {
    items: { id: string; text: string }[];
  };
  fillInTheBlankConfig?: {
    template: string;
    blankIds: string[];
  };
  numericConfig?: {
    requiredUnit?: string;
  };
  unit?: string;
  mathEquationConfig?: {
    hasLatexInput?: boolean;
  };
  imageHotspotConfig?: {
    imageUrl: string;
    imageAltText?: string;
  };
  caseStudyConfig?: {
    passageTitle: string;
    passageContent: string;
    passageMediaUrl?: string;
    subQuestions: any[];
  };
  fileUploadConfig?: {
    allowedFileTypes: string[];
    maxFileSizeMb: number;
  };
  audioVideoConfig?: {
    mediaType: 'AUDIO' | 'VIDEO';
    maxDurationSeconds: number;
  };
}

export interface QuestionRendererProps {
  question: QuestionData;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  value,
  onChange,
  disabled = false,
}) => {
  switch (question.type) {
    case 'MATCHING':
      return (
        <MatchingQuestion
          premises={question.matchingConfig?.premises || []}
          responses={question.matchingConfig?.responses || []}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'ORDERING':
      return (
        <OrderingQuestion
          items={question.orderingConfig?.items || []}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'FILL_IN_THE_BLANK':
      return (
        <FillInTheBlankQuestion
          template={question.fillInTheBlankConfig?.template || question.stem}
          blankIds={question.fillInTheBlankConfig?.blankIds || []}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'NUMERIC':
    case 'PARAMETERIZED_NUMERIC':
      return (
        <NumericQuestion
          requiredUnit={question.numericConfig?.requiredUnit || question.unit}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'MATH_EQUATION':
      return (
        <MathEquationQuestion
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'IMAGE_HOTSPOT':
      return (
        <ImageHotspotQuestion
          imageUrl={question.imageHotspotConfig?.imageUrl || ''}
          imageAltText={question.imageHotspotConfig?.imageAltText}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'CASE_STUDY':
      return (
        <CaseStudyQuestion
          passageTitle={question.caseStudyConfig?.passageTitle || 'Case Study Scenario'}
          passageContent={question.caseStudyConfig?.passageContent || ''}
          passageMediaUrl={question.caseStudyConfig?.passageMediaUrl}
          subQuestions={question.caseStudyConfig?.subQuestions || []}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'FILE_UPLOAD':
      return (
        <FileUploadQuestion
          allowedFileTypes={question.fileUploadConfig?.allowedFileTypes || ['.pdf', '.png', '.jpg']}
          maxFileSizeMb={question.fileUploadConfig?.maxFileSizeMb || 10}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'AUDIO_VIDEO_RESPONSE':
      return (
        <AudioVideoQuestion
          mediaType={question.audioVideoConfig?.mediaType || 'AUDIO'}
          maxDurationSeconds={question.audioVideoConfig?.maxDurationSeconds || 180}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'ESSAY':
      return (
        <div className="space-y-3">
          <label htmlFor="essay-response" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Written Essay Response
          </label>
          <textarea
            id="essay-response"
            rows={8}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Type your essay answer here. Keystroke rhythm and paste events are monitored..."
            className="w-full p-4 text-sm font-sans leading-relaxed text-[#0F172A] bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C4DFF] focus:border-[#6C4DFF] disabled:opacity-50"
          />
        </div>
      );

    case 'MULTIPLE_CHOICE':
    default: {
      const options = question.options || [];
      return (
        <div
          role="radiogroup"
          aria-label={question.stem}
          className="space-y-3 pt-2"
        >
          {options.map((opt, idx) => {
            const isSelected = value === opt.id || value === idx;
            const optLetter = String.fromCharCode(65 + idx);
            return (
              <button
                key={opt.id || idx}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`Option ${optLetter}: ${opt.text}`}
                disabled={disabled}
                onClick={() => onChange(opt.id !== undefined ? opt.id : idx)}
                className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer focus-visible:ring-2 focus-visible:ring-[#6C4DFF] focus-visible:outline-none ${
                  isSelected
                    ? 'border-[#1E40AF] bg-blue-50/80 text-[#1E40AF] font-bold shadow-2xs'
                    : 'border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <span className="pr-4">{opt.text}</span>
                <span
                  aria-hidden="true"
                  className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[11px] shrink-0 ${
                    isSelected ? 'bg-[#1E40AF] text-white border-[#1E40AF]' : 'border-[#CBD5E1]'
                  }`}
                >
                  {optLetter}
                </span>
              </button>
            );
          })}
        </div>
      );
    }
  }
};

