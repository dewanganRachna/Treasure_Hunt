import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
