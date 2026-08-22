import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export const exportAsImage = async (element: HTMLElement, format: 'jpg' | 'png') => {
  const canvas = await html2canvas(element);
  canvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, `ascii-art.${format}`);
    }
  }, `image/${format}`);
};

// All export functionality except image export is currently disabled.