import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { generatePdfThumbnail } from '../utils/pdfUtils';
import { FileText } from 'lucide-react';
export const BookCard = ({ book, onClick }) => {
    const [thumbnail, setThumbnail] = useState(book.coverUrl || null);
    const [loading, setLoading] = useState(!book.coverUrl);
    useEffect(() => {
        let isMounted = true;
        if (!thumbnail) {
            generatePdfThumbnail(book.file)
                .then((url) => {
                if (isMounted) {
                    setThumbnail(url);
                    setLoading(false);
                }
            })
                .catch((err) => {
                console.error("Failed to generate cover", err);
                if (isMounted)
                    setLoading(false);
            });
        }
        return () => { isMounted = false; };
    }, [book, thumbnail]);
    return (_jsxs("div", { className: "group flex flex-col gap-3 w-full max-w-[180px] cursor-pointer", onClick: () => onClick({ ...book, coverUrl: thumbnail || undefined }), children: [_jsxs("div", { className: "relative w-full aspect-[1/1.414] rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-sm transition-all duration-300 ease-out group-hover:shadow-xl group-hover:-translate-y-1.5 ring-1 ring-slate-900/5 dark:ring-white/10", children: [loading ? (_jsx("div", { className: "w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900", children: _jsx("div", { className: "w-6 h-6 border-2 border-slate-300 dark:border-slate-600 border-t-slate-800 dark:border-t-slate-200 rounded-full animate-spin" }) })) : thumbnail ? (_jsx("img", { src: thumbnail, alt: book.title, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400", children: _jsx(FileText, { size: 32, strokeWidth: 1.5 }) })), _jsx("div", { className: "absolute inset-0 rounded-lg ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none" })] }), _jsx("div", { className: "px-1 text-center", children: _jsx("h3", { className: "text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-2 leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors", children: book.title }) })] }));
};
