import React, { useEffect, useState, useRef } from 'react';
import { Book } from '../types';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface BookReaderProps {
  book: Book;
  onClose: () => void;
}

export const BookReader: React.FC<BookReaderProps> = ({ book, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // PDF State
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [resizeTrigger, setResizeTrigger] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      } catch (error) {
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
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    let active = true;

    const renderPage = async () => {
      if (renderTaskRef.current) {
        try {
          await renderTaskRef.current.cancel();
        } catch (error) {}
      }

      if (!active) return;

      setIsRendering(true);

      try {
        const page = await pdfDoc.getPage(pageNum);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        const containerWidth = containerRef.current!.clientWidth;
        const containerHeight = containerRef.current!.clientHeight;
        
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
          canvasContext: context!,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        
        await renderTask.promise;
      } catch (error: any) {
        if (error.name !== 'RenderingCancelledException') {
          console.error('Render error:', error);
        }
      } finally {
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
    let timeoutId: any;
    const handleResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
           setResizeTrigger(prev => prev + 1);
        }, 200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const changePage = (offset: number) => {
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') changePage(1);
      if (e.key === 'ArrowLeft') changePage(-1);
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageNum, totalPages]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-950 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Header Toolbar */}
      <div className="h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-slate-950 shrink-0 z-20">
        <div className="w-10"></div> {/* Spacer for balance */}
        
        <div className="flex flex-col items-center">
            <h2 className="text-sm font-medium text-slate-900 dark:text-slate-100 max-w-[200px] md:max-w-md truncate">
            {book.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
                Page {pageNum} of {totalPages}
            </p>
        </div>

        <button 
          onClick={handleClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
          <X size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* Main Reader Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900/50 p-0 md:p-8" ref={containerRef}>
        
        {/* Navigation Buttons (Desktop Only) */}
        <button
          onClick={(e) => { e.stopPropagation(); changePage(-1); }}
          disabled={pageNum <= 1}
          className="hidden md:flex absolute left-8 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-sm hover:shadow-md text-slate-800 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all z-20"
        >
           <ChevronLeft size={24} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); changePage(1); }}
          disabled={pageNum >= totalPages}
          className="hidden md:flex absolute right-8 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-sm hover:shadow-md text-slate-800 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all z-20"
        >
          <ChevronRight size={24} />
        </button>

        {/* Content Container */}
        <div className="relative max-w-full max-h-full flex justify-center items-center shadow-none md:shadow-2xl md:rounded-lg bg-transparent md:bg-white">
            
            {/* Mobile Tap Zones (Overlay on top of canvas) */}
            <div className="absolute inset-0 flex md:hidden z-10">
              {/* Previous Page Zone (Left 30%) */}
              <div 
                className="w-[30%] h-full active:bg-black/5 dark:active:bg-white/5 transition-colors" 
                onClick={(e) => { e.stopPropagation(); changePage(-1); }}
              />
              {/* Spacer (Middle 40%) */}
              <div className="w-[40%] h-full" />
              {/* Next Page Zone (Right 30%) */}
              <div 
                className="w-[30%] h-full active:bg-black/5 dark:active:bg-white/5 transition-colors"
                onClick={(e) => { e.stopPropagation(); changePage(1); }}
              />
            </div>

            {!pdfDoc && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900 z-0">
                <Loader2 className="animate-spin text-slate-400" size={32} />
              </div>
            )}
            
            {/* 
               Canvas element 
               Removed: w-auto, h-auto (as we set style in JS)
               Kept: mx-auto to center
               Note: style.width/height is set in JS to match fitScale
            */}
            <canvas 
              ref={canvasRef} 
              className="block select-none mx-auto" 
            />
        </div>
      </div>

      {/* Progress Bar (Minimal) */}
      <div className="h-1 bg-slate-200 dark:bg-slate-800 w-full shrink-0 z-20">
         <div 
           className="h-full bg-slate-900 dark:bg-white transition-all duration-300 ease-out"
           style={{ width: `${(pageNum / totalPages) * 100}%` }}
         ></div>
      </div>
    </div>
  );
};