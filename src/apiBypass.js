// src/apiBypass.js
import axios from 'axios';

const PUBLIC_PROXY = 'https://allorigins.win';


axios.interceptors.request.use((config) => {
  const url = config.url;

  
  if (url.includes('api.openweathermap.org')) {
    config.url = `${PUBLIC_PROXY}${encodeURIComponent(url)}`;
  }
  
 
  if (url.includes('://er-api.com')) {
    config.url = `${PUBLIC_PROXY}${encodeURIComponent(url)}`;
  }

  
  if (url.includes('corsproxy.io/?')) {
   
    const originalCbrUrl = 'https://cbr-xml-daily.ru';
    config.url = `${PUBLIC_PROXY}${encodeURIComponent(originalCbrUrl)}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
