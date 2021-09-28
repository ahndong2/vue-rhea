import API, { AxiosResponse } from '../index-instance';

export const getAuthInfoAPI = (): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'user/auth-info',
  // params: param,
});
