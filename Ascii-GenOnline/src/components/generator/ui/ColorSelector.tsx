// in ColorSelector.tsx

import React from "react";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Background Color
        </label>
        <Input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Main Color</label>
        <Input
          type="color"
          value={mainColor}
          onChange={(e) => setMainColor(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Accent Colors</label>
        {accentColors.map((color, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <Input
              type="color"
              value={color}
              onChange={(e) => updateAccentColor(index, e.target.value)}
            />
            <Button
              onClick={() => removeAccentColor(index)}
              variant="destructive"
              size="sm"
            >
              Remove
            </Button>
          </div>
        ))}
        <Button onClick={addAccentColor} className="mt-2">
          Add Accent Color
        </Button>
      </div>
    </div>
  );
};
