export type Shape = "circle" | "square" | "triangle" | "heart" | "octagon" | "star" | "diamond" | "hexagon" | "cross" | "arrow" | "lightning" | "cloud" | "flower" | "leaf" | "spiral" | "infinity" | "target";
export type StaticPattern = "solid" | "stripey" | "zigzag";
export type AnimatedPattern = "wave" | "random" | "spiral" | "pulsate" | "ripple" | "fractal" | "noise" | "vortex";
export type Pattern = StaticPattern | AnimatedPattern;

export interface ArtCell {
  char: string;
  color: string;
}

export interface ArtConfig {
  size: number;
  shape: Shape;
  pattern: Pattern;
  characters: string;
  backgroundColor: string;
  mainColor: string;
  accentColors: string[];
  rotation: number; // New property for rotation in degrees
}

export interface FloatingArtInstance {
  id: string;
  config: ArtConfig;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isSelected: boolean;
  zIndex: number;
  label?: string;
}