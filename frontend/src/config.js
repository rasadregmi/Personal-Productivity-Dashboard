export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const config = {
  apiBaseUrl: API_BASE_URL,
  backend: {
    host: 'localhost',
    port: 4000,
    protocol: 'http'
  },
  frontend: {
    host: 'localhost', 
    port: 3000,
    protocol: 'http'
  }
};

export default config;
