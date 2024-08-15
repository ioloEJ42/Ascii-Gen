import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../ASCIIArtGenerator.css";
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
import { Moon, Sun, Github, Undo, Redo, Shuffle } from "lucide-react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import {
  exportAsImage,
  exportAsGif,
  exportAsReactComponent,
} from "./utils/exportUtils";

const ASCIIArtGenerator: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [configHistory, setConfigHistory] = useState<ArtConfig[]>([]);
  const [currentConfigIndex, setCurrentConfigIndex] = useState(-1);
  const [config, setConfig] = useState<ArtConfig>({
    size: 40,
    shape: "circle",
    pattern: "solid",
    characters: " .:-=+*#%@",
    backgroundColor: theme === "light" ? "#ffffff" : "#000000",
    mainColor: theme === "light" ? "#000000" : "#ffffff",
    accentColors: [],
    rotation: 0,
  });

  const updateConfig = useCallback((newConfig: Partial<ArtConfig>) => {
    setConfig(prevConfig => {
      const updatedConfig = { ...prevConfig, ...newConfig };
      setConfigHistory(prev => [...prev.slice(0, currentConfigIndex + 1), updatedConfig]);
      setCurrentConfigIndex(prev => prev + 1);
      return updatedConfig;
    });
  }, [currentConfigIndex]);

  useEffect(() => {
    updateConfig({
      backgroundColor: theme === "light" ? "#ffffff" : "#000000",
      mainColor: theme === "light" ? "#000000" : "#ffffff",
    });
  }, [theme, updateConfig]);

  const time = useAnimationTimer();
  const art = useArtGeneration(config, time);
  const artDisplayRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(12);
  const [displaySize, setDisplaySize] = useState({ width: 400, height: 400 });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [frameCount, setFrameCount] = useState(10);
  const [showFrameSlider, setShowFrameSlider] = useState(false);

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

  const copyToClipboard = () => {
    const plainText = art.replace(/<[^>]+>/g, "");
    navigator.clipboard.writeText(plainText);
  };

  const onResize = (
    _event: React.SyntheticEvent,
    { size }: { size: { width: number; height: number } }
  ) => {
    setDisplaySize(size);
  };

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

  const undo = () => {
    if (currentConfigIndex > 0) {
      setCurrentConfigIndex(prev => prev - 1);
      setConfig(configHistory[currentConfigIndex - 1]);
    }
  };

  const redo = () => {
    if (currentConfigIndex < configHistory.length - 1) {
      setCurrentConfigIndex(prev => prev + 1);
      setConfig(configHistory[currentConfigIndex + 1]);
    }
  };

  const randomize = () => {
    const randomConfig: ArtConfig = {
      size: Math.floor(Math.random() * 61) + 20,
      shape: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)] as Shape,
      pattern: ["solid", "stripey", "zigzag", "wave", "random", "spiral", "pulsate", "ripple", "fractal", "noise", "vortex"][Math.floor(Math.random() * 11)] as Pattern,
      characters: " .:-=+*#%@".split('').sort(() => Math.random() - 0.5).join(''),
      backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      mainColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      accentColors: Array(3).fill(null).map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`),
      rotation: Math.floor(Math.random() * 361),
    };
    updateConfig(randomConfig);
  };

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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 max-w-7xl mx-auto flex-grow transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">ASCII Art Generator</h1>
          <div className="flex space-x-2">
            <Button
              onClick={undo}
              disabled={currentConfigIndex <= 0}
              variant="outline"
              size="icon"
              aria-label="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              onClick={redo}
              disabled={currentConfigIndex >= configHistory.length - 1}
              variant="outline"
              size="icon"
              aria-label="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
            <Button
              onClick={randomize}
              variant="outline"
              size="icon"
              aria-label="Randomize"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
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
                    onChange={(e) => updateConfig({ characters: e.target.value })}
                    aria-label="ASCII characters to use in the art"
                  />
                </div>
              </TabsContent>
              <TabsContent value="color">
                <ColorSelector
                  backgroundColor={config.backgroundColor}
                  setBackgroundColor={(backgroundColor) => updateConfig({ backgroundColor })}
                  mainColor={config.mainColor}
                  setMainColor={(mainColor) => updateConfig({ mainColor })}
                  accentColors={config.accentColors}
                  setAccentColors={(accentColors) => updateConfig({ accentColors })}
                />
              </TabsContent>
            </Tabs>
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
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={copyToClipboard}
                disabled={config.pattern === "random"}
                aria-label="Copy ASCII art to clipboard"
              >
                Copy to Clipboard
              </Button>
              <Button onClick={exportJPG}>Export as JPG</Button>
              <Button onClick={exportPNG}>Export as PNG</Button>
              <Button
                onClick={() => setShowFrameSlider(true)}
                disabled={isExporting || !isAnimated}
              >
                Export as GIF
              </Button>
              <Button onClick={exportReact}>Export as React Component</Button>
            </div>
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
          <div className="mt-4 lg:mt-0 flex items-center justify-center">
            <ResizableBox
              width={displaySize.width}
              height={displaySize.height}
              onResize={onResize}
              minConstraints={[200, 200]}
              maxConstraints={[800, 800]}
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
      <footer className="mt-8 py-4 border-t transition-colors duration-300 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ASCII Art Generator by Iolo
            <a
              href="https://github.com/ioloEJ42"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-300"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub: ioloEJ42
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ASCIIArtGenerator;
