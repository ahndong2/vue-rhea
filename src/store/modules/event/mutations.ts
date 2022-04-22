import {
  EventState, EventLog, UnknownList, EventSearchParam,
} from '@/store/type';
import { RespEventLogState } from '@/api/type';
import { eventDefaultData } from './index';

export const initData = (state: EventState): void => {
  const {
    occurred, unresolved, ignore, unknown,
  } = eventDefaultData();
  state.occurred = occurred;
  state.unresolved = unresolved;
  state.ignore = ignore;
  state.unknown = unknown;
  state.eventOccurredList = [];
  state.eventUnresolvedList = [];
  state.eventIgnoreList = [];
  state.unknownListTable = [];
  state.ignoreReason = {};
  state.occurredAlertStatusData = {
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
  state.unresolvedAlertStatusData = {
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

export const setUnknown = (state: EventState, data?:EventSearchParam): void => {
  state.unknown = {
    ...state.unknown,
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

export const setUnknownList = (state: EventState, data?: RespEventLogState): void => {
  state.unknownListTable = data as UnknownList[];
};

export const setEventIgnoreReason = (state: EventState, data): void => {
  state.ignoreReason = data;
};

export const setOccurredAlertStatusData = (state: EventState, data): void => {
  state.occurredAlertStatusData = data;
};
export const setUnresolvedAlertStatusData = (state: EventState, data): void => {
  state.unresolvedAlertStatusData = data;
};

export const setOrganizationList = (state: EventState, data): void => {
  state.organizationList = data;
};

export const setImpactFlowData = (state: EventState, data): void => {
  state.impactFlowData = data;
};

export const setUnknownCount = (state: EventState, data): void => {
  state.unknownCount = data;
};

export const setUnknownDataSourceList = (state: EventState, data): void => {
  state.unknownDataSourceList = data;
};
