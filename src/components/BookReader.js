import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
export const BookReader = ({ book, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    // PDF State
    const [pdfDoc, setPdfDoc] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isRendering, setIsRendering] = useState(false);
    const [resizeTrigger, setResizeTrigger] = useState(0);
    const canvasRef = useRef(null);
    const renderTaskRef = useRef(null);
    const containerRef = useRef(null);
    // Fade in animation
    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, []);
    // Load PDF Document
    useEffect(() => {
        let active = true;
        const url = URL.createObjectURL(book.file);
        const loadPdf = async () => {
            try {
                const loadingTask = window.pdfjsLib.getDocument(url);
                const doc = await loadingTask.promise;
                if (active) {
                    setPdfDoc(doc);
                    setTotalPages(doc.numPages);
                    setPageNum(1);
                }
            }
            catch (error) {
                console.error('Error loading PDF:', error);
            }
        };
        loadPdf();
        return () => {
            active = false;
            URL.revokeObjectURL(url);
        };
    }, [book.file]);
    // Render Page Logic
    useEffect(() => {
        if (!pdfDoc || !canvasRef.current || !containerRef.current)
            return;
        let active = true;
        const renderPage = async () => {
            if (renderTaskRef.current) {
                try {
                    await renderTaskRef.current.cancel();
                }
                catch (error) { }
            }
            if (!active)
                return;
            setIsRendering(true);
            try {
                const page = await pdfDoc.getPage(pageNum);
                const canvas = canvasRef.current;
                if (!canvas)
                    return;
                const context = canvas.getContext('2d');
                const containerWidth = containerRef.current.clientWidth;
                const containerHeight = containerRef.current.clientHeight;
                // Calculate scale to fit container while maintaining aspect ratio
                const unscaledViewport = page.getViewport({ scale: 1 });
                const heightScale = containerHeight / unscaledViewport.height;
                const widthScale = containerWidth / unscaledViewport.width;
                // Determine the scale that fits the page into the container (contain)
                const fitScale = Math.min(heightScale, widthScale);
                // High DPI rendering setup
                // We render at the device pixel ratio to ensure sharpness
                const dpr = window.devicePixelRatio || 1;
                const renderScale = fitScale * dpr;
                const viewport = page.getViewport({ scale: renderScale });
                // Set the actual canvas bitmap size (high resolution)
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                // Explicitly set the display size (CSS) to match the fitted size
                // This ensures the canvas takes up exactly the space calculated by fitScale,
                // preventing it from being displayed at its full high-res bitmap size (zoomed in).
                canvas.style.width = `${unscaledViewport.width * fitScale}px`;
                canvas.style.height = `${unscaledViewport.height * fitScale}px`;
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                const renderTask = page.render(renderContext);
                renderTaskRef.current = renderTask;
                await renderTask.promise;
            }
            catch (error) {
                if (error.name !== 'RenderingCancelledException') {
                    console.error('Render error:', error);
                }
            }
            finally {
                if (active) {
                    setIsRendering(false);
                    renderTaskRef.current = null;
                }
            }
        };
        renderPage();
        return () => {
            active = false;
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }
        };
    }, [pdfDoc, pageNum, resizeTrigger]); // Added resizeTrigger dependency
    // Handle Resize
    useEffect(() => {
        let timeoutId;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setResizeTrigger(prev => prev + 1);
            }, 200);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const changePage = (offset) => {
        const newPage = pageNum + offset;
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNum(newPage);
        }
    };
    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight')
                changePage(1);
            if (e.key === 'ArrowLeft')
                changePage(-1);
            if (e.key === 'Escape')
                handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pageNum, totalPages]);
    return (_jsxs("div", { className: `fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-950 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`, children: [_jsxs("div", { className: "h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-slate-950 shrink-0 z-20", children: [_jsx("div", { className: "w-10" }), " ", _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("h2", { className: "text-sm font-medium text-slate-900 dark:text-slate-100 max-w-[200px] md:max-w-md truncate", children: book.title }), _jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: ["Page ", pageNum, " of ", totalPages] })] }), _jsx("button", { onClick: handleClose, className: "w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors", children: _jsx(X, { size: 24, strokeWidth: 1.5 }) })] }), _jsxs("div", { className: "flex-1 relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900/50 p-0 md:p-8", ref: containerRef, children: [_jsx("button", { onClick: (e) => { e.stopPropagation(); changePage(-1); }, disabled: pageNum <= 1, className: "hidden md:flex absolute left-8 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-sm hover:shadow-md text-slate-800 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all z-20", children: _jsx(ChevronLeft, { size: 24 }) }), _jsx("button", { onClick: (e) => { e.stopPropagation(); changePage(1); }, disabled: pageNum >= totalPages, className: "hidden md:flex absolute right-8 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-sm hover:shadow-md text-slate-800 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all z-20", children: _jsx(ChevronRight, { size: 24 }) }), _jsxs("div", { className: "relative max-w-full max-h-full flex justify-center items-center shadow-none md:shadow-2xl md:rounded-lg bg-transparent md:bg-white", children: [_jsxs("div", { className: "absolute inset-0 flex md:hidden z-10", children: [_jsx("div", { className: "w-[30%] h-full active:bg-black/5 dark:active:bg-white/5 transition-colors", onClick: (e) => { e.stopPropagation(); changePage(-1); } }), _jsx("div", { className: "w-[40%] h-full" }), _jsx("div", { className: "w-[30%] h-full active:bg-black/5 dark:active:bg-white/5 transition-colors", onClick: (e) => { e.stopPropagation(); changePage(1); } })] }), !pdfDoc && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900 z-0", children: _jsx(Loader2, { className: "animate-spin text-slate-400", size: 32 }) })), _jsx("canvas", { ref: canvasRef, className: "block select-none mx-auto" })] })] }), _jsx("div", { className: "h-1 bg-slate-200 dark:bg-slate-800 w-full shrink-0 z-20", children: _jsx("div", { className: "h-full bg-slate-900 dark:bg-white transition-all duration-300 ease-out", style: { width: `${(pageNum / totalPages) * 100}%` } }) })] }));
};
