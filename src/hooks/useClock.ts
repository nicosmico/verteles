import { useState, useEffect } from 'react';

export function useClock(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => {
      setNow(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(t);
  }, []);

  return now;
}

export default useClock;
