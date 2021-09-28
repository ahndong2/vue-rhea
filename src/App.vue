<template>
  <div id="app">
    <GNB ref="gnbRef" />
    <div id="container" class="container-wrapper" @click="gnbBlurClick">
      <router-view />
      <footer class="footer">
        <div class="inner">
          <p>Copyright &copy; KB데이타시스템, All Rights Reserved.</p>
        </div>
      </footer>
    </div>
    <button class="btn-top" @click="scrollToTop">
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
  defineComponent, toRefs, reactive, onMounted,
} from '@vue/composition-api';
import { GNB, Spinner } from '@/components';
import { getInstance } from '@/composable';

export default defineComponent({
  name: 'App',
  components: {
    GNB,
    Spinner,
  },
  setup() {
    const { instance } = getInstance();
    // state
    const state = reactive({
    });

    const gnbBlurClick = ():void => {
      const ref = instance.$refs as any;
      if (ref.gnbRef.checkMenuVisible()) {
        ref.gnbRef.toggleMenu();
      }
    };

    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    onMounted(() => {
      const authToken = instance.$cookies.get('X-AUTH-TOKEN');
      if (process.env.NODE_ENV !== 'local' && !authToken) {
        window.location.href = '/loginPage';
      }
      instance.$store.dispatch('global/getAuthInfo');
    });
    return {
      ...toRefs(state),
      gnbBlurClick,
      scrollToTop,
    };
  },
});
</script>

<style>
</style>
