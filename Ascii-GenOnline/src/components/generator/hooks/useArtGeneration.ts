import { useState, useEffect } from 'react';
import { ArtConfig } from '../types';
import { generateArt } from '../utils/artGenerationUtils';

export const useArtGeneration = (config: ArtConfig, time: number) => {
  const [art, setArt] = useState<string>('');

  useEffect(() => {
    setArt(generateArt(config, time));
  }, [config, time]);

  return art;
};