<template>
  <main id="content" class="content-wrapper event">
    <div class="content-head">
      <h2 class="content-title">
        이벤트
      </h2>
    </div>

    <div class="content-inner">
      <tabs :tab-list="tabList" :active-idx="activeIdx" class="tab-event__main" @change="tabChange">
        <!-- Occurred -->
        <template #Occurred-icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" /><path d="M7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42zm12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42zM18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2v-5zm-6 11c.14 0 .27-.01.4-.04.65-.14 1.18-.58 1.44-1.18.1-.24.15-.5.15-.78h-4c.01 1.1.9 2 2.01 2z" />
          </svg>
        </template>
        <template #Occurred-body>
          <event-occurred />
        </template>
        <!-- Unresolved -->
        <template #Unresolved-icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" /><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
          </svg>
        </template>
        <template #Unresolved-body>
          <event-unresolved />
        </template>
        <!-- Ignore -->
        <template #Ignore-icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" /><path d="M20 18.69L7.84 6.14 5.27 3.49 4 4.76l2.8 2.8v.01c-.52.99-.8 2.16-.8 3.42v5l-2 2v1h13.73l2 2L21 19.72l-1-1.03zM12 22c1.11 0 2-.89 2-2h-4c0 1.11.89 2 2 2zm6-7.32V11c0-3.08-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68c-.15.03-.29.08-.42.12-.1.03-.2.07-.3.11h-.01c-.01 0-.01 0-.02.01-.23.09-.46.2-.68.31 0 0-.01 0-.01.01L18 14.68z" />
          </svg>
        </template>
        <template #Ignore-body>
          <event-ignore />
        </template>
        <!-- Unknown -->
        <template #Unknown-icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0V0z" fill="none" /><path d="M18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-5 0h-2v-2h2v2zm0-4h-2V8h2v4zm-1 10c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2z" />
          </svg>
        </template>
        <template #Unknown-body>
          <event-unknown />
        </template>
        <template #Unknown-count>
          <em v-if="unknownCount > 0" class="cnt">{{ unknownCount > 999 ? '999+' : unknownCount }}</em>
        </template>
      </tabs>
    </div>
  </main>
</template>

<script lang="ts">
import {
  reactive, toRefs, onMounted, computed,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { Tabs } from '@/components';
import {
  EventOccurred, EventUnresolved, EventIgnore, EventUnknown,
} from '@/views/event/templates';
import router from '@/router';
import { EVENT_TAB } from '../constants';

export default {
  name: 'Event',
  components: {
    Tabs,
    EventOccurred,
    EventUnresolved,
    EventIgnore,
    EventUnknown,
  },
  setup() {
    const { instance } = getInstance();
    const state = reactive({
      tabKey: instance.$route.params.tabKey || 'Occurred',
      tabList: EVENT_TAB,
      activeIdx: computed(() => state.tabList.findIndex((v) => state.tabKey === v.key)),
      unknownCount: computed(() => instance.$store.state.event.unknownCount),
    });

    const tabChange = (idx:number, tabKey:string):void => {
      if (state.tabKey === tabKey) return;
      state.tabKey = tabKey;
      instance.$store.commit('event/initData');

      router.replace({ params: { tabKey } }).catch(() => {});
    };

    onMounted(async ():Promise<void> => {
      // get org data
      instance.$store.dispatch('event/getOrgData');
      instance.$store.dispatch('event/getUnknownCount');
    });

    return {
      ...toRefs(state),
      tabChange,
    };
  },
};
</script>

<style scoped>
.content-inner {
  margin-top: -1rem;
}
</style>
