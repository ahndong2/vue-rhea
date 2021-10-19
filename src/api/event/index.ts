import API, { AxiosResponse } from '../index-instance';

export const getAlertStatusListAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/alert/prometheus/state',
  params: param,
});

export const getEventList = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/eventlog/page',
  params: param,
});

export const getEventIgnoreReason = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/findEventIgnoreList',
  params: param,
});

export const setEventIgnoreWriteAPI = (data): Promise<AxiosResponse> => API.request({
  method: 'POST',
  url: 'monitoring/eventignore/write',
  data,
});

export const setEventIgnoreCanclewriteAPI = (data): Promise<AxiosResponse> => API.request({
  method: 'POST',
  url: 'monitoring/eventignore/cancelwrite',
  data,
});
