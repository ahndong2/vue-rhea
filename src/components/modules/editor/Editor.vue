<template>
  <ckeditor v-model="editorData" :config="editorConfig"
            @input="onEditorInput"
  />
</template>

<script lang="ts">
import {
  reactive, toRefs, watch,
} from '@vue/composition-api';

export default {
  name: 'Editor',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      editorData: '',
      editorConfig: {
        height: '300px',
      },
    });

    const onEditorInput = (data) => {
      emit('input', data);
    };

    watch(() => props.content, (data) => {
      state.editorData = String(data);
    });

    return {
      ...toRefs(state),
      onEditorInput,
    };
  },
};
</script>
