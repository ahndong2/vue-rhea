import { MonitoringState } from '@/store/type';
import * as actions from './actions';
import * as mutations from './mutations';

const localStorage = window.localStorage.getItem('rhea/monitoring') as string;
const searchData = JSON.parse(localStorage) || {
  searchDuring: 1,
};

const state: MonitoringState = {
  searchData,
  alertStatusList: [],
  organizationList: [],
  prometheusList: [],
  groupJobsList: [],
  activeIdx: 0,
  prometheusInfo: {},
};

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations,
};
