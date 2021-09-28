import axios, { AxiosInstance, AxiosResponse } from 'axios';
import store from '@/store';

export interface Options {
  [key:string]: unknown,
}

const APP_BASE_URI = process.env.VUE_APP_URL;
const headers = { 'Content-Type': 'application/json' };
const createInstance = (url: string, options: Options = { headers }): AxiosInstance => {
  const instance = axios.create({ baseURL: url, ...options });
  instance.defaults.timeout = 300000;
  instance.interceptors.request.use(
    (config) => {
      store.commit('global/setSpinner', true);
      if (process.env.NODE_ENV === 'local') {
        console.log('[Request API]', config);
      }

      return config;
    },
    (error) => { Promise.reject(error); },
  );
  instance.interceptors.response.use(
    (response) => {
      if (process.env.NODE_ENV === 'local') {
        console.log('[Response API]', response);
      }

      store.commit('global/setSpinner', false);

      return response;
    },
    (error) => { Promise.reject(error); },
  );
  return instance;
};
const API = createInstance(`${APP_BASE_URI}`);

export { AxiosResponse };
export default API;
