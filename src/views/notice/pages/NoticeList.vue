<template>
  <main id="content" class="content-wrapper notice">
    <div class="content-head">
      <h2 class="content-title">
        공지사항
      </h2>
    </div>
    <notice-table />
  </main>
</template>

<script lang="ts">
import {
  reactive, toRefs, onMounted,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import NoticeTable from '../modules/NoticeTable.vue';

export default {
  name: 'NoticeList',
  components: {
    NoticeTable,
  },
  setup() {
    const { instance } = getInstance();
    const state = reactive({
    });

    onMounted(():void => {
      instance.$store.dispatch('board/getNoticeBoard');
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>
