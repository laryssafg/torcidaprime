import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-neutral-900/50 rounded-3xl border border-red-500/20 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Ops! Algo deu errado.</h2>
          <p className="text-neutral-400 text-sm mb-6 max-w-md mx-auto">
            {this.props.fallbackTitle || 'Ocorreu um erro ao carregar esta seção do painel. Isso pode ser causado por dados incompletos no banco de dados.'}
          </p>
          <div className="bg-black/40 p-3 rounded-lg text-left mb-6 w-full max-w-lg overflow-auto">
            <code className="text-[10px] text-red-400 font-mono block whitespace-pre-wrap">
              {this.state.error?.toString()}
            </code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2.5 rounded-xl transition-all font-semibold"
          >
            <RefreshCw size={18} />
            Recarregar Painel
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
