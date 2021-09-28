import API, { AxiosResponse } from '../index-instance';

export const getDashboardAlertAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/alert/state',
  params: param,
});

export const getOrgMonitoringListAPI = (): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/list',
  params: {
    useYn: 'Y',
  },
});
