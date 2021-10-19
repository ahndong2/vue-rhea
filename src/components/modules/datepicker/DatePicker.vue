<template>
  <v-date-picker
    v-model="value"
    v-bind="options"
    class="date-picker"
    @input="changeDate"
  >
    <template v-slot="{ inputValue, inputEvents }">
      <input class="inp-t" :value="inputValue" v-on="inputEvents">
    </template>
  </v-date-picker>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';
import { getInstance } from '@/composable';

export default {
  name: 'DatePicker',
  props: {
    id: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: () => ({
        mode: 'date',
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
    },
  },
  setup(props, { emit }) {
    const { instance } = getInstance();
    const state = reactive({
      value: props.date || instance.$moment().format(props.options.format),
    });

    const changeDate = (date) => {
      const id = props.id;
      const dt = instance.$moment(date).format(props.options.format);
      emit('change', dt, id);
    };
    return {
      ...toRefs(state),
      changeDate,
    };
  },
};
</script>

<style scoped>
.date-picker .inp-t {
  min-width: inherit;
  max-width: inherit;
  width: 150px;
}
</style>
