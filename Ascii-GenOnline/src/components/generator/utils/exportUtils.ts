import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { ArtConfig } from '../types';

export const exportAsImage = async (element: HTMLElement, format: 'jpg' | 'png') => {
  const canvas = await html2canvas(element);
  canvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, `ascii-art.${format}`);
    }
  }, `image/${format}`);
};

export const exportAsGif = (
  element: HTMLElement,
  duration: number,
  frameCount: number,
  onProgress: (progress: number) => void,
  onComplete: (url: string) => void
) => {
  const worker = new Worker(new URL('./gifWorker.ts', import.meta.url));

  worker.onmessage = (e) => {
    if (e.data.progress) {
      onProgress(e.data.progress);
    } else if (e.data.url) {
      onComplete(e.data.url);
      worker.terminate();
    }
  };

  const captureFrame = async () => {
    const canvas = await html2canvas(element);
    return canvas.toDataURL();
  };

  const captureFrames = async () => {
    const frameDataUrls = [];
    for (let i = 0; i < frameCount; i++) {
      frameDataUrls.push(await captureFrame());
      onProgress((i + 1) / frameCount * 50); // First 50% is for capturing frames
    }
    return frameDataUrls;
  };

  captureFrames().then(frameDataUrls => {
    worker.postMessage({
      frameDataUrls,
      delay: duration / frameCount,
      width: element.offsetWidth,
      height: element.offsetHeight
    });
  });
};

export const exportAsReactComponent = (art: string, config: ArtConfig) => {
  const componentCode = `
import React from 'react';

const ASCIIArt: React.FC = () => {
  return (
    <pre
      style={{
        backgroundColor: '${config.backgroundColor}',
        color: '${config.mainColor}',
        fontFamily: 'monospace',
        fontSize: '12px',
        lineHeight: 1,
      }}
    >
      {${JSON.stringify(art)}}
    </pre>
  );
};

export default ASCIIArt;
`;

  const blob = new Blob([componentCode], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'ASCIIArt.tsx');
};