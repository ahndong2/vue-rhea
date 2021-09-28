<script>
import { mixins, Bar } from 'vue-chartjs';

const { reactiveProp } = mixins;
export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null,
    },
    options: {
      type: Object,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,
      }),
    },
  },
  watch: {
    options(newValue) {
      this.renderChart(this.chartData, { ...this.options, ...newValue });
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
