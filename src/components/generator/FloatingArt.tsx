import React, { useState, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FloatingArtInstance } from './types';
import { ArtDisplay } from './ArtDisplay';
import { useAnimationTimer } from './hooks/useAnimationTimer';
import { useArtGeneration } from './hooks/useArtGeneration';
import { useArtDisplay } from './hooks/useArtDisplay';
import { X, Move } from 'lucide-react';

interface FloatingArtProps {
  instance: FloatingArtInstance;
  onMouseDown: (e: React.MouseEvent) => void;
  onDelete: () => void;
  isDragging?: boolean;
  isAtBoundary?: boolean;
  isCreating?: boolean;
  isDeleting?: boolean;
  onLabelChange?: (label: string) => void;
  isCanvasSelectionMode?: boolean;
  onCanvasSelect?: () => void;
}

export const FloatingArt: React.FC<FloatingArtProps> = ({
  instance,
  onMouseDown,
  onDelete,
  isDragging = false,
  isAtBoundary = false,
  isCreating = false,
  isDeleting = false,
  onLabelChange,
  isCanvasSelectionMode = false,
  onCanvasSelect,
}) => {
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(instance.label || '');
  const labelInputRef = useRef<HTMLInputElement>(null);
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
  const { fontSize, displaySize, aspectRatio, onResize } = useArtDisplay(instance.config);

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

  // Calculate container size based on art display size plus padding
  const containerWidth = Math.max(instance.size.width, displaySize.width + 32); // 32px for padding
  const containerHeight = Math.max(instance.size.height, displaySize.height + 80); // 80px for header + padding

  return (
    <div
      data-instance-id={instance.id}
      className={`absolute border bg-card transition-all duration-300 ${
        instance.isSelected
          ? 'border-brand ring-1 ring-brand/40'
          : 'border-border hover:border-brand/50'
      } ${isDragging ? 'scale-[1.02] opacity-90 shadow-2xl ring-1 ring-brand/40' : ''} ${
        isAtBoundary && isDragging ? 'border-red-500 ring-2 ring-red-500/50' : ''
      } ${
        isCanvasSelectionMode ? 'cursor-pointer ring-2 ring-brand shadow-brand/30' : ''
      }`}
      style={{
        left: instance.position.x,
        top: instance.position.y,
        width: containerWidth,
        height: containerHeight,
        zIndex: instance.zIndex,
        minWidth: '250px',
        minHeight: '200px',
        // Disable transitions during drag for better performance
        transition: isDragging ? 'none' : 'all 300ms',
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
        className={`flex items-center justify-between border-b border-border bg-muted/50 p-2 ${
          isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
        }`}
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

      {/* Art Display */}
      <div className="flex-1 p-4 flex items-center justify-center overflow-hidden">
        <ArtDisplay
          art={art}
          config={instance.config}
          fontSize={fontSize}
          displaySize={displaySize}
          aspectRatio={aspectRatio}
          onResize={onResize}
        />
      </div>
    </div>
  );
}; 