<template>
  <div class="section-content">
    <div v-if="monitoringListData.length === 0"
         class="empty"
    >
      모니터링 목록이 없습니다.
    </div>

    <dl v-for="(org,i) in monitoringListData" v-else :key="i"
        :class="['accordion-item depth-1', {'active': org.active}]"
    >
      <dt v-if="org.useYn === 'Y'" class="accordion-header" @click.stop="activeAccordion(i)">
        <div class="left-part">
          <strong class="tit">{{ org.name }}</strong>
        </div>
        <button type="button" class="btn-toggle" :disabled="org.prometheuses.length === 0 || org.prometheusesUseYnCnt === 0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
          </svg>
        </button>
      </dt>
      <dd v-if="org.useYn === 'Y' && org.prometheusesUseYnCnt > 0" class="accordion-content">
        <dl v-for="(prometheus,j) in org.prometheuses" :key="j"
            :class="['accordion-item depth-2', {'active': prometheus.active && prometheus.groupinfo.length > 0 }]"
        >
          <dt v-if="prometheus.useYn==='Y'" class="accordion-header" @click.stop="activeAccordion(i,j)">
            <div class="left-part">
              <info :title="prometheus.name" :content="prometheus.description" :mouse-event="true" />
            </div>
            <div class="right-part">
              <a v-if="!(prometheus.grafanaLink === null || prometheus.grafanaLink === 'null')"
                 title="그라파나 바로가기" class="link g" @click.stop.prevent="moveLink(prometheus.grafanaLink)"
              >
                <img src="@/assets/icons/ic_grafana.svg" alt="">
                <span>Grafana</span>
              </a>
              <router-link :to="{ name: 'Monitoring', query: {org: org.id, prom: prometheus.id}}" replace class="link">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" />
                </svg>
                <span>Details</span>
              </router-link>
            </div>
            <button :disabled="prometheus.groupinfo.length === 0 || prometheus.groupinfoUseYnCnt === 0" type="button" class="btn-toggle">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
              </svg>
            </button>
          </dt>
          <dd v-if="prometheus.useYn==='Y' && prometheus.groupinfoUseYnCnt > 0" class="accordion-content">
            <ul class="group-list">
              <li v-for="(groupinfo,k) in prometheus.groupinfo" :key="k">
                <div v-if="groupinfo.useYn === 'Y'" class="left-part">
                  <dl v-if="groupinfo.groupName">
                    <dt class="label">
                      Group
                    </dt>
                    <dd class="name">
                      {{ groupinfo.groupName }}
                    </dd>
                  </dl>
                  <dl v-if="groupinfo.jobName">
                    <dt class="label">
                      Job
                    </dt>
                    <dd class="name">
                      {{ groupinfo.jobName }}
                    </dd>
                  </dl>
                </div>
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

interface PropsType {
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
  setup(props:PropsType, { emit }) {
    const state = reactive({
      monitoringListData: computed(() => props.monitoringData),
    });

    const activeAccordion = (i:number, j:number) => {
      emit('update', i, j);
    };
    const moveLink = (link) => {
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
/* Monitoring */
.monitoring .empty {
  text-align: center;
  line-height: 50px;
  color: #999;
}
.accordion-item.depth-1 {
  position: relative;
  margin-bottom: 15px;
  background-color: #fff;
  box-shadow: 0 0 2px 0 rgb(0 0 0 / 7%);
  border-radius: 5px;
}

.accordion-header {
  position: relative;
  display: flex;
  height: 60px;
}
.accordion-item.depth-1 > .accordion-header {
  font-size: 17px;
}
.accordion-item.depth-1.active > .accordion-header {
  background-color: var(--KB-gray);
  color: #fff;
  border-radius: 5px 5px 0 0;
}
.accordion-header .tit {
  padding-top: 2px;
  font-weight: inherit;
}

.accordion-content {
  display: none;
}
.accordion-item.depth-1 > .accordion-content {
  padding: 5px 0 10px;
}
.accordion-item.active > .accordion-content {
  display: block;
}

.monitoring .left-part {
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 24px;
}
.monitoring .right-part {
  display: flex;
  align-items: center;
  margin-right: 70px;
  margin-left: auto;
}

.group-list {
  margin-top: -5px;
  margin-left: 60px;
  padding-bottom: 5px;
}
.group-list li {
  display: flex;
  height: 48px;
  font-size: 15px;
  border-bottom-width: 1px;
}
.group-list li:last-child {
  border-bottom-width: 0;
}
.group-list .left-part {
  padding-left: 0;
}

.group-list dl {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  min-width: 200px;
  margin-right: 24px;
}
.group-list .label {
  display: inline-block;
  vertical-align: top;
  padding-right: 12px;
  text-transform: uppercase;
  font-weight: 400;
  font-size: 13px;
  color: #c1aa99;
}

.monitoring .link {
  display: inline-flex;
  align-items: center;
  margin: 0 10px;
  font-weight: 400;
  font-size: 15px;
  color: #757575;
}
.monitoring .link:hover {
  text-decoration: underline;
}
.monitoring .link svg {
  margin-right: 2px;
  fill: currentColor;
}
.monitoring .link.g {
  color: var(--grafana);
}
.monitoring .link img {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.monitoring .btn-toggle {
  position: absolute;
  right: 0;
  top: 0;
  width: 60px;
  height: 100%;
}
.monitoring .btn-toggle:disabled {
  color: #ccc;
  cursor: not-allowed;
}
.monitoring .btn-toggle svg {
  fill: currentColor;
  transition: .3s;
}
.accordion-item.active > .accordion-header .btn-toggle svg {
  transform: rotate(180deg);
}
</style>
