<template>
  <div class="panel-wrapper">
    <div class="panel-container">
      <div class="panel-header">
        <div class="panel-title">
          <!-- {{ items.title }} -->
          <slot />
        </div>
      </div>
      <div class="panel-content" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';

// const { reactiveProp } = mixins;

export default {
  props: {
    items: Array,
  },
  mounted() {
    // this.renderChart(data, options);
  },
};
</script>

<style scoped>
.panel-wrapper {
  width: 400px;
  min-height: 150px;
  padding: 1.25rem;
  background-color: var(--white);
  border-radius: .375rem;
}
.chart {
  width: 100%;
}
</style>
