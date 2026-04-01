'use client';

import { useState, useEffect } from 'react';
import { X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

function isChromiumBrowser(): boolean {
  if (typeof navigator === 'undefined') return true;
  const ua = navigator.userAgent;
  return /Chrome|Edg/i.test(ua);
}

export function BrowserBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [isChromium, setIsChromium] = useState(true);

  useEffect(() => {
    setIsChromium(isChromiumBrowser());
  }, []);

  if (isChromium || dismissed) return null;

  return (
    <div
      data-testid="browser-banner"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-lg border border-border bg-background p-4 shadow-lg"
    >
      <div className="flex items-center gap-3">
        <Globe className="h-5 w-5 shrink-0 text-muted-foreground" />
        <p className="flex-1 font-body text-sm text-muted-foreground">
          For the best experience with voice features, use Chrome or Edge.
        </p>
        <Button
          data-testid="banner-dismiss"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
