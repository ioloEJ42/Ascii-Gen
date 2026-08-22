import React, { useState, useCallback, useRef, memo, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { FloatingArtInstance, ArtConfig } from './types';
import { FloatingArt } from './FloatingArt';
import { Plus } from 'lucide-react';
import { Trash2, Copy, Shuffle, Move } from 'lucide-react';

interface CanvasManagerProps {
  onSelectionChange: (selectedInstance: FloatingArtInstance | null) => void;
  selectedInstance: FloatingArtInstance | null;
  onCanvasCountChange?: (count: number) => void;
  onShareWorkspace?: () => void;
  isCanvasSelectionMode?: boolean;
  onCanvasSelect?: (instance: FloatingArtInstance) => void;
}

// Create a ref type for CanvasManager
interface CanvasManagerRef {
  shareWorkspace: () => void;
}

// Memoized FloatingArt component to prevent unnecessary re-renders
const MemoizedFloatingArt = memo(FloatingArt);

export const CanvasManager = forwardRef<CanvasManagerRef, CanvasManagerProps>(({ 
  onSelectionChange,
  selectedInstance,
  onCanvasCountChange,
  onShareWorkspace,
  isCanvasSelectionMode = false,
  onCanvasSelect,
}, ref) => {
  const [artInstances, setArtInstances] = useState<FloatingArtInstance[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [draggedInstance, setDraggedInstance] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isAtBoundary, setIsAtBoundary] = useState(false);
  const [creatingInstances, setCreatingInstances] = useState<Set<string>>(new Set());
  const [deletingInstances, setDeletingInstances] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const draggedElementRef = useRef<HTMLElement | null>(null);
  const lastMouseMoveRef = useRef<number>(0);

  // localStorage keys
  const STORAGE_KEY = 'ascii-art-canvases';
  const Z_INDEX_KEY = 'ascii-art-next-z-index';

  // Save canvases to localStorage
  const saveCanvasesToStorage = useCallback((canvases: FloatingArtInstance[], nextZ: number) => {
    try {
      const dataToSave = {
        canvases: canvases.map(canvas => ({
          id: canvas.id,
          config: canvas.config,
          position: canvas.position,
          size: canvas.size,
          isSelected: canvas.isSelected,
          zIndex: canvas.zIndex,
          label: canvas.label
        })),
        nextZIndex: nextZ,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      localStorage.setItem(Z_INDEX_KEY, nextZ.toString());
    } catch (error) {
      console.warn('Failed to save canvases to localStorage:', error);
    }
  }, []);

  // Load canvases from localStorage
  const loadCanvasesFromStorage = useCallback(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.canvases && Array.isArray(parsed.canvases)) {
          setArtInstances(parsed.canvases);
          if (parsed.nextZIndex) {
            setNextZIndex(parsed.nextZIndex);
          }
          return true;
        }
      }
    } catch (error) {
      console.warn('Failed to load canvases from localStorage:', error);
    }
    return false;
  }, []);

  // Load workspace from URL parameters
  const loadWorkspaceFromURL = useCallback(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedData = urlParams.get('data');

      if (encodedData) {
        const decodedData = JSON.parse(atob(encodedData));
        if (decodedData.canvases && Array.isArray(decodedData.canvases)) {
          setArtInstances(decodedData.canvases);
          if (decodedData.nextZIndex) {
            setNextZIndex(decodedData.nextZIndex);
          }
          return true;
        }
      }
    } catch (error) {
      console.warn('Failed to load workspace from URL:', error);
    }
    return false;
  }, []);

  // Load canvases on component mount
  React.useEffect(() => {
    // First try to load from URL parameters
    const loadedFromURL = loadWorkspaceFromURL();

    if (!loadedFromURL) {
      // If no URL data, try localStorage
      const loadedFromStorage = loadCanvasesFromStorage();
      if (!loadedFromStorage) {
        // If no saved data, create the first canvas automatically
        const firstCanvas: FloatingArtInstance = {
          id: `art-${Date.now()}`,
          config: {
            size: 30,
            shape: "circle" as const,
            pattern: "solid" as const,
            characters: " .:-=+*#%@",
            backgroundColor: "#000000",
            mainColor: "#ffffff",
            accentColors: [],
            rotation: 0,
          },
          position: { x: 50, y: 50 },
          size: { width: 300, height: 300 },
          isSelected: false,
          zIndex: 1,
          label: "My First Canvas",
        };
        
        setArtInstances([firstCanvas]);
        setNextZIndex(2);
      }
    }
    setIsLoading(false);
  }, [loadCanvasesFromStorage, loadWorkspaceFromURL]);

  // Save canvases whenever they change
  React.useEffect(() => {
    if (artInstances.length > 0) {
      saveCanvasesToStorage(artInstances, nextZIndex);
    }
  }, [artInstances, nextZIndex, saveCanvasesToStorage]);

  // Share workspace via URL
  const shareWorkspace = useCallback(() => {
    // Prevent multiple rapid calls
    if (isSharing) {
      return;
    }

    setIsSharing(true);

    try {
      const dataToShare = {
        canvases: artInstances.map(canvas => ({
          id: canvas.id,
          config: canvas.config,
          position: canvas.position,
          size: canvas.size,
          isSelected: canvas.isSelected,
          zIndex: canvas.zIndex,
          label: canvas.label
        })),
        nextZIndex: nextZIndex,
        timestamp: Date.now()
      };
      
      const encodedData = btoa(JSON.stringify(dataToShare));
      const shareUrl = `${window.location.origin}${window.location.pathname}?data=${encodeURIComponent(encodedData)}`;

      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        onShareWorkspace?.();
        setIsSharing(false);
      }).catch((error) => {
        console.error('Failed to copy to clipboard:', error);
        // Don't automatically open new tabs - just show error
        alert('Failed to copy to clipboard. Please copy the URL manually: ' + shareUrl);
        onShareWorkspace?.();
        setIsSharing(false);
      });
    } catch (error) {
      console.warn('Failed to share workspace:', error);
      alert('Failed to generate share URL. Please try again.');
      setIsSharing(false);
    }
  }, [artInstances, nextZIndex, onShareWorkspace, isSharing]);

  // Generate random shape and pattern
  const generateRandomShapeAndPattern = useCallback(() => {
    const shapes: ArtConfig['shape'][] = [
      'circle', 'square', 'triangle', 'heart', 'octagon', 'star', 'diamond', 'hexagon',
      'cross', 'arrow', 'lightning', 'cloud', 'flower', 'leaf', 'spiral', 'infinity', 'target'
    ];
    
    const patterns: ArtConfig['pattern'][] = [
      'solid', 'stripey', 'zigzag', 'wave', 'random', 'spiral', 'pulsate', 'ripple', 'fractal', 'noise', 'vortex'
    ];
    
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const randomSize = Math.max(20, Math.min(50, Math.floor(Math.random() * 30) + 20));
    const randomRotation = Math.floor(Math.random() * 360);
    
    return {
      shape: randomShape,
      pattern: randomPattern,
      size: randomSize,
      rotation: randomRotation,
    };
  }, []);

  // Smart positioning function
  const getSmartPosition = useCallback(() => {
    if (artInstances.length === 0) {
      // First canvas: top-left position
      return { x: 50, y: 50 };
    } else {
      // Subsequent canvases: random position in available area
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return { x: 50, y: 50 };

      const canvasWidth = canvasRect.width;
      const canvasHeight = canvasRect.height;
      const footerHeight = 88; // Footer content height
      const padding = 10;
      const canvasSize = 300; // Approximate canvas size

      // Calculate available area (excluding footer)
      const availableWidth = canvasWidth - canvasSize - padding * 2;
      const availableHeight = canvasHeight - canvasSize - footerHeight - padding * 2;

      // Try to find a non-overlapping position
      let attempts = 0;
      const maxAttempts = 50;
      
      while (attempts < maxAttempts) {
        // Generate random position within available area
        const randomX = Math.max(padding, Math.min(availableWidth, Math.random() * availableWidth));
        const randomY = Math.max(padding, Math.min(availableHeight, Math.random() * availableHeight));

        // Check if this position overlaps with existing canvases
        const hasOverlap = artInstances.some(instance => {
          const distance = Math.sqrt(
            Math.pow(randomX - instance.position.x, 2) + 
            Math.pow(randomY - instance.position.y, 2)
          );
          // Consider overlap if centers are too close (less than 1.5x canvas size)
          return distance < canvasSize * 1.5;
        });

        if (!hasOverlap) {
          return { x: randomX, y: randomY };
        }

        attempts++;
      }

      // If we can't find a non-overlapping position, just return a random one
      const fallbackX = Math.max(padding, Math.min(availableWidth, Math.random() * availableWidth));
      const fallbackY = Math.max(padding, Math.min(availableHeight, Math.random() * availableHeight));
      return { x: fallbackX, y: fallbackY };
    }
  }, [artInstances]);

  // Create a new art instance
  const createNewArt = useCallback(() => {
    const position = getSmartPosition();
    const isFirstCanvas = artInstances.length === 0;
    
    // First canvas: simple circle with solid pattern
    // Subsequent canvases: random shape and pattern
    const config = isFirstCanvas ? {
      size: 30,
      shape: "circle" as const,
      pattern: "solid" as const,
      characters: " .:-=+*#%@",
      backgroundColor: "#000000",
      mainColor: "#ffffff",
      accentColors: [],
      rotation: 0,
    } : {
      ...generateRandomShapeAndPattern(),
      characters: " .:-=+*#%@",
      backgroundColor: "#000000",
      mainColor: "#ffffff",
      accentColors: [],
    };
    
    const newInstance: FloatingArtInstance = {
      id: `art-${Date.now()}`,
      config,
      position: position,
      size: { width: 300, height: 300 },
      isSelected: false,
      zIndex: nextZIndex,
      label: isFirstCanvas ? "My First Canvas" : `Canvas ${artInstances.length + 1}`,
    };

    // Add the instance with creation animation
    setArtInstances(prev => [...prev, newInstance]);
    setNextZIndex(prev => prev + 1);
    setCreatingInstances(prev => new Set(prev).add(newInstance.id));
    
    // Remove creation animation after animation completes
    setTimeout(() => {
      setCreatingInstances(prev => {
        const newSet = new Set(prev);
        newSet.delete(newInstance.id);
        return newSet;
      });
    }, 300);
  }, [nextZIndex, getSmartPosition, artInstances, generateRandomShapeAndPattern]);

  // Delete an art instance
  const deleteArt = useCallback((id: string) => {
    // Add deletion animation first
    setDeletingInstances(prev => new Set(prev).add(id));
    
    // Wait for animation to complete before actually removing
    setTimeout(() => {
      setArtInstances(prev => {
        const newInstances = prev.filter(instance => instance.id !== id);
        // If we deleted the selected instance, clear selection
        if (selectedInstance?.id === id) {
          onSelectionChange(null);
        }
        return newInstances;
      });
      
      // Clear deletion animation state
      setDeletingInstances(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  }, [selectedInstance, onSelectionChange]);

  // Sync selected instance with instances array
  React.useEffect(() => {
    if (selectedInstance) {
      setArtInstances(prev => prev.map(instance => 
        instance.id === selectedInstance.id 
          ? { ...instance, config: selectedInstance.config, isSelected: true }
          : { ...instance, isSelected: false }
      ));
    }
  }, [selectedInstance]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if we have a selected instance and not typing in an input
      if (!selectedInstance || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Delete or Backspace to delete selected canvas
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        
        // Add visual feedback by briefly highlighting the delete button
        const deleteButton = document.querySelector(`[data-instance-id="${selectedInstance.id}"] [data-delete-button]`);
        if (deleteButton) {
          deleteButton.classList.add('scale-110', 'bg-destructive/20');
          setTimeout(() => {
            deleteButton.classList.remove('scale-110', 'bg-destructive/20');
          }, 150);
        }
        
        deleteArt(selectedInstance.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedInstance, deleteArt]);

  // Handle selection
  const handleSelect = useCallback((instance: FloatingArtInstance) => {
    // Update selection state for all instances
    setArtInstances(prev => prev.map(art => ({
      ...art,
      isSelected: art.id === instance.id
    })));
    
    // Notify parent of selection change
    onSelectionChange(instance);
  }, [onSelectionChange]);

  // Handle canvas selection for sharing
  const handleCanvasSelectForSharing = useCallback((instance: FloatingArtInstance) => {
    if (isCanvasSelectionMode && onCanvasSelect) {
      // Immediately exit selection mode and share the canvas
      onCanvasSelect(instance);
      // The sharing will be handled by the parent component
    }
  }, [isCanvasSelectionMode, onCanvasSelect]);

  // Context menu functions
  const deleteAllCanvases = useCallback(() => {
    if (artInstances.length === 0) return;
    
    // Add deletion animation for all canvases
    setDeletingInstances(new Set(artInstances.map(instance => instance.id)));
    
    // Wait for animation to complete before removing all
    setTimeout(() => {
      setArtInstances([]);
      onSelectionChange(null);
      
      // Clear deletion animation state
      setDeletingInstances(new Set());
    }, 300);
  }, [artInstances, onSelectionChange]);

  const duplicateAllCanvases = useCallback(() => {
    if (artInstances.length === 0) return;
    
    const duplicatedInstances = artInstances.map(instance => ({
      ...instance,
      id: `art-${Date.now()}-${Math.random()}`,
      position: {
        x: instance.position.x + 50,
        y: instance.position.y + 50
      },
      zIndex: nextZIndex + instance.zIndex
    }));
    
    setArtInstances(prev => [...prev, ...duplicatedInstances]);
    setNextZIndex(prev => prev + artInstances.length);
  }, [artInstances, nextZIndex]);

  const randomizeAllShapes = useCallback(() => {
    setArtInstances(prev => prev.map(instance => ({
      ...instance,
      config: {
        ...instance.config,
        ...generateRandomShapeAndPattern()
      }
    })));
  }, [generateRandomShapeAndPattern]);

  const centerAllCanvases = useCallback(() => {
    if (artInstances.length === 0) return;
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const centerX = (canvasRect.width - 300) / 2;
    const centerY = (canvasRect.height - 300 - 88) / 2; // Account for footer
    
    // Sort canvases by z-index to determine layering order
    const sortedCanvases = [...artInstances].sort((a, b) => a.zIndex - b.zIndex);
    
    setArtInstances(prev => prev.map((instance) => {
      const sortedIndex = sortedCanvases.findIndex(canvas => canvas.id === instance.id);
      const offset = sortedIndex * 30; // Smaller offset for better cascading
      
      return {
        ...instance,
        position: {
          x: centerX + offset,
          y: centerY + offset
        },
        // Ensure z-index matches the visual layering
        zIndex: sortedIndex + 1
      };
    }));
    
    // Update the next z-index to be higher than all current canvases
    setNextZIndex(artInstances.length + 2);
  }, [artInstances]);

  // Clear localStorage and reset workspace
  const clearWorkspace = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(Z_INDEX_KEY);
      setArtInstances([]);
      setNextZIndex(1);
      onSelectionChange(null);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }, [onSelectionChange]);

  // Update canvas label
  const updateCanvasLabel = useCallback((id: string, label: string) => {
    setArtInstances(prev => prev.map(instance => 
      instance.id === id ? { ...instance, label } : instance
    ));
  }, []);

  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    const instance = artInstances.find(art => art.id === id);
    if (!instance) return;

    // Check if the click was on the header bar (for dragging)
    const target = e.target as HTMLElement;
    const headerBar = target.closest('[data-header-bar]');
    
    if (headerBar) {
      // Handle dragging
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;
      
      // Calculate offset relative to the canvas container
      const offsetX = e.clientX - canvasRect.left - instance.position.x;
      const offsetY = e.clientY - canvasRect.top - instance.position.y;

      setDraggedInstance(id);
      setDragOffset({ x: offsetX, y: offsetY });

      // Cache the dragged element for better performance
      draggedElementRef.current = e.currentTarget as HTMLElement;

      // Bring to front
      setArtInstances(prev => prev.map(art => ({
        ...art,
        zIndex: art.id === id ? nextZIndex : art.zIndex,
      })));
      setNextZIndex(prev => prev + 1);
    } else {
      // Handle selection only (not dragging)
      handleSelect(instance);
    }
  }, [artInstances, nextZIndex, handleSelect]);

  // Throttled mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedInstance || !canvasRef.current) return;

    // Throttle to 60fps for better performance
    const now = performance.now();
    if (now - lastMouseMoveRef.current < 16) return; // ~60fps
    lastMouseMoveRef.current = now;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;

    // Get the dragged instance to calculate boundaries
    const draggedInstanceData = artInstances.find(instance => instance.id === draggedInstance);
    if (!draggedInstanceData) return;

    // Calculate canvas boundaries
    const canvasWidth = canvasRect.width;
    const canvasHeight = canvasRect.height;
    const canvasWidth_px = draggedInstanceData.size.width;
    const canvasHeight_px = draggedInstanceData.size.height;
    const padding = 10; // Small padding from edges
    const footerContentHeight = 88; // Footer content height (py-6 = 48px + content ~40px), excluding mt-8 margin

    // Constrain position within boundaries
    const constrainedX = Math.max(padding, Math.min(newX, canvasWidth - canvasWidth_px - padding));
    const constrainedY = Math.max(padding, Math.min(newY, canvasHeight - canvasHeight_px - footerContentHeight - padding));

    // Check if we're at a boundary for visual feedback
    const isAtBoundaryNow = (constrainedX !== newX || constrainedY !== newY);
    setIsAtBoundary(isAtBoundaryNow);

    // Update the state in real-time for live preview
    setArtInstances(prev => prev.map(instance => 
      instance.id === draggedInstance 
        ? { ...instance, position: { x: constrainedX, y: constrainedY } }
        : instance
    ));
  }, [draggedInstance, dragOffset, artInstances]);

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    // No need to update state here since it's already updated in real-time
    setDraggedInstance(null);
    draggedElementRef.current = null;
    setIsAtBoundary(false);
  }, []);

  // Handle canvas click to deselect
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setArtInstances(prev => prev.map(art => ({ ...art, isSelected: false })));
      onSelectionChange(null);
    }
  }, [onSelectionChange]);

  // Handle context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  // Close context menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => closeContextMenu();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [closeContextMenu]);

  // Notify parent when canvas count changes
  React.useEffect(() => {
    if (onCanvasCountChange) {
      onCanvasCountChange(artInstances.length);
    }
  }, [artInstances.length, onCanvasCountChange]);

  // Expose shareWorkspace to parent
  useImperativeHandle(ref, () => ({
    shareWorkspace: shareWorkspace,
  }));

  return (
    <div className="relative flex-1 bg-background overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-brand"></div>
            <p className="label-caps">Restoring workspace...</p>
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className="w-full h-full relative cursor-default bg-dot-grid"
        style={{
          // Disable text selection for better drag and drop experience
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        onContextMenu={handleContextMenu}
      >
        {/* Floating Art Instances */}
        {artInstances.map((instance) => (
          <MemoizedFloatingArt
            key={instance.id}
            instance={instance}
            onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, instance.id)}
            onDelete={() => deleteArt(instance.id)}
            isDragging={draggedInstance === instance.id}
            isAtBoundary={isAtBoundary}
            isCreating={creatingInstances.has(instance.id)}
            isDeleting={deletingInstances.has(instance.id)}
            onLabelChange={(label) => updateCanvasLabel(instance.id, label)}
            isCanvasSelectionMode={isCanvasSelectionMode}
            onCanvasSelect={() => handleCanvasSelectForSharing(instance)}
          />
        ))}

        {/* Add Button */}
        <Button
          onClick={createNewArt}
          size="icon"
          className="absolute bottom-4 right-4 z-50 rounded-none border border-brand bg-brand text-brand-foreground hover:bg-brand/90"
          aria-label="Add new ASCII art"
        >
          <Plus className="h-5 w-5" />
        </Button>

        {/* Context Menu */}
        {contextMenu.visible && (
          <div
            className="fixed z-50 min-w-48 border border-border bg-card shadow-lg"
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
            }}
          >
            <ul className="p-1">
              <li
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-wide hover:bg-accent"
                onClick={() => { deleteAllCanvases(); closeContextMenu(); }}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                Delete All Canvases
              </li>
              <li
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-wide hover:bg-accent"
                onClick={() => { duplicateAllCanvases(); closeContextMenu(); }}
              >
                <Copy className="h-3.5 w-3.5" />
                Duplicate All Canvases
              </li>
              <li
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-wide hover:bg-accent"
                onClick={() => { randomizeAllShapes(); closeContextMenu(); }}
              >
                <Shuffle className="h-3.5 w-3.5" />
                Randomize All Shapes
              </li>
              <li
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-wide hover:bg-accent"
                onClick={() => { centerAllCanvases(); closeContextMenu(); }}
              >
                <Move className="h-3.5 w-3.5" />
                Center All Canvases
              </li>
              <li
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-wide hover:bg-accent"
                onClick={() => { clearWorkspace(); closeContextMenu(); }}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                Clear Workspace
              </li>
              <li
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-wide hover:bg-accent"
                onClick={() => { shareWorkspace(); closeContextMenu(); }}
              >
                <Copy className="h-3.5 w-3.5" />
                Share Workspace
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}); 