import React from 'react';
import { ThemeProvider } from './components/generator/ThemeProvider';
import ASCIIArtGenerator from './components/generator/ASCIIArtGenerator';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        <ASCIIArtGenerator />
      </div>
    </ThemeProvider>
  );
};

export default App;