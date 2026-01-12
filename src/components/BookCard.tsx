import React from 'react';
import { Book } from '../types';
import { FileText } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const thumbnail = book.url || null; 

  return (
    <div 
      className="group flex flex-col gap-3 w-full max-w-[180px] cursor-pointer"
      onClick={() => onClick(book)}
    >
      <div 
        className="relative w-full aspect-[1/1.414] rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-sm transition-all duration-300 ease-out group-hover:shadow-xl group-hover:-translate-y-1.5 ring-1 ring-slate-900/5 dark:ring-white/10"
      >
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={book.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
             <FileText size={32} strokeWidth={1.5} />
          </div>
        )}
        
        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none"></div>
      </div>

      <div className="px-1 text-center">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-2 leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          {book.title}
        </h3>
      </div>
    </div>
  );
};
