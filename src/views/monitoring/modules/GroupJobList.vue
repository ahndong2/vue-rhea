<template>
  <div v-if="groupJobsList.length > 0">
    <dl v-for="(groupJob, idx) in groupJobsList" :key="idx" class="accordion-item" :class="{'active': activeIdx === idx}">
      <dt class="accordion-header">
        <button type="button" class="btn-toggle" @click="clickGroupJobs(idx)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
          </svg>
          <span class="text">{{ groupJob.name }}</span>
        </button>
      </dt>
      <dd v-if="activeIdx === idx && Object.keys(monitoringData).length > 0" class="accordion-content">
        <ul v-if="!isEmpty" id="grouplist" class="grid grid-cols-3 gap-8">
          <fragment v-for="(value,key) in monitoringData" :key="key">
            <!-- K8S node -->
            <template v-if="key === 'nodeList' && (checArrayLength(value.nodeAbledList) > 0 || checArrayLength(value.nodeDisabledList) > 0)">
              <li class="col-span-3 lg:col-span-1">
                <kubernetes-panel type="node" title="Node Status"
                                  :count-data="setNodeStatusData()" :disable-list="value.nodeDisabledList" :able-list="value.nodeAbledList"
                />
              </li>
            </template>
            <!-- K8S pod -->
            <template v-else-if="key === 'podList' && (checArrayLength(value.podAbledList) > 0 || checArrayLength(value.podDisabledList) > 0)">
              <li class="col-span-3 lg:col-span-1">
                <kubernetes-panel type="pod" title="Pod Status"
                                  :count-data="setPodStatusData()" :disable-list="value.podDisabledList" :able-list="value.podAbledList"
                />
              </li>
            </template>
            <!-- K8S PV -->
            <template v-else-if="key === 'podPvStatusList' && (checArrayLength(value.podAbledList) > 0 || checArrayLength(value.podDisabledList) > 0)">
              <li class="col-span-3 lg:col-span-1">
                <kubernetes-panel type="pv" title="PV Status"
                                  :count-data="setPvStatusData()" :disable-list="value.podDisabledList" :able-list="value.podAbledList"
                />
              </li>
            </template>
            <!-- HTTP Probe -->
            <li v-else-if="key === 'blackBoxList'"
                class="col-span-3 lg:col-span-2"
            >
              <http-probe-panel :black-box-list="value" />
            </li>
            <!-- chart (default) -->
            <li v-else-if="checArrayLength(value) > 0 && !value[0].noChart"
                class="col-span-3 lg:col-span-1"
            >
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">{{ monitoringInfo[activeType][key]['name'] }}</span>
                  <em v-if="monitoringInfo[activeType][key]['period']" class="unit">(단위 : {{ monitoringInfo[activeType][key]['period'] }})</em>
                </div>
                <div class="panel-content">
                  <div class="chart-wrapper">
                    <multi-chart :width="500" :height="300" class="chart" :chart-data="setLineChartDataSet(value)" :options="lineChartOptions" />
                  </div>
                </div>
              </div>
            </li>
            <!-- table-->
            <li v-else-if="checArrayLength(value) > 0 && value[0].noChart === 'table'"
                id="grouptable" class="col-span-3 lg:col-span-1"
            >
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">{{ value[0].name }}</span>
                </div>
                <div class="panel-content px-6 pb-8">
                  <table-container type="data" :height="value.length > 4 ? '230px' : ''">
                    <thead>
                      <tr>
                        <th><span>Instance</span></th>
                        <th><span>Status</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(v,i) in value" :key="i">
                        <td>{{ v.metric.instance }}</td>
                        <td>
                          <indicator :mouse-event="false" :class="[v.y === '1' ? 'text-green-500' : 'text-red-500']" />
                        </td>
                      </tr>
                    </tbody>
                  </table-container>
                </div>
              </div>
            </li>
          </fragment>
        </ul>
        <div v-if="isEmpty" class="empty">
          Data가 없습니다.
        </div>
      </dd>
      <dd v-if="activeIdx === idx && Object.keys(monitoringData).length === 0" class="accordion-content">
        <div class="empty">
          Data가 없습니다.
        </div>
      </dd>
    </dl>
  </div>
</template>

<script lang="ts">
import {
  reactive, toRefs, computed, watch, onUpdated, nextTick,
} from '@vue/composition-api';
import {
  MultiChart, CHART_METHOD, Indicator, TableContainer,
} from '@/components';
import { getInstance } from '@/composable';
import { CHART_COLORS } from '@/views/monitoring/constants';
import { MONITORING_INFO } from '@/constants';
import KubernetesPanel from './KubernetesPanel.vue';
import HttpProbePanel from './HttpProbePanel.vue';

interface DataSets {
  type?:string;
  data?:string;
  pointRadius?:number;
  fill?:boolean;
  borderColor?:string;
  borderWidth?:number;
  tension?:number;
}
interface ChartDataSets {
  datasets : DataSets[]
}
interface KubernetesCnt {
  label: string;
  count: number;
  class?:string;
}

export default {
  name: 'GroupJobList',
  components: {
    MultiChart,
    Indicator,
    TableContainer,
    KubernetesPanel,
    HttpProbePanel,
  },
  setup(props, { emit }) {
    const { instance } = getInstance();
    const state = reactive({
      monitoringInfo: MONITORING_INFO,
      activeIdx: computed(() => instance.$store.state.monitoring.activeIdx),
      groupJobsList: computed(() => instance.$store.state.monitoring.groupJobsList),
      monitoringData: computed(() => instance.$store.state.monitoring.monitoringData),
      activeType: computed(() => instance.$store.state.monitoring.activeType),
      lineChartOptions: {
        animation: {
          duration: 0,
        },
        hover: {
          animationDuration: 0,
        },
        responsiveAnimationDuration: 0,
        elements: {
          line: {
            tension: 0,
          },
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
              },
              type: 'time',
              // time: {
              //   unit: 'second',
              //   displayFormats: {
              //     second: 'HH:mm',
              //   },
              // },
            },
          ],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: true,
          displayColors: false,
          callbacks: {
            label: ((tooltipItems, data) => {
              const { metric, y, key } = data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];

              let value = y.indexOf('.') === -1 ? y : Number(y).toFixed(3);

              let tooltipArray = [] as string[];
              if (metric.instance) {
                // chartjs 특성상 첫번째 배열은 undefined시 자동으로 삭제가 안됨
                tooltipArray.push(`instance : ${metric.instance}`);
              }
              const basic = [`job : ${metric.job}`, `nodename : ${metric.nodename}`];
              tooltipArray = tooltipArray.concat(basic);

              if (key === 'networkReceptionList') {
                value = y;
                tooltipArray.unshift(`device: ${metric.device}`);
              } else if (key === 'storageList') {
                const info = [
                  `device: ${metric.device}`,
                  `fstype: ${metric.fstype}`,
                  `mountpoint: ${metric.mountpoint}`,
                ];
                tooltipArray = info.concat([...tooltipArray]);
              } else if (key === 'podCpuList' || key === 'podMemoryList') {
                tooltipArray.unshift(`pod: ${metric.pod}`);
              } else if (key === 'deploymentList') {
                tooltipArray.unshift(`deployment: ${metric.deployment}`);
              } else if (key === 'daemonsetList') {
                tooltipArray.unshift(`daemonset: ${metric.daemonset}`);
              } else if (key === 'replicasetList') {
                tooltipArray.unshift(`replicaset: ${metric.replicaset}`);
              } else if (key === 'podErrorList') {
                const info = [
                  `container: ${metric.container}`, `pod: ${metric.pod}`,
                  `reason: ${metric.reason}`, `namespace: ${metric.namespace}`,
                ];
                tooltipArray = info.concat([...tooltipArray]);
              } else if (key === 'statefulSetList') {
                tooltipArray.unshift(`statefulset: ${metric.statefulset}`);
              } else if (key === 'replicationControllerList') {
                tooltipArray.unshift(`replicationcontroller: ${metric.replicationcontroller}`);
              }

              tooltipArray.unshift(`value: ${value}`);
              if (!metric.nodename) {
                tooltipArray = tooltipArray.slice(0, -1);
              }

              return tooltipArray;
            }),
          },
        },
        // plugins: {
        //   decimation: {
        //     enabled: true,
        //     algorithm: 'lttb',
        //     samples: 500,
        //   },
        //   zoom: {
        //     pan: {
        //       enabled: true,
        //       mode: 'xy',
        //       speed: 20,
        //       threshold: 10,
        //       onPan: (e) => {
        //         e.chart.options.scales.xAxes[0].time = {
        //           unit: 'second',
        //           displayFormats: {
        //             second: 'HH:mm',
        //           },
        //         };
        //       },
        //       onPanComplete: (e) => {
        //         CHART_METHOD.panZoomAction(e);
        //       },
        //     },
        //     zoom: {
        //       enabled: true,
        //       drag: false,
        //       mode: () => 'xy',
        //       speed: 0.1,
        //       sensitivity: 3,
        //       rangeMin: {
        //         x: null,
        //         y: null,
        //       },
        //       onZoom: (e) => {
        //         e.chart.options.scales.xAxes[0].time = {
        //           unit: 'second',
        //           displayFormats: {
        //             second: 'HH:mm',
        //           },
        //         };
        //       },
        //       onZoomComplete: (event) => {
        //         CHART_METHOD.panZoomAction(event);
        //       },
        //     },
        //   },
        // },
      },
      isEmpty: true,
    });

    const setLineChartDataSet = (data):ChartDataSets => {
      const datasets = [] as DataSets[];
      data.forEach((v, idx) => {
        datasets.push({
          type: 'line',
          data: v,
          pointRadius: 1,
          fill: false,
          borderColor: CHART_COLORS[idx % CHART_COLORS.length],
          borderWidth: 1,
          tension: 0.1,
        });
      });
      return { datasets };
    };

    const clickGroupJobs = (idx:number):void => {
      instance.$store.commit('monitoring/setActiveIdx', idx);
      emit('search');
    };

    const getInfo = (key:string, search:string):string => MONITORING_INFO[state.activeType][key][search];

    const checArrayLength = (arr):number => (Array.isArray(arr) ? arr.length : 0);

    const checkIsEmpty = ():void => {
      let isEmpty = true;
      const data = state.monitoringData;
      const keys = Object.keys(data);

      if (keys.length === 0) {
        isEmpty = true;
      } else {
        if (state.activeType === 'K8S') {
          const nodeList = data.nodeList;
          const podList = data.podList;
          const pvList = data.podPvStatusList;
          if (
            nodeList?.nodeDisabledList.length > 0 || nodeList?.nodeAbledList.length > 0
            || podList?.podDisabledList.length > 0 || podList?.podAbledList.length > 0
            || pvList?.podDisabledList.length > 0 || pvList?.podAbledList.length > 0
          ) {
            isEmpty = false;
          }
        }
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (checArrayLength(data[key]) > 0) {
            isEmpty = false;
            break;
          }
        }
      }
      state.isEmpty = isEmpty;
    };

    const setNodeStatusData = ():KubernetesCnt[] => {
      const nodeList = state.monitoringData.nodeList;
      const data = [
        { label: 'Ready', count: nodeList.readyCount, class: 'text-green-500' },
        { label: 'Disk Pressure', count: nodeList.diskPressureCount },
        { label: 'Memory Pressure', count: nodeList.memoryPressureCount },
        { label: 'PID Pressure', count: nodeList.pidPressureCount },
        { label: 'Network Unavailable', count: nodeList.networkUnavailableCount },
      ];
      return data;
    };
    const setPodStatusData = ():KubernetesCnt[] => {
      const podList = state.monitoringData.podList;
      const data = [
        { label: 'Pending', count: podList.pendingCount },
        { label: 'Running', count: podList.runningCount, class: 'text-green-500' },
        { label: 'Succeeded', count: podList.succeededCount, class: 'text-green-700' },
        { label: 'Failed', count: podList.failedCount },
        { label: 'Unknown', count: podList.unknownCount },
      ];
      return data;
    };
    const setPvStatusData = ():KubernetesCnt[] => {
      const pvList = state.monitoringData.podPvStatusList;
      const data = [
        { label: 'Available', count: pvList.availableCount },
        { label: 'Bound', count: pvList.boundCount, class: 'text-green-500' },
        { label: 'Released', count: pvList.releasedCount, class: 'text-red-500' },
        { label: 'Failed', count: pvList.failedCount },
        { label: 'Pending', count: pvList.pendingCount },
      ];
      return data;
    };

    watch(() => state.activeType, ():void => {
      emit('search');
    });
    watch(() => state.monitoringData, ():void => {
      checkIsEmpty();
    });

    onUpdated(() => {
      const list = document.querySelector('#grouplist');
      const table = document.querySelector('#grouptable');
      if (!table) return;
      nextTick(() => {
        // eslint-disable-next-line no-unused-expressions
        list?.insertBefore(table, null);
      });
    });

    return {
      ...toRefs(state),
      setLineChartDataSet,
      clickGroupJobs,
      getInfo,
      checkIsEmpty,
      checArrayLength,
      setNodeStatusData,
      setPodStatusData,
      setPvStatusData,
    };
  },
};
</script>

<style scoped>
/* Accordion */
.accordion-item {
  position: relative;
  margin-bottom: 2rem;
}
.accordion-header {
  position: relative;
}
.btn-toggle {
  display: flex;
  font-weight: bold;
  font-size: 18px;
}
.btn-toggle svg {
  margin-right: 5px;
  vertical-align: sub;
  fill: currentColor;
  transform: rotate(-90deg);
  transition: .3s;
}
.accordion-item.active .btn-toggle svg {
  transform: none;
}
.accordion-item:not(.active) .btn-toggle {
  font-family: 'KBFGTextL';
  opacity: .6;
}
.accordion-content {
  padding: 1rem 0;
}

/* Panel */
.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 15px;
  word-wrap: break-word;
  background: var(--white);
  border-radius: 4px;
  cursor: default;
}
::v-deep .panel-header {
  position: relative;
  height: 3.75rem;
}
::v-deep .panel-title {
  display: inline-block;
  max-width: 80%;
  margin-left: 1.5rem;
  line-height: 3.75rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  letter-spacing: .25px;
  text-transform: capitalize;
}
::v-deep .panel-content {
  position: relative;
  flex: 1;
}
.unit {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-45%);
  margin-right: 1rem;
  text-align: right;
  font-family: 'KBFGTextL';
  font-size: 13px;
  line-height: 1.2;
  color: #757575;
  text-transform: capitalize;
}

/* Chart */
.chart-wrapper {
  padding: 0 6%;
}
.chart {
  position: relative;
  width: 100%;
  margin: 0 auto;
}
</style>
<style>
.btn-reset-chart {
  display: none;
  position: absolute;
  top: 3.5rem;
  right: 1.5rem;
  z-index: 10;
  width: 36px;
  height: 36px;
  font-size: 0;
  color: transparent;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' width='24' fill='%23555'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z'/%3E%3C/svg%3E");
  background-size: 17px;
  border-radius: 50%;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 15%);
}
</style>
