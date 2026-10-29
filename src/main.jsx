import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are bundled with the app so the kiosk looks right without internet.
// Only the Latin and Devanagari subsets: the game has no other scripts.
import '@fontsource/outfit/latin-400.css'
import '@fontsource/outfit/latin-500.css'
import '@fontsource/outfit/latin-600.css'
import '@fontsource/outfit/latin-700.css'
import '@fontsource/outfit/latin-800.css'
import '@fontsource/noto-sans-devanagari/devanagari-400.css'
import '@fontsource/noto-sans-devanagari/devanagari-500.css'
import '@fontsource/noto-sans-devanagari/devanagari-600.css'
import '@fontsource/noto-sans-devanagari/devanagari-700.css'
import '@fontsource/noto-sans-devanagari/devanagari-800.css'
import '@fontsource/noto-sans-devanagari/latin-400.css'
import '@fontsource/noto-sans-devanagari/latin-500.css'
import '@fontsource/noto-sans-devanagari/latin-600.css'
import '@fontsource/noto-sans-devanagari/latin-700.css'
import '@fontsource/noto-sans-devanagari/latin-800.css'
import '@fontsource/eb-garamond/latin-500.css'
import '@fontsource/eb-garamond/latin-600.css'
import '@fontsource/eb-garamond/latin-700.css'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

/**
 * Universal Chrome / Google Translate & Browser Extension DOM Fix:
 * When translation tools replace text nodes with <font> tags, React's removeChild
 * and insertBefore throw NotFoundError because the parentNode was modified.
 * This defensive monkeypatch prevents React from crashing when pages are translated.
 */
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      if (console && console.warn) {
        console.warn('DOM mutation safely caught: node was already replaced by browser translation.');
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console && console.warn) {
        console.warn('DOM mutation safely caught: reference node replaced by browser translation.');
      }
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments);
  };
}

// Kiosk: no long-press/right-click menu, no dragging things off the page, no Ctrl+wheel or
// Ctrl +/- zoom (pinch-zoom is blocked with touch-action in index.css)
document.addEventListener('contextmenu', (e) => e.preventDefault())
document.addEventListener('dragstart', (e) => e.preventDefault())
window.addEventListener('wheel', (e) => e.ctrlKey && e.preventDefault(), { passive: false })
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) e.preventDefault()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
