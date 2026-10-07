export interface TermlyConsent {
  analytics?: boolean;
}

export interface TermlyApi {
  getConsentState: () => TermlyConsent | undefined;
  on: (event: 'initialized' | 'consent', callback: (data?: { categories?: string[] }) => void) => void;
  initialize?: () => void;
}

declare global {
  interface Window {
    Termly?: TermlyApi;
    displayPreferenceModal?: () => void;
  }
}

/** A missing, loading, or failed CMP never implies permission to track. */
export function hasAnalyticsConsent(): boolean {
  try {
    return window.Termly?.getConsentState()?.analytics === true;
  } catch {
    return false;
  }
}

/** Observe saved consent, late CMP loading, withdrawal, and Astro navigation. */
export function observeAnalyticsConsent(callback: (granted: boolean) => void): () => void {
  let active = true;
  let previous: boolean | undefined;
  let connected: TermlyApi | undefined;
  let revokedInAnotherTab = false;
  let channel: BroadcastChannel | undefined;
  try {
    if (typeof BroadcastChannel === 'function') channel = new BroadcastChannel('analytics-consent');
  } catch {
    /* Consent still works when browser storage is restricted. */
  }

  const emit = (granted: boolean) => {
    if (active && granted !== previous) {
      previous = granted;
      callback(granted);
    }
  };
  const refresh = () => emit(!revokedInAnotherTab && hasAnalyticsConsent());
  const revoke = () => {
    revokedInAnotherTab = true;
    emit(false);
  };
  const connect = () => {
    const termly = window.Termly;
    if (termly && termly !== connected && typeof termly.on === 'function') {
      connected = termly;
      termly.on('initialized', refresh);
      termly.on('consent', (data) => {
        if (!active) return;
        revokedInAnotherTab = false;
        const granted = Array.isArray(data?.categories) ? data.categories.includes('analytics') : hasAnalyticsConsent();
        emit(granted);
        // Re-read grants in each tab; withdrawals take effect immediately.
        if (!granted) channel?.postMessage({ analytics: false });
      });
    }
    refresh();
  };
  const onStorage = (event: StorageEvent) => {
    // Termly may cache state in memory. Never re-grant from a stale tab.
    if (event.key === null || /termly/i.test(event.key)) revoke();
  };
  if (channel)
    channel.onmessage = (event) => {
      if (event.data?.analytics === false) revoke();
    };
  window.addEventListener('termly:ready', connect);
  window.addEventListener('load', connect);
  window.addEventListener('focus', connect);
  window.addEventListener('storage', onStorage);
  document.addEventListener('astro:page-load', connect);
  connect();

  return () => {
    active = false;
    channel?.close();
    window.removeEventListener('termly:ready', connect);
    window.removeEventListener('load', connect);
    window.removeEventListener('focus', connect);
    window.removeEventListener('storage', onStorage);
    document.removeEventListener('astro:page-load', connect);
    // Termly has no documented unsubscribe; its callbacks become inert.
  };
}
