import React, { useState, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FloatingArtInstance } from './types';
import { ArtDisplay } from './ArtDisplay';
import { useAnimationTimer } from './hooks/useAnimationTimer';
import { useArtGeneration } from './hooks/useArtGeneration';
import { X, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingArtProps {
  instance: FloatingArtInstance;
  onMouseDown: (e: React.MouseEvent) => void;
  onDelete: () => void;
  isDragging?: boolean;
  isAtBoundary?: boolean;
  isCreating?: boolean;
  isDeleting?: boolean;
  onLabelChange?: (label: string) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  isCanvasSelectionMode?: boolean;
  onCanvasSelect?: () => void;
}

const MIN_WIDTH = 250;
const MIN_HEIGHT = 236;
const MAX_WIDTH = 900;
const MAX_HEIGHT = 900;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const FloatingArt: React.FC<FloatingArtProps> = ({
  instance,
  onMouseDown,
  onDelete,
  isDragging = false,
  isAtBoundary = false,
  isCreating = false,
  isDeleting = false,
  onLabelChange,
  onSizeChange,
  isCanvasSelectionMode = false,
  onCanvasSelect,
}) => {
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(instance.label || '');
  const labelInputRef = useRef<HTMLInputElement>(null);
  const resizeStartRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);
  const [animationState, setAnimationState] = useState<'creating' | 'deleting' | 'normal'>(
    isCreating ? 'creating' : isDeleting ? 'deleting' : 'normal'
  );

  // Handle animation state changes
  React.useEffect(() => {
    if (isCreating) {
      setAnimationState('creating');
      // Animate to normal after a brief delay
      const timer = setTimeout(() => setAnimationState('normal'), 50);
      return () => clearTimeout(timer);
    } else if (isDeleting) {
      setAnimationState('deleting');
    } else {
      setAnimationState('normal');
    }
  }, [isCreating, isDeleting]);

  // Update label value when instance label changes
  React.useEffect(() => {
    setLabelValue(instance.label || '');
  }, [instance.label]);

  // Handle double-click to edit label
  const handleHeaderDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditingLabel(true);
    setTimeout(() => {
      labelInputRef.current?.focus();
      labelInputRef.current?.select();
    }, 0);
  };

  // Handle label save
  const handleLabelSave = () => {
    setIsEditingLabel(false);
    if (onLabelChange && labelValue.trim() !== instance.label) {
      onLabelChange(labelValue.trim());
    }
  };

  // Handle label cancel
  const handleLabelCancel = () => {
    setIsEditingLabel(false);
    setLabelValue(instance.label || '');
  };

  // Handle key press in label input
  const handleLabelKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelSave();
    } else if (e.key === 'Escape') {
      handleLabelCancel();
    }
  };

  // Determine if this instance has animated patterns
  const isAnimated = useMemo(() =>
    ["wave", "random", "spiral", "pulsate", "ripple", "fractal", "noise", "vortex"].includes(instance.config.pattern),
    [instance.config.pattern]
  );

  // Animation timer - only enable for animated patterns and when not dragging
  const currentFrame = useAnimationTimer(50, isAnimated && !isDragging);

  // Custom hooks
  const { art } = useArtGeneration(instance.config, currentFrame);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the header bar
    const target = e.target as HTMLElement;
    const headerBar = target.closest('[data-header-bar]');

    if (headerBar) {
      setIsDraggingState(true);
      onMouseDown(e);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingState(false);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Always select when clicking anywhere on the canvas (except header)
    const target = e.target as HTMLElement;
    const headerBar = target.closest('[data-header-bar]');

    if (!headerBar) {
      // Trigger selection by calling onMouseDown with a modified event
      onMouseDown(e);
    }
  };

  // The card owns its size directly — instance.size is the single source of
  // truth for both the window's dimensions and the art area inside it, so
  // there's no separate resize system to fall out of sync with this one.
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCanvasSelectionMode) return;
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: instance.size.width,
      startHeight: instance.size.height,
    };
    setIsResizing(true);
  };

  React.useEffect(() => {
    if (!isResizing) return;

    const handleResizeMouseMove = (e: MouseEvent) => {
      const start = resizeStartRef.current;
      if (!start) return;
      const deltaW = e.clientX - start.startX;
      const deltaH = e.clientY - start.startY;
      let newWidth = start.startWidth + deltaW;
      let newHeight = start.startHeight + deltaH;

      // Shift locks the aspect ratio the card had at the start of the drag —
      // the usual convention (Figma, Photoshop, etc). Whichever axis moved
      // proportionally more drives the other.
      if (e.shiftKey) {
        const ratio = start.startWidth / start.startHeight;
        if (Math.abs(deltaW) > Math.abs(deltaH * ratio)) {
          newHeight = newWidth / ratio;
        } else {
          newWidth = newHeight * ratio;
        }
      }

      onSizeChange?.({
        width: clamp(newWidth, MIN_WIDTH, MAX_WIDTH),
        height: clamp(newHeight, MIN_HEIGHT, MAX_HEIGHT),
      });
    };

    const handleResizeMouseUp = () => {
      resizeStartRef.current = null;
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleResizeMouseMove);
    window.addEventListener('mouseup', handleResizeMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [isResizing, onSizeChange]);

  const containerWidth = instance.size.width;
  const containerHeight = instance.size.height;

  return (
    <div
      data-instance-id={instance.id}
      className={cn(
        'absolute flex flex-col border bg-card transition-all duration-300',
        instance.isSelected ? 'border-brand ring-1 ring-brand/40' : 'border-border hover:border-brand/50',
        (isDragging || isResizing) && 'scale-[1.02] opacity-90 shadow-2xl ring-1 ring-brand/40',
        isAtBoundary && isDragging && 'border-red-500 ring-2 ring-red-500/50',
        isCanvasSelectionMode && 'cursor-pointer ring-2 ring-brand shadow-brand/30'
      )}
      style={{
        left: instance.position.x,
        top: instance.position.y,
        width: containerWidth,
        height: containerHeight,
        zIndex: instance.zIndex,
        minWidth: '250px',
        minHeight: '200px',
        // width/height are never transitioned — resize is direct manipulation,
        // not an animation. (Animating them was the actual bug: toggling the
        // whole `transition` shorthand in lockstep with isResizing raced with
        // the size update, so the browser would animate the resize instead of
        // applying it instantly, and that animation would never visibly
        // settle — the card looked stuck one step behind its real size.)
        // Position/opacity/transform still transition smoothly when not
        // actively being dragged.
        transition: isDragging || isResizing
          ? 'none'
          : 'left 300ms, top 300ms, opacity 300ms, transform 300ms',
        // Disable text selection for better drag and drop experience
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        // Animation states
        transform: animationState === 'creating' ? 'scale(0)' : animationState === 'deleting' ? 'scale(0)' : 'scale(1)',
        opacity: animationState === 'creating' || animationState === 'deleting' ? 0 : 1,
      }}
      onMouseUp={handleMouseUp}
      onClick={isCanvasSelectionMode ? onCanvasSelect : handleCanvasClick}
      onMouseDown={isCanvasSelectionMode ? undefined : onMouseDown}
    >
      {/* Header */}
      <div
        data-header-bar
        className={cn(
          'flex flex-shrink-0 items-center justify-between border-b border-border bg-muted/50 p-2',
          isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
        )}
        style={{
          // Disable text selection for better drag and drop experience
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
        onMouseDown={isCanvasSelectionMode ? (e) => e.stopPropagation() : handleMouseDown}
        onDoubleClick={isCanvasSelectionMode ? (e) => e.stopPropagation() : handleHeaderDoubleClick}
      >
        <div className="flex items-center gap-2">
          <Move className="h-4 w-4 text-muted-foreground" />
          {isEditingLabel ? (
            <input
              type="text"
              ref={labelInputRef}
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
              onBlur={handleLabelSave}
              onKeyPress={handleLabelKeyPress}
              className="bg-transparent border-none outline-none text-sm font-medium text-foreground min-w-0 flex-1"
              maxLength={20}
            />
          ) : (
            <span className="max-w-32 truncate text-[11px] font-medium uppercase tracking-wide text-foreground">
              {instance.label || 'Untitled'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            data-delete-button
            className="h-6 w-6 p-0 text-destructive hover:text-destructive transition-all duration-150"
          >
            <X className="h-3 w-3" strokeWidth={8} />
          </Button>
        </div>
      </div>

      {/* Art Display — fills exactly whatever space flex leaves it below the
          header; it measures that space itself rather than being told a
          computed number, so there's no assumption to drift out of sync. */}
      <ArtDisplay art={art} config={instance.config} />

      {/* Resize handle — drives the card's size directly */}
      <div
        className="resize-grip"
        onMouseDown={handleResizeMouseDown}
        aria-label="Resize canvas"
        role="slider"
        aria-valuenow={containerWidth}
      />
    </div>
  );
};
