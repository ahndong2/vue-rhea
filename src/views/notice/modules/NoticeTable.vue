<template>
  <div class="content-inner">
    <div class="tbl basic">
      <div class="table-container">
        <table>
          <caption>공지사항</caption>
          <colgroup>
            <col style="width: 150px;">
            <col style="width: auto;">
            <col style="width: 150px;">
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
                <a :href="`/backoffice/board/400/post?postId=${notice.id}`">
                  {{ notice.title }}
                </a>
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
                :items-per-page="searchParam.size" :max-size="5" @change="searchPage"
    />
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
      const prev = state.searchParam.size * (state.searchParam.page - 1);
      const top = state.totalElements - prev;
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
