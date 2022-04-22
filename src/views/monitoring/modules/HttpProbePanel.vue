<template>
  <div class="panel">
    <div class="panel-header">
      <span class="panel-title">HTTP Probe Overview</span>
    </div>
    <div class="panel-content px-6 pb-8">
      <table-container type="data" :height="blackBoxList.length > 4 ? '230px' : ''">
        <thead>
          <tr>
            <th><span>Instance</span></th>
            <th><span>Status</span></th>
            <th><span>Code</span></th>
            <th><span>SSL Expiry(days)</span></th>
            <th><span>Duration(ms)</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(v,i) in blackBoxList" :key="i">
            <td>{{ v.metric.instance }}</td>
            <td>
              <indicator :mouse-event="false" :class="[v.y === '1' ? 'text-green-500' : 'text-red-500']" />
            </td>
            <td class="flex items-center">
              <indicator :mouse-event="false" :class="[v.metric.StatusCode === '200' ? 'text-green-500' : 'text-red-500']" />
              <span class="text pt-1 pl-1">{{ v.metric.StatusCode }}</span>
            </td>
            <td>{{ Number(v.metric.SslCertExpiry).toFixed(0) }}</td>
            <td>{{ v.metric.BlackboxProbeDuration * 1000 }}</td>
          </tr>
        </tbody>
      </table-container>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs,
} from '@vue/composition-api';
import { Indicator, TableContainer } from '@/components';

export default defineComponent({
  name: 'HttpProbePanel',
  components: {
    Indicator,
    TableContainer,
  },
  props: {
    blackBoxList: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const state = reactive({
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>
