export type Shape = "circle" | "square" | "triangle" | "heart" | "octagon" | "star" | "diamond";
export type StaticPattern = "solid" | "stripey" | "zigzag";
export type AnimatedPattern = "wave" | "random" | "spiral" | "pulsate" | "ripple" | "fractal" | "noise" | "vortex";
export type Pattern = StaticPattern | AnimatedPattern;

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