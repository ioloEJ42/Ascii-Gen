// in ShapeSelector.tsx
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Shape } from "../types";
import { cn } from "@/lib/utils";

interface ShapeSelectorProps {
  shape: Shape;
  setShape: (shape: Shape) => void;
  size: number;
  setSize: (size: number) => void;
}

const SHAPES: { value: Shape; glyph: string; label: string }[] = [
  { value: "circle", glyph: "○", label: "Circle" },
  { value: "square", glyph: "□", label: "Square" },
  { value: "triangle", glyph: "△", label: "Triangle" },
  { value: "heart", glyph: "♥", label: "Heart" },
  { value: "octagon", glyph: "⬠", label: "Octagon" },
  { value: "star", glyph: "★", label: "Star" },
  { value: "diamond", glyph: "◇", label: "Diamond" },
  { value: "hexagon", glyph: "⬡", label: "Hexagon" },
  { value: "cross", glyph: "✛", label: "Cross" },
  { value: "arrow", glyph: "↑", label: "Arrow" },
  { value: "lightning", glyph: "⚡", label: "Lightning" },
  { value: "cloud", glyph: "☁", label: "Cloud" },
  { value: "flower", glyph: "✿", label: "Flower" },
  { value: "leaf", glyph: "❧", label: "Leaf" },
  { value: "spiral", glyph: "@", label: "Spiral" },
  { value: "infinity", glyph: "∞", label: "Infinity" },
  { value: "target", glyph: "◎", label: "Target" },
];

export const ShapeSelector: React.FC<ShapeSelectorProps> = ({
  shape,
  setShape,
  size,
  setSize,
}) => {
  return (
    <div className="space-y-5">
      <div>
        <label className="label-caps mb-2 block">Shape</label>
        <div className="grid grid-cols-4 gap-1.5">
          {SHAPES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setShape(s.value)}
              aria-pressed={shape === s.value}
              className={cn(
                "flex flex-col items-center justify-center gap-1 border px-1 py-2 text-[10px] uppercase tracking-wide transition-colors",
                shape === s.value
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border text-muted-foreground hover:border-brand/50 hover:text-foreground"
              )}
            >
              <span className="text-base leading-none">{s.glyph}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label-caps mb-2 flex items-center justify-between">
          <span>Detail</span>
          <span className="text-foreground">{size}</span>
        </label>
        <Slider
          min={10}
          max={100}
          step={1}
          value={[size]}
          onValueChange={(value) => setSize(value[0])}
        />
      </div>
    </div>
  );
};
