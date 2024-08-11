// Ascii-GenOnline/src/components/generator/hooks/useAnimationTimer.ts
import { useState, useEffect } from 'react';

export const useAnimationTimer = (interval: number = 50) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((t) => t + 0.05);
    }, interval);
    return () => clearInterval(intervalId);
  }, [interval]);

  return time;
};