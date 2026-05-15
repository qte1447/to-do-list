// src/apiBypass.js
import axios from 'axios';

// A fast proxy network that handles CORS and functions seamlessly within Russia
const WORKING_PROXY = 'https://codetabs.com';

// 1. Intercept the OUTGOING request to wrap the restricted URL
axios.interceptors.request.use((config) => {
  const url = config.url;

  // Intercept OpenWeatherMap requests
  if (url.includes('api.openweathermap.org')) {
    config.url = `${WORKING_PROXY}${encodeURIComponent(url)}`;
  }
  
  // Intercept ExchangeRate-API requests
  if (url.includes('://er-api.com')) {
    config.url = `${WORKING_PROXY}${encodeURIComponent(url)}`;
  }

  // Intercept and replace the broken corsproxy.io wrapper from your Central Bank call
  if (url.includes('corsproxy.io/?')) {
    const originalCbrUrl = 'https://cbr-xml-daily.ru';
    config.url = `${WORKING_PROXY}${encodeURIComponent(originalCbrUrl)}`;
  }

  return config;
}, (error) => Promise.reject(error));


// 2. Intercept the INCOMING response to unpack the proxy container if needed
axios.interceptors.response.use((response) => {
  // If the proxy wrapper responds with a stringified payload inside an object, extract it
  if (response.data && response.data.contents) {
    try {
      // If the data arrives as text inside a container, parse it to JSON for App.js
      if (typeof response.data.contents === 'string') {
        response.data = JSON.parse(response.data.contents);
      } else {
        response.data = response.data.contents;
      }
    } catch (e) {
      console.error("Failed to parse nested proxy contents structure", e);
    }
  }
  return response;
}, (error) => Promise.reject(error));
