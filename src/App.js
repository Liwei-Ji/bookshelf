import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { BookCard } from './components/BookCard';
import { BookReader } from './components/BookReader';
import { Sun, Moon, Plus, Library, BookOpen } from 'lucide-react';
const App = () => {
    const [books, setBooks] = useState([]);
    const [activeBook, setActiveBook] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const fileInputRef = useRef(null);
    // Toggle Dark Mode
    useEffect(() => {
        const html = document.documentElement;
        if (isDarkMode) {
            html.classList.add('dark');
        }
        else {
            html.classList.remove('dark');
        }
    }, [isDarkMode]);
    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const newBooks = Array.from(event.target.files).map((file) => ({
                id: crypto.randomUUID(),
                file: file,
                title: file.name.replace(/\.pdf$/i, ''),
            }));
            setBooks((prev) => [...prev, ...newBooks]);
        }
    };
    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };
    return (_jsxs("div", { className: "h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 supports-[height:100dvh]:h-[100dvh]", children: [_jsxs("header", { className: "px-6 py-4 flex justify-between items-center z-10 sticky top-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 shrink-0", children: [_jsx("div", { className: "flex items-center gap-3", children: _jsx("div", { className: "p-2 bg-slate-900 dark:bg-white rounded-lg transition-colors duration-300", children: _jsx(Library, { size: 20, className: "text-white dark:text-slate-900" }) }) }), _jsxs("div", { className: "flex items-center gap-3 md:gap-4", children: [_jsx("button", { onClick: () => setIsDarkMode(!isDarkMode), className: "p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all focus:outline-none active:scale-95", "aria-label": "Toggle Theme", children: isDarkMode ? _jsx(Moon, { size: 20 }) : _jsx(Sun, { size: 20 }) }), _jsxs("button", { onClick: triggerFileUpload, className: "flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 px-4 py-2.5 rounded-full font-medium text-sm transition-all active:scale-95 shadow-sm", children: [_jsx(Plus, { size: 18 }), _jsx("span", { className: "hidden sm:inline", children: "Add Book" }), _jsx("span", { className: "sm:hidden", children: "Add" })] })] }), _jsx("input", { type: "file", accept: "application/pdf", multiple: true, ref: fileInputRef, onChange: handleFileChange, className: "hidden" })] }), _jsx("main", { className: "flex-1 p-6 md:p-10 z-0 overflow-y-auto scroll-smooth", children: books.length === 0 ? (_jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 min-h-[50vh]", children: [_jsx("div", { className: "p-6 bg-slate-100 dark:bg-slate-900 rounded-full mb-6", children: _jsx(BookOpen, { size: 48, strokeWidth: 1.5 }) }), _jsx("h3", { className: "text-lg font-medium text-slate-900 dark:text-slate-200 mb-1", children: "No books yet" }), _jsx("p", { className: "text-sm", children: "Upload a PDF to get started" })] })) : (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 max-w-7xl mx-auto pb-10", children: books.map((book) => (_jsx("div", { className: "flex justify-center w-full", children: _jsx(BookCard, { book: book, onClick: setActiveBook }) }, book.id))) })) }), activeBook && (_jsx(BookReader, { book: activeBook, onClose: () => setActiveBook(null) }))] }));
};
export default App;
