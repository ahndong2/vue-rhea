import axios, { AxiosInstance, AxiosResponse } from 'axios';
import store from '@/store';
import Cookies from 'js-cookie';
import JSONbig from 'json-bigint';
import { AUTH_REMEMBER_ME, AUTH_TOKEN } from '@/constants';

export interface Options {
  [key:string]: unknown,
}

const APP_BASE_URI = process.env.VUE_APP_URL;
let headers;
if (process.env.NODE_ENV === 'local') {
  headers = {
    'Content-Type': 'application/json',
    'X-AUTH-TOKEN': AUTH_TOKEN.replace(/\s+/g, ''),
    'X-AUTH-REMENBER-ME': AUTH_REMEMBER_ME,
  };

  Cookies.set('X-AUTH-TOKEN', AUTH_TOKEN, { expires: 7, path: '/' });
  Cookies.set('X-AUTH-REMENBER-ME', AUTH_REMEMBER_ME, { expires: 7, path: '/' });
} else {
  headers = {
    'Content-Type': 'application/json',
  };
}

const createInstance = (url: string, options: Options = { headers }): AxiosInstance => {
  const instance = axios.create({
    baseURL: url,
    ...options,
    transformResponse: [(data) => JSONbig.parse(data)],
  });
  instance.defaults.timeout = 300000;
  instance.interceptors.request.use(
    (config) => {
      store.dispatch('global/setAPIRequestCount');
      if (process.env.NODE_ENV === 'local') {
        console.log('[Request API]', config);
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => {
      if (process.env.NODE_ENV === 'local') {
        console.log('[Response API]', response);
      }
      store.dispatch('global/setAPIResponseCount');

      const domain = `${window.location.hostname}/`;
      if (response.request.responseURL === `http://${domain}` || response.request.responseURL === `https://${domain}`) {
        window.alert('로그인 세션 타임이 종료되었습니다. \n로그인 페이지로 이동합니다.');
        window.location.href = '/';
      }

      return JSON.parse(JSON.stringify(response));
    },
    (error) => {
      store.dispatch('global/errorControll', error);
      return Promise.reject(error);
    },
  );
  return instance;
};
const API = createInstance(`${APP_BASE_URI}`);

export { AxiosResponse };
export default API;
