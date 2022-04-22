<template>
  <div class="pagination">
    <a title="첫 페이지" class="page-first" @click.prevent="goPrevPage(1)">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M24 0v24H0V0h24z" fill="none" />
        <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41zM6 6h2v12H6V6z" /></svg>
    </a>
    <a title="이전 페이지" class="page-prev" @click.prevent="goPrevPage(currentPage - 1)">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" /><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </a>
    <a v-for="(page, idx) in pageNewList" :key="idx"
       class="link" :class="{'active': page === currentPage}"
       @click.prevent="changePage(page)"
    >
      {{ page }}
    </a>
    <a title="다음 페이지" class="page-next" @click.prevent="goNextPage(currentPage + 1)">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" /><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      </svg>
    </a>
    <a title="마지막 페이지" class="page-last" @click.prevent="goNextPage(totalPage())">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41zM16 6h2v12h-2V6z" />
      </svg>
    </a>
  </div>
</template>

<script lang="ts">
import { computed, reactive, toRefs } from '@vue/composition-api';

interface Props {
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  maxSize?: number;
}
export default {
  props: {
    currentPage: { // 현재 페이지
      type: Number,
      default: 1,
    },
    totalItems: { // 전체 item 개수
      type: Number,
      default: 1,
    },
    itemsPerPage: { // 한페이지 목록 개수
      type: Number,
      default: 20,
    },
    maxSize: { // 페이징 개수(홀수)
      type: Number,
      default: 5,
    },
  },
  setup(props: Props, { emit }) {
    const totalPage = () => {
      const total = Number(props.totalItems);
      const items = Number(props.itemsPerPage);
      return total % items === 0 ? Math.floor(total / items) : Math.floor(total / items) + 1;
    };

    const calculateStartPage = () => {
      const current = Number(props.currentPage);
      const limit = Number(props.maxSize);

      const startPage = current % limit === 0
        ? limit * (Math.floor(current / limit) - 1) + 1
        : limit * Math.floor(current / limit) + 1;
      return startPage;
    };

    const calculateEndPage = () => {
      const current = Number(props.currentPage);
      const limit = Number(props.maxSize);
      const total = totalPage();

      const endPage = current % limit === 0
        ? limit * Math.floor(current / limit)
        : limit * (Math.floor(current / limit) + 1);
      return endPage > total ? total : endPage;
    };

    const getPageList = () => {
      const current = Number(props.currentPage);
      const limit = Number(props.maxSize);
      const half = Math.floor(limit / 2);
      const total = totalPage();
      const newArr = [] as number[];
      let start:number;
      let end:number;
      if (total === 0) {
        start = 1;
        end = 1;
      } else if (total < limit) {
        start = 1;
        end = total;
      } else if (current <= half) {
        start = 1;
        end = limit;
      } else if (current + half >= total) {
        start = total - limit + 1;
        end = total;
      } else {
        start = current - half;
        end = current + half;
      }
      for (let i = start; i <= end; i++) {
        newArr.push(i);
      }
      return newArr;
    };

    const changePage = (v) => {
      if (props.currentPage === v) return;
      emit('change', v);
    };

    const goPrevPage = (n) => {
      if (Number(props.currentPage) <= 1) return;
      emit('change', n);
    };

    const goNextPage = (n) => {
      const total = totalPage();

      if (Number(props.currentPage) >= total) return;
      emit('change', n);
    };

    const state = reactive({
      startPage: computed(() => calculateStartPage()),
      endPage: computed(() => calculateEndPage()),
      totalPage: computed(() => totalPage()),
      pageList: computed(() => {
        const newArr = [] as number[];
        for (let i = state.startPage; i <= state.endPage; i++) {
          newArr.push(i);
        }
        return newArr;
      }),
      pageNewList: computed(() => getPageList()),
    });

    return {
      ...toRefs(state),
      totalPage,
      changePage,
      goPrevPage,
      goNextPage,
    };
  },
};
</script>

<style scoped>
.pagination {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pagination > a {
  display: inline-flex;
}
.pagination .link {
  margin: 0 15px;
  color: #777;
}
.pagination .link:hover {
  color: var(--KB-gold);
}
.pagination .link.active {
  font-weight: bold;
  color: #111;
}
.pagination [class|="page"] {
  position: relative;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: #fff;
  border: 1px solid #ddd;
}
.pagination .page-first,
.pagination .page-next {
  border-right-width: 0;
}
.pagination .page-prev {
  margin-right: 30px;
}
.pagination .page-next {
  margin-left: 30px;
}
.pagination svg {
  fill: #666;
}
</style>
