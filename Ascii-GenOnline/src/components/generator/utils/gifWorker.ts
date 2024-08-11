import GIF from 'gif.js';

self.onmessage = (e) => {
  const { frameDataUrls, delay, width, height } = e.data;
  
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width,
    height,
  });

  frameDataUrls.forEach((dataUrl: string, index: number) => {
    const img = new Image();
    img.src = dataUrl;
    gif.addFrame(img, { delay });
    self.postMessage({ progress: 50 + (index + 1) / frameDataUrls.length * 50 });
  });

  gif.on('finished', (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    self.postMessage({ url });
  });

  gif.render();
};