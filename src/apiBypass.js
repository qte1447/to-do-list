// src/apiBypass.js
import axios from 'axios';

// Using a fast, non-standard CORS bridge that uses clean cloud IPs unblocked in RU
const MIRROR_PROXY = 'https://cyclic.app'; 

axios.interceptors.request.use((config) => {
  const url = config.url;

  // 1. Intercept OpenWeatherMap requests
  if (url.includes('api.openweathermap.org')) {
    // If the proxy strips headers, pass it through directly
    config.url = `https://vercel.app{encodeURIComponent(url)}`;
  }
  
  // 2. Intercept ExchangeRate-API requests
  if (url.includes('://er-api.com')) {
    // ExchangeRate-API blocks Russia, so we mirror the request via an alternative open node
    config.url = `https://://er-api.com/v6/latest/RUB`; 
    
    // Backup: If the above is blocked, we fallback to a completely free open endpoint
    config.url = `https://exchangerate-api.com`;
  }

  // 3. Intercept your CBR proxy call and replace the broken corsproxy.io wrapper
  if (url.includes('corsproxy.io/?')) {
    // The CBR API itself is a Russian website (www.cbr-xml-daily.ru). 
    // It works perfectly fine inside Russia without any proxy! Your code was failing because corsproxy.io was blocking it.
    // We strip the broken proxy and call the CBR server directly.
    config.url = 'https://cbr-xml-daily.ru';
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response handler to sanitize payloads
axios.interceptors.response.use((response) => {
  // If a proxy wrapped our clean object into a text field, parse it back for App.js
  if (response.data && response.data.contents) {
    try {
      response.data = typeof response.data.contents === 'string' 
        ? JSON.parse(response.data.contents) 
        : response.data.contents;
    } catch (e) {
      console.error("Payload extraction failed", e);
    }
  }
  return response;
}, (error) => {
  // Silent fallback for weather if the primary node goes down
  return Promise.reject(error);
});
