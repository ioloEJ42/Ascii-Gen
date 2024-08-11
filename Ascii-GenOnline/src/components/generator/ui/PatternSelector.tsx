import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pattern, StaticPattern, AnimatedPattern } from "../types";

interface PatternSelectorProps {
  pattern: Pattern;
  setPattern: (pattern: Pattern) => void;
}

export const PatternSelector: React.FC<PatternSelectorProps> = ({
  pattern,
  setPattern,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Static Patterns
        </label>
        <Select
          onValueChange={(value: StaticPattern) => setPattern(value)}
          value={pattern as StaticPattern}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select static pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="stripey">Stripey</SelectItem>
            <SelectItem value="zigzag">Zigzag</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Animated Patterns
        </label>
        <Select
          onValueChange={(value: AnimatedPattern) => setPattern(value)}
          value={pattern as AnimatedPattern}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select animated pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wave">Wave</SelectItem>
            <SelectItem value="random">Random</SelectItem>
            <SelectItem value="spiral">Spiral</SelectItem>
            <SelectItem value="pulsate">Pulsate</SelectItem>
            <SelectItem value="ripple">Ripple</SelectItem>
            <SelectItem value="fractal">Fractal</SelectItem>
            <SelectItem value="noise">Noise</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
