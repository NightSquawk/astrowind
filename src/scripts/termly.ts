import type { TermlyApi } from '../utils/analytics-consent';

type StashedNode = { node: Element; target: 'head' | 'body' };
const rootId = 'termly-code-snippet-support';
let stashed: StashedNode[] = [];

// Preserve Termly's React root and styles when Astro replaces the document body.
document.addEventListener('astro:before-swap', () => {
  stashed = [];
  const root = document.getElementById(rootId);
  if (root) stashed.push({ node: root, target: 'body' });
  document.querySelectorAll('head style').forEach((node) => {
    if (node.id === '_goober' || node.textContent?.includes('termly')) stashed.push({ node, target: 'head' });
  });
  stashed.forEach(({ node }) => node.remove());
});
document.addEventListener('astro:after-swap', () => {
  stashed.forEach(({ node, target }) => {
    if (!node.isConnected) document[target].appendChild(node);
  });
  stashed = [];
  if (!document.getElementById(rootId)) {
    (window.Termly as TermlyApi | undefined)?.initialize?.();
  }
});
document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element) || !event.target.closest('.termly-display-preferences')) return;
  event.preventDefault();
  window.displayPreferenceModal?.();
});
