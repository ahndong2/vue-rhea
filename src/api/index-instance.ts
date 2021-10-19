import axios, { AxiosInstance, AxiosResponse } from 'axios';
import store from '@/store';
import Cookies from 'js-cookie';

export interface Options {
  [key:string]: unknown,
}

const APP_BASE_URI = process.env.VUE_APP_URL;
let headers;
if (process.env.NODE_ENV === 'local') {
  const authToken = `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyaGVhIiwicm9sZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImF1dGgiOiJZSzh0M1VTNndPMUZSSWd3emx3ZFpFYnUxejIrRDRNTlowd0dnSzE3cXZ5QU1lKzE2
  Q2k0aVd3eTJhNmtrR09mWTdNQjJLeUtvOTJ1SHlsdzFOWEdZYkNUWjhDVzZhRjJKc0FscG55UjdlT1poMzBjSFhLR20waHdQQnptZDMwWDNkblovZG1Wd055Z3JxaUdHcFVSalJZRmdSSDF4YkFBMCs0VW1vMmtjQ01Fak9YOUlFTmFJNHR
  lK2FTQUlKTXJ0WnRoak1tUmVHVzZnL3JZaWtjUFpHWm5COUJSZ2hHTUUvQXRtQ2xKcU5sUTRNRGdMSklZNHltMWJVRWlTeElQUTBRSlFBTE9Yb2pGYkZPSERrSXAxZHh2a1Bnb0xBRnRlSUdsTlFsSWJ0cWdkbFJGSHpySTJrdDhKK1J1WW4zQ0tJRmtj
  RmhWZFhOY05YckpZRWVDWG81VnNHbENYVkJFbDNpQkFnY0Irbi9lUXFpeXRwNWF4RWgya0dJbTFaUFM5SGVmcnFUOTRESm9hcTVFVjFBN2I4aDBNZk4rdXgxdzFORVYrTXQ2RkJIVHJoRXR3blNUVEVBREtpRXZXMHhMaVZJdkpJSzlzK0l
  KazZzTGNHSkVCQmhQSmkxejhWeVFwOEwwdklINCs5QTBHOEVlMGJpdWdSSjBPdEtoVys4M0o4YmFQNmxLY21qRkUrVk5XeE5MK0VVMzNGMzJ6V1lzOTdxdmtkOWc1T2wvalRmSmF0cy9McmdKcGVQaVNQY0tnMDFsZDRRZDBWcnFZTElOWk4xTV
  Y4d2ZFdTZVYTRORkJwc1p5cS9Gd0oyTXY3dG44WmhrRXlwZEZ5YTAwVXNjOCtIQkJmN0wxTGo0aXhNVkNrRXpOR1UwNEE9PSIsInJlbW90ZUFkZHJlc3MiOiIxOTIuMTY4LjgzLjY0IiwiaWF0IjoxNjMyODg4NDQ5LCJleHAiOjE2MzI4OTU2N
  Dl9.WpUJrM6YUH6pTh7_Nfj6cH5x20_4Xh3skzid-kiXLdg`.replace(/\s+/g, '');
  const authTokenRememberMe = 'bUFIQWtyVmdRR0RnMG0lMkJCbGFLeEFnJTNEJTNEOmhTOEpWOHc2UllHOVNPSEV1OU93akElM0QlM0Q';
  headers = {
    'Content-Type': 'application/json',
    'X-AUTH-TOKEN': authToken,
    'X-AUTH-REMENBER-ME': authTokenRememberMe,
  };

  Cookies.set('X-AUTH-TOKEN', authToken, { expires: 7, path: '/' });
  Cookies.set('X-AUTH-REMENBER-ME', authTokenRememberMe, { expires: 7, path: '/' });
} else {
  headers = {
    'Content-Type': 'application/json',
  };
}
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
