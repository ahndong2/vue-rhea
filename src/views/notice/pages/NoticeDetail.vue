<template>
  <main id="content" class="content-wrapper notice">
    <div class="content-head">
      <h2 class="content-title">
        공지사항
      </h2>
    </div>
    <div class="content-inner">
      <div class="post">
        <dl data-type="title">
          <dt class="label">
            <label class="cursor-default">제목</label>
          </dt>
          <dd class="flex-1">
            {{ title }}
          </dd>
        </dl>
        <dl data-type="content">
          <dt class="label">
            <label class="cursor-default">내용</label>
          </dt>
          <dd class="flex-1" v-html="content" />
        </dl>
        <div class="btn-area">
          <button v-if="isAdmin" class="btn-edit" @click="edit">
            수정
          </button>
          <button class="btn-list" @click="goBack">
            목록
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import {
  reactive, toRefs, onMounted, computed, watch,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import router from '@/router';

export default {
  name: 'NoticeDetail',
  components: {},
  setup() {
    const { instance } = getInstance();
    const state = reactive({
      post: computed(() => instance.$store.state.board.noticePost),
      title: '',
      content: '',
      isAdmin: computed(() => {
        const userInfo = instance.$store.state.global.userInfo;
        if (!userInfo.name) return false;
        return userInfo.roleList.find((v) => v.name === 'ADMIN') !== undefined;
      }),
    });

    const goBack = () => {
      router.push({ name: 'NoticeList' });
    };

    const edit = () => {
      router.push({ name: 'NoticeEdit' });
    };

    const render = (post) => {
      state.title = post.title;
      state.content = post.content;
    };

    watch(() => state.post, (post) => {
      if (post !== null) {
        render(post);
      } else {
        alert('해당 게시글이 없습니다.');
        router.push({ name: 'NoticeList' });
      }
    });

    onMounted(() => {
      const param = instance.$route.params.postId;
      instance.$store.dispatch('board/getNoticePost', param);
    });

    return {
      ...toRefs(state),
      goBack,
      edit,
      render,
    };
  },
};
</script>

<style scoped>
.post {
  padding: 0 100px;
}
.post > dl {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.post > dl:first-child {
  padding-top: 0;
}
.post .label {
  width: 100px;
  font-weight: 700;
  line-height: 50px;
  white-space: nowrap;
}
[data-type="title"] dd {
  padding-top: 13px;
  font-size: 17px;
}
[data-type="content"] dd {
  min-height: 300px;
  padding: 10px 0;
  font-size: 15px;
  line-height: 2.0;
}
.btn-area {
  margin-top: 1rem;
  /* padding: 0 10px; */
  text-align: right;
}
.btn-area button {
  min-width: 100px;
  height: 40px;
  margin-left: 1rem;
  padding: 2px 1rem 0;
  border-radius: 0.25rem;
}
.btn-edit {
  background-color: #fbe8dd;
  color: #f36241;
}
.btn-list {
  background-color: var(--KB-gray);
  color: #fff;
}
</style>
