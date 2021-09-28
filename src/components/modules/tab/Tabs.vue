<template>
  <div class="tab-wrapper">
    <nav class="tab-nav">
      <ul>
        <li v-for="(tab, idx) in tabs" :key="idx" :class="['tab', { 'active': tab.isActive }]">
          <a @click="selectTab($event, tab)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
              <template v-if="tab.tabKey === 'Occurred'">
                <path d="M0 0h24v24H0z" fill="none" /><path d="M7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42zm12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42zM18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2v-5zm-6 11c.14 0 .27-.01.4-.04.65-.14 1.18-.58 1.44-1.18.1-.24.15-.5.15-.78h-4c.01 1.1.9 2 2.01 2z" />
              </template>
              <template v-if="tab.tabKey === 'Unresolved'">
                <path d="M0 0h24v24H0z" fill="none" /><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
              </template>
              <template v-if="tab.tabKey === 'Ignore'">
                <path d="M0 0h24v24H0z" fill="none" /><path d="M20 18.69L7.84 6.14 5.27 3.49 4 4.76l2.8 2.8v.01c-.52.99-.8 2.16-.8 3.42v5l-2 2v1h13.73l2 2L21 19.72l-1-1.03zM12 22c1.11 0 2-.89 2-2h-4c0 1.11.89 2 2 2zm6-7.32V11c0-3.08-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68c-.15.03-.29.08-.42.12-.1.03-.2.07-.3.11h-.01c-.01 0-.01 0-.02.01-.23.09-.46.2-.68.31 0 0-.01 0-.01.01L18 14.68z" />
              </template>
            </svg>
            {{ tab.name }}
          </a>
        </li>
      </ul>
    </nav>

    <div class="tabs-details">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs,
} from '@vue/composition-api';
import { getInstance } from '@/composable';

interface Tab {
    isActive?: boolean;
    name?: string;
}
export default defineComponent({
  name: 'Tabs',
  setup(props, { emit }) {
    const { instance } = getInstance();
    const state = reactive({
      tabs: instance.$children as Array<Tab>,
    });

    const selectTab = (e, selectedTab) => {
      e.preventDefault();
      emit('change', selectedTab.tabKey);

      state.tabs.forEach((tab:Tab) => {
        tab.isActive = (tab.name === selectedTab.name);
      });
    };

    return {
      ...toRefs(state),
      selectTab,
    };
  },
});
</script>

<style scoped>
.tab-nav {
  margin-bottom: 3rem;
  box-shadow: inset 0 -2px #e4e4e4;
}
.tab-nav > ul {
  display: inline-flex;
}
.tab-nav .tab {
  position: relative;
  display: inline-block;
  width: 170px;
  padding-bottom: 5px;
  font-size: 19px;
  color: #999;
}
.tab-nav .tab.active {
  box-shadow: inset 0 -3px var(--KB-darkgray);
}
.tab-nav .tab a {
  display: block;
  height: 50px;
  line-height: 50px;
  padding-right: 5px;
  text-align: center;
}
.tab-nav .tab.active a {
  font-weight: 700;
  color: var(--KB-darkgray);
}
.tab-nav .tab svg {
  width: 22px;
  height: 22px;
  vertical-align: -4px;
  fill: currentColor;
}
</style>
