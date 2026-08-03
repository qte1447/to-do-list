import React, { useEffect, useRef, useState } from 'react';

// Custom hook to fetch timezone time with auto-refresh
function useTimezoneTime(tzString, { refreshInterval = null } = {}) {
  const [time, setTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await fetch(
          `https://time.now/developer/api/timezone/${encodeURIComponent(tzString)}`
        );
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        setTime(data);
        setError('');
      } catch (e) {
        setError(e.message || 'Ошибка загрузки времени');
        setTime(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTime();

    if (refreshInterval) {
      timerRef.current = setInterval(fetchTime, refreshInterval * 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tzString, refreshInterval]);

  return { time, loading, error };
}

// List of cities and their IANA timezones
const TIMEZONE_CITIES = [
  { label: 'New York', tz: 'America/New_York' },
  { label: 'Москва',   tz: 'Europe/Moscow' },
  { label: 'Токио',   tz: 'Asia/Tokyo' },
];

export default function WorldTimeClock() {
  // Track time for each city using the hook
  const cityTimes = TIMEZONE_CITIES.map(({ label, tz }) => {
    const { time, loading, error } = useTimezoneTime(tz, { refreshInterval: 60 });
    // Format time if available
    let displayTime;
    if (time && time.datetime) {
      // Use user's locale if possible, fallback to simple format
      displayTime = new Date(time.datetime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (time) {
      displayTime = '—:—';
    } else if (loading) {
      displayTime = 'Загрузка...';
    } else if (error) {
      displayTime = 'Ошибка';
    } else {
      displayTime = '—:—';
    }
    return {
      label,
      tz,
      displayTime,
      loading,
      error,
    };
  });

  return (
    <div style={{ fontFamily: 'sans-serif', margin: 24, maxWidth: 600, padding: 16 }}>
      <h2>Текущее время по городам 🌎</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', border: '1px solid #ddd' }}>
        <thead>
          <tr>
            <th>Город</th>
            <th>Время</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {cityTimes.map((city) => (
            <tr key={city.tz} style={{ border: '1px solid #f5f5f5' }}>
              <td style={{ padding: 4 }}>{city.label}</td>
              <td style={{ padding: 4 }}>
                {city.loading
                  ? 'Загрузка...'
                  : city.error
                    ? <span style={{ color: 'red' }}>{city.error}</span>
                    : city.displayTime
                }
              </td>
              <td style={{ padding: 4 }}>
                {city.loading ? '⏳' : city.error ? '❌' : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
