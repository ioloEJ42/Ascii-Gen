import { useState, useEffect, useMemo } from 'react';
import { ArtConfig, ArtCell } from '../types';
import { generateArt } from '../utils/artGenerationUtils';

export const useArtGeneration = (config: ArtConfig, time: number) => {
  const [art, setArt] = useState<ArtCell[][]>([]);

  // Determine if the current pattern is animated
  const isAnimated = useMemo(() => 
    ["wave", "random", "spiral", "pulsate", "ripple", "fractal", "noise", "vortex"].includes(config.pattern),
    [config.pattern]
  );

  useEffect(() => {
    // Always regenerate when config or time changes
    setArt(generateArt(config, time));
  }, [config, time]);

  return { art, isAnimated };
};