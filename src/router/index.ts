import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { apiSchedule } from '@/utils';

const DashBoard = () => import(/* webpackChunkName: "DashBoard" */ '@/views/dashboard/pages/Dashboard.vue');
const Event = () => import(/* webpackChunkName: "Event" */ '@/views/event/pages/Event.vue');
const Monitoring = () => import(/* webpackChunkName: "Monitoring" */ '@/views/monitoring/pages/Monitoring.vue');

const NoticeList = () => import(/* webpackChunkName: "NoticeList" */ '@/views/notice/pages/NoticeList.vue');
const NoticeWrite = () => import(/* webpackChunkName: "NoticeWrite" */ '@/views/notice/pages/NoticeWrite.vue');
const NoticeDetail = () => import(/* webpackChunkName: "NoticeDetail" */ '@/views/notice/pages/NoticeDetail.vue');
const NoticeEdit = () => import(/* webpackChunkName: "NoticeEdit" */ '@/views/notice/pages/NoticeEdit.vue');

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
    props: ({ params }) => ({
      tabKey: params.tabKey,
    }),
  },
  {
    path: '/vue/monitoring',
    name: 'Monitoring',
    component: Monitoring,
    props: ({ params }) => ({
      org: String(params.org || ''),
      prom: String(params.prom || ''),
      group: String(params.group || ''),
      parent: String(params.parent || ''),
    }),
  },
  {
    path: '/vue/notice',
    name: 'NoticeList',
    component: NoticeList,
  },
  {
    path: '/vue/notice/write',
    name: 'NoticeWrite',
    component: NoticeWrite,
  },
  {
    path: '/vue/notice/:postId',
    name: 'NoticeDetail',
    component: NoticeDetail,
  },
  {
    path: '/vue/notice/write/:postId',
    name: 'NoticeEdit',
    component: NoticeEdit,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior() {
    const container = document.getElementById('container') as HTMLElement;
    container.scrollTo({ top: 0, left: 0 });
    return { x: 0, y: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  apiSchedule(to);
  next();
});

export default router;
