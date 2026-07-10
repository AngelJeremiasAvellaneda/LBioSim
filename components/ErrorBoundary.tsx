'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    this.setState({ hasError: true, error });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div role="alert" className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl bg-white/80 border border-stone-200 text-center min-h-[200px]">
          <span className="text-3xl">⚠</span>
          <p className="text-stone-600 text-sm font-medium">Ocurrió un error al cargar este módulo.</p>
          <p className="text-stone-400 text-xs max-w-md font-mono">{this.state.error?.message}</p>
          <button
            onClick={this.handleRetry}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md"
            aria-label="Reintentar"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
