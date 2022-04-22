import { MonitoringState } from '@/store/type';

export const initData = (state:MonitoringState) => {
  state.alertStatusList = {
    DB: [],
    NATIVE: [],
    RESOURCE: [],
    SERVICE: [],
    PROCESS: [],
    K8S: [],
    RHEA: [],
    clearTotalUnconfirmedCnt: 0,
    dbUnconfirmedCnt: 0,
    nativeUnconfirmedCnt: 0,
    resourceUnconfirmedCnt: 0,
    serviceUnconfirmedCnt: 0,
  };
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

export const setActiveType = (state:MonitoringState, data) => {
  state.activeType = data;
};

export const setActiveIdx = (state:MonitoringState, data) => {
  state.activeIdx = data;
};

export const setPrometheusInfo = (state:MonitoringState, data) => {
  state.prometheusInfo = data;
};

export const setMonitoringDataUnit = (state:MonitoringState, data) => {
  if (!data) {
    state.monitoringData = {};
    return;
  }

  state.monitoringData = {
    ...state.monitoringData,
    [data.key]: data.data,
  };
};

export const setMonitoringData = (state:MonitoringState, data) => {
  if (!data) {
    state.monitoringData = {};
    return;
  }
  state.monitoringData = data;
};
