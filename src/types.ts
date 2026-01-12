export interface Book {
  id: string;
  url?: string; 
  title: string;
  coverUrl?: string;
  file: File | string;
}

// Extend Window interface for PDF.js
declare global {
  interface Window {
    pdfjsLib: any;
  }
}