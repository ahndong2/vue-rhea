<template>
  <header class="header">
    <div class="inner">
      <h1 class="logo">
        <router-link :to="{ name: 'Home'}"
                     class="home-link"
                     @click.native="goHome"
        >
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
          <i class="fi fi-rr-sign-out" />
        </a>
      </div>
    </div>
    <nav v-if="menuVisible" class="side-menu">
      <ul class="front">
        <li v-for="menu in menuList" :key="menu.name">
          <router-link v-if="!menu.backOffice"
                       :to="menu.resourceUrl"
                       :class="menu.class"
                       @click.native="toggleMenu"
          >
            {{ menu.name }}
          </router-link>
          <a v-else :href="menu.resourceUrl" :class="menu.class">
            {{ menu.name }}
          </a>
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
import { MENU_INFO } from './constants';

export default defineComponent({
  name: 'GNB',
  props: {
  },
  setup(props, { emit }) {
    const { instance } = getInstance();
    const state = reactive({
      userInfo: computed(() => instance.$store.state.global.userInfo),
      menuListOrigin: computed(() => instance.$store.state.global.menuListOrigin),
      menuList: computed(() => instance.$store.state.global.menuList),
      isAdmin: false,
      menuVisible: false,
    });

    const toggleMenu = ():void => {
      state.menuVisible = !state.menuVisible;
      if (state.menuVisible === false) {
        emit('reload');
      }
    };
    const goHome = ():void => {
      emit('reload');
    };

    const checkMenuVisible = (): boolean => state.menuVisible;

    const setMenuList = () => {
      if (state.menuListOrigin.length === 0) return;
      let menuList = Object.keys(MENU_INFO).map((key) => {
        let menu = MENU_INFO[key];
        [...state.menuListOrigin].filter((m) => m.status === 'ACTIVE').forEach((v) => {
          if (v.name !== menu.name) return;
          menu = { ...menu, ...v };
        });
        return menu;
      });
      if (!state.isAdmin) menuList = menuList.filter((m) => m.name !== 'Admin');
      instance.$store.commit('global/setMenuList', menuList);
    };

    watch(() => state.userInfo, (value) => {
      if (!value) return;
      for (let i = 0; i < value.roleList.length; i++) {
        const val = value.roleList[i];
        if (val.name === 'ADMIN') {
          state.isAdmin = true;
          setMenuList();
        }
      }
    });

    watch(() => state.menuListOrigin, (value) => {
      if (value.length === 0) return;
      setMenuList();
    });

    return {
      ...toRefs(state),
      toggleMenu,
      checkMenuVisible,
      goHome,
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
.side-menu {
  position: fixed;
  top: var(--gnb-height);
  bottom: 0;
  z-index: 100;
  width: 264px;
  text-align: center;
  background-color: var(--white);
  border-right: 1px solid #b4b4b4;
}
.side-menu > ul {
  display: flex;
  flex-direction: column;
}
.side-menu li a {
  display: block;
  padding: 15px 45px 13px;
  text-align: left;
  font-size: 14px;
  background: url(~@/assets/icons/ic_menu_02.png) no-repeat 22px;
  border-bottom: 1px solid #e9e9e9;
}
.side-menu li a:hover {
  font-weight: bold;
}
.side-menu .menu-01 {background-image: url(~@/assets/icons/ic_menu_01.png);}
.side-menu .menu-02 {background-image: url(~@/assets/icons/ic_menu_02.png);}
.side-menu .menu-03 {background-image: url(~@/assets/icons/ic_menu_03.png);}
.side-menu .menu-04 {background-image: url(~@/assets/icons/ic_menu_04.png);}
.side-menu .menu-05 {background-image: url(~@/assets/icons/ic_menu_05.png);}
.side-menu .menu-06 {background-image: url(~@/assets/icons/ic_menu_06.png);}

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
  width: 2rem;
  height: 2rem;
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
  color: #eee;
  border-left: 1px solid rgb(255 255 255 / 15%);
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
