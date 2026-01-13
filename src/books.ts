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
    const baseUrl = import.meta.env.BASE_URL;
    const jsonUrl = `${baseUrl.replace(/\/$/, '')}/pdfs/books.json`;

    const res = await fetch(jsonUrl);
    if (!res.ok) throw new Error(`Failed to fetch books.json: ${res.status}`);

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
