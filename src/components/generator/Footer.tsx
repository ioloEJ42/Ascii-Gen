import React, { useState } from 'react';
import { Github } from 'lucide-react';
import { resetWelcomePopup } from '../../lib/cookies';

export const Footer: React.FC = () => {
  const [showRoadmap, setShowRoadmap] = useState(false);
  const isDevelopment = import.meta.env.DEV;

  return (
    <footer className="border-t border-border bg-card/50 py-4">
      <div className="mx-auto flex max-w-7xl justify-center px-4">
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/ioloEJ42"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center text-[11px] uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            ioloEJ42
          </a>
          <button
            className="border border-border px-2.5 py-1 text-[11px] uppercase tracking-wide text-muted-foreground transition-colors hover:border-brand hover:text-brand"
            onClick={() => setShowRoadmap(true)}
            aria-label="Show Roadmap"
          >
            Roadmap
          </button>
          {isDevelopment && (
            <button
              className="border border-dashed border-muted-foreground/30 px-2.5 py-1 text-[11px] uppercase tracking-wide text-muted-foreground/70 transition-colors hover:border-destructive hover:text-destructive"
              onClick={resetWelcomePopup}
              aria-label="Show Welcome Popup (Dev Only)"
              title="Show Welcome Popup (Dev Only)"
            >
              Show Welcome
            </button>
          )}
        </div>
      </div>
      {/* Roadmap Modal */}
      {showRoadmap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-md border border-border bg-card p-6 shadow-lg">
            <button
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              onClick={() => setShowRoadmap(false)}
              aria-label="Close Roadmap"
            >
              ×
            </button>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand">
              // Roadmap
            </h2>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>&gt; Export to GIF and video (with animation support)</li>
              <li>&gt; Export to PNG/JPG/React component</li>
              <li>&gt; Share art to social media</li>
              <li>&gt; Save/load art configurations</li>
              <li>&gt; More shapes and patterns</li>
              <li>&gt; Custom color palettes</li>
              <li>&gt; Accessibility improvements</li>
              <li>&gt; Mobile UI enhancements</li>
              <li>&gt; Performance optimizations</li>
              <li>&gt; Community gallery</li>
            </ul>
            <div className="mt-4 text-[11px] text-muted-foreground">
              Have an idea? <a href="https://github.com/ioloEJ42/Ascii-Gen/issues" target="_blank" rel="noopener noreferrer" className="text-brand underline hover:text-brand/80">Suggest it on GitHub!</a>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
