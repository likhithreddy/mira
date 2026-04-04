'use client';

import { Component, Suspense, lazy } from 'react';
import type { Application } from '@splinetool/runtime';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
  onLoad?: (app: Application) => void;
}

class ErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || <div className="flex h-full w-full items-center justify-center" />
      );
    }
    return this.props.children;
  }
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <span className="loader"></span>
          </div>
        }
      >
        <Spline scene={scene} className={className} onLoad={onLoad} />
      </Suspense>
    </ErrorBoundary>
  );
}
