import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Log to error reporting service (Sentry, LogRocket, etc.)
    // errorReportingService.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback component if provided
      if (this.props.FallbackComponent) {
        return <this.props.FallbackComponent error={this.state.error} />;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-dark-100 border border-dark-300 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-6">
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gold text-dark px-6 py-2 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-gray-400 cursor-pointer hover:text-white">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-red-400 overflow-auto p-4 bg-dark-200 rounded">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
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
