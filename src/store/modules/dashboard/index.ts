import { DashboardState } from '@/store/type';
import * as actions from './actions';
import * as mutations from './mutations';

const localStorage = () => JSON.parse(window.localStorage.getItem('rhea/dashboard')as string) || {
  refreshTime: 60,
  minute: 5,
  day: 2,
  hour: 2,
};

const state: DashboardState = {
  alert: {
    refreshTime: localStorage().refreshTime,
    minute: localStorage().minute,
    day: localStorage().day,
    hour: localStorage().hour,
  },
  currentTime: 0,
  beforeMinutes: 0,
  beforeHours: 0,
  beforeDays: 0,
  alertSummaryMinute: [],
  alertSummaryTime: [],
  dayUnresolvedCnt: 0,
  totalUnresolvedCnt: 0,
  orgMonitoringList: [],
  orgMonitoringNameList: [],
};

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations,
};
