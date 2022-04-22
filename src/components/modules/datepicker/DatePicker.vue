<template>
  <v-date-picker
    v-model="value"
    v-bind="options"
    class="date-picker"
    @input="changeDate"
  >
    <template v-slot="{ inputValue, inputEvents }">
      <input :value="inputValue" class="inp-t" spellcheck="false" :placeholder="title" v-on="inputEvents">
      <i class="fi fi-rr-calendar" />
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
    title: {
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
      value: props.date,
    });

    const changeDate = (date) => {
      if (!date) {
        window.alert('날짜를 다시 선택해주세요.');
        return;
      }
      const id = props.id;
      const dt = date ? instance.$moment(date).format(props.options.format) : '';

      emit('change', dt, id);
    };

    const setDate = (date) => {
      state.value = date;
    };

    return {
      ...toRefs(state),
      changeDate,
      setDate,
    };
  },
};
</script>

<style scoped>
.date-picker {
  position: relative;
  display: inline-block;
}
.date-picker .fi {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  margin-top: -0.5rem;
  font-size: 14px;
  color: #666;
}
</style>
