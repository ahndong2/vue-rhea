<template>
  <div v-if="groupJobsList.length > 0">
    <dl v-for="(groupJob, idx) in groupJobsList" :key="idx" class="accordion-item" :class="activeIdx === idx ? 'active' : ''">
      <dt class="accordion-header">
        <button type="button" class="btn-toggle" @click="clickAccordion(idx)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
          </svg>
          <span>{{ groupJob.name }}</span>
        </button>
      </dt>

      <dd v-if="activeIdx === idx" class="accordion-content">
        <ul v-if="groupJob.chartData" class="panel-list">
          <fragment v-if="groupJob.chartData.cpuList.length > 0">
            <li class="col-span-6 lg:col-span-3">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">CPU Usage</span>
                  <em class="period">(단위: %)</em>
                </div>
                <div class="panel-content">
                  <div class="chart-wrapper">
                    <multi-chart :width="500" :height="300" class="chart" :chart-data="setLineChartDataSet(groupJob.chartData.cpuList)" :options="lineChartOptions" />
                  </div>
                </div>
              </div>
            </li>
          </fragment>

          <fragment v-if="groupJob.chartData.memoryList.length > 0">
            <li class="col-span-6 lg:col-span-3">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Memory Usage</span>
                  <em class="period">(단위: %)</em>
                </div>
                <div class="panel-content">
                  <div class="chart-wrapper">
                    <multi-chart :width="500" :height="300" class="chart" :chart-data="setLineChartDataSet(groupJob.chartData.memoryList)" :options="lineChartOptions" />
                  </div>
                </div>
              </div>
            </li>
          </fragment>

          <fragment v-if="groupJob.chartData.storageList.length > 0">
            <li class="col-span-6 lg:col-span-3">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Storage Usage</span>
                  <em class="period">(단위: %)</em>
                </div>
                <div class="panel-content">
                  <div class="chart-wrapper">
                    <multi-chart :width="500" :height="300" class="chart" :chart-data="setLineChartDataSet(groupJob.chartData.storageList)" :options="lineChartOptions" />
                  </div>
                </div>
              </div>
            </li>
          </fragment>

          <fragment v-if="groupJob.chartData.networkReceptionList.length > 0">
            <li class="col-span-6 lg:col-span-3">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Network Reception</span>
                  <em class="period">(단위: Mbps)</em>
                </div>
                <div class="panel-content">
                  <div class="chart-wrapper">
                    <multi-chart :width="500" :height="300" class="chart" :chart-data="setLineChartDataSet(groupJob.chartData.networkReceptionList)" :options="lineChartOptions" />
                  </div>
                </div>
              </div>
            </li>
          </fragment>

          <!-- <fragment v-if="groupJob.chartData.networkSendList.length > 0">
            <li class="col-span-6 lg:col-span-3">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Network Send</span>
                </div>
                <div class="panel-content">
                  <div class="chart-wrapper">
                    <multi-chart :width="500" :height="300" class="chart" :chart-data="setLineChartDataSet(groupJob.chartData.networkSendList)" :options="lineChartOptions" />
                  </div>
                </div>
              </div>
            </li>
          </fragment> -->

          <!-- <fragment v-if="groupJob.chartData.systemLoadList.length > 0">
            <li class="col-span-6 lg:col-span-3">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">System Load</span>
                </div>
                <div class="panel-content">
                  <div class="chart-wrapper">
                    <multi-chart :width="500" :height="300" class="chart" :chart-data="setLineChartDataSet(groupJob.chartData.systemLoadList)" :options="lineChartOptions" />
                  </div>
                </div>
              </div>
            </li>
          </fragment> -->

          <li v-if="groupJob.chartData.nodeList && (groupJob.chartData.nodeList.nodeAbledList.length > 0 || groupJob.chartData.nodeList.nodeDisabledList.length > 0)" class="col-span-6 lg:col-span-3">
            <div class="panel">
              <div class="panel-header">
                <span class="panel-title">Node Status</span>
                <em class="period">현재 시점 기준 <br>(과거 날짜로 조회 시 Node/Pod의 과거 기준 그래프 지원은 안됨.)</em>
              </div>
              <div class="panel-content">
                <div class="status">
                  <div class="count">
                    <dl class="text-green-500">
                      <dt class="tit">
                        Ready
                      </dt>
                      <dd class="cnt">
                        {{ groupJob.chartData.nodeList.readyCount }}
                      </dd>
                    </dl>
                    <dl>
                      <dt class="tit">
                        Disk<br>Pressure
                      </dt>
                      <dd class="cnt">
                        {{ groupJob.chartData.nodeList.diskPressureCount }}
                      </dd>
                    </dl>
                    <dl>
                      <dt class="tit">
                        Memory<br>Pressure
                      </dt>
                      <dd class="cnt">
                        {{ groupJob.chartData.nodeList.memoryPressureCount }}
                      </dd>
                    </dl>
                    <dl>
                      <dt class="tit">
                        PID<br>Pressure
                      </dt>
                      <dd class="cnt">
                        {{ groupJob.chartData.nodeList.pidPressureCount }}
                      </dd>
                    </dl>
                    <dl>
                      <dt class="tit">
                        Network<br>Unavailable
                      </dt>
                      <dd class="cnt">
                        {{ groupJob.chartData.nodeList.networkUnavailableCount }}
                      </dd>
                    </dl>
                  </div>
                  <div class="dots">
                    <ul>
                      <indicator v-for="(indicator, j) in groupJob.chartData.nodeList.nodeDisabledList" :key="j"
                                 class="text-red-500" :content="indicator.node"
                      />
                      <indicator v-for="(indicator, j) in groupJob.chartData.nodeList.nodeAbledList" :key="j"
                                 class="text-green-500" :content="indicator.node"
                      />
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li v-if="groupJob.chartData.podList && (groupJob.chartData.podList.podDisabledList.length > 0 || groupJob.chartData.podList.podAbledList.length > 0)" class="col-span-6 lg:col-span-3">
            <div class="panel">
              <div class="panel-header">
                <span class="panel-title">Pod Status</span>
                <em class="period">현재 시점 기준 <br>(과거 날짜로 조회 시 Node/Pod의 과거 기준 그래프 지원은 안됨.)</em>
              </div>
              <div class="panel-content">
                <div class="status">
                  <div class="count">
                    <dl>
                      <dt class="tit">
                        Pending
                      </dt>
                      <dd class="cnt">
                        {{ groupJob.chartData.podList.pendingCount }}
                      </dd>
                    </dl>
                    <dl class="text-green-400">
                      <dt class="tit">
                        Running
                      </dt>
                      <dd class="cnt">
                        {{ groupJob.chartData.podList.runningCount }}
                      </dd>
                    </dl>
                    <dl class="text-green-600">
                      <dt class="tit">
                        Succeeded
                      </dt>
                      <dd class="cnt">
                        {{ groupJob.chartData.podList.succeededCount }}
                      </dd>
                    </dl>
                    <dl>
                      <dt class="tit">
                        Failed
                      </dt>
                      <dd class="cnt">
                        {{ groupJob.chartData.podList.failedCount }}
                      </dd>
                    </dl>
                    <dl>
                      <dt class="tit">
                        Unknown
                      </dt>
                      <dd class="cnt">
                        {{ groupJob.chartData.podList.unknownCount }}
                      </dd>
                    </dl>
                  </div>
                  <div class="dots">
                    <ul>
                      <indicator v-for="(indicator, j) in groupJob.chartData.podList.podDisabledList" :key="j"
                                 class="text-red-500" :content="indicator.pod"
                      />
                      <indicator v-for="(indicator, j) in groupJob.chartData.podList.podAbledList" :key="j"
                                 :class="indicator.phase.includes('Succeeded') ? 'text-green-600' : 'text-green-400'"
                                 :content="indicator.pod"
                      />
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <fragment v-if="groupJob.chartData.podErrorList.length > 0">
            <li class="col-span-6 lg:col-span-3">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Pod Error</span>
                </div>
                <div class="panel-content">
                  <div class="chart-wrapper">
                    <multi-chart :width="500" :height="300" class="chart" :chart-data="setLineChartDataSet(groupJob.chartData.podErrorList)" :options="lineChartOptions" />
                  </div>
                </div>
              </div>
            </li>
          </fragment>
        </ul>
        <div v-if="!groupJob.chartData || (
          !groupJob.chartData.cpuList.length &&
          !groupJob.chartData.memoryList.length &&
          !groupJob.chartData.networkReceptionList.length &&
          !groupJob.chartData.storageList.length &&
          !groupJob.chartData.podList.podAbledList.length &&
          !groupJob.chartData.podList.podDisabledList.length &&
          !groupJob.chartData.nodeList.nodeAbledList.length &&
          !groupJob.chartData.nodeList.nodeDisabledList.length &&
          !groupJob.chartData.podErrorList.length
        )" class="empty"
        >
          Data가 없습니다.
        </div>
      </dd>
    </dl>
  </div>
</template>

<script lang="ts">
import {
  reactive, toRefs, computed,
} from '@vue/composition-api';
import { MultiChart, Indicator } from '@/components';
import { getInstance } from '@/composable';
import { CHART_COLORS } from '@/views/monitoring/constants';

interface DataSets {
  type?:string;
  data?:string;
  pointRadius?:number;
  fill?:boolean;
  borderColor?:string;
  borderWidth?:number;
  tension?:number;
}
export default {
  name: 'GroupJobPanel',
  components: {
    MultiChart,
    Indicator,
  },

  setup(props, { emit }) {
    const { instance } = getInstance();

    // state
    const state = reactive({
      activeIdx: computed(() => instance.$store.state.monitoring.activeIdx),
      groupJobsList: computed(() => instance.$store.state.monitoring.groupJobsList),
      lineChartOptions: {
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
              },
              type: 'time',
              time: {
                unit: 'second',

                displayFormats: {
                  second: 'HH:mm',
                },
              },
            },
          ],
          // yAxes: [{
          //   beforeUpdate(axis) {
          //     console.log('beforeUpdate', axis);
          //   },
          //   afterUpdate(axis) {
          //     console.log('afterUpdate', axis);
          //   },
          // }],
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
              let value;
              let tooltipArray = [`instance : ${metric.instance}`,
                `job : ${metric.job}`,
                `nodename : ${metric.nodename}`];
              if (key === 'networkReceptionList') {
                value = y;
                tooltipArray.unshift(`device: ${metric.device}`);
              } else {
                value = y.indexOf('.') === -1 ? y : Number(y).toFixed(3);
              }

              tooltipArray.unshift(`value: ${value}`);
              if (!metric.nodename) {
                tooltipArray = tooltipArray.slice(0, -1);
              }
              return tooltipArray;
            }),
          },
        },
      },
    });

    const setLineChartDataSet = (data) => {
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

    const clickAccordion = (idx) => {
      instance.$store.commit('monitoring/setActiveIdx', idx);
      emit('search');
    };

    // watch(() => state.groupJobsList, (value) => {
    //   if (value.length === 0 || value[0].chartData) return;
    //   emit('search');
    // });

    return {
      ...toRefs(state),
      setLineChartDataSet,
      clickAccordion,
    };
  },
};
</script>

<style scoped>
/* Monitoring */
.accordion-item {
  margin-bottom: 2rem;
}
.accordion-header {
  position: relative;
}
.accordion-header .btn-toggle {
  display: flex;
  font-weight: 700;
  font-size: 18px;
  text-transform: capitalize;
}
.accordion-header svg {
  margin-right: 5px;
  vertical-align: sub;
  fill: currentColor;
  transform: rotate(-90deg);
  transition: .3s;
}
.accordion-item.active > .accordion-header svg {
  transform: none;
}
.accordion-content {
  margin: 1.2rem 0 3rem;
}
.empty {
  padding: 0 30px;
  font-size: 15px;
  color: #999;
}

/* Panel */
.panel-list {
  display: grid;
  grid-gap: 2rem;
  gap: 2rem;
  grid-template-columns: repeat(6, minmax(0, 1fr));
}
.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  word-wrap: break-word;
  background: var(--white);
  border-radius: 4px;
  cursor: default;
}
.panel-header {
  overflow: hidden;
  position: relative;
  height: 60px;
  line-height: 60px;
}
.panel-title {
  display: inline-block;
  max-width: 80%;
  margin-left: 24px;
  color: #333;
  white-space: nowrap;
  text-overflow: ellipsis;
  letter-spacing: .5px;
}
.period {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  margin-right: 24px;
  padding-top: 2px;
  text-align: right;
  font-size: 13px;
  line-height: 1.2;
  color: #999;
  text-transform: capitalize;
}
.panel-content {
  position: relative;
  flex: 1;
}

/* chart */
.chart-wrapper {
  padding: 5px 30px;
}
.chart {
  position: relative;
  width: 100%;
  margin: 0 auto;
}

/* status */
.status .count {
  display: flex;
  flex-direction: row;
  padding: 15px 0;
  background: rgb(238 238 238 / 20%);
}
.status .count > dl {
  position: relative;
  flex: 1;
  text-align: center;
}
.status .count > dl:not(:first-child)::before {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 0;
  width: 1px;
  background: #eee;
  content: ' ';
}
.status .count .tit {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  line-height: 1.2;
  font-size: 13px;
  color: var(--KB-silver);
  letter-spacing: 0.5px;
}
.status .count .cnt {
  overflow: hidden;
  height: 25px;
  font-weight: 700;
  font-size: 17px;
  white-space: nowrap;
}

/* dots */
.status .dots {
  padding: 22px;
}
.dots > ul {
  display: inline-flex;
  flex-wrap: wrap;
}
</style>
