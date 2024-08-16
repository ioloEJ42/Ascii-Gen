# ASCII Art Generator

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
5. [Usage](#usage)
   - [Shape Selection](#shape-selection)
   - [Pattern Customization](#pattern-customization)
   - [Color Management](#color-management)
   - [Export Options](#export-options)
   - [Keyboard Shortcuts](#keyboard-shortcuts)
6. [Code Structure](#code-structure)
7. [Performance Optimizations](#performance-optimizations)
8. [Accessibility](#accessibility)
9. [Deployment](#deployment)
10. [Future Enhancements](#future-enhancements)
11. [Contributing](#contributing)
12. [License](#license)
13. [Acknowledgments](#acknowledgments)

## Introduction

The ASCII Art Generator is an interactive web application that allows users to create, customize, and export ASCII art. This project demonstrates the power of modern web technologies in creating visually appealing and functional user interfaces, while also showcasing complex algorithms for shape generation and pattern application in ASCII format.

Live Demo: [ASCII Art Generator](https://ascii-gen.netlify.app/)

## Features

- **Dynamic Shape Generation**: Choose from multiple shapes including circle, square, triangle, heart, octagon, star, and diamond.
- **Customizable Patterns**: Apply various patterns to your shapes, including animated options like wave, spiral, and pulsate.
- **Real-time Color Management**: Customize background, main, and accent colors with an intuitive color picker.
- **Interactive Resizing**: Resize your ASCII art in real-time with a draggable interface.
- **Multiple Export Options**: Save your creation as JPG, PNG, animated GIF, or even as a React component.
- **Responsive Design**: Fully responsive layout that works on desktop and mobile devices.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing in any environment.
- **Keyboard Shortcuts**: Enhance productivity with easy-to-use keyboard shortcuts.
- **Accessibility**: Implemented with web accessibility standards in mind.

## Tech Stack

- **React.js**: A JavaScript library for building user interfaces
- **TypeScript**: Adds static typing to JavaScript for improved developer experience and code quality
- **Vite**: Next-generation front-end tooling for faster development and optimized builds
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development
- **Shadcn UI**: A collection of re-usable components built with Radix UI and Tailwind CSS
- **React-resizable**: A resizable component for React
- **HTML2Canvas**: Allows for rendering and capturing the ASCII art as an image
- **GIF.js**: Enables the creation of animated GIFs from the ASCII art
- **React-hotkeys-hook**: Provides easy implementation of keyboard shortcuts

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later) or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ASCII-GEN.git
   cd ASCII-GEN/Ascii-GenOnline

2. Install dependencies:
   npm install
   # or
   yarn install

3. Start the development server:
    npm run dev
    # or
    yarn dev
    
4. Open http://localhost:3000 in your browser to view the application.

# Usage
Shape Selection

Choose from a variety of shapes in the Shape tab. Adjust the size using the slider for more detailed or larger ASCII art.
Pattern Customization

Explore different patterns in the Pattern tab. Animated patterns create dynamic ASCII art.
Color Management

In the Color tab, customize the background, main color, and add accent colors for more vibrant art.
Export Options

Use the export buttons to save your creation in various formats:

    JPG/PNG: For static images
    GIF: For animated patterns
    React Component: Exports the ASCII art as a reusable React component

# Keyboard Shortcuts

    R: Randomize the current configuration
    T: Toggle between light and dark themes
    C: Copy the ASCII art to clipboard
    J: Export as JPG
    P: Export as PNG
    G: Show GIF export options
    X: Export as React component

# Code Structure
  The project follows a modular structure:

    src/components/generator/: Main component files
    ASCIIArtGenerator.tsx: Core component orchestrating the entire application
    ui/: UI components like ShapeSelector, PatternSelector, ColorSelector
    hooks/: Custom hooks for animation and art generation
    utils/: Utility functions including art generation algorithms and export functions
    src/types.ts: TypeScript type definitions
    src/styles/: Global styles and Tailwind configuration

# Performance Optimizations

    Efficient re-rendering using React's useCallback and useMemo hooks
    Optimized art generation algorithm to handle large ASCII art sizes
    Lazy loading of export functionalities to reduce initial load time

# Accessibility

    Proper ARIA labels on interactive elements
    Keyboard navigation support
    Color contrast considerations in the UI design
    Screen reader-friendly content structure

# Deployment

The application is deployed on Netlify, leveraging their continuous deployment features:

    Connect your GitHub repository to Netlify
    Set the build command to npm run build or yarn build
    Set the publish directory to dist/
    Configure any necessary environment variables in Netlify's dashboard

# Future Enhancements

    User accounts for saving and sharing creations
    More shape options and custom shape uploads
    Advanced pattern editor
    Social media sharing integration
    Performance optimizations for mobile devices

# Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

    Fork the repository
    Create your feature branch (git checkout -b feature/AmazingFeature)
    Commit your changes (git commit -m 'Add some AmazingFeature')
    Push to the branch (git push origin feature/AmazingFeature)
    Open a Pull Request

 #License

This project is licensed under the MIT License - see the LICENSE.md file for details.
Acknowledgments

    React Documentation
    TypeScript Documentation
    Tailwind CSS
    Vite
    Netlify


Developed with <3 by IEJ