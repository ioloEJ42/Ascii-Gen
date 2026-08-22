import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from './ui/dialog';
import { Button } from './ui/button';
import { hasSeenWelcomePopup, markWelcomePopupAsSeen } from '../lib/cookies';
import { Sparkles, Palette, Share2, Settings } from 'lucide-react';

const WelcomePopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if user has seen the popup before
    if (!hasSeenWelcomePopup()) {
      // Small delay to ensure the app is fully loaded
      const timer = setTimeout(() => {
        setIsOpen(true);
        setIsInitialized(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setIsInitialized(true);
    }
  }, []);

  const handleClose = () => {
    markWelcomePopupAsSeen();
    setIsOpen(false);
  };

  // Don't render anything until we've checked the cookie
  if (!isInitialized) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold uppercase tracking-widest">
            <Sparkles className="h-5 w-5 text-brand" />
            Welcome to ASCII_Gen
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            Create beautiful ASCII art with our powerful generator. Here's what you can do:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Palette className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wide">Create & Customize</h4>
                <p className="text-xs text-muted-foreground">
                  Generate various shapes and patterns with customizable colors, characters, and effects.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Settings className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wide">Real-time Preview</h4>
                <p className="text-xs text-muted-foreground">
                  See your changes instantly as you adjust settings in the sidebar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Share2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wide">Multiple Canvases</h4>
                <p className="text-xs text-muted-foreground">
                  Work on multiple pieces at once and organize your art collection.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-dashed border-border p-3">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Tip:</strong> Click on any art piece to select and edit it. Use the sidebar to customize colors, characters, and effects!
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleClose} className="rounded-none border border-brand bg-brand px-6 text-brand-foreground hover:bg-brand/90">
            Let's Get Started!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup; 