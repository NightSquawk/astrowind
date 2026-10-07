import type { datadogRum } from '@datadog/browser-rum';
import { analyticsPath } from '../utils/datadog-privacy';

/** Custom actions use explicit, non-personal labels. Native RUM owns page views. */
export function initDatadogRUMEvents(rum: Pick<typeof datadogRum, 'addAction'>): () => void {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  let observer: IntersectionObserver | undefined;
  let scrollTimer: ReturnType<typeof setTimeout> | undefined;
  const tracked = new Set<number>();
  const label = (element: Element, attribute: string) => {
    const value = element.getAttribute(attribute) || '';
    return /^[a-z][a-z0-9_-]{0,63}$/.test(value) ? value : undefined;
  };
  const page = () => analyticsPath(window.location.pathname);

  document.addEventListener(
    'click',
    (event) => {
      if (!(event.target instanceof Element)) return;
      const contact = event.target.closest('a[href^="mailto:"], a[href^="tel:"]');
      if (contact) {
        rum.addAction(contact.getAttribute('href')?.startsWith('tel:') ? 'phone_click' : 'email_click', {
          page_path: page(),
        });
        return;
      }
      const target = event.target.closest('a[data-analytics-action], button[data-analytics-action]');
      const action = target && label(target, 'data-analytics-action');
      if (action) rum.addAction('cta_click', { action, page_path: page() });
    },
    options
  );

  document.addEventListener(
    'submit',
    (event) => {
      if (!(event.target instanceof HTMLFormElement)) return;
      const form = label(event.target, 'data-analytics-form');
      if (form) rum.addAction('form_submit', { form, page_path: page() });
    },
    options
  );

  const reset = () => {
    observer?.disconnect();
    clearTimeout(scrollTimer);
    scrollTimer = undefined;
    tracked.clear();
    if (typeof IntersectionObserver !== 'function') return;
    const visible = new WeakSet<Element>();
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = label(entry.target, 'data-analytics-section');
          if (section && entry.isIntersecting && entry.intersectionRatio >= 0.5 && !visible.has(entry.target)) {
            visible.add(entry.target);
            rum.addAction('element_visibility', { section, page_path: page() });
          }
        }
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll('[data-analytics-section]').forEach((element) => observer?.observe(element));
  };
  window.addEventListener(
    'scroll',
    () => {
      if (scrollTimer) return;
      scrollTimer = setTimeout(() => {
        scrollTimer = undefined;
        const height = document.documentElement.scrollHeight;
        if (!height) return;
        const percent = Math.min(100, Math.round((100 * (window.scrollY + window.innerHeight)) / height));
        for (const threshold of [25, 50, 75, 100]) {
          if (percent >= threshold && !tracked.has(threshold)) {
            tracked.add(threshold);
            rum.addAction('scroll_depth', { percent_scrolled: threshold, page_path: page() });
          }
        }
      }, 100);
    },
    { ...options, passive: true }
  );
  document.addEventListener(
    'astro:before-swap',
    () => {
      observer?.disconnect();
      clearTimeout(scrollTimer);
      scrollTimer = undefined;
    },
    options
  );
  document.addEventListener('astro:page-load', reset, options);
  reset();

  return () => {
    abort.abort();
    observer?.disconnect();
    clearTimeout(scrollTimer);
  };
}
