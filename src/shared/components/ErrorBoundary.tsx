import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AssessIQ ErrorBoundary] Uncaught runtime error caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAFAF7] text-[#2B2350] flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-white border-2 border-[#2B2350] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#2B2350] space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 border-2 border-[#2B2350] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="font-heading font-black text-xl text-[#2B2350]">
                {this.props.fallbackTitle || 'Session Recovery Sentinel'}
              </h2>
              <p className="text-xs text-[#6B6590]">
                An unexpected component rendering interruption occurred. Your answers remain cryptographically protected in local storage.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-left font-mono text-[11px] overflow-x-auto max-h-36">
                <strong>Error: </strong> {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <Button
                onClick={this.handleReset}
                className="w-full sm:w-auto bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-2.5 px-4 rounded-xl border-2 border-[#2B2350] shadow-[2px_2px_0px_#2B2350] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reload Examination Session
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = '/student')}
                className="w-full sm:w-auto font-mono text-xs border border-[#2B2350] py-2.5 px-4 rounded-xl"
              >
                <Home className="w-3.5 h-3.5 mr-1.5" /> Return to Student Desk
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

