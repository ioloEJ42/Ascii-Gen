import React, { useLayoutEffect, useRef, useState } from 'react';
import { ArtConfig, ArtCell } from './types';
import { BASE_FONT_SIZE } from './hooks/useArtDisplay';

interface ArtDisplayProps {
  art: ArtCell[][];
  config: ArtConfig;
}

export const ArtDisplay: React.FC<ArtDisplayProps> = ({ art, config }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const artDisplayRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState({ x: 1, y: 1 });

  // Measure the actual available space directly — no assumption about what
  // the parent's layout leaves us, just observe reality.
  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Measure the content's natural (unscaled) footprint at BASE_FONT_SIZE and
  // stretch it — independently per axis — to exactly fill the available
  // width/height. offsetWidth/offsetHeight ignore any transform already
  // applied, so this stays correct across repeated resizes.
  useLayoutEffect(() => {
    const el = artDisplayRef.current;
    const { width, height } = containerSize;
    if (!el || width <= 0 || height <= 0) return;
    const naturalWidth = el.offsetWidth;
    const naturalHeight = el.offsetHeight;
    if (naturalWidth === 0 || naturalHeight === 0) return;
    setScale({ x: width / naturalWidth, y: height / naturalHeight });
  }, [art, containerSize]);

  return (
    <div ref={wrapperRef} className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
      <div
        ref={artDisplayRef}
        className="font-mono whitespace-pre border"
        style={{
          backgroundColor: config.backgroundColor,
          color: config.mainColor,
          fontSize: `${BASE_FONT_SIZE}px`,
          lineHeight: "1",
          fontFamily: "'Courier New', 'Consolas', 'Monaco', monospace",
          display: "inline-block",
          textAlign: "center",
          transform: `scale(${scale.x}, ${scale.y})`,
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
    </div>
  );
};
