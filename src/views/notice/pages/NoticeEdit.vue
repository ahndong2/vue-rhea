<template>
  <main id="content" class="content-wrapper notice">
    <div class="content-head">
      <h2 class="content-title">
        공지사항
      </h2>
    </div>
    <div class="content-inner">
      <div class="post">
        <dl>
          <dt class="label">
            <label for="title">제목</label>
          </dt>
          <dd class="flex-1">
            <input id="title" v-model.trim="title" type="text" spellcheck="false" class="inp-t" placeholder="제목을 입력해 주세요." maxlength="100">
          </dd>
        </dl>
        <dl>
          <dt class="label">
            <label class="cursor-default">내용</label>
          </dt>
          <dd class="flex-1">
            <editor :content="content" @input="inputContent" />
          </dd>
        </dl>
      </div>
      <div class="btn-area">
        <button class="btn-cancel" @click="goBack">
          취소
        </button>
        <button class="btn-submit" @click="submit">
          저장
        </button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import {
  reactive, toRefs, onMounted, computed, watch,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { Editor } from '@/components';
import router from '@/router';

export default {
  name: 'NoticeEdit',
  components: {
    Editor,
  },
  setup() {
    const { instance } = getInstance();
    const state = reactive({
      post: computed(() => instance.$store.state.board.noticePost),
      id: 0,
      title: '',
      content: '',
    });

    const inputContent = (data) => {
      state.content = data;
    };

    const goBack = () => {
      const confirm = window.confirm('저장하지 않고 나가시겠습니까?');
      if (confirm) router.push({ name: 'NoticeList' });
    };

    const submit = () => {
      // validate
      if (state.title === '') {
        alert('제목을 입력해 주세요.');
        return;
      }
      if (state.content === '') {
        alert('내용을 입력해 주세요.');
        return;
      }
      const data = {
        id: state.id,
        title: state.title,
        content: state.content,
      };
      // API POST
      instance.$store.dispatch('board/setNoticeEdit', data);
    };

    const render = (post) => {
      state.id = post.id;
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

    onMounted(async () => {
      const param = instance.$route.params.postId;
      instance.$store.dispatch('board/getNoticePost', param);
    });

    return {
      ...toRefs(state),
      inputContent,
      goBack,
      submit,
      render,
    };
  },
};
</script>

<style scoped>
.content-inner {
  max-width: 1024px;
}
.post > dl {
  display: flex;
  padding-bottom: 1.5rem;
}
.post .label {
  width: 100px;
  flex: 0 0 100px;
  font-weight: bold;
  line-height: 3rem;
  white-space: nowrap;
}
.post .inp-t {
  width: 100%;
  height: 3rem;
  padding: 0 1.25rem;
  font-size: 14px;
  background-color: #fff;
  border: 1px solid #d1d1d1;
}
.btn-area {
  text-align: right;
}
.btn-area button {
  min-width: 100px;
  height: 40px;
  margin-left: 1rem;
  padding: 2px 1rem 0;
  border-radius: 0.25rem;
}
.btn-cancel {
  background-color: #e4e4e4;
  color: #444;
}
.btn-submit {
  background-color: var(--KB-positive);
  color: #fff;
}
</style>
