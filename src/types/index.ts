export type AcademicLevel =
  | 'Elementary'
  | 'Middle School'
  | 'High School'
  | 'Undergraduate'
  | 'Professional / Lifelong';

export interface QAResult {
  directAnswer: string;
  detailedExplanation: string;
  keyFacts: string[];
  realWorldAnalogy: string;
  didYouKnow: string;
  suggestedFollowUps: string[];
}

export interface StepItem {
  stepNumber: number;
  title: string;
  explanation: string;
}

export interface Misconception {
  myth: string;
  truth: string;
}

export interface SimplifierResult {
  title: string;
  elevatorPitch: string;
  metaphorAnalogy: string;
  stepByStepBreakdown: StepItem[];
  commonMisconceptions: Misconception[];
  realWorldApplications: string[];
  quickKnowledgeCheck: {
    question: string;
    answer: string;
  };
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface QuizResult {
  quizTitle: string;
  topic: string;
  difficulty: string;
  estimatedMinutes: number;
  summaryNote: string;
  questions: QuizQuestion[];
}

export interface LearningPhase {
  phaseNumber: number;
  phaseTitle: string;
  estimatedTimeline: string;
  focusDescription: string;
  topicsToMaster: string[];
  handsOnProject: string;
  keyMilestoneCheck: string;
}

export interface LearningPathResult {
  title: string;
  topic: string;
  targetAudience: string;
  totalEstimatedHours: string;
  prerequisites: string[];
  phases: LearningPhase[];
  bestPracticesAndTips: string[];
  recommendedFreeResources: string[];
}

export interface KeyConcept {
  term: string;
  definition: string;
}

export interface StructuredSection {
  heading: string;
  contentBullets: string[];
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface SummaryResult {
  documentTitle: string;
  originalWordCount: number;
  summaryWordCount: number;
  readingTimeMinutes: number;
  executiveSummary: string;
  keyConcepts: KeyConcept[];
  structuredSections: StructuredSection[];
  criticalTakeaways: string[];
  studyFlashcards: Flashcard[];
}

export interface EpicItem {
  id: string;
  name: string;
  status: string;
  tasks: string[];
}

export interface ArchitectureData {
  appName: string;
  version: string;
  description: string;
  targetPlatforms: string[];
  epics: EpicItem[];
  systemRequirements: {
    processor: string;
    ram: string;
    storage: string;
    network: string;
    audio: string;
    browser: string;
  };
  skillsRequired: string[];
}
