import { ArtConfig, Shape, Pattern } from "../types";

const rotatePoint = (
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  angle: number
): [number, number] => {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = cos * (x - centerX) + sin * (y - centerY) + centerX;
  const ny = cos * (y - centerY) - sin * (x - centerX) + centerY;
  return [nx, ny];
};

const generateShape = (
  x: number,
  y: number,
  size: number,
  shape: Shape,
  rotation: number
): boolean => {
  const centerX = size / 2;
  const centerY = size / 2;
  const [rotatedX, rotatedY] = rotatePoint(x, y, centerX, centerY, rotation);

  switch (shape) {
    case "circle":
      return (
        Math.sqrt(
          Math.pow(rotatedX - centerX, 2) + Math.pow(rotatedY - centerY, 2)
        ) <=
        size / 2
      );
    case "square":
      const halfSize = size / 2;
      return (
        Math.abs(rotatedX - centerX) <= halfSize &&
        Math.abs(rotatedY - centerY) <= halfSize
      );
    case "triangle":
      const triangleHeight = (size * Math.sqrt(3)) / 2;
      const triangleY = rotatedY - (size - triangleHeight) / 2;
      return (
        triangleY >= 0 &&
        triangleY <= triangleHeight &&
        Math.abs(rotatedX - centerX) <=
          (triangleHeight - triangleY) / Math.sqrt(3)
      );
    case "heart":
      const heartX = (rotatedX - centerX) / (size / 2);
      const heartY = (rotatedY - centerY) / (size / 2);
      return (
        Math.pow(Math.pow(heartX, 2) + Math.pow(heartY, 2) - 1, 3) -
          Math.pow(heartX, 2) * Math.pow(heartY, 3) <=
        0
      );
    case "octagon":
      const octRadius = size / 2;
      const octX = Math.abs(rotatedX - centerX);
      const octY = Math.abs(rotatedY - centerY);
      return (
        octX <= octRadius * Math.cos(Math.PI / 8) &&
        octY <= octRadius * Math.cos(Math.PI / 8) &&
        octX + octY <= octRadius * Math.sqrt(2) * Math.cos(Math.PI / 8)
      );
    case "star":
      const angle = Math.atan2(rotatedY - centerY, rotatedX - centerX);
      const distanceFromCenter = Math.sqrt(
        Math.pow(rotatedX - centerX, 2) + Math.pow(rotatedY - centerY, 2)
      );
      const armAngle = (Math.PI * 2) / 10; // 5-pointed star
      const innerRadius = size / 6;
      const outerRadius = size / 2;
      const angleModulus = angle % armAngle;
      const normalizedAngle =
        angleModulus > armAngle / 2 ? armAngle - angleModulus : angleModulus;
      const radiusAtAngle =
        innerRadius +
        (outerRadius - innerRadius) * Math.abs(Math.sin(normalizedAngle * 5));
      return distanceFromCenter <= radiusAtAngle;
    case "diamond":
      const diamondX = Math.abs(rotatedX - centerX);
      const diamondY = Math.abs(rotatedY - centerY);
      return diamondX + diamondY <= size / 2;
    default:
      return false;
  }
};

const calculateValue = (
  x: number,
  y: number,
  size: number,
  shape: Shape,
  pattern: Pattern,
  time: number,
  rotation: number
): number => {
  const centerX = size / 2;
  const centerY = size / 2;
  const [rotatedX, rotatedY] = rotatePoint(x, y, centerX, centerY, rotation);

  let value = 0;

  // Calculate base value based on shape
  switch (shape) {
    case "circle":
      value =
        Math.sqrt(
          Math.pow(rotatedX - centerX, 2) + Math.pow(rotatedY - centerY, 2)
        ) /
        (size / 2);
      break;
    case "square":
      value =
        Math.max(Math.abs(rotatedX - centerX), Math.abs(rotatedY - centerY)) /
        (size / 2);
      break;
    case "triangle":
      value =
        (Math.abs(rotatedX - centerX) + Math.abs(rotatedY - centerY)) / size;
      break;
    case "heart":
      const heartX = (rotatedX - centerX) / (size / 2);
      const heartY = (rotatedY - centerY) / (size / 2);
      value = Math.sqrt(
        Math.pow(heartX, 2) + Math.pow(heartY - Math.abs(heartX) * 0.7, 2)
      );
      break;
    case "octagon":
      const octX = Math.abs(rotatedX - centerX) / (size / 2);
      const octY = Math.abs(rotatedY - centerY) / (size / 2);
      value = Math.max(octX, octY, (octX + octY) / Math.sqrt(2));
      break;
    case "star":
      const angle = Math.atan2(rotatedY - centerY, rotatedX - centerX);
      const distanceFromCenter = Math.sqrt(
        Math.pow(rotatedX - centerX, 2) + Math.pow(rotatedY - centerY, 2)
      );
      const armAngle = (Math.PI * 2) / 10;
      const normalizedAngle = angle % armAngle;
      value =
        (distanceFromCenter / (size / 2)) *
        (1 - 0.5 * Math.abs(Math.sin(normalizedAngle * 5)));
      break;
    case "diamond":
      value =
        (Math.abs(rotatedX - centerX) + Math.abs(rotatedY - centerY)) / size;
      break;
  }

  // Modify value based on pattern
  switch (pattern) {
    case "solid":
      // No change to value
      break;
    case "stripey":
      value = (Math.sin(rotatedX * 0.2) + 1) / 2;
      break;
    case "zigzag":
      value = (Math.abs(Math.sin(rotatedX * 0.3 + rotatedY * 0.3)) + 1) / 2;
      break;
    case "wave":
      const wave1 =
        Math.sin(rotatedX * 0.2 + time) * Math.cos(rotatedY * 0.2 + time);
      const wave2 = Math.sin(rotatedX * 0.1 - rotatedY * 0.1 + time * 1.5);
      const wave3 = Math.cos(rotatedX * 0.15 + rotatedY * 0.15 - time * 0.8);
      value = (wave1 + wave2 + wave3 + 3) / 6;
      break;
    case "random":
      value = Math.random();
      break;
    case "spiral":
      const angle = Math.atan2(rotatedY - centerY, rotatedX - centerX);
      const distance = Math.sqrt(
        Math.pow(rotatedX - centerX, 2) + Math.pow(rotatedY - centerY, 2)
      );
      value = (Math.sin(distance * 0.5 - time * 5 + angle * 3) + 1) / 2;
      break;
    case "pulsate":
      const distanceFromCenter = Math.sqrt(
        Math.pow(rotatedX - centerX, 2) + Math.pow(rotatedY - centerY, 2)
      );
      value = (Math.sin(distanceFromCenter * 0.3 - time * 5) + 1) / 2;
      break;
    case "ripple":
      const rippleDistance = Math.sqrt(
        Math.pow(rotatedX - centerX, 2) + Math.pow(rotatedY - centerY, 2)
      );
      value = Math.sin(rippleDistance * 0.5 - time * 3) * 0.5 + 0.5;
      break;
    case "fractal":
      const scale = 0.1;
      value = Math.abs(
        Math.sin(rotatedX * scale) +
          Math.sin(rotatedY * scale) +
          Math.sin((rotatedX + rotatedY) * scale + time)
      );
      value =
        (value +
          Math.abs(
            Math.sin(rotatedX * scale * 2) +
              Math.sin(rotatedY * scale * 2) +
              Math.sin((rotatedX - rotatedY) * scale * 2 + time * 1.5)
          )) /
        4;
      break;
    case "noise":
      // Simplex-like noise approximation
      const noise = (x: number, y: number) => {
        const s = (x + y) * 0.5 * (Math.sqrt(3) - 1);
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        return (Math.sin(i * 12.9898 + j * 78.233 + time) * 43758.5453) % 1;
      };
      value = (noise(rotatedX * 0.1, rotatedY * 0.1) + 1) / 2;
      break;
    case "vortex":
      const dx = rotatedX - centerX;
      const dy = rotatedY - centerY;
      const distanceVortex = Math.sqrt(dx * dx + dy * dy);
      const angleVortex = Math.atan2(dy, dx);
      value =
        (Math.sin(angleVortex * 5 + distanceVortex * 0.2 - time * 3) + 1) / 2;
      break;
  }

  return Math.max(0, Math.min(1, value));
};

export const generateArt = (config: ArtConfig, time: number): string => {
  const {
    size,
    shape,
    pattern,
    characters,
    mainColor,
    accentColors,
    rotation,
  } = config;

  // Add padding to ensure the shape is fully visible
  const padding = Math.ceil(size * 0.1); // 10% padding
  const totalSize = size + padding * 2;

  let art = "";

  const getColor = (x: number, y: number, value: number): string => {
    // Adjust x and y to account for padding
    const adjustedX = x - padding;
    const adjustedY = y - padding;

    if (!generateShape(adjustedX, adjustedY, size, shape, rotation))
      return config.backgroundColor;
    if (accentColors.length === 0) return mainColor;

    // Use position and value to determine color
    const positionFactor = (adjustedX + adjustedY) / (size * 2);
    const colorIndex = Math.floor(positionFactor * accentColors.length);
    const baseColor = accentColors[colorIndex] || mainColor;

    // Mix with main color based on value
    return mixColors(baseColor, mainColor, value);
  };

  for (let y = 0; y < totalSize; y++) {
    for (let x = 0; x < totalSize; x++) {
      // Adjust x and y to account for padding when checking shape
      const adjustedX = x - padding;
      const adjustedY = y - padding;

      if (!generateShape(adjustedX, adjustedY, size, shape, rotation)) {
        art += " ";
        continue;
      }

      const value = calculateValue(
        adjustedX,
        adjustedY,
        size,
        shape,
        pattern,
        time,
        rotation
      );
      const charIndex = Math.floor(value * (characters.length - 1));
      const color = getColor(x, y, value);

      art += `<span style="color:${color}">${
        characters[charIndex] || " "
      }</span>`;
    }
    art += "\n";
  }

  return art;
};

// Helper function to mix colors
function mixColors(color1: string, color2: string, weight: number): string {
  const w1 = weight;
  const w2 = 1 - w1;
  const rgb1 = parseInt(color1.slice(1), 16);
  const rgb2 = parseInt(color2.slice(1), 16);
  const r = Math.round(w1 * (rgb1 >> 16) + w2 * (rgb2 >> 16));
  const g = Math.round(w1 * ((rgb1 >> 8) & 0xff) + w2 * ((rgb2 >> 8) & 0xff));
  const b = Math.round(w1 * (rgb1 & 0xff) + w2 * (rgb2 & 0xff));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
