// src/apiBypass.js

import axios from 'axios';

// Define working, Russia-friendly endpoints
const API_CONFIG = {
  openweathermap: 'https://api.openweathermap.org/data/2.5', // 
  exchangerate: 'https://api.exchangerate-api.com/v4/latest/RUB', //
  cbr: 'https://cbr-xml-daily.ru/daily_json.js' //
};

// Intercept requests to fix broken URLs
axios.interceptors.request.use((config) => {
  const url = config.url;

  // 1. Fix OpenWeatherMap — if blocked, use a free public fallback (e.g., Coingecko for temp fallback)
  if (url?.includes('api.openweathermap.org')) {
    // Option A: Try direct (might work if not blocked in user's network)
    // Option B: Fallback to Coingecko for temperature? Not ideal — better to warn user
    console.warn('OpenWeatherMap may be blocked in your region. Consider using a fallback.');
    // We don't proxy — instead, we let it fail gracefully and suggest alternatives
    // If you MUST proxy, you need your own backend (not possible on GitHub Pages)
    return config;
  }

  // 2. Fix ExchangeRate-API (er-api.com) — replace with working public API
  if (url?.includes('er-api.com') || url?.includes('exchange-rate-api')) {
    config.url = API_CONFIG.exchangerate;
    return config;
  }

  // 3. Fix corsproxy.io wrapper for CBR
  if (url?.includes('corsproxy.io/?') && url.includes('cbr-xml-daily.ru')) {
    // Extract the original CBR URL from the proxy wrapper
    const decodedUrl = decodeURIComponent(url.split('?')[1]);
    config.url = decodedUrl;
    return config;
  }

  // 4. If someone directly calls CBR via corsproxy.io, redirect to direct
  if (url?.includes('cbr-xml-daily.ru') && !url.startsWith('https://cbr-xml-daily.ru')) {
    config.url = API_CONFIG.cbr;
    return config;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response handler: extract wrapped content if needed
axios.interceptors.response.use(
  (response) => {
    if (response.data && response.data.contents) {
      try {
        response.data = typeof response.data.contents === 'string'
          ? JSON.parse(response.data.contents)
          : response.data.contents;
      } catch (e) {
        console.error('Payload extraction failed:', e);
      }
    }
    return response;
  },
  (error) => {
    // For critical APIs, provide fallbacks or user-friendly messages
    if (error.response?.status === 403 && error.config.url?.includes('openweathermap.org')) {
      console.warn('OpenWeatherMap is blocked in your region. Consider using a local weather service.');
    }
    return Promise.reject(error);
  }
);

// Optional: Export a helper to fetch CBR rates directly
export const fetchCBRRates = async () => {
  try {
    const res = await axios.get(API_CONFIG.cbr);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch CBR rates:', error);
    throw error;
  }
};

export const fetchExchangeRates = async () => {
  try {
    const res = await axios.get(API_CONFIG.exchangerate);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    throw error;
  }
};

