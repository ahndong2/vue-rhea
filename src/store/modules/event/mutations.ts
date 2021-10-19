import { EventState, EventLog, EventSearchParam } from '@/store/type';
import { RespEventLogState } from '@/api/type';

export const initData = (state: EventState): void => {
  state.eventOccurredList = [];
  state.eventUnresolvedList = [];
  state.eventIgnoreList = [];
  state.ignoreReason = {};
  state.occurredAlertStatusData = [];
  state.unresolvedAlertStatusData = [];
};

export const setOccurred = (state: EventState, data?:EventSearchParam): void => {
  state.occurred = {
    ...state.occurred,
    ...data,
  };
};
export const setUnresolved = (state: EventState, data?:EventSearchParam): void => {
  state.unresolved = {
    ...state.unresolved,
    ...data,
  };
};
export const setIgnore = (state: EventState, data?:EventSearchParam): void => {
  state.ignore = {
    ...state.ignore,
    ...data,
  };
};

export const setEventOccurredList = (state: EventState, data?: RespEventLogState): void => {
  state.eventOccurredList = data as EventLog[];
};

export const setEventUnresolvedList = (state: EventState, data?: RespEventLogState): void => {
  state.eventUnresolvedList = data as EventLog[];
};

export const setEventIgnoreList = (state: EventState, data?: RespEventLogState): void => {
  state.eventIgnoreList = data as EventLog[];
};

export const setEventIgnoreReason = (state: EventState, data): void => {
  state.ignoreReason = data;
};

export const setOrgList = (state: EventState, data): void => {
  state.orgList = data;
};

export const setOccurredAlertStatusData = (state: EventState, data): void => {
  state.occurredAlertStatusData = data;
};
export const setUnresolvedAlertStatusData = (state: EventState, data): void => {
  state.unresolvedAlertStatusData = data;
};
