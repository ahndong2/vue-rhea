<template>
  <div class="tab-wrapper">
    <nav class="tab-nav">
      <ul class="tab-list">
        <li v-for="(tab, index) in tabList" :key="index" class="tab" :class="{'active': index === activeTabIdx}">
          <a class="btn" @click="selectTab($event, index)">
            <slot :name="`${tab.key}-icon`" />
            <span class="text">
              {{ tab.value }}
            </span>
            <slot :name="`${tab.key}-count`" />
          </a>
        </li>
      </ul>
    </nav>

    <div class="tabs-details">
      <template v-for="(tab, index) in tabList">
        <div v-if="index === activeTabIdx" :key="index">
          <slot :name="`${tab.key}-body`" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs,
} from '@vue/composition-api';

interface TabList {
  key?: string;
  value?: string;
}
export default defineComponent({
  name: 'Tabs',
  props: {
    tabList: {
      type: Array,
      default: () => [],
    },
    activeIdx: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      activeTabIdx: props.activeIdx,
    });

    const selectTab = (e, idx) => {
      e.preventDefault();
      state.activeTabIdx = idx;
      const tList = props.tabList as TabList;
      emit('change', idx, tList[idx].key);
    };

    return {
      ...toRefs(state),
      selectTab,
    };
  },
});
</script>

<style scoped>
.tab-event__main > .tab-nav {
  margin-bottom: 3rem;
  box-shadow: inset 0 -2px #e4e4e4;
}
.tab-event__main > .tab-nav .tab-list {
  display: flex;
}
.tab-event__main > .tab-nav .tab {
  position: relative;
  padding-bottom: 5px;
  color: var(--gray);
}
.tab-event__main > .tab-nav .tab.active {
  box-shadow: inset 0 -3px var(--KB-darkgray);
}
.tab-event__main > .tab-nav .tab .btn {
  display: flex;
  height: 3rem;
  padding: 0 3rem;
  text-align: center;
  align-items: center;
  justify-content: center;
}
.tab-event__main > .tab-nav .tab.active .btn {
  font-weight: bold;
  color: var(--KB-darkgray);
}
.tab-event__main > .tab-nav .tab svg {
  width: 21px;
  height: 21px;
  margin-right: 5px;
  fill: currentColor;
}
.tab-event__main > .tab-nav .tab .text {
  position: relative;
  padding-top: 2px;
  font-size: 17px;
  white-space: nowrap;
}
.tab-event__main > .tab-nav .tab .cnt {
  margin-left: 0.375rem;
  padding: 2px 0.5rem 0;
  font-weight: normal;
  font-size: 12px;
  color: #fff;
  background: var(--rhea);
  border-radius: 1rem;
}

.tab-event__detail > .tab-nav {
  margin-bottom: 1rem;
}
.tab-event__detail > .tab-nav .tab-list {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab-event__detail > .tab-nav .tab {
  flex-basis: calc(50% - 0.5rem);
}
.tab-event__detail > .tab-nav .tab .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  padding: 2px 1.5rem 0;
  font-size: 15px;
  border-width: 1px;
  border-color: rgb(0 0 0 / 15%);
  border-radius: 5px;
  color: #999;
}
.tab-event__detail > .tab-nav .tab.active .btn {
  color: white;
  background-color: var(--KB-gray);
}
</style>
