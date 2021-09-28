<template>
  <main id="content" class="content-wrapper event">
    <div class="content-head">
      <h2 class="content-title">
        이벤트
      </h2>
    </div>

    <div class="content-inner">
      <tabs @change="tabChange">
        <tab tab-key="Occurred" name="발생" :selected="tabKey==='Occurred'">
          <event-occurred />
        </tab>
        <tab tab-key="Unresolved" name="해제" :selected="tabKey==='Unresolved'">
          <event-unresolved />
        </tab>
        <tab tab-key="Ignore" name="예외" :selected="tabKey==='Ignore'">
          <event-ignore />
        </tab>
      </tabs>
    </div>
  </main>
</template>

<script lang="ts">
import {
  reactive, toRefs, onMounted, computed,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { Tab, Tabs } from '@/components';
import { EventOccurred, EventUnresolved, EventIgnore } from '@/views/event/templates';
import router from '@/router';

export default {
  name: 'Event',
  components: {
    Tab,
    Tabs,
    EventOccurred,
    EventUnresolved,
    EventIgnore,
  },
  props: {
    tabKey: {
      type: String,
      default: 'Occurred',
    },
  },
  setup(props) {
    const { instance } = getInstance();
    const state = reactive({
      occurredRefreshTime: computed(() => instance.$store.state.event.occurred.refreshTime),
      monitoringListData: computed(() => instance.$store.state.event.orgMonitoringList),
    });

    const tabChange = (tabKey) => {
      if (props.tabKey === tabKey) return;
      instance.$store.commit('event/initData');
      if (tabKey === 'Occurred') {
        router.push({ path: '/vue/event', query: { tabKey: 'Occurred' } });
      } else if (tabKey === 'Unresolved') {
        router.push({ path: '/vue/event', query: { tabKey: 'Unresolved' } });
      } else {
        router.push({ path: '/vue/event', query: { tabKey: 'Ignore' } });
      }
    };

    onMounted(async () => {
      // get org data
      instance.$store.dispatch('event/getOrgData');
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
.alert-status .tbl tbody td {
  width: 15%;
}
</style>
