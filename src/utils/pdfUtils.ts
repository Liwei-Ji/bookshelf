/**
 * utils/pdfUtils.ts
 * Generates a thumbnail image from the first page of a PDF file or URL.
 */

export const generatePdfThumbnail = async (pdf: File | string): Promise<string> => {
  let arrayBuffer: ArrayBuffer;

  if (typeof pdf === "string") {
    // 如果傳入的是 URL，從網路抓 PDF
    try {
      const response = await fetch(pdf);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF from URL: ${pdf}`);
      }
      arrayBuffer = await response.arrayBuffer();
    } catch (err) {
      console.error("Error fetching PDF:", err);
      throw err;
    }
  } else {
    // 如果傳入的是 File，讀取 ArrayBuffer
    arrayBuffer = await pdf.arrayBuffer();
  }

  const typedarray = new Uint8Array(arrayBuffer);

  try {
    // 使用全局 pdfjsLib 讀取 PDF
    const loadingTask = window.pdfjsLib.getDocument(typedarray);
    const pdfDoc = await loadingTask.promise;

    // 讀取第一頁
    const page = await pdfDoc.getPage(1);
    const scale = 1.5; // 可以調整縮圖大小
    const viewport = page.getViewport({ scale });

    // 建立 canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas context not available");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // 渲染 PDF 第一頁到 canvas
    await page.render({ canvasContext: context, viewport }).promise;

    // 轉成 Base64 圖片 URL
    return canvas.toDataURL("image/jpeg", 0.8);
  } catch (err) {
    console.error("Error generating PDF thumbnail:", err);
    throw err;
  }
};
