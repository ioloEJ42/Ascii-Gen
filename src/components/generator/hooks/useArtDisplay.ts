// Renders the character grid at a fixed reference size, then ArtDisplay
// measures its actual natural (unscaled) footprint and stretches it with a
// CSS transform to exactly match whatever space is available — independently
// on each axis, so the canvas always fills 100% of its container regardless
// of the container's shape. See ArtDisplay.tsx for the measure/scale step.
export const BASE_FONT_SIZE = 16;
