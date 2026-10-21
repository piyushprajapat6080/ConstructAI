/**
 * ConstructAI Client-Side Image Compression & Resizing Utility
 * 
 * Compresses and resizes high-resolution raw inspection photos (up to 8MB)
 * down to max dimension 1600px with 0.8 JPEG quality on HTML5 Canvas.
 * Produces optimized payloads (<800 KB) preventing 'Part exceeded maximum size of 1024KB'
 * multipart errors and drastically accelerating Groq LPU multimodal inference.
 */

export async function compressImage(source, maxDimension = 1600, quality = 0.8) {
  if (!source) return null;

  // If already a small SVG or non-image, return as-is
  if (source instanceof Blob && source.type && source.type.includes('svg')) {
    return {
      file: source,
      dataUrl: null,
      sizeBytes: source.size,
      width: 0,
      height: 0
    };
  }

  return new Promise((resolve) => {
    const processImageElement = (img, originalName = 'inspection_photo.jpg') => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // If neither dimension exceeds maxDimension, scale is 1.0
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // If 2D context fails, fallback safely
          return resolve({
            file: source instanceof Blob ? source : null,
            dataUrl: typeof source === 'string' ? source : null,
            sizeBytes: source.size || 0,
            width,
            height
          });
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve({
                file: source instanceof Blob ? source : null,
                dataUrl: compressedDataUrl,
                sizeBytes: compressedDataUrl.length,
                width,
                height
              });
            }

            const cleanName = (originalName || 'photo.jpg').replace(/\.[^/.]+$/, '') + '.jpg';
            const compressedFile = new File([blob], cleanName, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });

            resolve({
              file: compressedFile,
              dataUrl: compressedDataUrl,
              sizeBytes: blob.size,
              width,
              height
            });
          },
          'image/jpeg',
          quality
        );
      } catch (err) {
        console.warn('Canvas image compression failed, falling back to original:', err);
        resolve({
          file: source instanceof Blob ? source : null,
          dataUrl: typeof source === 'string' ? source : null,
          sizeBytes: source.size || 0,
          width: 0,
          height: 0
        });
      }
    };

    if (source instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => processImageElement(img, source.name || 'inspection_photo.jpg');
        img.onerror = () => {
          resolve({
            file: source,
            dataUrl: null,
            sizeBytes: source.size,
            width: 0,
            height: 0
          });
        };
        img.src = e.target.result;
      };
      reader.onerror = () => {
        resolve({
          file: source,
          dataUrl: null,
          sizeBytes: source.size,
          width: 0,
          height: 0
        });
      };
      reader.readAsDataURL(source);
    } else if (typeof source === 'string') {
      // Data URL or image URL
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => processImageElement(img, 'photo.jpg');
      img.onerror = () => {
        resolve({
          file: null,
          dataUrl: source,
          sizeBytes: source.length,
          width: 0,
          height: 0
        });
      };
      img.src = source;
    } else {
      resolve(null);
    }
  });
}
