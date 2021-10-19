import { GlobalState } from '@/store/type';
import * as actions from './actions';
import * as mutations from './mutations';

const state: GlobalState = {
  userInfo: {},
  menuListOrigin: [],
  menuList: [],
  spinner: false,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
