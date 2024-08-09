import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Shape = "circle" | "square" | "triangle";
type Pattern = "solid" | "stripey" | "zigzag" | "wave" | "random";

const ASCIIArtGenerator: React.FC = () => {
  const [size, setSize] = useState<number>(40);
  const [shape, setShape] = useState<Shape>("circle");
  const [pattern, setPattern] = useState<Pattern>("solid");
  const [characters, setCharacters] = useState<string>(" .:-=+*#%@");
  const [baseColor, setBaseColor] = useState<string>("#ffffff");
  const [accentColors, setAccentColors] = useState<string[]>([
    "#ff0000",
    "#00ff00",
  ]);
  const [art, setArt] = useState<string>("");
  const [time, setTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((t) => t + 0.05);
    }, 50);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    generateArt();
  }, [size, shape, pattern, characters, baseColor, accentColors, time]);

  const generateArt = () => {
    let frame = "";
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let value = 0;
        let inShape = true;
        switch (shape) {
          case "circle":
            inShape =
              Math.sqrt(
                Math.pow(x - size / 2, 2) + Math.pow(y - size / 2, 2)
              ) <=
              size / 2;
            break;
          case "square":
            inShape = true; // Always in shape for square
            break;
          case "triangle":
            inShape = y <= size - x;
            break;
        }

        if (!inShape) {
          frame += " ";
          continue;
        }

        switch (shape) {
          case "circle":
            value =
              Math.sqrt(Math.pow(x - size / 2, 2) + Math.pow(y - size / 2, 2)) /
              (size / 2);
            break;
          case "square":
            value =
              Math.max(Math.abs(x - size / 2), Math.abs(y - size / 2)) /
              (size / 2);
            break;
          case "triangle":
            value = (Math.abs(x - size / 2) + Math.abs(y - size / 2)) / size;
            break;
        }

        switch (pattern) {
          case "solid":
            // No change to value
            break;
          case "stripey":
            value = (Math.sin(x * 0.2) + 1) / 2;
            break;
          case "zigzag":
            value = (Math.abs(Math.sin(x * 0.3 + y * 0.3)) + 1) / 2;
            break;
          case "wave":
            const wave1 = Math.sin(x * 0.2 + time) * Math.cos(y * 0.2 + time);
            const wave2 = Math.sin(x * 0.1 - y * 0.1 + time * 1.5);
            const wave3 = Math.cos(x * 0.15 + y * 0.15 - time * 0.8);
            value = (wave1 + wave2 + wave3 + 3) / 6; // Normalize to 0-1 range
            break;
          case "random":
            value = Math.random();
            break;
        }

        value = Math.max(0, Math.min(1, value)); // Ensure value is within 0-1 range
        const charIndex = Math.floor(value * (characters.length - 1));
        frame += characters[charIndex] ?? " ";
      }
      frame += "\n";
    }
    setArt(frame);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(art);
  };

  const addAccentColor = () => {
    setAccentColors([...accentColors, "#ffffff"]); // Add a default white color
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
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ASCII Art Generator</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Tabs defaultValue="shape" className="w-full">
            <TabsList>
              <TabsTrigger value="shape">Shape</TabsTrigger>
              <TabsTrigger value="pattern">Pattern</TabsTrigger>
              <TabsTrigger value="color">Color</TabsTrigger>
            </TabsList>
            <TabsContent value="shape">
              <Select onValueChange={(value: Shape) => setShape(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="circle">Circle</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="triangle">Triangle</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Size
                </label>
                <Slider
                  min={10}
                  max={100}
                  step={1}
                  value={[size]}
                  onValueChange={(value) => setSize(value[0])}
                  className="mt-1"
                />
              </div>
            </TabsContent>
            <TabsContent value="pattern">
              <Select onValueChange={(value: Pattern) => setPattern(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="stripey">Stripey</SelectItem>
                  <SelectItem value="zigzag">Zigzag</SelectItem>
                  <SelectItem value="wave">Wave</SelectItem>
                  <SelectItem value="random">Random</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Characters
                </label>
                <Input
                  value={characters}
                  onChange={(e) => setCharacters(e.target.value)}
                  className="mt-1"
                />
              </div>
            </TabsContent>
            <TabsContent value="color">
              {pattern === "solid" ? (
                <div className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Select Base Color</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Pick Base Color</DialogTitle>
                      <DialogDescription>
                        <HexColorPicker
                          color={baseColor}
                          onChange={setBaseColor}
                        />
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Select Base Color</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Pick Base Color</DialogTitle>
                      <DialogDescription>
                        <HexColorPicker
                          color={baseColor}
                          onChange={setBaseColor}
                        />
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                  {accentColors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>{`Select Accent Color ${index + 1}`}</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>{`Pick Accent Color ${
                            index + 1
                          }`}</DialogTitle>
                          <DialogDescription>
                            <HexColorPicker
                              color={color}
                              onChange={(color) =>
                                updateAccentColor(color, index)
                              }
                            />
                          </DialogDescription>
                        </DialogContent>
                      </Dialog>
                      <Button
                        onClick={() => removeAccentColor(index)}
                        variant="destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addAccentColor}>Add Accent Color</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          <Button
            onClick={copyToClipboard}
            className="mt-2"
            disabled={pattern === "random"}
          >
            Copy
          </Button>
        </div>
        <div>
          <pre
            className="font-mono text-xs whitespace-pre overflow-auto p-4 border rounded"
            style={{
              color: baseColor,
              backgroundColor: "#000000",
              maxHeight: "80vh",
            }}
          >
            {art}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ASCIIArtGenerator;
