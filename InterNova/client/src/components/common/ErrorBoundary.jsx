import React from 'react';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child components
 * Professional MERN pattern for production error handling
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // In production, you could send to error tracking service
    // e.g., Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <i className="uil uil-exclamation-triangle display-1 text-warning"></i>
              <h3 className="mt-4">Oops! Something went wrong</h3>
              <p className="text-muted">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
