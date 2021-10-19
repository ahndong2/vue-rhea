import API, { AxiosResponse } from '../index-instance';

export const getAlertStatusListAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/alert/prometheus/state',
  params: param,
});

export const getOrgMonitoringListAPI = (): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/list',
  params: {
    useYn: 'Y',
  },
});

export const getPrometheusListAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/prometheus',
  params: param,
});

export const getGroupJobsListAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/prometheus/groupInfo',
  params: param,
});

export const getMonitoringDetailAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  // url: 'monitoring/monitoringDetail',
  url: 'monitoring/monitoringDetailDivide',
  params: param,
});
