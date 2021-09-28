userInfo: computed(() => instance.$store.state.global.userInfo),<template>
  <main id="content" class="content-wrapper notice">
    <div class="content-head">
      <h2 class="content-title">
        공지사항
      </h2>
    </div>

    <notice-table />
    <a v-if="isAdmin"
       href="/backoffice/board/400/create"
       class="btn-write"
    >
      등록
    </a>
  </main>
</template>

<script lang="ts">
import {
  reactive, toRefs, onMounted, computed, watch,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import NoticeTable from '../modules/NoticeTable.vue';

export default {
  name: 'Notice',
  components: {
    NoticeTable,
  },
  setup() {
    const { instance } = getInstance();

    const state = reactive({
      // userInfo: computed(() => instance.$store.state.global.userInfo),
      isAdmin: computed(() => {
        const userInfo = instance.$store.state.global.userInfo;
        if (!userInfo.name) return false;
        return userInfo.roleList.find((v) => v.name === 'ADMIN') !== undefined;
      }),
    });

    onMounted(() => {
      instance.$store.dispatch('board/getNoticeBoard');
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style scoped>
::v-deep .tbl.basic .tit {
  text-align: left;
  white-space: normal;
}
::v-deep .btn-write {
  position: absolute;
  bottom: 0;
  right: 0;
  min-width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 0.97rem;
  border-radius: 4px;
  color: #fff;
  background-color: var(--KB-gray);
}
</style>
