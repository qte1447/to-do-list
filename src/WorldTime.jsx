// src/WorldTime.jsx
import React, { useEffect, useState } from 'react';

const TIMEZONE_MAP = {
  NewYork: 'America/New_York',
  Moscow: 'Europe/Moscow',
  Tokyo: 'Asia/Tokyo',
};

const WorldTime = ({ timezones }) => {
  const [times, setTimes] = useState([]);

  useEffect(() => {
    const fetchTimes = async () => {
      const results = [];
      for (const tzName of timezones) {
        const tzId = TIMEZONE_MAP[tzName];
        if (!tzId) {
          results.push({
            city: tzName,
            time: 'Неизвестен',
            error: true,
          });
          continue;
        }
        try {
          const response = await fetch(
            `https://time.now/developer/api/timezone/${tzId}`
          );
          if (!response.ok) {
            results.push({
              city: tzName,
              time: 'Ошибка соединения',
              error: true,
            });
            continue;
          }
          const data = await response.json();
          const datetime = data.datetime || '—';
          const formatted = new Date(datetime).toLocaleString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });
          results.push({
            city: tzName,
            time: formatted,
            error: false,
          });
        } catch (e) {
          results.push({
            city: tzName,
            time: 'Ошибка',
            error: true,
          });
        }
      }
      setTimes(results);
    };
    fetchTimes();
  }, [timezones]);

  if (times.length === 0) return <div>Loading...</div>;

  return (
    <div className="world-time">
      <h2>Текущее время</h2>
      <div className="time-list">
        {times.map(t => (
          <div key={t.city} className="time-item">
            <span className={t.error ? 'time-error' : 'time-label'}>
              {t.error ? (t.time || 'Ошибка подключения') : t.city}
              {t.error ? '' : ` (${TIMEZONE_MAP[t.city]})`}
            </span>
            <span className={t.error ? 'time-value-error' : 'time-value'}>
              {t.error ? '' : t.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldTime;

