// src/books.ts
import { Book } from './types';
import booksJson from './books.json';

interface BookJson {
  id: string;
  url: string;
  title: string;
}

export const books: Book[] = (booksJson as BookJson[]).map((b) => ({
  ...b,
  file: b.url
}));
