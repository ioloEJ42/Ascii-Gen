import React, { useState, useCallback, useRef } from "react";
import { Sidebar } from "./Sidebar";
import { CanvasManager } from "./CanvasManager";
import { Footer } from "./Footer";
import { ArtConfig, FloatingArtInstance } from "./types";

// Create a ref type for CanvasManager
interface CanvasManagerRef {
  shareWorkspace: () => void;
}

const ASCIIArtGenerator: React.FC = () => {
  // State management
  const [isCharInputFocused, setIsCharInputFocused] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<FloatingArtInstance | null>(null);
  const [canvasCount, setCanvasCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Ref to CanvasManager
  const canvasManagerRef = useRef<CanvasManagerRef>(null);

  // Default config for sidebar (when no instance is selected)
  const defaultConfig: ArtConfig = {
    size: 40,
    shape: "circle",
    pattern: "solid",
    characters: " .:-=+*#%@",
    backgroundColor: "#000000",
    mainColor: "#ffffff",
    accentColors: [],
    rotation: 0,
  };

  // Show toast notification
  const showToastNotification = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  // Share entire workspace
  const handleShareWorkspace = useCallback(() => {
    canvasManagerRef.current?.shareWorkspace();
    showToastNotification('Link added to clipboard!');
  }, [showToastNotification]);

  // Handle selection changes
  const handleSelectionChange = useCallback((instance: FloatingArtInstance | null) => {
    setSelectedInstance(instance);
  }, []);

  // Handle canvas count changes
  const handleCanvasCountChange = useCallback((count: number) => {
    setCanvasCount(count);
  }, []);

  // Handle config updates from sidebar
  const handleConfigUpdate = useCallback((updates: Partial<ArtConfig>) => {
    if (selectedInstance) {
      const newConfig = { ...selectedInstance.config, ...updates };
      // Update the selected instance's config
      setSelectedInstance(prev => {
        if (!prev) return null;
        return { ...prev, config: newConfig };
      });
    }
  }, [selectedInstance]);

  // Use selected instance config or default config
  const currentConfig = selectedInstance?.config || defaultConfig;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        config={currentConfig}
        updateConfig={handleConfigUpdate}
        isCharInputFocused={isCharInputFocused}
        setIsCharInputFocused={setIsCharInputFocused}
        selectedInstance={selectedInstance}
        canvasCount={canvasCount}
        onShareWorkspace={handleShareWorkspace}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Canvas Manager */}
        <CanvasManager 
          onSelectionChange={handleSelectionChange}
          selectedInstance={selectedInstance}
          onCanvasCountChange={handleCanvasCountChange}
          onShareWorkspace={handleShareWorkspace}
          ref={canvasManagerRef}
        />

        {/* Footer */}
        <Footer />
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed right-4 top-4 z-50 animate-in slide-in-from-top-2 border border-brand bg-card px-4 py-2.5 shadow-lg">
          <p className="text-xs uppercase tracking-wide text-foreground">{toastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ASCIIArtGenerator;
