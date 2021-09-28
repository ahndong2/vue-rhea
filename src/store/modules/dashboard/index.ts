import { DashboardState } from '@/store/type';
import * as actions from './actions';
import * as mutations from './mutations';

const localStorage = window.localStorage.getItem('rhea/dashboard') as string;
const alertData = JSON.parse(localStorage) || {
  refreshTime: 60,
  minute: 5,
  day: 2,
  hour: 2,
};

const state: DashboardState = {
  alert: {
    refreshTime: alertData.refreshTime,
    minute: alertData.minute,
    day: alertData.day,
    hour: alertData.hour,
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
};

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations,
};
