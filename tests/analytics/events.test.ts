import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { initDatadogRUMEvents } from '../../src/scripts/datadog-rum';
let stop: () => void;
const addAction = vi.fn();
beforeEach(() => {
  vi.useFakeTimers();
  addAction.mockReset();
  document.body.innerHTML = '';
  Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 1000 });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 500 });
  stop = initDatadogRUMEvents({ addAction });
});
afterEach(() => {
  stop();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it('records contact type without text, address, number, or destination', () => {
  document.body.innerHTML = '<a href="mailto:private@example.com?subject=private">private@example.com</a>';
  document.querySelector('a')!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(addAction).toHaveBeenCalledWith('email_click', { page_path: '/' });
  expect(JSON.stringify(addAction.mock.calls)).not.toContain('private');
});
it('ignores card wrappers and uses explicit CTA labels', () => {
  document.body.innerHTML =
    '<div class="button-wrapper"><span id="card">Card</span></div><button data-analytics-action="request-demo">Demo</button>';
  document.getElementById('card')!.click();
  expect(addAction).not.toHaveBeenCalled();
  document.querySelector('button')!.click();
  expect(addAction).toHaveBeenCalledWith('cta_click', { action: 'request-demo', page_path: '/' });
});
it('resets scroll milestones after navigation and removes listeners on withdrawal', () => {
  window.dispatchEvent(new Event('scroll'));
  vi.advanceTimersByTime(100);
  expect(addAction).toHaveBeenCalledTimes(2);
  window.dispatchEvent(new Event('scroll'));
  vi.advanceTimersByTime(100);
  expect(addAction).toHaveBeenCalledTimes(2);
  document.dispatchEvent(new Event('astro:page-load'));
  window.dispatchEvent(new Event('scroll'));
  vi.advanceTimersByTime(100);
  expect(addAction).toHaveBeenCalledTimes(4);
  stop();
  window.dispatchEvent(new Event('scroll'));
  vi.advanceTimersByTime(100);
  expect(addAction).toHaveBeenCalledTimes(4);
});

it('observes each section once per page and reconnects after Astro navigation', () => {
  stop();
  const observers: FakeObserver[] = [];
  class FakeObserver {
    observe = vi.fn();
    disconnect = vi.fn();
    constructor(public callback: IntersectionObserverCallback) {
      observers.push(this);
    }
    visible(target: Element) {
      this.callback(
        [{ target, isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver
      );
    }
  }
  vi.stubGlobal('IntersectionObserver', FakeObserver);
  document.body.innerHTML = '<section data-analytics-section="services"></section>';
  stop = initDatadogRUMEvents({ addAction });
  const first = document.querySelector('section')!;
  observers[0].visible(first);
  observers[0].visible(first);
  expect(addAction).toHaveBeenCalledExactlyOnceWith('element_visibility', { section: 'services', page_path: '/' });
  document.dispatchEvent(new Event('astro:before-swap'));
  expect(observers[0].disconnect).toHaveBeenCalled();
  document.body.innerHTML = '<section data-analytics-section="services"></section>';
  document.dispatchEvent(new Event('astro:page-load'));
  expect(observers).toHaveLength(2);
  observers[1].visible(document.querySelector('section')!);
  expect(addAction).toHaveBeenCalledTimes(2);
  stop();
  expect(observers[1].disconnect).toHaveBeenCalled();
});
