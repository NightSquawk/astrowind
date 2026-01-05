// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="../vendor/integration/types.d.ts" />

// Cloudflare Workers Runtime
type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

// Global Datadog RUM configuration
declare global {
  interface Window {
    __DATADOG_CONFIG__?: {
      applicationId?: string;
      clientToken?: string;
      site?: string;
      env?: string;
      service?: string;
      version?: string;
    };
  }
}

// Environment Variables
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ImportMetaEnv {
  // Site Configuration
  readonly PUBLIC_SITE_URL?: string;
  
  // Analytics
  readonly PUBLIC_GOOGLE_ANALYTICS_ID?: string;
  readonly PUBLIC_GOOGLE_TAG_MANAGER_ID?: string;
  
  // Datadog RUM
  readonly PUBLIC_DATADOG_CLIENT_TOKEN?: string;
  readonly PUBLIC_DATADOG_APPLICATION_ID?: string;
  readonly PUBLIC_DATADOG_SITE?: string;
  readonly PUBLIC_DATADOG_ENV?: string;
  readonly PUBLIC_DATADOG_SERVICE?: string;
  readonly PUBLIC_DATADOG_VERSION?: string;
  
  // Termly CMP
  readonly PUBLIC_TERMLY_CMP_WEBSITE_UUID?: string;
  
  // GoHighLevel Tracking
  readonly PUBLIC_GO_HIGH_LEVEL_TRACKING_ID?: string;
  
  // Google Maps
  readonly PUBLIC_GOOGLE_MAPS_API_KEY?: string;

  // Mux Video & Audio
  readonly MUX_TOKEN_ID?: string;
  readonly MUX_TOKEN_SECRET?: string;
  readonly PUBLIC_MUX_TOKEN_ID?: string;
  readonly PUBLIC_MUX_TOKEN_SECRET?: string;
}

// Mux Player web component type declarations
declare namespace JSX {
  interface IntrinsicElements {
    'mux-player': any;
    'mux-audio': any;
  }
}

export {};