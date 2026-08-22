import React from 'react';

interface ExportPanelProps {
  isExporting: boolean;
  exportProgress: number;
  frameCount: number;
  showFrameSlider: boolean;
  isAnimated: boolean;
  onExportGIF: () => void;
  onShowFrameSlider: () => void;
  onFrameCountChange: (value: number[]) => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = () => {
  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold mb-3">Export Options</h3>
      <div className="text-muted-foreground text-sm">Export functionality is currently disabled.</div>
    </div>
  );
}; 