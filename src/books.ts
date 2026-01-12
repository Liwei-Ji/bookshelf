// src/books.ts
import { Book } from './types';

interface BookJson {
  id: string;
  url: string;
  title: string;
}

/**
 * 讀取 public/pdfs/books.json 並轉成 Book[]
 */
export const loadBooks = async (): Promise<Book[]> => {
  try {
    const res = await fetch(`${process.env.PUBLIC_URL}/pdfs/books.json`);
    if (!res.ok) throw new Error('Failed to fetch books.json');

    const data: BookJson[] = await res.json();

    return data.map((b) => ({
      ...b,
      file: b.url, 
    }));
  } catch (err) {
    console.error('Error loading books:', err);
    return [];
  }
};
