<template>
  <div class="panel">
    <div class="panel-header">
      <span class="panel-title">{{ title }}</span>
    </div>
    <div class="panel-content">
      <div class="cnt-list">
        <dl v-for="(item,idx) in countData" :key="idx" :class="item.class">
          <dt class="tit">
            {{ item.label }}
          </dt>
          <dd class="cnt">
            {{ item.count }}
          </dd>
        </dl>
      </div>
      <div class="dot-list">
        <indicator v-for="(indicator, j) in disableList" :key="`n${j}`"
                   :tooltip="indicator[tooptipKey]" class="text-red-500"
        />
        <indicator v-for="(indicator, j) in ableList" :key="`y${j}`"
                   :tooltip="indicator[tooptipKey]" :class="indicator | ableClassObj(type)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, computed,
} from '@vue/composition-api';
import { Indicator } from '@/components';

export default defineComponent({
  name: 'KubernetesPanel',
  components: {
    Indicator,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    countData: {
      type: Array,
      default: () => [],
    },
    ableList: {
      type: Array,
      default: () => [],
    },
    disableList: {
      type: Array,
      default: () => [],
    },
  },
  filters: {
    ableClassObj: (indicator, type) => {
      switch (type) {
        case 'pod':
          return indicator.phase.includes('Succeeded') ? 'text-green-700' : 'text-green-500';
        default:
          return 'text-green-500';
      }
    },
  },
  setup(props) {
    const state = reactive({
      tooptipKey: computed(() => {
        switch (props.type) {
          case 'pv':
            return 'persistentvolume';
          default:
            return props.type;
        }
      }),
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped>
.cnt-list {
  overflow: hidden;
  display: flex;
  flex-direction: row;
  padding: 12px 0;
  color: var(--gray);
  background: rgb(238 238 238 / 20%);
}
.cnt-list > dl {
  position: relative;
  flex: 1;
  text-align: center;
}
.cnt-list > dl:not(:first-child)::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 1px;
  height: 2.5rem;
  transform: translateY(-50%);
  background: #eee;
  content: ' ';
}
.cnt-list .tit {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  padding: 0 1rem;
  line-height: 1.1;
  font-family: 'KBFGTextL';
  font-size: 13px;
  color: var(--KB-silver);
  word-break: keep-all;
}
.cnt-list .cnt {
  overflow: hidden;
  font-size: 14px;
  white-space: nowrap;
}
.dot-list {
  display: flex;
  flex-wrap: wrap;
  max-width: calc(100% - 2rem);
  margin: 0.9rem auto 1rem;
}
</style>
