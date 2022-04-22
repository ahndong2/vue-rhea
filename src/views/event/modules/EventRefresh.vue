<template>
  <div class="controls">
    <select-box id="searchDuring" name="searchDuring" title="검색 기간" class="mr-4 rounded-md"
                :value="searchDuring" :options="selectSearchDuring" @change="changeSelectBox"
    />
    <button id="refresh" title="새로고침" class="btn-refresh rounded-l-md" @click="changeSelectBox">
      <i class="fi fi-rr-rotate-right" />
    </button>
    <select-box id="refreshTime" name="refreshTime" title="새로고침 주기" class="rounded-r-md"
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

interface Props {
  type?: string;
}
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
  setup(props:Props) {
    const { instance } = getInstance();
    const {
      REFRESH_TIME, SEARCH_DURING,
    } = SELECT_OPTIONS;

    const state = reactive({
      selectSearchDuring: computed(() => (
        props.type === 'Occurred'
          ? SEARCH_DURING.filter((item) => item.value !== 2880 && item.value !== 4320)
          : SEARCH_DURING.slice(5, -1)
      )),
      selectRefreshTime: REFRESH_TIME,
      refreshTime: computed(() => (
        props.type === 'Occurred'
          ? instance.$store.state.event.occurred.refreshTime
          : instance.$store.state.event.unresolved.refreshTime
      )),
      searchDuring: computed(() => (
        props.type === 'Occurred'
          ? instance.$store.state.event.occurred.searchDuring
          : instance.$store.state.event.unresolved.searchDuring
      )),
    });

    const animateRefresh = ():void => {
      const refresh = document.querySelector('#refresh') as HTMLElement;
      refresh.classList.add('on');
      setTimeout(() => { refresh.classList.remove('on'); }, 1000);
    };

    const changeSelectBox = (e:Event):void => {
      const data = {
        refreshTime: state.refreshTime,
        searchDuring: state.searchDuring,
        [(e.target as HTMLInputElement).name]: Number((e.target as HTMLInputElement).value),
        page: 1,
      } as {
        refreshTime?: number;
        searchDuring?: number;
        undefined?: number;
        page?: number;
      };
      delete data.undefined;

      if (props.type === 'Occurred') {
        instance.$store.commit('event/setOccurred', data);
      } else {
        instance.$store.commit('event/setUnresolved', data);
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

      apiSchedule({ name: 'Event', params: { tabKey: props.type } });
      animateRefresh();
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
