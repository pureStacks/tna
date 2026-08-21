import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_CMS_DATA } from '../data/defaultData';

type CMSContextType = {
  data: any;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
};

const CMSContext = createContext<CMSContextType>({
  data: DEFAULT_CMS_DATA,
  loading: false,
  error: null,
  refreshData: async () => {}
});

export const useCMS = () => useContext(CMSContext);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(DEFAULT_CMS_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/public/data');
      if (!res.ok) {
        console.warn('Could not fetch latest CMS data from server, using cached/default content.');
        setData((prev: any) => prev || DEFAULT_CMS_DATA);
        setError(null);
        return;
      }
      const json = await res.json();
      if (json && json.settings) {
        // Deep merge with defaults to protect against any missing subfields
        const mergedData = {
          settings: {
            ...DEFAULT_CMS_DATA.settings,
            ...json.settings,
            header: { ...DEFAULT_CMS_DATA.settings.header, ...(json.settings?.header || {}) },
            home: { ...DEFAULT_CMS_DATA.settings.home, ...(json.settings?.home || {}) },
            about: { ...DEFAULT_CMS_DATA.settings.about, ...(json.settings?.about || {}) },
            features: { ...DEFAULT_CMS_DATA.settings.features, ...(json.settings?.features || {}) },
            contact: { ...DEFAULT_CMS_DATA.settings.contact, ...(json.settings?.contact || {}) },
            footer: { ...DEFAULT_CMS_DATA.settings.footer, ...(json.settings?.footer || {}) },
          },
          products: (json.products && json.products.length > 0) ? json.products : DEFAULT_CMS_DATA.products,
          testimonials: (json.testimonials && json.testimonials.length > 0) ? json.testimonials : DEFAULT_CMS_DATA.testimonials,
        };
        setData(mergedData);
        setError(null);
      } else {
        setData((prev: any) => prev || DEFAULT_CMS_DATA);
      }
    } catch (err: any) {
      console.warn('Network error during CMS fetch, falling back to default data:', err);
      setData((prev: any) => prev || DEFAULT_CMS_DATA);
      setError(null); // Keep error null so user sees the website smoothly
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <CMSContext.Provider value={{ data: data || DEFAULT_CMS_DATA, loading, error, refreshData: fetchData }}>
      {children}
    </CMSContext.Provider>
  );
}
