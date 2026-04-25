import React from 'react';
import { Link } from 'react-router-dom';

const isDevelopment = import.meta.env.DEV;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <i 
              className="fas fa-exclamation-triangle" 
              style={{ 
                fontSize: '64px', 
                color: '#dc3545', 
                marginBottom: '20px', 
                display: 'block' 
              }}
            ></i>
            <h2 style={{ marginBottom: '10px', color: '#fff' }}>
              Oops! Something went wrong
            </h2>
            <p style={{ color: '#888', marginBottom: '20px' }}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-orange"
              >
                <i className="fas fa-sync-alt"></i> Refresh Page
              </button>
              <Link to="/" className="btn-outline">
                <i className="fas fa-home"></i> Go Home
              </Link>
            </div>
            {isDevelopment && this.state.error && (
              <details style={{ 
                marginTop: '30px', 
                textAlign: 'left', 
                background: '#2a2a2a', 
                padding: '15px', 
                borderRadius: '8px',
                maxWidth: '600px',
                margin: '30px auto 0'
              }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  color: '#ff8c00', 
                  marginBottom: '10px',
                  fontWeight: '600'
                }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{ 
                  color: '#dc3545', 
                  fontSize: '12px', 
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
