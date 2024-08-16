import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../ASCIIArtGenerator.css"; // Importing global CSS for the component
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PatternSelector } from "./ui/PatternSelector";
import { ShapeSelector } from "./ui/ShapeSelector";
import { ColorSelector } from "./ui/ColorSelector";
import { useAnimationTimer } from "./hooks/useAnimationTimer";
import { useArtGeneration } from "./hooks/useArtGeneration";
import { ArtConfig, Shape, Pattern } from "./types";
import { Input } from "@/components/ui/input";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Github, Shuffle } from "lucide-react";
import { ResizableBox } from "react-resizable";
import { useHotkeys } from "react-hotkeys-hook";
import "react-resizable/css/styles.css"; // Importing styles for resizable components
import {
  exportAsImage,
  exportAsGif,
  exportAsReactComponent,
} from "./utils/exportUtils";

// Main component for ASCII Art Generator
const ASCIIArtGenerator: React.FC = () => {
  // Theme management and initial configuration setup
  const { theme, toggleTheme } = useTheme();
  const initialConfig: ArtConfig = {
    size: 40,
    shape: "circle",
    pattern: "solid",
    characters: " .:-=+*#%@",
    backgroundColor: "#000000",
    mainColor: "#ffffff",
    accentColors: [],
    rotation: 0,
  };

  // State management for configuration and other UI elements
  const [config, setConfig] = useState<ArtConfig>(initialConfig);
  const [fontSize, setFontSize] = useState(12);
  const [displaySize, setDisplaySize] = useState({ width: 400, height: 400 });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [frameCount, setFrameCount] = useState(10);
  const [showFrameSlider, setShowFrameSlider] = useState(false);
  const [isCharInputFocused, setIsCharInputFocused] = useState(false);

  // Keyboard shortcuts setup
  useHotkeys("r", () => randomize(), {
    enableOnFormTags: true,
    enabled: !isCharInputFocused,
  });
  useHotkeys("t", () => toggleTheme(), {
    enableOnFormTags: true,
    enabled: !isCharInputFocused,
  });
  useHotkeys("c", () => copyToClipboard(), {
    enableOnFormTags: true,
    enabled: !isCharInputFocused,
  });
  useHotkeys("j", () => exportJPG(), {
    enableOnFormTags: true,
    enabled: !isCharInputFocused,
  });
  useHotkeys("p", () => exportPNG(), {
    enableOnFormTags: true,
    enabled: !isCharInputFocused,
  });
  useHotkeys("g", () => setShowFrameSlider(true), {
    enableOnFormTags: true,
    enabled: !isCharInputFocused,
  });
  useHotkeys("x", () => exportReact(), {
    enableOnFormTags: true,
    enabled: !isCharInputFocused,
  });

  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    const padding = Math.ceil(config.size * 0.1); // 10% padding
    const totalSize = config.size + padding * 2;
    setAspectRatio(totalSize / totalSize); // This will be 1 for square, but we keep it for potential future non-square shapes
  }, [config.size]);

  useEffect(() => {
    const updateFontSize = () => {
      if (artDisplayRef.current) {
        const { width, height } = artDisplayRef.current.getBoundingClientRect();
        const padding = Math.ceil(config.size * 0.1); // 10% padding
        const totalSize = config.size + padding * 2;
        const newFontSize = Math.floor(
          Math.min(width / totalSize, height / totalSize) * 0.9
        );
        setFontSize(Math.max(6, Math.min(newFontSize, 16)));
      }
    };

    updateFontSize();
  }, [config.size, displaySize]);

  // Refs
  const artDisplayRef = useRef<HTMLDivElement>(null);

  // Callback function to update the configuration
  const updateConfig = useCallback((newConfig: Partial<ArtConfig>) => {
    setConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  }, []);

  // Callback function to randomize the art configuration
  const randomize = useCallback(() => {
    const randomConfig: ArtConfig = {
      size: Math.floor(Math.random() * 61) + 20,
      shape: [
        "circle",
        "square",
        "triangle",
        "heart",
        "octagon",
        "star",
        "diamond",
      ][Math.floor(Math.random() * 7)] as Shape,
      pattern: [
        "solid",
        "stripey",
        "zigzag",
        "wave",
        "random",
        "spiral",
        "pulsate",
        "ripple",
        "fractal",
        "noise",
        "vortex",
      ][Math.floor(Math.random() * 11)] as Pattern,
      characters: " .:-=+*#%@"
        .split("")
        .sort(() => Math.random() - 0.5)
        .join(""),
      backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      mainColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      accentColors: Array(3)
        .fill(null)
        .map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
      rotation: Math.floor(Math.random() * 361),
    };
    setConfig(randomConfig);
  }, []);

  // Effect to update colors based on the current theme
  useEffect(() => {
    updateConfig({
      backgroundColor: theme === "light" ? "#ffffff" : "#000000",
      mainColor: theme === "light" ? "#000000" : "#ffffff",
    });
  }, [theme, updateConfig]);

  // Effect to dynamically update font size based on container size
  useEffect(() => {
    const updateFontSize = () => {
      if (artDisplayRef.current) {
        const { width, height } = artDisplayRef.current.getBoundingClientRect();
        const newFontSize = Math.floor(
          Math.min(width / config.size, height / config.size) * 0.9
        );
        setFontSize(Math.max(6, Math.min(newFontSize, 16)));
      }
    };

    updateFontSize();
  }, [config.size, displaySize]);

  // Hooks to manage animation and art generation
  const time = useAnimationTimer();
  const art = useArtGeneration(config, time);

  // Helper function to copy ASCII art as plain text to clipboard
  const copyToClipboard = () => {
    const plainText = art.replace(/<[^>]+>/g, "");
    navigator.clipboard.writeText(plainText);
  };

  // Handle resizing of the art display area
  const onResize = (
    _event: React.SyntheticEvent,
    { size }: { size: { width: number; height: number } }
  ) => {
    setDisplaySize(size);
  };

  // Export functions to save the art in different formats
  const exportJPG = () => {
    if (artDisplayRef.current) exportAsImage(artDisplayRef.current, "jpg");
  };

  const exportPNG = () => {
    if (artDisplayRef.current) exportAsImage(artDisplayRef.current, "png");
  };

  const exportGIF = () => {
    if (artDisplayRef.current) {
      setIsExporting(true);
      setExportProgress(0);
      exportAsGif(
        artDisplayRef.current,
        2000,
        frameCount,
        (progress) => setExportProgress(progress),
        (url) => {
          setIsExporting(false);
          setShowFrameSlider(false);
          const link = document.createElement("a");
          link.href = url;
          link.download = "ascii-art.gif";
          link.click();
          URL.revokeObjectURL(url);
        }
      );
    }
  };

  const exportReact = () => {
    exportAsReactComponent(art, config);
  };

  // Determine if the current pattern is animated
  const isAnimated = [
    "wave",
    "random",
    "spiral",
    "pulsate",
    "ripple",
    "fractal",
    "noise",
    "vortex",
  ].includes(config.pattern);

  // Main component rendering
  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 max-w-7xl mx-auto flex-grow transition-colors duration-300">
        {/* Header with title and theme/randomize buttons */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">ASCII Art Generator</h1>
          <div className="flex space-x-4">
            <div className="flex flex-col items-center">
              <Button
                onClick={randomize}
                variant="outline"
                size="icon"
                aria-label="Randomize (R)"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                R
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="icon"
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode (T)`}
              >
                {theme === "light" ? (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                )}
              </Button>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                T
              </span>
            </div>
          </div>
        </div>

        {/* Main content area with tabs and art display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            {/* Tabs for selecting shape, pattern, and color */}
            <Tabs defaultValue="shape" className="w-full">
              <TabsList aria-label="ASCII Art Generator Options">
                <TabsTrigger value="shape">Shape</TabsTrigger>
                <TabsTrigger value="pattern">Pattern</TabsTrigger>
                <TabsTrigger value="color">Color</TabsTrigger>
              </TabsList>
              <TabsContent value="shape">
                <ShapeSelector
                  shape={config.shape}
                  setShape={(shape) => updateConfig({ shape })}
                  size={config.size}
                  setSize={(size) => updateConfig({ size })}
                />
              </TabsContent>
              <TabsContent value="pattern">
                <PatternSelector
                  pattern={config.pattern}
                  setPattern={(pattern) => updateConfig({ pattern })}
                />
                <div className="mt-4">
                  <label
                    htmlFor="characters-input"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Characters
                  </label>
                  <Input
                    id="characters-input"
                    value={config.characters}
                    onChange={(e) =>
                      updateConfig({ characters: e.target.value })
                    }
                    onFocus={() => setIsCharInputFocused(true)}
                    onBlur={() => setIsCharInputFocused(false)}
                    aria-label="ASCII characters to use in the art"
                  />
                </div>
              </TabsContent>
              <TabsContent value="color">
                <ColorSelector
                  backgroundColor={config.backgroundColor}
                  setBackgroundColor={(backgroundColor) =>
                    updateConfig({ backgroundColor })
                  }
                  mainColor={config.mainColor}
                  setMainColor={(mainColor) => updateConfig({ mainColor })}
                  accentColors={config.accentColors}
                  setAccentColors={(accentColors) =>
                    updateConfig({ accentColors })
                  }
                />
              </TabsContent>
            </Tabs>

            {/* Rotation slider */}
            <div>
              <label
                htmlFor="rotation-slider"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Rotation
              </label>
              <Slider
                id="rotation-slider"
                min={0}
                max={360}
                step={1}
                value={[config.rotation]}
                onValueChange={(value) => updateConfig({ rotation: value[0] })}
                aria-valuemin={0}
                aria-valuemax={360}
                aria-valuenow={config.rotation}
                aria-valuetext={`${config.rotation} degrees`}
              />
              <span
                className="text-sm text-gray-500 dark:text-gray-400"
                aria-live="polite"
              >
                {config.rotation}°
              </span>
            </div>

            {/* Export buttons */}
            <div className="flex flex-wrap gap-2">
              <div className="flex flex-col items-center">
                <Button
                  onClick={copyToClipboard}
                  disabled={config.pattern === "random"}
                  aria-label="Copy ASCII art to clipboard (C)"
                >
                  Copy to Clipboard
                </Button>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  C
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Button onClick={exportJPG} aria-label="Export as JPG (J)">
                  Export as JPG
                </Button>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  J
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Button onClick={exportPNG} aria-label="Export as PNG (P)">
                  Export as PNG
                </Button>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  P
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Button
                  onClick={() => setShowFrameSlider(true)}
                  disabled={isExporting || !isAnimated}
                  aria-label="Export as GIF (G)"
                >
                  Export as GIF
                </Button>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  G
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Button
                  onClick={exportReact}
                  aria-label="Export as React Component (X)"
                >
                  Export as React Component
                </Button>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  X
                </span>
              </div>
            </div>

            {/* Slider for frame count during GIF export */}
            {showFrameSlider && (
              <div className="mt-4">
                <label
                  htmlFor="frame-count-slider"
                  className="block text-sm font-medium mb-1"
                >
                  Frame Count: {frameCount}
                </label>
                <Slider
                  id="frame-count-slider"
                  min={5}
                  max={30}
                  step={1}
                  value={[frameCount]}
                  onValueChange={(value) => setFrameCount(value[0])}
                />
                <Button
                  onClick={exportGIF}
                  disabled={isExporting}
                  className="mt-2"
                >
                  {isExporting
                    ? `Exporting GIF (${Math.round(exportProgress)}%)`
                    : "Start GIF Export"}
                </Button>
              </div>
            )}
          </div>

          {/* Display area for the generated ASCII art */}
          <div className="mt-4 lg:mt-0 flex items-center justify-center">
            <ResizableBox
              width={displaySize.width}
              height={displaySize.width / aspectRatio}
              onResize={onResize}
              minConstraints={[200, 200 / aspectRatio]}
              maxConstraints={[800, 800 / aspectRatio]}
              lockAspectRatio={true}
            >
              <div
                ref={artDisplayRef}
                className="font-mono whitespace-pre p-2 lg:p-4 border rounded overflow-hidden transition-colors duration-300"
                style={{
                  backgroundColor: config.backgroundColor,
                  color: config.mainColor,
                  fontSize: `${fontSize}px`,
                  lineHeight: "1",
                  fontFamily: "'JetBrains Mono', monospace",
                  display: "inline-block",
                  textAlign: "center",
                  width: "100%",
                  height: "100%",
                }}
                dangerouslySetInnerHTML={{ __html: art }}
                aria-label="Generated ASCII art"
                role="img"
              />
            </ResizableBox>
          </div>
        </div>
      </div>

      {/* Footer with copyright and GitHub link */}
      <footer className="mt-8 py-4 border-t transition-colors duration-300 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ASCII Online © by Iolo 2024
          </p>
          <a
            href="https://github.com/ioloEJ42"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-300"
          >
            <Github className="w-5 h-5 mr-2" />
            GitHub: ioloEJ42
          </a>
        </div>
      </footer>
    </div>
  );
};
export default ASCIIArtGenerator;
