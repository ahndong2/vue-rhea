import Vue from 'vue';
import router from '@/router';
import store from '@/store';
import App from '@/App.vue';
import VueCompositionAPI from '@vue/composition-api';
import Fragment from 'vue-fragment';
import VueMoment from 'vue-moment';
import VCalendar from 'v-calendar';
import VueCookies from 'vue-cookies';

Vue.use(VueCompositionAPI);
Vue.use(Fragment.Plugin);
Vue.use(VueMoment);
Vue.use(VCalendar);
Vue.use(VueCookies);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
