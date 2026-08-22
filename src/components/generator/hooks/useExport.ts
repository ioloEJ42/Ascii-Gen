// All export functionality is disabled
export const useExport = () => {
  return {
    isExporting: false,
    exportProgress: 0,
    frameCount: 10,
    showFrameSlider: false,
    exportGIF: () => {},
    onShowFrameSlider: () => {},
    onFrameCountChange: () => {},
  };
}; 