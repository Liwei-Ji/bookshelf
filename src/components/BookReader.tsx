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

  // Load PDF from URL
  useEffect(() => {
    let active = true;

    const loadPdf = async () => {
      try {
        if (!book.url) return;

    const pdfUrl = `${process.env.PUBLIC_URL}/${book.url.replace('./', '')}`;

    const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
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
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
      setPdfDoc(null);
    };
  }, [book.url]);

  // Render Page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    let active = true;

    const renderPage = async () => {
      if (renderTaskRef.current) {
        try {
          await renderTaskRef.current.cancel();
        } catch {}
      }

      if (!active) return;

      setIsRendering(true);

      try {
        const page = await pdfDoc.getPage(pageNum);
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const context = canvas.getContext('2d');

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const unscaledViewport = page.getViewport({ scale: 1 });
        const widthScale = containerWidth / unscaledViewport.width;
        const heightScale = containerHeight / unscaledViewport.height;

        const fitScale = Math.min(widthScale, heightScale);

        const dpr = window.devicePixelRatio || 1;
        const renderScale = fitScale * dpr;

        const viewport = page.getViewport({ scale: renderScale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Set CSS display size
        canvas.style.width = `${unscaledViewport.width * fitScale}px`;
        canvas.style.height = `${unscaledViewport.height * fitScale}px`;

        const renderContext = {
          canvasContext: context!,
          viewport,
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
  }, [pdfDoc, pageNum, resizeTrigger]);

  // Handle window resize
  useEffect(() => {
    let timeoutId: any;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setResizeTrigger((prev) => prev + 1);
      }, 200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Page change
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

  // Keyboard navigation
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
      className={`fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-950 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-slate-950 shrink-0 z-20">
        <div className="w-10" />
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

      {/* Main Reader */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900/50 p-0 md:p-8"
        ref={containerRef}
      >
        {/* Desktop Navigation */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            changePage(-1);
          }}
          disabled={pageNum <= 1}
          className="hidden md:flex absolute left-8 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-sm hover:shadow-md text-slate-800 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all z-20"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            changePage(1);
          }}
          disabled={pageNum >= totalPages}
          className="hidden md:flex absolute right-8 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-sm hover:shadow-md text-slate-800 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all z-20"
        >
          <ChevronRight size={24} />
        </button>

        {/* Content Container */}
        <div className="relative max-w-full max-h-full flex justify-center items-center shadow-none md:shadow-2xl md:rounded-lg bg-transparent md:bg-white">
          {/* Mobile Tap Zones */}
          <div className="absolute inset-0 flex md:hidden z-10">
            <div
              className="w-[30%] h-full active:bg-black/5 dark:active:bg-white/5 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                changePage(-1);
              }}
            />
            <div className="w-[40%] h-full" />
            <div
              className="w-[30%] h-full active:bg-black/5 dark:active:bg-white/5 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                changePage(1);
              }}
            />
          </div>

          {!pdfDoc && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900 z-0">
              <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
          )}

          <canvas ref={canvasRef} className="block select-none mx-auto" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-200 dark:bg-slate-800 w-full shrink-0 z-20">
        <div
          className="h-full bg-slate-900 dark:bg-white transition-all duration-300 ease-out"
          style={{ width: `${(pageNum / totalPages) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
