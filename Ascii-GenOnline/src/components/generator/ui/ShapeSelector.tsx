// in ShapeSelector.tsx
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Shape } from "../types";

interface ShapeSelectorProps {
  shape: Shape;
  setShape: (shape: Shape) => void;
  size: number;
  setSize: (size: number) => void;
}

export const ShapeSelector: React.FC<ShapeSelectorProps> = ({
  shape,
  setShape,
  size,
  setSize,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Shape</label>
        <Select onValueChange={(value: Shape) => setShape(value)} value={shape}>
          <SelectTrigger>
            <SelectValue placeholder="Select shape" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="circle">Circle</SelectItem>
            <SelectItem value="square">Square</SelectItem>
            <SelectItem value="triangle">Triangle</SelectItem>
            <SelectItem value="heart">Heart</SelectItem>
            <SelectItem value="octagon">Octagon</SelectItem>
            <SelectItem value="star">Star</SelectItem>
            <SelectItem value="diamond">Diamond</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Size</label>
        <Slider
          min={10}
          max={100}
          step={1}
          value={[size]}
          onValueChange={(value) => setSize(value[0])}
        />
        <span className="text-sm text-gray-500">{size}</span>
      </div>
    </div>
  );
};
