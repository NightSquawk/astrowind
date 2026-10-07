import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { hasAnalyticsConsent, observeAnalyticsConsent, type TermlyApi } from '../../src/utils/analytics-consent';

let stop: (() => void) | undefined;
let granted = false;
let handlers: Record<string, (data?: { categories?: string[] }) => void>;
class Channel {
  static last: Channel;
  onmessage?: (event: { data: { analytics: boolean } }) => void;
  postMessage = vi.fn();
  close = vi.fn();
  constructor() {
    Channel.last = this;
  }
}
function installTermly() {
  window.Termly = {
    getConsentState: () => ({ analytics: granted }),
    on: (event, callback) => {
      handlers[event] = callback;
    },
  } satisfies TermlyApi;
}
beforeEach(() => {
  delete window.Termly;
  granted = false;
  handlers = {};
  vi.stubGlobal('BroadcastChannel', Channel);
});
afterEach(() => {
  stop?.();
  stop = undefined;
  vi.unstubAllGlobals();
});

describe('analytics consent', () => {
  it('fails closed without a CMP or when its API throws', () => {
    expect(hasAnalyticsConsent()).toBe(false);
    installTermly();
    window.Termly!.getConsentState = () => {
      throw new Error('unavailable');
    };
    expect(hasAnalyticsConsent()).toBe(false);
  });
  it('reads saved consent and stops on withdrawal without polling', () => {
    installTermly();
    granted = true;
    const callback = vi.fn();
    stop = observeAnalyticsConsent(callback);
    expect(callback).toHaveBeenLastCalledWith(true);
    granted = false;
    handlers.consent({ categories: ['essential'] });
    expect(callback).toHaveBeenLastCalledWith(false);
    expect(Channel.last.postMessage).toHaveBeenCalledWith({ analytics: false });
  });
  it('supports a late CMP, initialization, and an explicit grant', () => {
    const callback = vi.fn();
    stop = observeAnalyticsConsent(callback);
    expect(callback).toHaveBeenLastCalledWith(false);
    installTermly();
    window.dispatchEvent(new Event('termly:ready'));
    granted = true;
    handlers.initialized();
    expect(callback).toHaveBeenLastCalledWith(true);
    handlers.consent({ categories: [] });
    expect(callback).toHaveBeenLastCalledWith(false);
  });
  it('honors cross-tab withdrawal even if Termly cached an old grant', () => {
    installTermly();
    granted = true;
    const callback = vi.fn();
    stop = observeAnalyticsConsent(callback);
    Channel.last.onmessage?.({ data: { analytics: false } });
    window.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new Event('astro:page-load'));
    expect(callback).toHaveBeenLastCalledWith(false);
    handlers.consent({ categories: ['analytics'] });
    expect(callback).toHaveBeenLastCalledWith(true);
  });
  it('does not duplicate emissions or react after disposal', () => {
    installTermly();
    const callback = vi.fn();
    stop = observeAnalyticsConsent(callback);
    document.dispatchEvent(new Event('astro:page-load'));
    expect(callback).toHaveBeenCalledTimes(1);
    stop();
    granted = true;
    handlers.consent({ categories: ['analytics'] });
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
