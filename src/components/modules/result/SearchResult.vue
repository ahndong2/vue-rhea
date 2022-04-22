<template>
  <div v-if="total > 0" class="search-result">
    검색결과
    {{ from.toLocaleString() }} ~ {{ to.toLocaleString() }} ({{ page }} page)
    | 총 {{ total.toLocaleString() }} 건 ({{ pages }} page)
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from '@vue/composition-api';

export default defineComponent({
  name: 'SearchResult',
  props: {
    page: { // current page
      type: Number,
      default: 1,
    },
    size: { // items per page
      type: Number,
      default: 10,
    },
    total: { // total items
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const state = reactive({
      from: computed(() => (props.total ? props.size * (props.page - 1) + 1 : 0)),
      to: computed(() => (props.size * props.page > props.total ? props.total : props.size * props.page)),
      pages: computed(() => (Math.ceil(props.total / props.size))),
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped>
.search-result {
  font-size: 14px;
  cursor: default;
}
</style>
