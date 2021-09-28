<template>
  <div class="dashboard p-5 pr-0">
    {{ $moment().format('YYYY-MM-DD') }}
    <multi-chart class="chart" :chart-data="data" :options="options" />
    <button class="btn-update" @click="fillData()">
      update
    </button>
  </div>
</template>

<script lang="ts">
import {
  reactive, toRefs,
} from '@vue/composition-api';
import MultiChart from '@/components/modules/chart/MultiChart.vue';
import { getInstance } from '@/composable';

export default {
  name: 'MultiChartSample',
  components: {
    MultiChart,
  },
  setup() {
    const { instance } = getInstance();

    const state = reactive({
      data: {
        datasets: [
          {
            type: 'line',
            data: [
              {
                x: instance.$moment('01:00:00', 'HH:mm:ss'),
                y: 0,
              },
              {
                x: instance.$moment('01:00:01', 'HH:mm:ss'),
                y: 10,
              },
              {
                x: instance.$moment('01:00:02', 'HH:mm:ss'),
                y: 5,
              },
              {
                x: instance.$moment('01:00:05', 'HH:mm:ss'),
                y: 25,
              },
              {
                x: instance.$moment('01:00:08', 'HH:mm:ss'),
                y: 5,
              },
              {
                x: instance.$moment('01:00:09', 'HH:mm:ss'),
                y: 30,
              },
              {
                x: instance.$moment('01:00:12', 'HH:mm:ss'),
                y: 45,
              },
            ],
          },
        ],
      },
      options: {
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
                  second: 'mm:ss',
                },
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      },
    });

    const fillData = () => { // init load + update
      const dummy = {
        x: instance.$moment('01:00:15', 'HH:mm:ss'),
        y: 20,
      };

      const copyData = { ...state.data };
      copyData.datasets[0].data.push(dummy);
      console.log(copyData);

      state.data = { ...copyData };
    };

    return {
      ...toRefs(state),
      fillData,
    };
  },
};
</script>

<style scoped>
</style>
