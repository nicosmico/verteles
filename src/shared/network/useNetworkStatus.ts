import { useState, useEffect } from 'react';

export interface NetworkStatus {
  online: boolean;
  downlink: number | null;
}

export function useNetworkStatus(): NetworkStatus {
  const [online, setOnline] = useState(navigator.onLine);
  const [downlink, setDownlink] = useState<number | null>(() => {
    const conn = (navigator as any).connection;
    return conn ? conn.downlink : null;
  });

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const conn = (navigator as any).connection;
    const handleConnectionChange = () => {
      if (conn) setDownlink(conn.downlink);
    };

    if (conn) {
      conn.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (conn) {
        conn.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return { online, downlink };
}

export default useNetworkStatus;
