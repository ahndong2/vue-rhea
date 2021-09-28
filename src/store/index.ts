import Vue from 'vue';
import Vuex from 'vuex';
import plugins from './plugins';
import global from './modules/global';
import dashboard from './modules/dashboard';
import board from './modules/board';
import event from './modules/event';
import monitoring from './modules/monitoring';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    global,
    dashboard,
    board,
    event,
    monitoring,
  },
  plugins,
});

export default store;
