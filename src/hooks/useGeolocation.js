import { useState, useEffect } from 'react';

// Shared promise to prevent multiple concurrent requests
let fetchPromise = null;

export const useGeolocation = () => {
  const [locData, setLocData] = useState({
    city: 'HYD',
    countryCode: 'IND',
    lat: 17.3850,
    lon: 78.4867,
    fullLocation: 'Hyderabad, Telangana, India',
    ip: 'Unknown'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchLocation = async () => {
      // Check cache first
      let cached = null;
      try {
        cached = sessionStorage.getItem('geo_data');
      } catch {
        // Continue with a network lookup when storage is unavailable.
      }
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (isMounted && parsed && typeof parsed === 'object') {
            setLocData((current) => ({ ...current, ...parsed }));
            setLoading(false);
            return;
          }
        } catch {
          try { sessionStorage.removeItem('geo_data'); } catch { /* Ignore unavailable storage. */ }
        }
      }

      // Prevent concurrent identical requests
      if (!fetchPromise) {
        fetchPromise = (async () => {
          let data = {
            city: 'HYD',
            countryCode: 'IND',
            lat: 17.3850,
            lon: 78.4867,
            fullLocation: 'Unknown',
            ip: 'Unknown'
          };

          try {
            // Primary Attempt: freeipapi.com
            const res = await fetch('https://freeipapi.com/api/json');
            if (res.ok) {
              const result = await res.json();
              data.city = result.cityName ? result.cityName.toUpperCase().substring(0, 3) : 'UNK';
              data.countryCode = result.countryCode || 'UNK';
              data.lat = result.latitude || 0;
              data.lon = result.longitude || 0;
              data.fullLocation = [result.cityName, result.regionName, result.countryName].filter(Boolean).join(', ') || 'Unknown';
              data.ip = result.ipAddress || 'Unknown';
            } else {
              throw new Error('Primary failed');
            }
          } catch {
            try {
              // Fallback: ipapi.co
              const res = await fetch('https://ipapi.co/json/');
              if (res.ok) {
                const result = await res.json();
                data.city = result.city ? result.city.toUpperCase().substring(0, 3) : 'UNK';
                data.countryCode = result.country_code || 'UNK';
                data.lat = result.latitude || 0;
                data.lon = result.longitude || 0;
                data.fullLocation = [result.city, result.region, result.country_name].filter(Boolean).join(', ') || 'Unknown';
                data.ip = result.ip || 'Unknown';
              }
            } catch (e) {
              console.error('Geolocation failed:', e);
            }
          }
          return data;
        })();
      }

      try {
        const data = await fetchPromise;
        try { sessionStorage.setItem('geo_data', JSON.stringify(data)); } catch { /* Storage is optional. */ }
        if (isMounted) {
          setLocData(data);
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      } finally {
        fetchPromise = null;
      }
    };

    fetchLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  return { locData, loading };
};
