import { ArtConfig, ArtCell, Shape, Pattern } from "../types";

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
    case "circle": {
      // Adjust for font aspect ratio - characters are typically taller than wide
      // This compensates for the fact that monospace characters are usually ~1.5:1 aspect ratio
      const aspectRatio = 1.0; // Reduced from 2.0 to 1.5 for better balance
      const adjustedX = (rotatedX - centerX) / aspectRatio;
      const adjustedY = rotatedY - centerY;
      return (
        Math.sqrt(
          Math.pow(adjustedX, 2) + Math.pow(adjustedY, 2)
        ) <=
        size / 2
      );
    }
    case "square": {
      const halfSize = size / 2;
      return (
        Math.abs(rotatedX - centerX) <= halfSize &&
        Math.abs(rotatedY - centerY) <= halfSize
      );
    }
    case "triangle": {
      const triangleHeight = (size * Math.sqrt(3)) / 2;
      const triangleY = rotatedY - (size - triangleHeight) / 2;
      return (
        triangleY >= 0 &&
        triangleY <= triangleHeight &&
        Math.abs(rotatedX - centerX) <=
          (triangleHeight - triangleY) / Math.sqrt(3)
      );
    }
    case "heart": {
      const heartX = (rotatedX - centerX) / (size / 2);
      const heartY = -(rotatedY - centerY) / (size / 2); // Flip Y to make heart upright
      return (
        Math.pow(Math.pow(heartX, 2) + Math.pow(heartY, 2) - 1, 3) -
          Math.pow(heartX, 2) * Math.pow(heartY, 3) <=
        0
      );
    }
    case "octagon": {
      const octRadius = size / 2;
      const octX = Math.abs(rotatedX - centerX);
      const octY = Math.abs(rotatedY - centerY);
      return (
        octX <= octRadius * Math.cos(Math.PI / 8) &&
        octY <= octRadius * Math.cos(Math.PI / 8) &&
        octX + octY <= octRadius * Math.sqrt(2) * Math.cos(Math.PI / 8)
      );
    }
    case "star": {
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
    }
    case "diamond": {
      const diamondX = Math.abs(rotatedX - centerX);
      const diamondY = Math.abs(rotatedY - centerY);
      return diamondX + diamondY <= size / 2;
    }
    case "hexagon": {
      const hexRadius = size / 2;
      const hexX = Math.abs(rotatedX - centerX);
      const hexY = Math.abs(rotatedY - centerY);
      return (
        hexX <= hexRadius * Math.cos(Math.PI / 6) &&
        hexY <= hexRadius * Math.sin(Math.PI / 6) &&
        hexX + hexY / Math.tan(Math.PI / 6) <= hexRadius
      );
    }
    case "cross": {
      const crossWidth = size / 6;
      const crossLength = size / 2;
      const crossX = Math.abs(rotatedX - centerX);
      const crossY = Math.abs(rotatedY - centerY);
      return (
        (crossX <= crossWidth && crossY <= crossLength) ||
        (crossY <= crossWidth && crossX <= crossLength)
      );
    }
    case "arrow": {
      const arrowWidth = size / 6;
      const arrowLength = size / 2;
      const arrowX = rotatedX - centerX;
      const arrowY = rotatedY - centerY;
      
      // Arrow shaft (vertical line)
      const shaft = Math.abs(arrowX) <= arrowWidth && arrowY >= -arrowLength && arrowY <= arrowLength / 2;
      
      // Arrow head (triangular point)
      const headY = arrowY - arrowLength / 2;
      if (headY >= 0 && headY <= arrowLength / 2) {
        const headWidth = arrowWidth + (arrowLength / 2 - headY) * 2; // Expand width towards tip
        const head = Math.abs(arrowX) <= headWidth;
        return shaft || head;
      }
      
      return shaft;
    }
    case "lightning": {
      const lightningX = rotatedX - centerX;
      const lightningY = rotatedY - centerY;
      const lightningWidth = size / 12;
      
      // Create a proper lightning bolt path with clear zigzag
      const lightningPath = [
        { x: 0, y: -size/2 },           // Top start
        { x: size/6, y: -size/3 },      // First zig
        { x: -size/8, y: -size/6 },     // First zag
        { x: size/10, y: 0 },           // Second zig
        { x: -size/6, y: size/6 },      // Second zag
        { x: size/8, y: size/3 },       // Third zig
        { x: 0, y: size/2 }             // Bottom end
      ];
      
      // Check if point is near any segment of the lightning path
      for (let i = 0; i < lightningPath.length - 1; i++) {
        const p1 = lightningPath[i];
        const p2 = lightningPath[i + 1];
        
        // Calculate distance from point to line segment
        const A = lightningX - p1.x;
        const B = lightningY - p1.y;
        const C = p2.x - p1.x;
        const D = p2.y - p1.y;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) param = dot / lenSq;
        
        let xx, yy;
        if (param < 0) {
          xx = p1.x;
          yy = p1.y;
        } else if (param > 1) {
          xx = p2.x;
          yy = p2.y;
        } else {
          xx = p1.x + param * C;
          yy = p1.y + param * D;
        }
        
        const dx = lightningX - xx;
        const dy = lightningY - yy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= lightningWidth) {
          return true;
        }
      }
      
      return false;
    }
    case "cloud": {
      const cloudX = rotatedX - centerX;
      const cloudY = rotatedY - centerY;
      const cloudRadius = size / 3;
      
      // Create cloud shape using multiple overlapping circles
      const circles = [
        { x: -cloudRadius/2, y: 0, r: cloudRadius },
        { x: cloudRadius/2, y: 0, r: cloudRadius },
        { x: 0, y: -cloudRadius/2, r: cloudRadius },
        { x: -cloudRadius, y: 0, r: cloudRadius/2 },
        { x: cloudRadius, y: 0, r: cloudRadius/2 }
      ];
      
      return circles.some(circle => {
        const dx = cloudX - circle.x;
        const dy = cloudY - circle.y;
        return Math.sqrt(dx * dx + dy * dy) <= circle.r;
      });
    }
    case "flower": {
      const flowerX = rotatedX - centerX;
      const flowerY = rotatedY - centerY;
      const flowerRadius = size / 2;
      
      // Create flower with petals using polar coordinates
      const angle = Math.atan2(flowerY, flowerX);
      const distance = Math.sqrt(flowerX * flowerX + flowerY * flowerY);
      
      // Flower equation: r = a + b*cos(n*theta) where n=5 for 5 petals
      const petalRadius = flowerRadius * (0.3 + 0.7 * Math.cos(5 * angle));
      
      return distance <= petalRadius;
    }
    case "leaf": {
      const leafX = rotatedX - centerX;
      const leafY = rotatedY - centerY;
      const leafLength = size / 2;
      
      // Create leaf shape using parametric equations
      const t = Math.atan2(leafY, leafX);
      const r = Math.sqrt(leafX * leafX + leafY * leafY);
      
      // Leaf equation: r = a * (1 + cos(t)) * sin(t)
      const leafRadius = leafLength * (1 + Math.cos(t)) * Math.sin(t) * 0.5;
      
      return r <= leafRadius && r >= 0;
    }
    case "spiral": {
      const spiralX = rotatedX - centerX;
      const spiralY = rotatedY - centerY;
      const spiralRadius = size / 2;
      
      // Create spiral using polar coordinates
      const angle = Math.atan2(spiralY, spiralX);
      const distance = Math.sqrt(spiralX * spiralX + spiralY * spiralY);
      
      // Spiral equation: r = a * theta
      const spiralR = spiralRadius * (angle + Math.PI) / (2 * Math.PI);
      const tolerance = size / 8;
      
      return Math.abs(distance - spiralR) <= tolerance;
    }
    case "infinity": {
      const infinityX = rotatedX - centerX;
      const infinityY = rotatedY - centerY;
      const infinityRadius = size / 4;
      
      // Create infinity symbol using two circles connected by lines
      const leftCircle = Math.sqrt(Math.pow(infinityX + infinityRadius, 2) + Math.pow(infinityY, 2)) <= infinityRadius;
      const rightCircle = Math.sqrt(Math.pow(infinityX - infinityRadius, 2) + Math.pow(infinityY, 2)) <= infinityRadius;
      
      // Add connecting lines
      const lineWidth = size / 12;
      const topLine = Math.abs(infinityY + infinityRadius/2) <= lineWidth && Math.abs(infinityX) <= infinityRadius;
      const bottomLine = Math.abs(infinityY - infinityRadius/2) <= lineWidth && Math.abs(infinityX) <= infinityRadius;
      
      return leftCircle || rightCircle || topLine || bottomLine;
    }
    case "target": {
      const targetX = rotatedX - centerX;
      const targetY = rotatedY - centerY;
      const targetRadius = size / 2;
      
      // Create target with concentric circles
      const distance = Math.sqrt(targetX * targetX + targetY * targetY);
      const ringCount = 3;
      const ringWidth = targetRadius / ringCount;
      
      // Check if point is in any ring (alternating filled/empty)
      for (let i = 0; i < ringCount; i++) {
        const innerRadius = i * ringWidth;
        const outerRadius = (i + 1) * ringWidth;
        const isFilled = i % 2 === 0; // Even rings are filled
        
        if (distance >= innerRadius && distance <= outerRadius) {
          return isFilled;
        }
      }
      
      return false;
    }
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
    case "circle": {
      value =
        Math.sqrt(
          Math.pow(rotatedX - centerX, 2) + Math.pow(rotatedY - centerY, 2)
        ) /
        (size / 2);
      break;
    }
    case "square": {
      value =
        Math.max(Math.abs(rotatedX - centerX), Math.abs(rotatedY - centerY)) /
        (size / 2);
      break;
    }
    case "triangle": {
      value =
        (Math.abs(rotatedX - centerX) + Math.abs(rotatedY - centerY)) / size;
      break;
    }
    case "heart": {
      const heartX = (rotatedX - centerX) / (size / 2);
      const heartY = -(rotatedY - centerY) / (size / 2); // Flip Y to match upright heart
      value = Math.sqrt(
        Math.pow(heartX, 2) + Math.pow(heartY - Math.abs(heartX) * 0.7, 2)
      );
      break;
    }
    case "octagon": {
      const octX = Math.abs(rotatedX - centerX) / (size / 2);
      const octY = Math.abs(rotatedY - centerY) / (size / 2);
      value = Math.max(octX, octY, (octX + octY) / Math.sqrt(2));
      break;
    }
    case "star": {
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
    }
    case "diamond": {
      value =
        (Math.abs(rotatedX - centerX) + Math.abs(rotatedY - centerY)) / size;
      break;
    }
    case "hexagon": {
      const hexX = Math.abs(rotatedX - centerX) / (size / 2);
      const hexY = Math.abs(rotatedY - centerY) / (size / 2);
      value = Math.max(hexX, hexY, (hexX + hexY) / Math.sqrt(3));
      break;
    }
    case "cross": {
      const crossWidth = size / 6;
      const crossLength = size / 2;
      const crossX = Math.abs(rotatedX - centerX);
      const crossY = Math.abs(rotatedY - centerY);
      const vertical = crossX <= crossWidth ? crossY / crossLength : 1;
      const horizontal = crossY <= crossWidth ? crossX / crossLength : 1;
      value = Math.min(vertical, horizontal);
      break;
    }
    case "arrow": {
      const arrowWidth = size / 6;
      const arrowLength = size / 2;
      const arrowX = rotatedX - centerX;
      const arrowY = rotatedY - centerY;
      
      // Calculate distance from arrow centerline
      const shaftDist = Math.abs(arrowX) / arrowWidth;
      const headDist = arrowY > arrowLength / 2 ? 
        Math.sqrt(Math.pow(arrowX, 2) + Math.pow(arrowY - arrowLength / 2, 2)) / arrowWidth : 0;
      
      value = Math.min(shaftDist, headDist);
      break;
    }
    case "lightning": {
      const lightningX = rotatedX - centerX;
      const lightningY = rotatedY - centerY;
      const lightningWidth = size / 12;
      
      // Create a proper lightning bolt path with clear zigzag
      const lightningPath = [
        { x: 0, y: -size/2 },           // Top start
        { x: size/6, y: -size/3 },      // First zig
        { x: -size/8, y: -size/6 },     // First zag
        { x: size/10, y: 0 },           // Second zig
        { x: -size/6, y: size/6 },      // Second zag
        { x: size/8, y: size/3 },       // Third zig
        { x: 0, y: size/2 }             // Bottom end
      ];
      
      // Find the minimum distance to any segment of the lightning path
      let minDistance = Infinity;
      for (let i = 0; i < lightningPath.length - 1; i++) {
        const p1 = lightningPath[i];
        const p2 = lightningPath[i + 1];
        
        // Calculate distance from point to line segment
        const A = lightningX - p1.x;
        const B = lightningY - p1.y;
        const C = p2.x - p1.x;
        const D = p2.y - p1.y;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) param = dot / lenSq;
        
        let xx, yy;
        if (param < 0) {
          xx = p1.x;
          yy = p1.y;
        } else if (param > 1) {
          xx = p2.x;
          yy = p2.y;
        } else {
          xx = p1.x + param * C;
          yy = p1.y + param * D;
        }
        
        const dx = lightningX - xx;
        const dy = lightningY - yy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        minDistance = Math.min(minDistance, distance);
      }
      
      value = minDistance / lightningWidth;
      break;
    }
    case "cloud": {
      const cloudX = rotatedX - centerX;
      const cloudY = rotatedY - centerY;
      const cloudRadius = size / 3;
      
      // Calculate distance to nearest cloud circle
      const circles = [
        { x: -cloudRadius/2, y: 0, r: cloudRadius },
        { x: cloudRadius/2, y: 0, r: cloudRadius },
        { x: 0, y: -cloudRadius/2, r: cloudRadius },
        { x: -cloudRadius, y: 0, r: cloudRadius/2 },
        { x: cloudRadius, y: 0, r: cloudRadius/2 }
      ];
      
      const minDist = Math.min(...circles.map(circle => {
        const dx = cloudX - circle.x;
        const dy = cloudY - circle.y;
        return Math.sqrt(dx * dx + dy * dy) / circle.r;
      }));
      
      value = minDist;
      break;
    }
    case "flower": {
      const flowerX = rotatedX - centerX;
      const flowerY = rotatedY - centerY;
      const flowerRadius = size / 2;
      
      const angle = Math.atan2(flowerY, flowerX);
      const distance = Math.sqrt(flowerX * flowerX + flowerY * flowerY);
      const petalRadius = flowerRadius * (0.3 + 0.7 * Math.cos(5 * angle));
      
      value = distance / petalRadius;
      break;
    }
    case "leaf": {
      const leafX = rotatedX - centerX;
      const leafY = rotatedY - centerY;
      const leafLength = size / 2;
      
      const t = Math.atan2(leafY, leafX);
      const r = Math.sqrt(leafX * leafX + leafY * leafY);
      const leafRadius = leafLength * (1 + Math.cos(t)) * Math.sin(t) * 0.5;
      
      value = r / leafRadius;
      break;
    }
    case "spiral": {
      const spiralX = rotatedX - centerX;
      const spiralY = rotatedY - centerY;
      const spiralRadius = size / 2;
      
      const angle = Math.atan2(spiralY, spiralX);
      const distance = Math.sqrt(spiralX * spiralX + spiralY * spiralY);
      const spiralR = spiralRadius * (angle + Math.PI) / (2 * Math.PI);
      const tolerance = size / 8;
      
      value = Math.abs(distance - spiralR) / tolerance;
      break;
    }
    case "infinity": {
      const infinityX = rotatedX - centerX;
      const infinityY = rotatedY - centerY;
      const infinityRadius = size / 4;
      
      // Calculate distance to nearest infinity component
      const leftDist = Math.sqrt(Math.pow(infinityX + infinityRadius, 2) + Math.pow(infinityY, 2)) / infinityRadius;
      const rightDist = Math.sqrt(Math.pow(infinityX - infinityRadius, 2) + Math.pow(infinityY, 2)) / infinityRadius;
      const topDist = Math.abs(infinityY + infinityRadius/2) / (size / 12);
      const bottomDist = Math.abs(infinityY - infinityRadius/2) / (size / 12);
      
      value = Math.min(leftDist, rightDist, topDist, bottomDist);
      break;
    }
    case "target": {
      const targetX = rotatedX - centerX;
      const targetY = rotatedY - centerY;
      const targetRadius = size / 2;
      
      const distance = Math.sqrt(targetX * targetX + targetY * targetY);
      const ringCount = 3;
      const ringWidth = targetRadius / ringCount;
      
      // Calculate which ring the point is in
      const ringIndex = Math.floor(distance / ringWidth);
      const ringCenter = (ringIndex + 0.5) * ringWidth;
      
      value = Math.abs(distance - ringCenter) / ringWidth;
      break;
    }
  }

  // Modify value based on pattern
  switch (pattern) {
    case "solid": {
      // No change to value
      break;
    }
    case "stripey": {
      value = (Math.sin(rotatedX * 0.2) + 1) / 2;
      break;
    }
    case "zigzag": {
      value = (Math.abs(Math.sin(rotatedX * 0.3 + rotatedY * 0.3)) + 1) / 2;
      break;
    }
    case "wave": {
      const wave1 =
        Math.sin(rotatedX * 0.2 + time) * Math.cos(rotatedY * 0.2 + time);
      const wave2 = Math.sin(rotatedX * 0.1 - rotatedY * 0.1 + time * 1.5);
      const wave3 = Math.cos(rotatedX * 0.15 + rotatedY * 0.15 - time * 0.8);
      value = (wave1 + wave2 + wave3 + 3) / 6;
      break;
    }
    case "random": {
      value = Math.random();
      break;
    }
    case "spiral": {
      const angle = Math.atan2(rotatedY - centerY, rotatedX - centerX);
      const distance = Math.sqrt(
        Math.pow(rotatedX - centerX, 2) + Math.pow(rotatedY - centerY, 2)
      );
      value = (Math.sin(distance * 0.5 - time * 5 + angle * 3) + 1) / 2;
      break;
    }
    case "pulsate": {
      const distanceFromCenter = Math.sqrt(
        Math.pow(rotatedX - centerX, 2) + Math.pow(rotatedY - centerY, 2)
      );
      value = (Math.sin(distanceFromCenter * 0.3 - time * 5) + 1) / 2;
      break;
    }
    case "ripple": {
      const rippleDistance = Math.sqrt(
        Math.pow(rotatedX - centerX, 2) + Math.pow(rotatedY - centerY, 2)
      );
      value = Math.sin(rippleDistance * 0.5 - time * 3) * 0.5 + 0.5;
      break;
    }
    case "fractal": {
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
    }
    case "noise": {
      // Simplex-like noise approximation
      const noise = (x: number, y: number) => {
        const s = (x + y) * 0.5 * (Math.sqrt(3) - 1);
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        return (Math.sin(i * 12.9898 + j * 78.233 + time) * 43758.5453) % 1;
      };
      value = (noise(rotatedX * 0.1, rotatedY * 0.1) + 1) / 2;
      break;
    }
    case "vortex": {
      const dx = rotatedX - centerX;
      const dy = rotatedY - centerY;
      const distanceVortex = Math.sqrt(dx * dx + dy * dy);
      const angleVortex = Math.atan2(dy, dx);
      value =
        (Math.sin(angleVortex * 5 + distanceVortex * 0.2 - time * 3) + 1) / 2;
      break;
    }
  }

  return Math.max(0, Math.min(1, value));
};

export const generateArt = (config: ArtConfig, time: number): ArtCell[][] => {
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

  const rows: ArtCell[][] = [];

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
    const row: ArtCell[] = [];
    for (let x = 0; x < totalSize; x++) {
      // Adjust x and y to account for padding when checking shape
      const adjustedX = x - padding;
      const adjustedY = y - padding;

      if (!generateShape(adjustedX, adjustedY, size, shape, rotation)) {
        row.push({ char: " ", color: config.backgroundColor });
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

      row.push({ char: characters[charIndex] || " ", color });
    }
    rows.push(row);
  }

  return rows;
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
