<template>
  <div id="app">
    <GNB ref="gnbRef" @reload="scrollToTop" />
    <div id="container" ref="container" class="container-wrapper" @click="gnbBlurClick">
      <div ref="routerViewWrap">
        <router-view ref="routerView" :key="$route.fullPath" />
      </div>
      <footer class="footer">
        <div class="inner">
          <p>Copyright &copy; KB데이타시스템, All Rights Reserved.</p>
        </div>
      </footer>
    </div>
    <button v-if="topShow" class="btn-top" @click="scrollToTop">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
      </svg>
      <span class="hide">맨위로</span>
    </button>
    <Spinner />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, toRefs, reactive, computed, onMounted, onUpdated,
} from '@vue/composition-api';
import { GNB, Spinner } from '@/components';
import { getInstance } from '@/composable';

declare let ResizeObserver;
export default defineComponent({
  name: 'App',
  components: {
    GNB,
    Spinner,
  },
  setup() {
    const { instance } = getInstance();
    const refs = instance.$refs;
    const state = reactive({
      topShow: computed(() => instance.$store.state.global.topBtn),
    });

    const gnbBlurClick = ():void => {
      if (refs.gnbRef.checkMenuVisible()) {
        refs.gnbRef.toggleMenu();
      }
    };

    const scrollToTop = ():void => {
      refs.container.scrollTo({ top: 0, left: 0 });
    };

    const observerResize = ():void => {
      let timer:number;
      const obsever = new ResizeObserver((entries) => {
        if (timer) {
          clearTimeout(timer);
        }
        // debounce
        timer = setTimeout(() => {
          entries.forEach((entry) => {
            const { height } = entry.contentRect;
            const windowHeight:number = window.innerHeight;
            const headerHeight:number = refs.gnbRef.$el.clientHeight;
            const flag = (windowHeight - headerHeight) < height;

            if (flag !== state.topShow) {
              // 중복 실행 방지
              instance.$store.commit('global/setTopBtn', flag);
            }
          });
        }, 500);
      });

      obsever.observe(instance.$refs.routerViewWrap);
    };

    onMounted(() => {
      const authToken = instance.$cookies.get('X-AUTH-TOKEN');
      if (process.env.NODE_ENV !== 'local' && !authToken) {
        window.location.href = '/loginPage';
      }

      instance.$store.dispatch('global/getAuthInfo');
      instance.$store.dispatch('global/getMenuList');
    });

    onUpdated(() => {
      observerResize();
    });
    return {
      ...toRefs(state),
      gnbBlurClick,
      scrollToTop,
    };
  },
});
</script>
