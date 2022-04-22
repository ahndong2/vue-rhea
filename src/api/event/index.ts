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

export const getDataSourceList = (): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/prometheus',
  params: {
    useYn: 'Y',
  },
});

export const getEventListAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/eventLogQueryDslList',
  params: param,
});

export const getEventDetailListAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/eventlog/page',
  params: param,
});

export const getEventIgnoreReasonAPI = (param): Promise<AxiosResponse> => API.request({
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

export const getImpactFlowAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/impactFlow',
  params: param,
});

export const setImpactFlowAPI = (data): Promise<AxiosResponse> => API.request({
  method: 'POST',
  url: 'monitoring/impactFlow/update',
  data,
});

export const getUnknownResourceListAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/unknownResourceList',
  params: param,
});

export const getUnknownResourceCountAPI = (): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'monitoring/unknownResource/unregisteredCount',
});

export const getAlarmGroupUserListAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'alarm/groupInfo/alarmGroupUserList',
  params: param,
});

export const getUnknownDataSourceListAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'data/data-source/unknown',
  params: param,
});
