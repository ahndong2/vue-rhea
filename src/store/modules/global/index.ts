import { GlobalState } from '@/store/type';
import * as actions from './actions';
import * as mutations from './mutations';

const state: GlobalState = {
  userInfo: {},
  spinner: false,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
