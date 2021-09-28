import { EventState } from '@/store/type';
import * as actions from './actions';
import * as mutations from './mutations';

const localStorage = JSON.parse(window.localStorage.getItem('rhea/event')as string) || {
  occurred: {
    refreshTime: 60,
    searchDuring: 72,
  },
  unresolved: {
    refreshTime: 60,
    searchDuring: 72,
  },
};
const eventData = {
  occurred: {
    refreshTime: 60,
    searchDuring: 72,
    ...localStorage.occurred || {},
    organizationName: '',
    prometheusName: '',
    groupJobName: '',
    alertLevel: '',
    page: 1,
    size: 50,
    totalCount: 0,
  },
  unresolved: {
    refreshTime: 60,
    searchDuring: 72,
    ...localStorage.unresolved || {},
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
};
const state: EventState = {
  ...eventData,
  orgList: [],
  eventOccurredList: [],
  eventUnresolvedList: [],
  eventIgnoreList: [],
  ignoreReason: {},
  occurredAlertStatusData: [],
  unresolvedAlertStatusData: [],
};

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations,
};
