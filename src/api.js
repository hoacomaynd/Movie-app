import axios from 'axios';

const API_KEY = 'c66ee3248c7f997fa413179d7d3cc1d2';
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY
  }
});

export default api;