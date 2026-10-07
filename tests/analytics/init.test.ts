import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  consent: undefined as undefined | ((granted: boolean) => void),
  init: vi.fn(),
  setTrackingConsent: vi.fn(),
  events: vi.fn(),
  stop: vi.fn(),
}));
vi.mock('../../src/utils/analytics-consent', () => ({
  observeAnalyticsConsent: (callback: (granted: boolean) => void) => {
    mocks.consent = callback;
    callback(false);
  },
}));
vi.mock('@datadog/browser-rum', () => ({
  datadogRum: { init: mocks.init, setTrackingConsent: mocks.setTrackingConsent },
}));
vi.mock('../../src/scripts/datadog-rum', () => ({ initDatadogRUMEvents: mocks.events }));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  mocks.consent = undefined;
  mocks.events.mockReturnValue(mocks.stop);
  document.body.innerHTML = '';
});
afterEach(() => {
  vi.useRealTimers();
});
function config(hosts = ['example.com']) {
  const element = document.createElement('script');
  element.id = 'datadog-config';
  element.type = 'application/json';
  element.textContent = JSON.stringify({
    applicationId: 'app',
    clientToken: 'client',
    site: 'us3.datadoghq.com',
    service: 'test-site',
    env: 'production',
    allowedHosts: hosts,
  });
  document.body.append(element);
}
it('does nothing without config, without polling', async () => {
  vi.useFakeTimers();
  const { initDatadogRUM } = await import('../../src/scripts/datadog-init');
  initDatadogRUM();
  expect(mocks.consent).toBeUndefined();
  expect(mocks.init).not.toHaveBeenCalled();
  expect(vi.getTimerCount()).toBe(0);
});
it('does nothing on a preview host', async () => {
  config(['other.example']);
  const { initDatadogRUM } = await import('../../src/scripts/datadog-init');
  initDatadogRUM();
  expect(mocks.consent).toBeUndefined();
  expect(mocks.init).not.toHaveBeenCalled();
});
it('starts once after grant, with replay off, then disposes events on withdrawal', async () => {
  config();
  const { initDatadogRUM } = await import('../../src/scripts/datadog-init');
  initDatadogRUM();
  expect(mocks.init).not.toHaveBeenCalled();
  mocks.consent!(true);
  await vi.waitFor(() => expect(mocks.init).toHaveBeenCalledTimes(1));
  expect(mocks.init.mock.calls[0][0]).toMatchObject({
    trackingConsent: 'not-granted',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    defaultPrivacyLevel: 'mask',
    trackAnonymousUser: false,
  });
  expect(mocks.setTrackingConsent).toHaveBeenLastCalledWith('granted');
  mocks.consent!(false);
  expect(mocks.stop).toHaveBeenCalled();
  expect(mocks.setTrackingConsent).toHaveBeenLastCalledWith('not-granted');
  mocks.consent!(true);
  initDatadogRUM();
  expect(mocks.init).toHaveBeenCalledTimes(1);
});
it('does not re-grant when consent is withdrawn during SDK loading', async () => {
  config();
  const { initDatadogRUM } = await import('../../src/scripts/datadog-init');
  initDatadogRUM();
  mocks.consent!(true);
  mocks.consent!(false);
  await vi.waitFor(() => expect(mocks.init).toHaveBeenCalledTimes(1));
  expect(mocks.setTrackingConsent).toHaveBeenCalledExactlyOnceWith('not-granted');
  expect(mocks.events).not.toHaveBeenCalled();
});
