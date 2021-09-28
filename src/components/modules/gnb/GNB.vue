<template>
  <header class="header">
    <div class="inner">
      <h1 class="logo">
        <router-link :to="{ path: '/'}" replace class="home-link">
          <b>Rhea</b> 통합 모니터링 시스템
        </router-link>
      </h1>
      <button type="button" class="btn-menu" :class="{'active': menuVisible}"
              @click="toggleMenu"
      >
        <span class="hide">메뉴</span>
      </button>
      <div class="util">
        <span v-if="userInfo.name" class="user">
          {{ userInfo.department }} {{ userInfo.name }} {{ userInfo.position }}님
        </span>
        <a href="/logout" class="btn-logout" title="로그아웃">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="#eee">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </svg>
        </a>
      </div>
    </div>
    <nav v-if="menuVisible" class="gnb">
      <ul class="front">
        <li class="home">
          <router-link :to="{ path: '/'}" @click.native="toggleMenu">
            Home
          </router-link>
        </li>
        <li class="event">
          <router-link :to="{ path: '/vue/event',query: { tabKey: 'Occurred' }}" @click.native="toggleMenu">
            이벤트
          </router-link>
        </li>
        <li class="monitoring">
          <router-link :to="{ path: '/vue/monitoring'}" @click.native="toggleMenu">
            모니터링
          </router-link>
        </li>
        <li class="notice">
          <router-link :to="{ path: '/vue/notice'}" @click.native="toggleMenu">
            공지사항
          </router-link>
        </li>
        <!-- 어드민 -->
        <li v-if="isAdmin" class="admin">
          <a href="/backoffice/main">Admin</a>
        </li>
        <li class="password">
          <a href="/user/change/my-password">PW변경</a>
        </li>
        <li class="logout">
          <a href="/logout">로그아웃</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, computed, watch,
} from '@vue/composition-api';
import { getInstance } from '@/composable';

export default defineComponent({
  name: 'GNB',
  props: {
  },
  setup() {
    const { instance } = getInstance();
    const state = reactive({
      userInfo: computed(() => instance.$store.state.global.userInfo),
      isAdmin: false,
      menuVisible: false,
    });

    const toggleMenu = ():void => {
      state.menuVisible = !state.menuVisible;
    };

    const checkMenuVisible = (): boolean => state.menuVisible;

    watch(() => state.userInfo, (value) => {
      if (!value) return;
      for (let i = 0; i < value.roleList.length; i++) {
        const val = value.roleList[i];
        if (val.name === 'ADMIN') {
          state.isAdmin = true;
        }
      }
    });
    return {
      ...toRefs(state),
      toggleMenu,
      checkMenuVisible,
    };
  },
});
</script>

<style>
.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  background-image: linear-gradient(to right, #444 0%, #444 100%);
  background-repeat: no-repeat;
  background-position: left top;
  background-size: 100% var(--gnb-height);
}
.header .inner {
  display: flex;
  max-width: var(--inner-width);
  height: var(--gnb-height);
  margin: 0 auto;
  padding: 0 1.5rem;
}
.header .gnb {
  position: fixed;
  top: var(--gnb-height);
  bottom: 0;
  z-index: 100;
  width: 264px;
  text-align: center;
  background-color: var(--white);
  border-right: 1px solid #b4b4b4;
}
.gnb > ul {
  display: flex;
  flex-direction: column;
}
.gnb li a {
  display: block;
  padding: 15px 45px;
  text-align: left;
  background-repeat: no-repeat;
  background-position: 22px;
  border-bottom: 1px solid #e9e9e9;
}
.gnb li a:hover {
  font-weight: 700;
}
.gnb li.home a {
  background-image: url(~@/assets/icons/ic_home.svg);
  background-position: 20px;
  background-size: 16px;
}
.gnb li.event a {
  background-image: url(~@/assets/icons/ic_notifications.svg);
  background-position: 20px;
  background-size: 17px 16px;
}
.gnb li.monitoring a {
  background-image: url(~@/assets/icons/ic_monitor.svg);
  background-position: 21px;
  background-size: 15px 16px;
}
.gnb li.notice a {
  background-image: url(~@/assets/icons/ic_volume.svg);
  background-position: 23px;
  background-size: 13px 14px;
}
.gnb li.admin a {
  background-image: url(~@/assets/icons/ic_settings.svg);
  background-size: 16px;
}
.gnb li.password a {
  background-image: url(~@/assets/icons/ic_edit.svg);
  background-position: 21px;
  background-size: 15px;
}
.gnb li.logout a {
  background-image: url(~@/assets/icons/ic_logout.svg);
  background-size: 15px;
}

.logo {
  display: flex;
  align-items: center;
  margin: 0 auto;
}
.home-link {
  position: relative;
  /* padding-left: 35px; */
  font-size: 21px;
  color: var(--white);
}
.home-link b {
  font-size: 23px;
  vertical-align: -1px;
}
.home-link::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  background-repeat: no-repeat;
  background-position: left 2px center;
  background-image: url(~@/assets/images/bi.svg);
  background-size: auto 90%;
  /* content: ' '; */
}

.header .btn-menu,
.header .btn-logout {
  width: 56px;
  height: 54px;
}
.header .btn-menu {
  position: absolute;
  top: 0;
  left: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23fff'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z'/%3E%3C/svg%3E");
  background-size: 22px 28px;
  border-right: 1px solid rgb(255 255 255 / 15%);
}
.header .btn-menu.active {
  background-color: rgb(239 180 73);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23fff'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
  background-size: 28px;
}
.header .btn-logout {
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid rgb(255 255 255 / 15%);
}
.header .btn-logout svg {
  width: 20px;
  height: 20px;
}

.util {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  height: 100%;
  align-items: center;
  color: var(--white);
}
.util .user {
  margin-right: 28px;
  font-size: 15px;
  cursor: default;
}
</style>
