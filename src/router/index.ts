import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { apiSchedule } from '@/utils';

// import DashBoard from '@/views/dashboard/pages/Dashboard.vue';
// import Event from '@/views/event/pages/Event.vue';
// import Monitoring from '@/views/monitoring/pages/Monitoring.vue';
// import NoticeList from '@/views/notice/pages/NoticeList.vue';

const DashBoard = () => import(/* webpackChunkName: "DashBoard" */ '@/views/dashboard/pages/Dashboard.vue');
const Event = () => import(/* webpackChunkName: "Event" */ '@/views/event/pages/Event.vue');
const Monitoring = () => import(/* webpackChunkName: "Monitoring" */ '@/views/monitoring/pages/Monitoring.vue');
const NoticeList = () => import(/* webpackChunkName: "NoticeList" */ '@/views/notice/pages/NoticeList.vue');

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/vue/dashboard',
  },
  {
    path: '/vue/dashboard',
    name: 'DashBoard',
    component: DashBoard,
  },
  {
    path: '/vue/event',
    name: 'Event',
    component: Event,
    props: ({ query }) => ({
      tabKey: query.tabKey,
    }),
  },
  {
    path: '/vue/monitoring',
    name: 'Monitoring',
    component: Monitoring,
  },
  {
    path: '/vue/notice',
    name: 'Notice',
    component: NoticeList,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  // if (from.name) {
  //   apiSchedule(to);
  // }
  apiSchedule(to);
  next();
});

export default router;
