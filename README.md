# ASCII Art Generator V2

> **Complete V2 Overhaul** - A modern, multi-canvas ASCII art generator with real-time collaboration and advanced customization.

## Table of Contents
1. [Introduction](#introduction)
2. [V2 Features](#v2-features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Usage](#usage)
6. [Code Structure](#code-structure)
7. [Performance Optimizations](#performance-optimizations)
8. [Future Enhancements](#future-enhancements)
9. [Contributing](#contributing)
10. [License](#license)

## Introduction

The ASCII Art Generator V2 is a complete overhaul of the original project, featuring a modern side-by-side editor with multi-canvas support, real-time drag and drop, and an extensive library of shapes and patterns. Built with performance and user experience in mind, this version offers a professional-grade ASCII art creation tool with advanced sharing capabilities.

**Live Demo**: [ASCII Art Generator V2](https://ascii-gen.netlify.app/)

## V2 Features

### **Multi-Canvas System**
- **Floating Canvases**: Create multiple ASCII art instances on a single workspace
- **Drag & Drop**: Smooth, responsive dragging with visual feedback
- **Canvas Selection**: Click any canvas to select and edit its properties
- **Independent Controls**: Each canvas maintains its own configuration
- **Context Menu**: Right-click for bulk operations (duplicate, randomize, center all)

### **Advanced Shape Library**
- **16 Unique Shapes**: Circle, Square, Triangle, Heart, Octagon, Star, Diamond, Hexagon, Cross, Arrow, Lightning, Cloud, Flower, Leaf, Spiral, Infinity, Target
- **Real-time Generation**: Instant shape updates with smooth animations
- **Size Control**: Adjustable size from 20-50 characters
- **Rotation**: 360-degree rotation control

### **Enhanced Pattern System**
- **Static Patterns**: Solid, Stripey, Zigzag
- **Animated Patterns**: Wave, Random, Spiral, Pulsate, Ripple, Fractal, Noise, Vortex
- **Character Customization**: Full control over ASCII characters used
- **Real-time Animation**: Smooth 50ms frame rate animations

### **Smart Color Management**
- **Background Colors**: Customizable background with color picker
- **Main Colors**: Primary color selection for art elements
- **Accent Colors**: Multiple accent color support
- **Smart Randomization**: Respects existing color structure

### **Sharing & Collaboration**
- **URL-Based Sharing**: Share entire workspaces via generated URLs
- **Automatic Clipboard**: Share links are automatically copied to clipboard
- **Workspace Loading**: Load shared workspaces directly from URLs
- **Local Storage**: Automatic persistence of workspace state
- **Bulk Operations**: Duplicate, randomize, and center all canvases

### **Modern UI/UX**
- **Side-by-Side Editor**: Professional layout with sidebar controls
- **Dark Theme**: Pitch black and white high-contrast design
- **Responsive Design**: Mobile hamburger menu for smaller screens
- **Visual Feedback**: Selection borders, drag indicators, hover states
- **Welcome Popup**: Friendly introduction for new users with cookie-based persistence
- **Keyboard Shortcuts**: Delete/Backspace to remove selected canvas

### **Performance Optimizations**
- **Hardware Acceleration**: Smooth 60fps dragging with `translate3d`
- **Direct DOM Manipulation**: Eliminated drag latency issues
- **Optimized Rendering**: Efficient React state management
- **Memory Efficient**: Clean component architecture

### **Intuitive Controls**
- **Two Randomize Buttons**: Separate shape/pattern and color randomization
- **Tabbed Interface**: Organized Shape, Pattern, and Color tabs
- **Real-time Updates**: Instant visual feedback for all changes
- **Smart Disabling**: Controls only active when canvas is selected

## Tech Stack

### **Core Technologies**
- **React 18**: Latest React with concurrent features
- **TypeScript**: Full type safety and better developer experience
- **Vite 5.4.17**: Next-generation build tool with instant hot reload
- **Tailwind CSS**: Utility-first CSS framework for rapid development

### **UI Components**
- **Shadcn UI**: Modern, accessible component library
- **Radix UI**: Unstyled, accessible primitives
- **Lucide React**: Beautiful, customizable icons

### **Performance & Animation**
- **Custom Hooks**: `useAnimationTimer`, `useArtGeneration`, `useArtDisplay`
- **Optimized Algorithms**: Efficient shape generation and pattern calculation
- **Hardware Acceleration**: GPU-accelerated animations and transforms

### **Sharing & Storage**
- **URL Encoding**: Base64 encoding for workspace data
- **Local Storage**: Persistent workspace state
- **Clipboard API**: Automatic link copying
- **File-Saver**: Export capabilities (infrastructure ready)

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or later)
- npm (v8.0.0 or later)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ioloEJ42/Ascii-Gen.git
   cd Ascii-Gen
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5175/`

## Usage

### **Creating Art**
1. **Add Canvas**: Click the `+` button to create a new ASCII art canvas
2. **Select Canvas**: Click anywhere on a canvas to select it
3. **Edit Properties**: Use the sidebar controls to customize your art
4. **Drag to Move**: Grab the header bar to reposition canvases

### **Shape & Pattern Controls**
- **Shape Tab**: Choose from 16 different shapes
- **Size Slider**: Adjust the complexity of your art
- **Pattern Tab**: Select static or animated patterns
- **Characters**: Customize the ASCII characters used

### **Color Management**
- **Color Tab**: Set background, main, and accent colors
- **Color Picker**: Intuitive color selection interface
- **Randomize Colors**: Smart randomization that respects current structure

### **Sharing Workspaces**
- **Share Button**: Click to generate and copy a shareable URL
- **Load Shared**: Open a shared URL to load the workspace
- **Context Menu**: Right-click for bulk operations
- **Keyboard Shortcuts**: Use Delete/Backspace to remove selected canvas

### **Advanced Features**
- **Rotation**: 360-degree rotation control
- **Real-time Updates**: See changes instantly
- **Multi-canvas**: Work with multiple art pieces simultaneously
- **Responsive**: Works perfectly on mobile and desktop

## Code Structure

```
src/
├── components/
│   └── generator/
│       ├── ASCIIArtGenerator.tsx    # Main orchestrator
│       ├── CanvasManager.tsx        # Multi-canvas management
│       ├── FloatingArt.tsx          # Individual canvas component
│       ├── Sidebar.tsx              # Control panel
│       ├── ui/                      # UI components
│       │   ├── ShapeSelector.tsx
│       │   ├── PatternSelector.tsx
│       │   └── ColorSelector.tsx
│       ├── hooks/                   # Custom hooks
│       │   ├── useAnimationTimer.ts
│       │   ├── useArtGeneration.ts
│       │   └── useArtDisplay.ts
│       └── utils/
│           └── artGenerationUtils.ts # Core algorithms
├── types.ts                         # TypeScript definitions
└── styles/                          # Global styles
```

## Performance Optimizations

### **Drag & Drop**
- **Direct DOM Manipulation**: Bypasses React for smooth dragging
- **Hardware Acceleration**: Uses `translate3d` for GPU acceleration
- **State Synchronization**: Updates React state only after drag completion

### **Rendering**
- **Optimized Algorithms**: Efficient shape and pattern generation
- **Memoized Components**: Prevents unnecessary re-renders
- **Lazy Loading**: Components load only when needed

### **Memory Management**
- **Clean Architecture**: Modular components with clear separation
- **Efficient State**: Minimal state updates and proper cleanup
- **Optimized Hooks**: Custom hooks for reusable logic

## Future Enhancements

### **Planned Features**
- **Export Functionality**: GIF, PNG, SVG export options (infrastructure ready)
- **More Shapes**: Additional geometric and organic shapes
- **Advanced Patterns**: Custom pattern editor
- **Collaboration**: Real-time multi-user editing
- **Social Sharing**: Direct sharing to social media platforms

### **Technical Improvements**
- **Web Workers**: Background processing for complex calculations
- **Service Workers**: Offline functionality and caching
- **PWA Support**: Install as native app
- **API Integration**: Backend for saving and sharing

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### **Code Standards**
- **TypeScript**: Full type safety required
- **ESLint**: Follow project linting rules
- **Prettier**: Consistent code formatting
- **Testing**: Add tests for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Developed with ❤️ by IEJ**