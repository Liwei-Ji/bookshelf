export interface Book {
  id: string;
  file: File;
  title: string;
  coverUrl?: string;
}

// Extend Window interface for PDF.js
declare global {
  interface Window {
    pdfjsLib: any;
  }
}