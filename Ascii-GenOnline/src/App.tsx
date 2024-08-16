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

// Customizable Animation Speed: For animated patterns, allow users to adjust the speed of the animation.
// Save and Load Configurations: Implement functionality to save current configurations and load them later.
// Shareable Links: Generate unique URLs that encode the current configuration, allowing users to share their creations easily.
// More Shapes: Add more complex shapes like stars, hearts, or even custom SVG uploads.
// Text Overlay: Allow users to add text overlays to their ASCII art.
// Color Gradients: Implement color gradient options for more vibrant art.
// ASCII Art Library: Create a gallery of pre-made ASCII art that users can start from and modify.
// Mobile Optimization: Ensure the interface is fully responsive and works well on mobile devices.
// Accessibility Improvements: Conduct an accessibility audit and make necessary improvements.
// Performance Optimization: If dealing with larger ASCII art sizes, consider using Web Workers for calculations to keep the UI responsive.
// Social Sharing: Add buttons to directly share creations on social media platforms.
// User Accounts: Implement a simple account system for users to save and manage their creations.
// API Endpoint: Create an API that allows other developers to generate ASCII art programmatically.
// Collaborative Mode: Implement a real-time collaborative feature where multiple users can work on the same piece.
// ASCII Art to Image Conversion: Allow users to upload images and convert them into ASCII art.
// More Export Options: Add options to export as SVG or even animated SVG for animated patterns.
// Keyboard Shortcuts: Implement keyboard shortcuts for common actions to improve usability.
// Tutorials or Tooltips: Add an interactive tutorial or helpful tooltips to guide new users