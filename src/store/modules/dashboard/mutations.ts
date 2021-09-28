import { DashboardState, AlertObj } from '@/store/type';
import { RespDashboardAlertState } from '@/api/type';

export const setAlert = (state: DashboardState, alertObject?: AlertObj): void => {
  state.alert = {
    ...state.alert,
    ...alertObject,
  };
};

export const setCurrentTime = (state: DashboardState, minute: number): void => {
  state.currentTime = minute;
};

export const setBeforeMinutes = (state: DashboardState, minute: number): void => {
  state.beforeMinutes = minute;
};

export const setBeforeHours = (state: DashboardState, hour: number): void => {
  state.beforeHours = hour;
};

export const setBeforeDays = (state: DashboardState, day: number): void => {
  state.beforeDays = day;
};

export const setAlertSummary = (state: DashboardState, data:RespDashboardAlertState):void => {
  const {
    minute, time, dayUnresolvedCnt, totalUnresolvedCnt,
  } = data;
  state.alertSummaryMinute = minute;
  state.alertSummaryTime = time;
  state.dayUnresolvedCnt = dayUnresolvedCnt;
  state.totalUnresolvedCnt = totalUnresolvedCnt;
};

export const setOrgMonitoringList = (state:DashboardState, data) => {
  state.orgMonitoringList = data;
};
