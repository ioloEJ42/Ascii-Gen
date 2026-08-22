// in ColorSelector.tsx

import React from "react";
import { Input } from "@/components/ui/input";

interface ColorSelectorProps {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  mainColor: string;
  setMainColor: (color: string) => void;
  accentColors: string[];
  setAccentColors: (colors: string[]) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  backgroundColor,
  setBackgroundColor,
  mainColor,
  setMainColor,
  accentColors,
  setAccentColors,
}) => {
  const addAccentColor = () => {
    setAccentColors([...accentColors, "#ffffff"]);
  };

  const updateAccentColor = (index: number, color: string) => {
    const newColors = [...accentColors];
    newColors[index] = color;
    setAccentColors(newColors);
  };

  const removeAccentColor = (index: number) => {
    setAccentColors(accentColors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="label-caps mb-2 flex items-center justify-between">
          <span>Background</span>
          <span className="text-foreground">{backgroundColor}</span>
        </label>
        <Input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="h-9 border-border p-1"
        />
      </div>
      <div>
        <label className="label-caps mb-2 flex items-center justify-between">
          <span>Main</span>
          <span className="text-foreground">{mainColor}</span>
        </label>
        <Input
          type="color"
          value={mainColor}
          onChange={(e) => setMainColor(e.target.value)}
          className="h-9 border-border p-1"
        />
      </div>
      <div>
        <label className="label-caps mb-2 block">Accent</label>
        <div className="space-y-2">
          {accentColors.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="color"
                value={color}
                onChange={(e) => updateAccentColor(index, e.target.value)}
                className="h-9 border-border p-1"
              />
              <button
                type="button"
                onClick={() => removeAccentColor(index)}
                aria-label="Remove accent color"
                className="border border-border px-2 py-2 text-[10px] uppercase tracking-wide text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addAccentColor}
          className="mt-2 w-full border border-dashed border-border py-1.5 text-[10px] uppercase tracking-wide text-muted-foreground transition-colors hover:border-brand hover:text-brand"
        >
          + Add Accent Color
        </button>
      </div>
    </div>
  );
};
