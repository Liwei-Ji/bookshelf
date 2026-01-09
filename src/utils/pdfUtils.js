/**
 * Generates a thumbnail image from the first page of a PDF file.
 */
export const generatePdfThumbnail = async (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = async function () {
            const typedarray = new Uint8Array(this.result);
            try {
                // Load the PDF file using the global pdfjsLib
                const loadingTask = window.pdfjsLib.getDocument(typedarray);
                const pdf = await loadingTask.promise;
                // Fetch the first page
                const page = await pdf.getPage(1);
                const scale = 1.5; // High enough resolution for cover
                const viewport = page.getViewport({ scale });
                // Prepare canvas using PDF page dimensions
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                if (!context) {
                    reject(new Error('Canvas context not available'));
                    return;
                }
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                // Render PDF page into canvas context
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                await page.render(renderContext).promise;
                // Convert canvas to image URL
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve(dataUrl);
            }
            catch (error) {
                console.error('Error rendering PDF:', error);
                reject(error);
            }
        };
        fileReader.onerror = (error) => reject(error);
        fileReader.readAsArrayBuffer(file);
    });
};
