export interface TemplateConfig {
  site: {
    name: string;
    url: string;
    description: string;
  };
  contact: {
    phone: string;
    email: string;
    address: { street: string; city: string; state: string; zip: string; };
  };
  social: Record<string, string>;
  features: {
    coupons: boolean;
    campaigns: boolean;
    podcast: boolean;
    redirects: boolean;
  };
  analytics?: {
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    datadogAppId?: string;
    datadogClientToken?: string;
    datadogSite?: string;
    datadogService?: string;
    goHighLevelTrackingId?: string;
    termlyWebsiteUUID?: string;
  };
  podcast?: {
    name?: string;
  };
}
