import React, { useState, useEffect } from 'react';
import { BookCard } from './components/BookCard';
import { BookReader } from './components/BookReader';
import { Book } from './types';
import { Sun, Moon, Library, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load books.json on mount
useEffect(() => {
  fetch(`${process.env.PUBLIC_URL}/pdfs/books.json`)
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then((data: Book[]) => setBooks(data))
    .catch((err) =>
      console.error('Failed to load books.json:', err)
    );
}, []);
  // Toggle Dark Mode
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 supports-[height:100dvh]:h-[100dvh]">
      
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center z-10 sticky top-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 dark:bg-white rounded-lg transition-colors duration-300">
             <Library size={20} className="text-white dark:text-slate-900" />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all focus:outline-none active:scale-95"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 z-0 overflow-y-auto scroll-smooth">
        {books.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 min-h-[50vh]">
            <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-full mb-6">
               <BookOpen size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-1">No books available</h3>
            <p className="text-sm">Please add PDF files to public/pdfs/ and update books.json</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 max-w-7xl mx-auto pb-10">
            {books.map((book) => (
              <div key={book.id} className="flex justify-center w-full">
                <BookCard book={{ ...book, url: encodeURI(book.url!) }} onClick={setActiveBook} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Active Book Reader Overlay */}
      {activeBook && (
        <BookReader 
          book={activeBook} 
          onClose={() => setActiveBook(null)} 
        />
      )}
    </div>
  );
};

export default App;
