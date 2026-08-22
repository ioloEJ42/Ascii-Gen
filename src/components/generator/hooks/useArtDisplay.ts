import { useState, useEffect, useCallback } from 'react';
import { ArtConfig } from '../types';

export const useArtDisplay = (config: ArtConfig) => {
  const [fontSize, setFontSize] = useState(12);
  const [displaySize, setDisplaySize] = useState({ width: 300, height: 300 });
  const [aspectRatio, setAspectRatio] = useState(1);

  // Calculate aspect ratio based on config size
  useEffect(() => {
    const padding = Math.ceil(config.size * 0.1); // 10% padding
    const totalSize = config.size + padding * 2;
    setAspectRatio(totalSize / totalSize); // Square for now, but extensible
  }, [config.size]);

  // Update font size based on container size and art size
  const updateFontSize = useCallback(() => {
    const padding = Math.ceil(config.size * 0.1);
    const totalSize = config.size + padding * 2;
    const newFontSize = Math.floor(
      Math.min(displaySize.width / totalSize, displaySize.height / totalSize) * 0.9
    );
    setFontSize(Math.max(6, Math.min(newFontSize, 16)));
  }, [config.size, displaySize.width, displaySize.height]);

  // Update font size when display size or config changes
  useEffect(() => {
    updateFontSize();
  }, [updateFontSize]);

  const onResize = useCallback((
    _event: React.SyntheticEvent,
    { size }: { size: { width: number; height: number } }
  ) => {
    // Ensure minimum size
    const minSize = 200;
    const maxSize = 600;
    
    const constrainedSize = {
      width: Math.max(minSize, Math.min(maxSize, size.width)),
      height: Math.max(minSize, Math.min(maxSize, size.height))
    };
    
    setDisplaySize(constrainedSize);
  }, []);

  return {
    fontSize,
    displaySize,
    aspectRatio,
    onResize,
    updateFontSize,
  };
}; 