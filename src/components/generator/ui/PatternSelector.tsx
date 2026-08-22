import React from "react";
import { Pattern, StaticPattern, AnimatedPattern } from "../types";
import { cn } from "@/lib/utils";

interface PatternSelectorProps {
  pattern: Pattern;
  setPattern: (pattern: Pattern) => void;
}

const STATIC_PATTERNS: StaticPattern[] = ["solid", "stripey", "zigzag"];
const ANIMATED_PATTERNS: AnimatedPattern[] = [
  "wave",
  "random",
  "spiral",
  "pulsate",
  "ripple",
  "fractal",
  "noise",
  "vortex",
];

const PatternGrid: React.FC<{
  options: Pattern[];
  pattern: Pattern;
  setPattern: (pattern: Pattern) => void;
}> = ({ options, pattern, setPattern }) => (
  <div className="grid grid-cols-3 gap-1.5">
    {options.map((p) => (
      <button
        key={p}
        type="button"
        onClick={() => setPattern(p)}
        aria-pressed={pattern === p}
        className={cn(
          "border px-2 py-1.5 text-[10px] uppercase tracking-wide transition-colors",
          pattern === p
            ? "border-brand bg-brand/10 text-brand"
            : "border-border text-muted-foreground hover:border-brand/50 hover:text-foreground"
        )}
      >
        {p}
      </button>
    ))}
  </div>
);

export const PatternSelector: React.FC<PatternSelectorProps> = ({
  pattern,
  setPattern,
}) => {
  return (
    <div className="space-y-5">
      <div>
        <label className="label-caps mb-2 block">Static</label>
        <PatternGrid options={STATIC_PATTERNS} pattern={pattern} setPattern={setPattern} />
      </div>
      <div>
        <label className="label-caps mb-2 block">Animated</label>
        <PatternGrid options={ANIMATED_PATTERNS} pattern={pattern} setPattern={setPattern} />
      </div>
    </div>
  );
};
