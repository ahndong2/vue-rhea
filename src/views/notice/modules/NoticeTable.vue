<template>
  <div class="content-inner">
    <div class="tbl basic">
      <div class="table-container">
        <table>
          <caption>공지사항</caption>
          <colgroup>
            <col style="width: 150px;">
            <col style="width: auto;">
            <col style="width: 200px;">
            <col style="width: 200px;">
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>등록일</th>
              <th>등록자</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(notice, idx) in noticeBoardList" :key="idx">
              <td>{{ getId(idx) }}</td>
              <td class="tit">
                <router-link :to="{ name: 'NoticeDetail', params: { postId: notice.id }}"
                             class="block text-left whitespace-normal"
                >
                  {{ notice.title }}
                </router-link>
              </td>
              <td>{{ $moment(notice.regDate).format('YYYY-MM-DD') }}</td>
              <td>{{ notice.user.name }}</td>
            </tr>
            <tr v-if="noticeBoardList.length === 0">
              <td colspan="4">
                게시글이 없습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <pagination :current-page="searchParam.page" :total-items="totalElements"
                :items-per-page="searchParam.size" :max-size="5" class="mt-10" @change="searchPage"
    />
    <router-link v-if="isAdmin" :to="{ name: 'NoticeWrite'}"
                 class="btn-write"
    >
      등록
    </router-link>
  </div>
</template>

<script lang="ts">
import {
  reactive, toRefs, computed,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { Pagination } from '@/components/modules';

export default {
  name: 'NoticeTable',
  components: {
    Pagination,
  },
  setup() {
    const { instance } = getInstance();
    const state = reactive({
      noticeBoardList: computed(() => instance.$store.state.board.noticeBoard.content),
      totalElements: computed(() => instance.$store.state.board.noticeBoard.totalElements),
      searchParam: computed(() => instance.$store.state.board.searchParam),
      isAdmin: computed(() => {
        const userInfo = instance.$store.state.global.userInfo;
        if (!userInfo.name) return false;
        return userInfo.roleList.find((v) => v.name === 'ADMIN') !== undefined;
      }),
    });
    const searchPage = (v) => {
      const data = {
        ...state.searchParam,
        page: v,
      };
      instance.$store.commit('board/setSeachParam', data);
      instance.$store.dispatch('board/getNoticeBoard');
    };

    const getId = (idx) => {
      const [page, size, total] = [state.searchParam.page, state.searchParam.size, state.totalElements];
      const prev = size * (page - 1);
      const top = total - prev;
      return top - idx;
    };

    return {
      ...toRefs(state),
      searchPage,
      getId,
    };
  },
};
</script>

<style scoped>
.tbl tbody th,
.tbl tbody td {
  font-size: 14px;
}
.tbl.basic tbody td {
  height: 45px;
}
.tbl tbody td:not(.tit) {
  color: #888;
}
.btn-write {
  position: absolute;
  bottom: 0;
  right: 0;
  min-width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: .25rem;
  color: #fff;
  background-color: var(--KB-gray);
}
</style>
