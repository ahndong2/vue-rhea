import { MonitoringState } from '@/store/type';

export const initData = (state:MonitoringState) => {
  state.alertStatusList = [];
  state.prometheusList = [];
  state.groupJobsList = [];
  state.activeIdx = 0;
  state.prometheusInfo = {};
};

export const setSearchData = (state:MonitoringState, data) => {
  state.searchData = {
    ...state.searchData,
    ...data,
  };
};

export const setAlertStatusList = (state:MonitoringState, data) => {
  state.alertStatusList = data;
};

export const setOrganizationList = (state:MonitoringState, data) => {
  state.organizationList = data;
};

export const setPrometheusList = (state:MonitoringState, data) => {
  state.prometheusList = data;
};

export const setGroupJobsList = (state:MonitoringState, data) => {
  state.groupJobsList = data;
};

export const setGroupJobsDetailData = (state:MonitoringState, data) => {
  state.groupJobsList = data;
};

export const setActiveIdx = (state:MonitoringState, data) => {
  state.activeIdx = data;
};

export const setPrometheusInfo = (state:MonitoringState, data) => {
  state.prometheusInfo = data;
};
