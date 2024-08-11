import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { HexColorPicker } from "react-colorful";

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

  const updateAccentColor = (color: string, index: number) => {
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full justify-start text-left font-normal" variant="outline" style={{ backgroundColor }}>
              <span className="mr-2" style={{ backgroundColor, border: '1px solid black', width: 20, height: 20, display: 'inline-block' }}></span>
              {backgroundColor}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Pick Background Color</DialogTitle>
            <DialogDescription asChild>
              <div>
                <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Main Color
        </label>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full justify-start text-left font-normal" variant="outline" style={{ color: mainColor }}>
              <span className="mr-2" style={{ backgroundColor: mainColor, border: '1px solid black', width: 20, height: 20, display: 'inline-block' }}></span>
              {mainColor}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Pick Main Color</DialogTitle>
            <DialogDescription asChild>
              <div>
                <HexColorPicker color={mainColor} onChange={setMainColor} />
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Accent Colors
        </label>
        {accentColors.map((color, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex-grow justify-start text-left font-normal" variant="outline" style={{ color }}>
                  <span className="mr-2" style={{ backgroundColor: color, border: '1px solid black', width: 20, height: 20, display: 'inline-block' }}></span>
                  {color}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Pick Accent Color {index + 1}</DialogTitle>
                <DialogDescription asChild>
                  <div>
                    <HexColorPicker
                      color={color}
                      onChange={(newColor) => updateAccentColor(newColor, index)}
                    />
                  </div>
                </DialogDescription>
              </DialogContent>
            </Dialog>
            <Button onClick={() => removeAccentColor(index)} variant="destructive">
              Remove
            </Button>
          </div>
        ))}
        <Button onClick={addAccentColor} className="mt-2">Add Accent Color</Button>
      </div>
    </div>
  );
};