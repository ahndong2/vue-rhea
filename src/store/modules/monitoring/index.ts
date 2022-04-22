import { MonitoringState } from '@/store/type';
import * as actions from './actions';
import * as mutations from './mutations';

const localStorage = () => JSON.parse(window.localStorage.getItem('rhea/monitoring')as string) || {
  searchDuring: 1,
};
const state: MonitoringState = {
  searchData: localStorage(),
  alertStatusList: {
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
  },
  organizationList: [],
  prometheusList: [],
  groupJobsList: [],
  activeIdx: 0,
  prometheusInfo: {},
  monitoringData: {},
  activeType: 'RESOURCE',
};

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations,
};
