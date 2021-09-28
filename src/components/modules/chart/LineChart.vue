<script>
import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {},
  data() {
    return {
      options: {
        animation: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
              display: true,
            },
          }],
          xAxes: [{
            gridLines: {
              display: true,
            },
          }],
        },
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: 0,
          },
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
