import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl overflow-auto border-2 border-red-500">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Application Error</h1>
            <p className="text-slate-700 mb-4 whitespace-pre-wrap">{this.state.error?.toString()}</p>
            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
