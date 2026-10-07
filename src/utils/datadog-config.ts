import type { RumInitConfiguration } from '@datadog/browser-rum';

export interface DatadogConfig {
  applicationId: string;
  clientToken: string;
  site: RumInitConfiguration['site'];
  service: string;
  env: string;
  version?: string;
  allowedHosts: string[];
}

export function canTrackLocation(config: DatadogConfig | undefined, location: Pick<Location, 'hostname' | 'protocol'>) {
  return Boolean(
    config?.applicationId &&
    config.clientToken &&
    config.service &&
    config.env === 'production' &&
    location.protocol === 'https:' &&
    !/(^localhost$|\.localhost$|\.workers\.dev$|\.pages\.dev$|^127\.|^\[::1\]$)/i.test(location.hostname) &&
    config.allowedHosts?.includes(location.hostname.toLowerCase())
  );
}
