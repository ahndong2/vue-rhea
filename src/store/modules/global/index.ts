import { GlobalState } from '@/store/type';
import * as actions from './actions';
import * as mutations from './mutations';

const state: GlobalState = {
  userInfo: {},
  menuListOrigin: [],
  menuList: [],
  spinner: false,
  apiRequestCount: 0,
  apiResponseCount: 0,
  topBtn: false,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
