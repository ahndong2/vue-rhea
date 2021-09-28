<template>
  <div class="controls">
    <select-box id="selectSearchDuring" name="searchDuring" class="mr-4 rounded-md"
                :value="searchDuring" :options="selectSearchDuring" @change="changeSelectBox"
    />
    <button title="새로고침" class="btn-refresh rounded-l-md" @click="changeSelectBox">
      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
      </svg>
    </button>
    <select-box id="selectRefreshTime" name="refreshTime" title="새로고침 주기" class="rounded-r-md"
                :value="refreshTime" :options="selectRefreshTime" @change="changeSelectBox"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, computed,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { SelectBox } from '@/components';
import { SELECT_OPTIONS } from '@/views/event/constants';
import { setLocalStorage, apiSchedule } from '@/utils';

export default defineComponent({
  name: 'EventRefresh',
  components: {
    SelectBox,
  },
  props: {
    type: {
      type: String,
      default: 'Occurred',
    },
  },
  setup(props) {
    const { instance } = getInstance();
    const {
      REFRESH_TIME, SEARCH_DURING,
    } = SELECT_OPTIONS;

    // state
    const state = reactive({
      selectSearchDuring: computed(() => (props.type === 'Occurred' ? SEARCH_DURING : SEARCH_DURING.slice(0, -1))),
      selectRefreshTime: REFRESH_TIME,
      refreshTime: computed(() => (props.type === 'Occurred' ? instance.$store.state.event.occurred.refreshTime : instance.$store.state.event.unresolved.refreshTime)),
      searchDuring: computed(() => (props.type === 'Occurred' ? instance.$store.state.event.occurred.searchDuring : instance.$store.state.event.unresolved.searchDuring)),
    });

    const changeSelectBox = (e) => {
      const data = {
        refreshTime: state.refreshTime,
        searchDuring: state.searchDuring,
        [e.target.name]: Number(e.target.value),
      } as {
        refreshTime?: number;
        searchDuring?: number;
        undefined?: number;
      };
      delete data.undefined;

      if (props.type === 'Occurred') {
        instance.$store.commit('event/setOccurred', data);
        apiSchedule({ name: 'Event', query: { tabKey: 'Occurred' } });
      } else {
        instance.$store.commit('event/setUnresolved', data);
        apiSchedule({ name: 'Event', query: { tabKey: 'Unresolved' } });
      }

      // localstorage
      const localStorageData = {
        occurred: {
          refreshTime: instance.$store.state.event.occurred.refreshTime,
          searchDuring: instance.$store.state.event.occurred.searchDuring,
        },
        unresolved: {
          refreshTime: instance.$store.state.event.unresolved.refreshTime,
          searchDuring: instance.$store.state.event.unresolved.searchDuring,
        },
      };
      setLocalStorage('rhea/event', localStorageData);
    };

    return {
      ...toRefs(state),
      changeSelectBox,
    };
  },
});
</script>

<style scoped>
</style>
