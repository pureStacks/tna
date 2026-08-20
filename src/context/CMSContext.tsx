import React, { createContext, useContext, useEffect, useState } from 'react';

type CMSContextType = {
  data: any;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
};

const CMSContext = createContext<CMSContextType>({
  data: null,
  loading: true,
  error: null,
  refreshData: async () => {}
});

export const useCMS = () => useContext(CMSContext);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/public/data');
      if (!res.ok) throw new Error('Failed to fetch CMS data');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <CMSContext.Provider value={{ data, loading, error, refreshData: fetchData }}>
      {children}
    </CMSContext.Provider>
  );
}
