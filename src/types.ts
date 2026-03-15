export interface Book {
  id: string;
  url?: string; 
  title: string;
  coverUrl?: string;
  file: string;
  knowledgePath?: string;
}

// Knowledge resource from NotebookLM or other sources
export interface KnowledgeResource {
  type: 'audio' | 'slides' | 'video';
  label: string;
  url?: string;
  images?: string[];
}

// Concept used in Part 1 overview
export interface KeyIdea {
  name: string;
  explanation: string;
  importance: string;
  bookExample: string;
}

// Full knowledge summary JSON structure
export interface KnowledgeSummary {
  meta: {
    bookTitle: string;
    generatedAt: string;
    depth: 'quick' | 'full' | 'none';
    language: string;
  };
  part1_overview?: {
    topic: string;
    coreProblem: string;
    mainArgument: string;
    targetAudience: string;
    keyIdeas: KeyIdea[];
  };
  part5_eightyTwenty?: {
    essentialKnowledge: string[];
  };
  part6_onePager?: {
    coreIdea: string;
    keyConcepts: string[];
    keyPrinciples: string[];
    applications: string[];
  };
  resources?: KnowledgeResource[];
}

// Extend Window interface for PDF.js
declare global {
  interface Window {
    pdfjsLib: any;
  }
}