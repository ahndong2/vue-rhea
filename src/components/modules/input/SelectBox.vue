<template>
  <select :id="id" v-model="selectValue" :name="name" :title="title"
          :class="className" @change="changeEvent"
  >
    <!-- <option v-if="title && !value" value="" disabled>
      {{ title }}
    </option> -->
    <option v-for="(opt,idx) in selectOptions" :key="idx" :value="opt.value">
      {{ opt.label }}
    </option>
  </select>
</template>

<script>
import {
  computed, reactive, toRefs, watch,
} from '@vue/composition-api';

export default {
  name: 'SelectBox',
  props: {
    id: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    className: {
      type: String,
      default: 'slt',
    },
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [String, Number],
      default: '',
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      selectOptions: computed(() => {
        const opts = [...props.options];
        if (props.title) {
          opts.unshift({ label: props.title, value: '' });
        }
        return opts;
      }),
      selectValue: props.value,
    });
    const changeEvent = (e) => {
      emit('change', e);
    };
    watch(() => props.value, (value) => {
      state.selectValue = value;
    });
    return {
      ...toRefs(state),
      changeEvent,
    };
  },
};
</script>

<style scoped>

</style>
