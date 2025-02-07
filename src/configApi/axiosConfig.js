import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

const instance = axios.create({
  baseURL: baseURL,
  timeout: 50000 ,
  headers: { 'Content-Type': 'application/json' }
});

export default instance;
