<template>
  <section id="alertStatus" class="alert-status">
    <hgroup class="section-title">
      <h3>{{ title }}</h3>
      <div v-if="statusType === 0" class="resolved">
        <em class="tit">미확인 해제 건</em>
        <span class="cnt">{{ alertStatusData.clearTotalUnconfirmedCnt > 999 ? '999+' : alertStatusData.clearTotalUnconfirmedCnt }}</span>
      </div>
    </hgroup>
    <div class="section-content">
      <nav ref="tabAlert" class="tab-alert">
        <ul>
          <li v-for="(tab,idx) in ALERT_STATUS_TAB_DATA" :key="idx" class="tab" :class="{'active': activeTab === tab.key}">
            <a @click.prevent="switchTab(tab.key)">
              <em class="tit">{{ tab.name.replace('_', ' ') }}</em>
              <span v-if="statusType !== 2 && alertStatusData[tab.value] > 0" class="cnt">{{ alertStatusData[tab.value] }}</span>
            </a>
          </li>
        </ul>
      </nav>
      <nav v-if="statusType === 2" class="tab-alert fixed" :class="{'active': scrollYN}">
        <ul>
          <li v-for="(tab,idx) in ALERT_STATUS_TAB_DATA" :key="idx" class="tab" :class="{'active': activeTab === tab.key}">
            <a @click.prevent="switchTab(tab.key)">
              <em class="tit">{{ tab.name.replace('_', ' ') }}</em>
            </a>
          </li>
        </ul>
      </nav>

      <fragment v-for="(tab,idx) in ALERT_STATUS_TAB_DATA" :key="idx">
        <alert-status-table v-show="activeTab === tab.key"
                            :alert-status-data="alertStatusData[tab.key]"
                            :table-data="info[tab.key]"
                            :status-type="statusType"
                            @callback="callbackFunc"
        />
      </fragment>
    </div>
  </section>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, computed, onMounted, onUnmounted,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { MONITORING_INFO } from '@/constants';
import { ALERT_STATUS_TAB_DATA } from './constans';
import AlertStatusTable from './AlertStatusTable.vue';

export default defineComponent({
  name: 'AlertStatus',
  components: {
    AlertStatusTable,
  },
  props: {
    alertStatusData: {
      type: Object,
      default: () => {},
    },
    statusType: { // 0 발생 , 1 해제 , 2 모니터링
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const { instance } = getInstance();
    const ref = instance.$refs;

    const state = reactive({
      activeTab: computed(() => instance.$store.state.monitoring.activeType),
      scrollYN: false,
      ALERT_STATUS_TAB_DATA,
      info: computed(() => {
        MONITORING_INFO.CUSTOM_PROMQL = props.alertStatusData.customPromQLList;

        return MONITORING_INFO;
      }),
      title: computed(() => {
        switch (props.statusType) {
          case 0:
            return 'Alert 발생 현황';
          case 1:
            return 'Alert 해제 현황';
          default:
            return 'Alert 현황';
        }
      }),
    });

    const callbackFunc = (data) => {
      emit('callback', data);
    };

    const switchTab = (type) => {
      instance.$store.commit('monitoring/setActiveType', type);
    };

    const handleScroll = (e) => {
      const scrollTop = e.target.scrollTop;
      const tabTop = ref.tabAlert.getBoundingClientRect().top + scrollTop;
      state.scrollYN = scrollTop > tabTop;
    };

    onMounted(():void => {
      const container = document.getElementById('container') as HTMLElement;
      container.addEventListener('scroll', handleScroll);

      // 예외 처리
      const data = JSON.parse(JSON.stringify(state.info.K8S));
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (value.searchType === 'PodCPU' || value.searchType === 'PodMemory') {
          delete data[key];
        }
      });
      state.info.K8S = data;
    });
    onUnmounted(():void => {
      const container = document.getElementById('container') as HTMLElement;
      container.removeEventListener('scroll', handleScroll);
    });
    return {
      ...toRefs(state),
      callbackFunc,
      switchTab,
      handleScroll,
    };
  },
});
</script>

<style scoped>
.section-title {
  display: flex;
  align-items: center;
}
.resolved {
  position: relative;
  margin-left: 15px;
  font-weight: normal;
  font-size: 15px;
  color: #757575;
}
.resolved .cnt {
  margin-left: .5rem;
  padding: 3px 7px 1px;
  font-size: 12px;
  color: #fff;
  letter-spacing: .5px;
  background-color: var(--KB-silver);
  border-radius: 20px;
}

.tab-alert {
  padding-top: 5px;
  padding-bottom: 1.5rem;
}
.tab-alert.fixed {
  top: 0;
  left: 0;
  width: 100%;
  padding-bottom: 5px;
  background-color: rgb(247 247 247 / 90%);
  box-shadow: 0px 1px 1px rgb(0 0 0 / 10%);
  opacity: 0;
  z-index: 50;
  transition: .1s;
}
.tab-alert.active {
  top: var(--gnb-height);
  opacity: 1;
}
.tab-alert > ul {
  display: flex;
  flex-wrap: wrap;
  max-width: var(--inner-width);
  margin: -0.25rem;
}
.tab-alert.fixed > ul {
  padding: 0 1.5rem;
}
.tab-alert .tab {
  margin: 0.25rem;
}
.tab-alert .tab a {
  display: flex;
  min-width: 7.5rem;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  padding: 3px 1.25rem 0;
  color: #888;
  background-color: #eee;
  border-radius: 0.375rem;
}
.tab-alert .tab.active a {
  color: #fff;
  background-color: #12a7db;
}
.tab-alert .tab .tit {
  font-size: 13px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.tab-alert .tab .cnt {
  padding: 0px 0 0 0.375rem;
  font-size: 12px;
  color: #666;
}
.tab-alert .tab.active .cnt {
  color: #f8f99e;
}
</style>
