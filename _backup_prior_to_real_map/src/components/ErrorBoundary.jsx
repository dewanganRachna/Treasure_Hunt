import React from 'react';

/**
 * ErrorBoundary: Catches any runtime or DOM mutation errors (e.g. from Google Translate)
 * and keeps the application resilient without ever showing a blank screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('ErrorBoundary caught an error (likely browser translation DOM mutation):', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#040d21',
            color: '#ffffff',
            fontFamily: "'Outfit', sans-serif",
            padding: '24px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              padding: '32px',
              borderRadius: '20px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1.5px solid #00f2fe',
              boxShadow: '0 0 40px rgba(0, 242, 254, 0.4)',
              maxWidth: '480px'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔄</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#00f2fe', marginBottom: '8px' }}>
              Resuming Game...
            </h2>
            <p style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '24px', lineHeight: 1.5 }}>
              A browser translation or display glitch was caught. Tap below to continue playing seamlessly.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00f2fe, #0284c7)',
                color: '#040d21',
                fontWeight: 900,
                fontSize: '16px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              CONTINUE GAME
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
