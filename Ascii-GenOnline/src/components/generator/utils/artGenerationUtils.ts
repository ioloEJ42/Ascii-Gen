import { ArtConfig, Shape, Pattern } from '../types';

const rotatePoint = (x: number, y: number, centerX: number, centerY: number, angle: number): [number, number] => {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = (cos * (x - centerX)) + (sin * (y - centerY)) + centerX;
  const ny = (cos * (y - centerY)) - (sin * (x - centerX)) + centerY;
  return [nx, ny];
};

const generateShape = (x: number, y: number, size: number, shape: Shape, rotation: number): boolean => {
  const centerX = size / 2;
  const centerY = size / 2;
  const [rotatedX, rotatedY] = rotatePoint(x, y, centerX, centerY, rotation);

  switch (shape) {
    case 'circle':
      return Math.sqrt(Math.pow(rotatedX - centerX, 2) + Math.pow(rotatedY - centerY, 2)) <= size / 2;
    case 'square':
      const halfSize = size / 2;
      return Math.abs(rotatedX - centerX) <= halfSize && Math.abs(rotatedY - centerY) <= halfSize;
    case 'triangle':
      const triangleHeight = size * Math.sqrt(3) / 2;
      const triangleY = rotatedY - (size - triangleHeight) / 2;
      return triangleY >= 0 && triangleY <= triangleHeight && Math.abs(rotatedX - centerX) <= (triangleHeight - triangleY) / Math.sqrt(3);
    default:
      return false;
  }
};

const calculateValue = (x: number, y: number, size: number, shape: Shape, pattern: Pattern, time: number, rotation: number): number => {
  const centerX = size / 2;
  const centerY = size / 2;
  const [rotatedX, rotatedY] = rotatePoint(x, y, centerX, centerY, rotation);

  let value = 0;

  // Calculate base value based on shape
  switch (shape) {
    case 'circle':
      value = Math.sqrt(Math.pow(rotatedX - centerX, 2) + Math.pow(rotatedY - centerY, 2)) / (size / 2);
      break;
    case 'square':
      value = Math.max(Math.abs(rotatedX - centerX), Math.abs(rotatedY - centerY)) / (size / 2);
      break;
    case 'triangle':
      value = (Math.abs(rotatedX - centerX) + Math.abs(rotatedY - centerY)) / size;
      break;
  }

  // Modify value based on pattern
  switch (pattern) {
    case 'solid':
      // No change to value
      break;
    case 'stripey':
      value = (Math.sin(rotatedX * 0.2) + 1) / 2;
      break;
    case 'zigzag':
      value = (Math.abs(Math.sin(rotatedX * 0.3 + rotatedY * 0.3)) + 1) / 2;
      break;
    case 'wave':
      const wave1 = Math.sin(rotatedX * 0.2 + time) * Math.cos(rotatedY * 0.2 + time);
      const wave2 = Math.sin(rotatedX * 0.1 - rotatedY * 0.1 + time * 1.5);
      const wave3 = Math.cos(rotatedX * 0.15 + rotatedY * 0.15 - time * 0.8);
      value = (wave1 + wave2 + wave3 + 3) / 6;
      break;
    case 'random':
      value = Math.random();
      break;
    case 'spiral':
      const angle = Math.atan2(y - size / 2, x - size / 2);
      const distance = Math.sqrt(Math.pow(x - size / 2, 2) + Math.pow(y - size / 2, 2));
      value = (Math.sin(distance * 0.5 - time * 5 + angle * 3) + 1) / 2;
      break;
    case 'pulsate':
      const distanceFromCenter = Math.sqrt(Math.pow(x - size / 2, 2) + Math.pow(y - size / 2, 2));
      value = (Math.sin(distanceFromCenter * 0.3 - time * 5) + 1) / 2;
      break;
    case 'ripple':
      const rippleDistance = Math.sqrt(Math.pow(x - size / 2, 2) + Math.pow(y - size / 2, 2));
      value = Math.sin(rippleDistance * 0.5 - time * 3) * 0.5 + 0.5;
      break;
    case 'fractal':
      const scale = 0.1;
      value = Math.abs(Math.sin(x * scale) + Math.sin(y * scale) + Math.sin((x + y) * scale + time));
      value = (value + Math.abs(Math.sin(x * scale * 2) + Math.sin(y * scale * 2) + Math.sin((x - y) * scale * 2 + time * 1.5))) / 4;
      break;
    case 'noise':
      // Simplex noise would be ideal here, but for simplicity, we'll use a pseudo-random noise
      value = Math.abs(Math.sin(x * 0.1 + y * 0.1 + time) * Math.cos(x * 0.15 - y * 0.15 + time * 1.2));
      break;
  }

  return Math.max(0, Math.min(1, value));
};

export const generateArt = (config: ArtConfig, time: number): string => {
  const { size, shape, pattern, characters, mainColor, rotation } = config;
  let art = '';

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!generateShape(x, y, size, shape, rotation)) {
        art += ' ';
        continue;
      }

      const value = calculateValue(x, y, size, shape, pattern, time, rotation);
      const charIndex = Math.floor(value * (characters.length - 1));
      art += `<span style="color:${mainColor}">${characters[charIndex] || ' '}</span>`;
    }
    art += '\n';
  }

  return art;
};