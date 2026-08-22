import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { PatternSelector } from './ui/PatternSelector';
import { ShapeSelector } from './ui/ShapeSelector';
import { ColorSelector } from './ui/ColorSelector';
import { Menu, X, Palette, Shapes, Layers, Share2 } from 'lucide-react';
import { ArtConfig, FloatingArtInstance } from './types';

interface SidebarProps {
  config: ArtConfig;
  updateConfig: (updates: Partial<ArtConfig>) => void;
  isCharInputFocused: boolean;
  setIsCharInputFocused: (focused: boolean) => void;
  selectedInstance: FloatingArtInstance | null;
  canvasCount?: number;
  onShareWorkspace?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  updateConfig,
  setIsCharInputFocused,
  selectedInstance,
  canvasCount = 0,
  onShareWorkspace,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to validate and sanitize character string
  const sanitizeCharacters = (chars: string): string => {
    // Remove any problematic characters and ensure we have valid ones
    const validChars = chars.replace(/[^\x20-\x7E]/g, ''); // Only printable ASCII
    return validChars.length > 0 ? validChars.slice(0, 10) : ' .:-=+*#%@';
  };

  // Helper function to validate color
  const isValidColor = (color: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(color);
  };

  // Randomize shape and pattern
  const handleRandomizeShapePattern = () => {
    if (!selectedInstance) {
      console.warn('No selected instance for randomization');
      return;
    }

    try {
      // All shapes are implemented in artGenerationUtils
      const implementedShapes: ArtConfig['shape'][] = [
        'circle', 'square', 'triangle', 'heart', 'octagon', 'star', 'diamond', 'hexagon',
        'cross', 'arrow', 'lightning', 'cloud', 'flower', 'leaf', 'spiral', 'infinity', 'target'
      ];
      
      const patterns: ArtConfig['pattern'][] = [
        'solid', 'stripey', 'zigzag', 'wave', 'random', 'spiral', 'pulsate', 'ripple', 'fractal', 'noise', 'vortex'
      ];
      
      // Safe character set with fallback
      const baseCharacters = ' .:-=+*#%@';
      const extendedCharacters = ' .:-=+*#%@!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      const randomShape = implementedShapes[Math.floor(Math.random() * implementedShapes.length)];
      const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
      const randomSize = Math.max(20, Math.min(50, Math.floor(Math.random() * 30) + 20)); // Ensure bounds
      const randomRotation = Math.floor(Math.random() * 360);
      
      // Create random character string with validation
      let randomCharacters: string;
      try {
        const shuffled = extendedCharacters.split('').sort(() => Math.random() - 0.5);
        randomCharacters = sanitizeCharacters(shuffled.join(''));
      } catch (error) {
        console.warn('Character randomization failed, using fallback:', error);
        randomCharacters = baseCharacters;
      }
      
      // Update each property individually to ensure proper state updates
      updateConfig({
        shape: randomShape,
        pattern: randomPattern,
        size: randomSize,
        rotation: randomRotation,
        characters: randomCharacters,
      });
    } catch (error) {
      console.error('Shape/Pattern randomization failed:', error);
      // Fallback to safe defaults
      updateConfig({
        shape: 'circle',
        pattern: 'solid',
        size: 30,
        rotation: 0,
        characters: ' .:-=+*#%@',
      });
    }
  };

  // Randomize colors and background
  const handleRandomizeColors = () => {
    if (!selectedInstance) {
      console.warn('No selected instance for color randomization');
      return;
    }

    try {
      // Clean color array with no duplicates and all valid colors
      const colors = [
        '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
        '#ff8800', '#8800ff', '#00ff88', '#ff0088', '#880000', '#008800',
        '#000088', '#888800', '#800080', '#008080', '#ffa500', '#ff69b4',
        '#32cd32', '#ff1493', '#00ced1', '#ff4500', '#9400d3', '#4169e1'
      ];
      
      // Validate colors before using them
      const validColors = colors.filter(isValidColor);
      if (validColors.length === 0) {
        console.warn('No valid colors found, using fallback colors');
        validColors.push('#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff');
      }
      
      const randomBackground = validColors[Math.floor(Math.random() * validColors.length)];
      const randomMain = validColors[Math.floor(Math.random() * validColors.length)];
      
      // Only randomize existing accent colors, don't add or remove
      const currentAccentCount = selectedInstance.config.accentColors.length;
      const randomAccents = Array.from({ length: currentAccentCount }, () => 
        validColors[Math.floor(Math.random() * validColors.length)]
      );
      
      // Update each property individually to ensure proper state updates
      updateConfig({
        backgroundColor: randomBackground,
        mainColor: randomMain,
        accentColors: randomAccents,
      });
    } catch (error) {
      console.error('Color randomization failed:', error);
      // Fallback to safe defaults
      updateConfig({
        backgroundColor: '#000000',
        mainColor: '#ffffff',
        accentColors: selectedInstance.config.accentColors.map(() => '#ffffff'),
      });
    }
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-card border-r border-border z-40
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-lg font-semibold uppercase tracking-widest">
              ASCII_Gen
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              // real-time ascii art workspace
            </p>
            {selectedInstance && (
              <div className="mt-3 border border-brand/40 bg-brand/5 px-2.5 py-2 text-xs">
                <span className="label-caps text-brand">Selected</span>
                <span className="ml-1.5 lowercase text-foreground">{selectedInstance.config.shape}</span>
                <div className="mt-1 text-muted-foreground">
                  <kbd className="border border-border bg-muted px-1 py-0.5 text-[10px]">Delete</kbd> to remove
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Randomize Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleRandomizeShapePattern}
                variant="outline"
                size="lg"
                className="w-full justify-start gap-2 rounded-none border-border text-xs uppercase tracking-wide hover:border-brand hover:bg-brand/5 hover:text-brand disabled:opacity-40"
                disabled={!selectedInstance}
              >
                <Shapes className="h-4 w-4" />
                Randomize Shape & Pattern
              </Button>
              <Button
                onClick={handleRandomizeColors}
                variant="outline"
                size="lg"
                className="w-full justify-start gap-2 rounded-none border-border text-xs uppercase tracking-wide hover:border-brand hover:bg-brand/5 hover:text-brand disabled:opacity-40"
                disabled={!selectedInstance}
              >
                <Palette className="h-4 w-4" />
                Randomize Colors
              </Button>
            </div>

            {/* Canvas Count Badge */}
            <div className="flex justify-center">
              <div className="border border-border px-2 py-1">
                <span className="label-caps">
                  {canvasCount} {canvasCount === 1 ? 'Canvas' : 'Canvases'}
                </span>
              </div>
            </div>

            {/* Share Button */}
            <div className="relative">
              <Button
                onClick={() => {
                  onShareWorkspace?.();
                }}
                variant="outline"
                size="lg"
                className="w-full justify-start gap-2 rounded-none border-border text-xs uppercase tracking-wide hover:border-brand hover:bg-brand/5 hover:text-brand"
                disabled={canvasCount === 0}
              >
                <Share2 className="h-4 w-4" />
                Share Workspace
              </Button>
            </div>

            {/* Conditional Content */}
            {selectedInstance ? (
              <>
                {/* Tabs */}
                <Tabs defaultValue="shape" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="shape">
                      <Shapes className="h-3.5 w-3.5" />
                      Shape
                    </TabsTrigger>
                    <TabsTrigger value="pattern">
                      <Layers className="h-3.5 w-3.5" />
                      Pattern
                    </TabsTrigger>
                    <TabsTrigger value="color">
                      <Palette className="h-3.5 w-3.5" />
                      Color
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="shape" className="mt-6">
                    <ShapeSelector
                      shape={config.shape}
                      setShape={(shape) => updateConfig({ shape })}
                      size={config.size}
                      setSize={(size) => updateConfig({ size })}
                    />
                  </TabsContent>

                  <TabsContent value="pattern" className="mt-6">
                    <PatternSelector
                      pattern={config.pattern}
                      setPattern={(pattern) => updateConfig({ pattern })}
                    />
                    <div className="mt-5">
                      <label
                        htmlFor="characters-input"
                        className="label-caps mb-2 block"
                      >
                        Characters
                      </label>
                      <Input
                        id="characters-input"
                        value={config.characters}
                        onChange={(e) => updateConfig({ characters: e.target.value })}
                        onFocus={() => setIsCharInputFocused(true)}
                        onBlur={() => setIsCharInputFocused(false)}
                        aria-label="ASCII characters to use in the art"
                        placeholder="Enter characters for ASCII art..."
                        className="border-border font-mono"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="color" className="mt-6">
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

                {/* Rotation slider */}
                <div className="space-y-2">
                  <label
                    htmlFor="rotation-slider"
                    className="label-caps flex items-center justify-between"
                  >
                    <span>Rotation</span>
                    <span className="text-foreground">{config.rotation}°</span>
                  </label>
                  <Slider
                    id="rotation-slider"
                    min={0}
                    max={360}
                    step={1}
                    value={[config.rotation]}
                    onValueChange={(value) => updateConfig({ rotation: value[0] })}
                    className="w-full"
                  />
                </div>
              </>
            ) : (
              /* No Canvas Selected Message */
              <div className="flex flex-col items-center justify-center border border-dashed border-border py-12 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center border border-border text-muted-foreground">
                  <Shapes className="h-5 w-5" />
                </div>
                <h3 className="label-caps mb-2">
                  No Canvas Selected
                </h3>
                <p className="max-w-xs px-4 text-xs text-muted-foreground">
                  Click on any canvas to select it and start editing. Use the + button to create new canvases.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}; 