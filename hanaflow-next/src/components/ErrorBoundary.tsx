"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-[40vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="text-4xl mb-4">⚠️</p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Une erreur inattendue s&apos;est produite
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Essaie de recharger la page. Si le problème persiste, contacte le support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-sap-blue text-white text-sm font-semibold rounded-lg hover:bg-sap-blue/90 transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
