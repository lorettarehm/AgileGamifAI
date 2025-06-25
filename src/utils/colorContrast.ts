// Color contrast utility functions and tests
// Based on WCAG 2.1 AA standards which require a contrast ratio of at least 4.5:1 for normal text

interface ColorContrastResult {
  ratio: number;
  passes: boolean;
  level: 'AA' | 'AAA' | 'FAIL';
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Get relative luminance of a color
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): ColorContrastResult {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) {
    return { ratio: 0, passes: false, level: 'FAIL' };
  }
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  
  const passes = ratio >= 4.5; // WCAG AA standard for normal text
  const level = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL';
  
  return { ratio, passes, level };
}

// Test our current color combinations
export const colorContrastTests = {
  // Teal colors used in the app
  tealColors: {
    'teal-50': '#f0fdfa',     // bg
    'teal-100': '#ccfbf1',    // badge bg
    'teal-200': '#99f6e4',    // borders
    'teal-300': '#5eead4',    // borders
    'teal-400': '#2dd4bf',    // icon colors
    'teal-500': '#14b8a6',    // primary button bg
    'teal-600': '#0d9488',    // primary button bg hover
    'teal-700': '#0f766e',    // text
    'teal-800': '#115e59',    // text
    'teal-900': '#134e4a',    // dark text
  },
  
  // Purple colors used in the app
  purpleColors: {
    'purple-50': '#faf5ff',   // bg
    'purple-100': '#f3e8ff',  // badge bg
    'purple-200': '#e9d5ff',  // borders
    'purple-300': '#d8b4fe',  // borders
    'purple-400': '#c084fc',  // secondary button bg
    'purple-500': '#a855f7',  // secondary button bg hover
    'purple-600': '#9333ea',  // text/icons
    'purple-700': '#7c3aed',  // text
    'purple-800': '#6b21a8',  // text
    'purple-900': '#581c87',  // dark text
  },
  
  // Test combinations we're using
  testCombinations: [
    // Badge combinations
    { bg: '#ccfbf1', text: '#115e59', name: 'teal-100 bg + teal-800 text (default badge)' },
    { bg: '#f3e8ff', text: '#6b21a8', name: 'purple-100 bg + purple-800 text (secondary badge)' },
    { bg: '#e9d5ff', text: '#581c87', name: 'purple-200 bg + purple-900 text (purple badge)' },
    
    // Button combinations  
    { bg: '#14b8a6', text: '#ffffff', name: 'teal-500 bg + white text (primary button)' },
    { bg: '#c084fc', text: '#ffffff', name: 'purple-400 bg + white text (secondary button)' },
    
    // Text combinations
    { bg: '#ffffff', text: '#0f766e', name: 'white bg + teal-700 text' },
    { bg: '#ffffff', text: '#115e59', name: 'white bg + teal-800 text' },
    { bg: '#ffffff', text: '#9333ea', name: 'white bg + purple-600 text' },
    
    // Filter panel combinations
    { bg: '#f0fdfa', text: '#0f766e', name: 'teal-50 bg + teal-700 text' },
    { bg: '#ccfbf1', text: '#134e4a', name: 'teal-100 bg + teal-900 text' },
  ]
};

/**
 * Run contrast tests on all our color combinations
 */
export function runContrastTests(): void {
  console.log('🎯 Running Color Contrast Tests for WCAG AA Compliance\n');
  
  colorContrastTests.testCombinations.forEach((combo, index) => {
    const result = getContrastRatio(combo.bg, combo.text);
    const status = result.passes ? '✅ PASS' : '❌ FAIL';
    const icon = result.level === 'AAA' ? '🌟' : result.level === 'AA' ? '✅' : '❌';
    
    console.log(`${index + 1}. ${combo.name}`);
    console.log(`   ${icon} Ratio: ${result.ratio.toFixed(2)}:1 (${result.level})`);
    console.log(`   ${status} - ${result.passes ? 'Meets WCAG AA' : 'Fails WCAG AA'}`);
    console.log('');
  });
}

// Export the test function for use in tests
export { getContrastRatio };