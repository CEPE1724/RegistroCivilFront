import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;
console.log("Base URL for API:", baseURL);
const instance = axios.create({
  baseURL: baseURL,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' }
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // o sessionStorage, o desde donde guardes tu token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default instance;
