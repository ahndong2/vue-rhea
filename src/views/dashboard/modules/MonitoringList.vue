<template>
  <div class="section-content">
    <div v-if="monitoringListData.length === 0"
         class="empty"
    >
      모니터링 목록이 없습니다.
    </div>
    <dl v-for="(org,i) in monitoringListData" v-else :key="i"
        class="accordion-item depth-1"
        :class="{
          'active': org.active,
          'disabled': org.prometheuses.length === 0 || org.prometheusesUseYnCnt === 0
        }"
    >
      <dt v-if="org.useYn === 'Y'" class="accordion-header" @click.stop="activeAccordion(i)">
        <div class="left-part">
          <strong class="tit">{{ org.fullName || org.name }}</strong>
        </div>
        <button type="button" :disabled="org.prometheuses.length === 0 || org.prometheusesUseYnCnt === 0" class="btn-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
          </svg>
        </button>
      </dt>
      <dd v-if="org.useYn === 'Y' && org.prometheusesUseYnCnt > 0" class="accordion-content">
        <dl v-for="(prometheus,j) in org.prometheuses" :key="j"
            class="accordion-item depth-2"
            :class="{
              'active': prometheus.active && prometheus.groupinfoUseYnCnt > 0,
              'disabled': prometheus.groupinfo.length === 0 || prometheus.groupinfoUseYnCnt === 0
            }"
        >
          <dt v-if="prometheus.useYn==='Y'"
              class="accordion-header flex-col sm:flex-row"
              @click.stop="activeAccordion(i,j)"
          >
            <div class="left-part">
              <info :title="prometheus.name" :content="prometheus.description" :mouse-event="true" />
            </div>
            <div class="right-part">
              <a v-if="!(prometheus.grafanaLink === null || prometheus.grafanaLink === 'null')"
                 title="그라파나 바로가기" class="link g" @click.stop.prevent="moveLink(prometheus.grafanaLink)"
              >
                <img src="@/assets/icons/ic_grafana.svg" alt="">
                <span class="text">Grafana</span>
              </a>
              <router-link :to="{ name: 'Monitoring', params: {org: org.id, prom: prometheus.id, parent: org.parentId}}"
                           title="모니터링 바로가기"
                           class="link"
              >
                <i class="fi fi-rr-zoom-in" />
                <span class="text">Details</span>
              </router-link>
            </div>
            <button type="button" :disabled="prometheus.groupinfo.length === 0 || prometheus.groupinfoUseYnCnt === 0" class="btn-toggle">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
              </svg>
            </button>
          </dt>
          <dd v-if="prometheus.useYn==='Y' && prometheus.groupinfoUseYnCnt > 0" class="accordion-content">
            <ul class="group-list">
              <li v-for="(groupinfo,k) in prometheus.groupinfo.filter((p) => p.useYn === 'Y')" :key="k">
                <span>{{ groupinfo.projectName }}</span>
                {{ groupinfo.projectName && groupinfo.groupName ? '_' : '' }}
                <span>{{ groupinfo.groupName }}</span>
                {{ groupinfo.groupName && groupinfo.jobName ? '_' : '' }}
                <span>{{ groupinfo.jobName }}</span>
              </li>
            </ul>
          </dd>
        </dl>
      </dd>
    </dl>
  </div>
</template>

<script lang="ts">
import {
  computed, reactive, toRefs,
} from '@vue/composition-api';
import { Info } from '@/components';
import { MonitoringListType } from '@/views/dashboard/type';

interface Props {
  monitoringData?: MonitoringListType[]
}

export default {
  name: 'MonitoringList',
  components: {
    Info,
  },
  props: {
    monitoringData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props:Props, { emit }) {
    const state = reactive({
      monitoringListData: computed(() => props.monitoringData),
    });
    const activeAccordion = (i:number, j:number):void => {
      emit('update', i, j);
    };
    const moveLink = (link):void => {
      let url = 'https://screen.digitalkds.co.kr';
      if (!(link === null || link === 'null')) {
        url = link;
      }
      window.open(url);
    };
    return {
      ...toRefs(state),
      activeAccordion,
      moveLink,
    };
  },
};
</script>

<style scoped>
.monitoring .empty {
  text-align: center;
  line-height: 3rem;
  color: var(--gray);
}
.accordion-item.depth-1 {
  position: relative;
  margin-bottom: 1rem;
  background-color: #fff;
  box-shadow: 0 0 2px 0 rgb(0 0 0 / 7%);
  border-radius: 0.25rem;
}
.accordion-item.depth-2.active:not(:last-child) {
  padding-bottom: 0.5rem;
  border-bottom-width: 1px;
  margin-bottom: 0.5rem;
}

.accordion-header {
  position: relative;
  display: flex;
  height: 3rem;
}
.accordion-item.depth-1.active > .accordion-header {
  background-color: var(--KB-gray);
  color: #fff;
  border-radius: 5px 5px 0 0;
}
.accordion-item.depth-1 > .accordion-header {
  height: 3.25rem;
}
.accordion-item.depth-2 > .accordion-header {
  font-size: 15px;
}
.accordion-header .tit {
  padding-top: 2px;
  font-weight: normal;
  font-size: 15px;
}
.accordion-item.disabled .tit,
.accordion-item.disabled .info-item::v-deep .tit {
  color: var(--gray);
}

.accordion-content {
  display: none;
}
.accordion-item.depth-1 > .accordion-content {
  padding: 0.5rem 0;
}
.accordion-item.active > .accordion-content {
  display: block;
}

.monitoring .left-part {
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 1.5rem;
}
.monitoring .right-part {
  display: flex;
  align-items: center;
  margin-right: 4rem;
  margin-left: auto;
}

.group-list {
  padding: 0 3rem 1rem;
}
.group-list li {
  position: relative;
  display: flex;
  height: 30px;
  font-size: 15px;
  line-height: 30px;
  padding-left: 1rem;
}
.group-list li::before {
  content: ' ';
  position: absolute;
  top: calc(50% - 1px);
  left: 0;
  width: 4px;
  height: 4px;
  background: var(--KB-positive);
}

.monitoring .link {
  display: inline-flex;
  align-items: center;
  margin: 0 0.5rem;
  font-size: 14px;
  color: #757575;
}
.monitoring .link.g {
  color: var(--grafana);
}
.monitoring .link img {
  width: 16px;
  height: 16px;
  margin-right: 0.25rem;
}
.monitoring .link .fi {
  margin-right: 0.25rem;
}
.monitoring .link:hover .text {
  text-decoration: underline;
}

.btn-toggle {
  position: absolute;
  right: 0;
  top: 0;
  width: 4rem;
  height: 100%;
}
.btn-toggle:disabled {
  color: var(--lightgray);
}
.btn-toggle svg {
  fill: currentColor;
  transition: .3s;
}
.accordion-item.active > .accordion-header > .btn-toggle svg {
  transform: rotate(180deg);
}
</style>
