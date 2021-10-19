<template>
  <div class="pagination">
    <a href="javascript:void(0);" class="page-first" @click="prevPage(1)">
      <icon name="page_first" />
      <span class="hide">첫 페이지</span>
    </a>
    <a href="javascript:void(0);" class="page-prev" @click="prevPage(currentPage - 1)">
      <icon name="arr_l" />
      <span class="hide">이전 페이지</span>
    </a>
    <a v-for="(page, idx) in pageList" :key="idx" href="javascript:void(0);"
       :class="['link', {'active': page === currentPage}]"
       @click="changeCurrentPage(page)"
    >{{ page }}</a>
    <a href="javascript:void(0);" class="page-next" @click="nextPage(currentPage + 1)">
      <icon name="arr_r" />
      <span class="hide">다음 페이지</span>
    </a>
    <a href="javascript:void(0);" class="page-last" @click="nextPage(totalPage())">
      <icon name="page_last" />
      <span class="hide">마지막 페이지</span>
    </a>
  </div>
</template>

<script lang="ts">
import { computed, reactive, toRefs } from '@vue/composition-api';
import Icon from '@/components/modules/icon/Icon.vue';

interface Props {
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  maxSize?: number;
}
export default {
  components: { Icon },
  props: {
    currentPage: { // 현재페이지
      type: Number,
      default: 1,
    },
    totalItems: { // 전체 item 갯수
      type: Number,
      default: 1,
    },
    itemsPerPage: { // 한페이지 목록 갯수
      type: Number,
      default: 20,
    },
    maxSize: { // 페이징 갯수
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
      const currentPage = Number(props.currentPage);
      const maxSize = Number(props.maxSize);

      return currentPage % maxSize === 0
        ? maxSize * (Math.floor(currentPage / maxSize) - 1) + 1
        : maxSize * Math.floor(currentPage / maxSize) + 1;
    };

    const calculateEndPage = () => {
      const page = Number(props.currentPage);
      const limit = Number(props.maxSize);
      const total = totalPage();

      let endPage = limit * (Math.floor(page / limit) + 1);

      if (page % limit === 0) {
        endPage = limit * Math.floor(page / limit);
      }

      return total < endPage ? total : endPage;
    };

    const prevPage = (n) => {
      if (Number(props.currentPage) <= 1) return;
      emit('change', n);
    };

    const nextPage = (n) => {
      const total = totalPage();

      if (Number(props.currentPage) >= total) return;
      emit('change', n);
    };

    const changeCurrentPage = (v) => {
      emit('change', v);
    };

    const state = reactive({
      startPage: computed(() => calculateStartPage()),
      endPage: computed(() => calculateEndPage()),
      totalPage: computed(() => totalPage()),
      pageList: computed(() => {
        const newArr = [] as number[];

        for (let i = state.startPage; i <= state.endPage; i += 1) {
          newArr.push(i);
        }
        if (newArr.length === 0) {
          newArr.push(1);
        }
        return newArr;
      }),
    });

    return {
      ...toRefs(state),
      changeCurrentPage,
      prevPage,
      nextPage,
      totalPage,
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
  margin-top: 40px;
}
.pagination > a {
  display: inline-flex;
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
.pagination .ico {
  opacity: .6;
}
.pagination .link {
  margin: 0 15px;
  color: #777;
}
.pagination .link:hover {
  color: var(--KB-gold);
}
.pagination .link.active {
  font-weight: 700;
  color: #111;
  /* color: var(--KB-positive); */
}
</style>
