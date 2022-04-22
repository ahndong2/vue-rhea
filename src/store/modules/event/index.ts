import { EventState } from '@/store/type';
import * as actions from './actions';
import * as mutations from './mutations';

const localStorage = () => JSON.parse(window.localStorage.getItem('rhea/event')as string) || {
  occurred: {
    refreshTime: 60,
    searchDuring: 60,
  },
  unresolved: {
    refreshTime: 60,
    searchDuring: 720,
  },
};
export const eventDefaultData = () => ({
  occurred: {
    ...localStorage().occurred || {},
    organizationName: '',
    prometheusName: '',
    groupJobName: '',
    alertLevel: '',
    page: 1,
    size: 50,
    totalCount: 0,
  },
  unresolved: {
    ...localStorage().unresolved || {},
    organizationName: '',
    prometheusName: '',
    groupJobName: '',
    alertLevel: '',
    page: 1,
    size: 50,
    totalCount: 0,
  },
  ignore: {
    prometheusName: '',
    groupJobName: '',
    page: 1,
    size: 50,
    totalCount: 0,
  },
  unknown: {
    page: 1,
    size: 20,
    totalCount: 0,
  },
});
const state: EventState = {
  ...eventDefaultData(),
  organizationList: [],
  eventOccurredList: [],
  eventUnresolvedList: [],
  eventIgnoreList: [],
  unknownListTable: [],
  ignoreReason: {},
  unknownCount: 0,
  occurredAlertStatusData: {
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
  unresolvedAlertStatusData: {
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
  impactFlowData: {},
  unknownDataSourceList: [],
};

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations,
};
