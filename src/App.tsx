import React from 'react';
import { ThemeProvider } from './components/generator/ThemeProvider';
import ASCIIArtGenerator from './components/generator/ASCIIArtGenerator';
import WelcomePopup from './components/WelcomePopup';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <ASCIIArtGenerator />
        <WelcomePopup />
      </div>
    </ThemeProvider>
  );
};

export default App;