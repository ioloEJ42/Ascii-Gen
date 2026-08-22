import React, { useRef } from 'react';
import { ResizableBox } from 'react-resizable';
import { ArtConfig, ArtCell } from './types';
import 'react-resizable/css/styles.css';

interface ArtDisplayProps {
  art: ArtCell[][];
  config: ArtConfig;
  fontSize: number;
  displaySize: { width: number; height: number };
  aspectRatio: number;
  onResize: (event: React.SyntheticEvent, data: { size: { width: number; height: number } }) => void;
}

export const ArtDisplay: React.FC<ArtDisplayProps> = ({
  art,
  config,
  fontSize,
  displaySize,
  aspectRatio,
  onResize,
}) => {
  const artDisplayRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <ResizableBox
        width={displaySize.width}
        height={displaySize.width / aspectRatio}
        onResize={onResize}
        minConstraints={[150, 150 / aspectRatio]}
        maxConstraints={[500, 500 / aspectRatio]}
        lockAspectRatio={true}
        className="border border-dashed border-muted-foreground/20"
      >
        <div
          ref={artDisplayRef}
          className="font-mono whitespace-pre p-2 lg:p-4 border overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: config.backgroundColor,
            color: config.mainColor,
            fontSize: `${fontSize}px`,
            lineHeight: "1",
            fontFamily: "'Courier New', 'Consolas', 'Monaco', monospace",
            display: "inline-block",
            textAlign: "center",
            width: "100%",
            height: "100%",
            minHeight: "150px",
            // Disable text selection for better drag and drop experience
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            cursor: "default",
          }}
          aria-label="Generated ASCII art"
          role="img"
        >
          {art.map((row, rowIndex) => (
            <div key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <span key={cellIndex} style={{ color: cell.color }}>
                  {cell.char}
                </span>
              ))}
            </div>
          ))}
        </div>
      </ResizableBox>
    </div>
  );
}; 