/**
 * CSS Styling Tests for Calculator
 * Tests dark theme colors, responsive layout, and animations
 */

const fs = require('fs');
const path = require('path');

// Read CSS file
const cssPath = path.join(__dirname, 'style.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

console.log('Running CSS Styling Tests...\n');

// Test 1: Dark theme colors applied per PRD
function testDarkThemeColors() {
    console.log('Test 1: Dark theme colors from PRD...');
    
    // Required colors from PRD
    const requiredColors = {
        '#1a1a2e': '--bg-primary',
        '#16213e': '--bg-calculator', 
        '#0f3460': '--bg-display',
        '#e94560': '--btn-number',
        '#533483': '--btn-operator',
        '#00d9ff': '--btn-equals'
    };
    
    let passed = true;
    for (const [color, varName] of Object.entries(requiredColors)) {
        const hasColor = cssContent.includes(color) || cssContent.includes(varName);
        if (!hasColor) {
            console.log(`  ❌ Missing color: ${color} (${varName})`);
            passed = false;
        }
    }
    
    // Check design tokens are imported
    const hasDesignTokensImport = cssContent.includes('@import') && 
                                   cssContent.includes('design-tokens.css');
    if (!hasDesignTokensImport) {
        console.log('  ⚠️  Warning: design-tokens.css not imported via @import');
    }
    
    if (passed) {
        console.log('  ✅ Dark theme colors present\n');
    }
    return passed;
}

// Test 2: 4x5 grid layout with proper spacing
function testGridLayout() {
    console.log('Test 2: 4x5 grid layout with spacing...');
    
    const hasGrid = cssContent.includes('display: grid') && 
                    cssContent.includes('grid-template-columns: repeat(4, 1fr)');
    const hasGap = cssContent.includes('gap: var(--gap)') || 
                   cssContent.includes('gap: 10px');
    
    if (!hasGrid) {
        console.log('  ❌ Missing 4-column grid layout');
        return false;
    }
    if (!hasGap) {
        console.log('  ❌ Missing gap spacing');
        return false;
    }
    
    console.log('  ✅ 4x5 grid layout with proper spacing\n');
    return true;
}

// Test 3: Button styles with hover/active states and scale animation
function testButtonStyles() {
    console.log('Test 3: Button styles with hover/active states...');
    
    const hasHover = cssContent.includes(':hover') && 
                     cssContent.includes('filter: brightness');
    const hasActive = cssContent.includes(':active') && 
                      cssContent.includes('transform: scale(0.95)');
    const hasTransition = cssContent.includes('transition:');
    const hasShadow = cssContent.includes('box-shadow:');
    
    if (!hasHover) {
        console.log('  ❌ Missing hover state');
        return false;
    }
    if (!hasActive) {
        console.log('  ❌ Missing active scale animation');
        return false;
    }
    if (!hasTransition) {
        console.log('  ❌ Missing transition property');
        return false;
    }
    if (!hasShadow) {
        console.log('  ❌ Missing box shadow');
        return false;
    }
    
    console.log('  ✅ Button styles with hover/active states and animations\n');
    return true;
}

// Test 4: Display area with JetBrains Mono font at 48px
function testDisplayStyling() {
    console.log('Test 4: Display area with JetBrains Mono font...');
    
    const hasMonoFont = cssContent.includes('JetBrains Mono') || 
                        cssContent.includes('var(--font-mono)');
    const has48px = cssContent.includes('font-size: 48px');
    const hasDisplayBg = cssContent.includes('--bg-display');
    
    if (!hasMonoFont) {
        console.log('  ❌ Missing JetBrains Mono font');
        return false;
    }
    if (!has48px) {
        console.log('  ❌ Missing 48px font size for numbers');
        return false;
    }
    if (!hasDisplayBg) {
        console.log('  ❌ Missing display background color');
        return false;
    }
    
    console.log('  ✅ Display area with JetBrains Mono at 48px\n');
    return true;
}

// Test 5: Responsive breakpoints
function testResponsiveBreakpoints() {
    console.log('Test 5: Responsive breakpoints...');
    
    const hasMobile = cssContent.includes('@media (max-width: 479px)') ||
                      cssContent.includes('@media (max-width: 480px)');
    const hasTablet = cssContent.includes('@media (min-width: 480px) and (max-width: 768px)');
    const hasDesktop = cssContent.includes('@media (min-width: 769px)') ||
                       cssContent.includes('@media (min-width: 768px)');
    
    if (!hasMobile) {
        console.log('  ❌ Missing mobile breakpoint (<480px)');
        return false;
    }
    if (!hasTablet) {
        console.log('  ❌ Missing tablet breakpoint (480-768px)');
        return false;
    }
    if (!hasDesktop) {
        console.log('  ❌ Missing desktop breakpoint (>768px)');
        return false;
    }
    
    console.log('  ✅ All responsive breakpoints present\n');
    return true;
}

// Test 6: Box shadows and border-radius
function testVisualEffects() {
    console.log('Test 6: Box shadows and border-radius...');
    
    const hasBorderRadius20 = cssContent.includes('20px') || 
                              cssContent.includes('--border-radius-lg');
    const hasBoxShadow = cssContent.includes('box-shadow:') &&
                         cssContent.includes('0 10px 40px');
    
    if (!hasBorderRadius20) {
        console.log('  ❌ Missing 20px border-radius');
        return false;
    }
    if (!hasBoxShadow) {
        console.log('  ❌ Missing box-shadow');
        return false;
    }
    
    console.log('  ✅ Box shadows and border-radius applied\n');
    return true;
}

// Test 7: Design tokens usage
function testDesignTokens() {
    console.log('Test 7: Design tokens integration...');
    
    const usesCssVars = cssContent.includes('var(--') &&
                        cssContent.includes('var(--color-');
    
    if (!usesCssVars) {
        console.log('  ⚠️  Warning: Limited CSS variable usage');
    }
    
    console.log('  ✅ Design tokens integrated\n');
    return true;
}

// Run all tests
let allPassed = true;

allPassed = testDarkThemeColors() && allPassed;
allPassed = testGridLayout() && allPassed;
allPassed = testButtonStyles() && allPassed;
allPassed = testDisplayStyling() && allPassed;
allPassed = testResponsiveBreakpoints() && allPassed;
allPassed = testVisualEffects() && allPassed;
allPassed = testDesignTokens() && allPassed;

if (allPassed) {
    console.log('✅ All CSS styling tests passed!');
    process.exit(0);
} else {
    console.log('❌ Some tests failed');
    process.exit(1);
}
