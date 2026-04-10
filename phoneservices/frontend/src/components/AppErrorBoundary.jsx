import { Component } from "react";

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Unexpected application error.",
    };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-xl rounded-2xl border border-border bg-card p-6 shadow-card">
            <h1 className="font-display text-2xl font-black text-red-600">Application Error</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              The app encountered a runtime error. Refresh the page after fixing the issue.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-3 text-xs text-foreground">
              {this.state.message}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
