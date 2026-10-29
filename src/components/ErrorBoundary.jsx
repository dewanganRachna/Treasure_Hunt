import React from 'react';
import { t } from '../data/i18n';

const AUTO_RELOAD_MS = 8000;

/**
 * Catches runtime errors (including DOM changes made by browser translation) and shows a
 * bilingual restart screen in the game's own style. On an unattended kiosk it reloads by itself.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.timer = null;
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('ErrorBoundary caught an error:', error, errorInfo);
    this.timer = setTimeout(this.handleReload, AUTO_RELOAD_MS);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="err-screen" role="alert">
        <div className="err-card">
          <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true">
            <polygon points="12,2.4 21,7.2 21,16.8 12,21.6 3,16.8 3,7.2" fill="none" stroke="#a86e18" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3.4" fill="#c98a24" />
          </svg>
          <h2 lang="hi">{t('hi', 'errTitle')}</h2>
          <div className="err-en">{t('en', 'errTitle')}</div>
          <p>
            <span lang="hi">{t('hi', 'errBody')}</span>
            <br />
            {t('en', 'errBody')}
          </p>
          <button type="button" onClick={this.handleReload} autoFocus>
            <span lang="hi">{t('hi', 'errButton')}</span> · {t('en', 'errButton')}
          </button>
        </div>
      </div>
    );
  }
}
