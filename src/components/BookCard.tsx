import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import { FileText, Loader2 } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const generateThumbnail = async () => {
      // 安全檢查：解決 'book.url' is possibly 'undefined' 報錯
      if (!book.url) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        // 獲取 Vite 基礎路徑
        const baseUrl = import.meta.env.BASE_URL;
        // 確保路徑拼接正確，避免雙斜槓
        const pdfUrl = `${baseUrl.replace(/\/$/, '')}/${book.url.replace(/^\//, '')}`;

        // 使用 PDF.js 載入文件 (需確保 index.html 已引入 pdf.js CDN)
        const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        // 獲取第一頁 (封面)
        const page = await pdf.getPage(1);
        
        // 設定封面渲染比例
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          // 將 PDF 渲染到畫布上
          await page.render({ canvasContext: context, viewport }).promise;
          
          if (isMounted) {
            // 將畫布轉換為圖片 DataURL 並存入 State
            setThumbnail(canvas.toDataURL('image/jpeg', 0.8));
          }
        }
      } catch (err) {
        console.error('生成封面失敗:', book.title, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    generateThumbnail();
    
    // 組件卸載時的清理動作
    return () => { isMounted = false; };
  }, [book.url, book.title]);

  return (
    <div 
      className="group flex flex-col gap-3 w-full max-w-[180px] cursor-pointer"
      onClick={() => onClick(book)}
    >
      {/* 封面圖片容器 */}
      <div 
        className="relative w-full aspect-[1/1.414] rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-sm transition-all duration-300 ease-out group-hover:shadow-xl group-hover:-translate-y-1.5 ring-1 ring-slate-900/5 dark:ring-white/10"
      >
        {loading ? (
          /* 載入中狀態 */
          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900">
             <Loader2 size={24} className="animate-spin text-slate-400" />
          </div>
        ) : thumbnail ? (
          /* 成功生成封面圖片 */
          <img 
            src={thumbnail} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-500"
          />
        ) : (
          /* 生成失敗或無 URL 時顯示預設圖標 */
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
             <FileText size={32} strokeWidth={1.5} />
             <span className="text-[10px] mt-2">No Preview</span>
          </div>
        )}
        
        {/* 書本左側陰影與光澤，增加真實感 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none"></div>
      </div>

      {/* 書名區域 */}
      <div className="px-1 text-center">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-2 leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          {book.title}
        </h3>
      </div>
    </div>
  );
};