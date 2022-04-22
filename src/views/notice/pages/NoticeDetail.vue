<template>
  <main id="content" class="content-wrapper notice">
    <div class="content-head">
      <h2 class="content-title">
        공지사항
      </h2>
    </div>
    <div class="content-inner">
      <div class="flex-1 detail">
        <dl class="view">
          <dt class="title">
            {{ title }}
          </dt>
          <dd class="content" v-html="content" />
        </dl>
        <div class="btn-area">
          <button v-if="isAdmin" class="btn-edit" @click="editPost">
            수정
          </button>
          <button class="btn-list" @click="goBack">
            목록
          </button>
        </div>
      </div>
      <div class="flex-1 comment">
        <div class="count">
          댓글 <span class="num">{{ commentList.length }}</span>
        </div>
        <div class="write">
          <textarea v-model.trim="comment" cols="30" rows="10" spellcheck="false" />
          <button class="btn-submit" :disabled="!comment" data-mode="create" @click="submit">
            등록
          </button>
        </div>

        <ul v-if="commentList.length > 0" class="comment-list">
          <li v-for="(comment,idx) in commentList" :key="idx">
            <div class="info">
              <div class="name">
                {{ comment.user.name }}
              </div>
              <div class="date">
                {{ $moment(comment.regDate).format('YYYY-MM-DD HH:mm') }}
              </div>
            </div>
            <div v-if="comment.id === edit.id" class="write">
              <textarea v-model.trim="edit.content" cols="30" rows="10" spellcheck="false" />
              <button class="btn-submit" data-mode="edit" @click="editSubmit">
                수정
              </button>
            </div>
            <div v-else class="content">
              {{ comment.content }}
            </div>
            <div v-if="userInfo.id === comment.user.id" class="btns">
              <button class="btn" @click="editComment(comment)">
                <i class="fi fi-rr-pencil" />
                <span class="hide">수정</span>
              </button>
              <button class="btn" @click="deleteComment(comment.id)">
                <i class="fi fi-rr-trash text-sm" />
                <span class="hide">삭제</span>
              </button>
            </div>
          </li>
        </ul>
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
      comment: '',
      commentList: computed(() => instance.$store.state.board.commentList),
      userInfo: computed(() => instance.$store.state.global.userInfo),
      edit: {
        id: 0,
        content: '',
      },
    });

    const goBack = () => {
      router.push({ name: 'NoticeList' });
    };

    const editPost = () => {
      router.push({ name: 'NoticeEdit' });
    };

    const render = (post) => {
      state.title = post.title;
      state.content = post.content;
    };

    const submit = () => { // 댓글 등록 (POST)
      const data = {
        content: state.comment,
        postId: state.post.id,
        userId: state.userInfo.id,
      };
      instance.$store.dispatch('board/setCommentWrite', data);
      state.comment = '';
    };

    const deleteComment = (id) => { // 댓글 삭제 (DELETE)
      const confirm = window.confirm('삭제하시겠습니까?');
      const param = {
        commentId: id,
        postId: state.post.id,
        userId: state.userInfo.id,
      };
      if (confirm) {
        instance.$store.dispatch('board/deleteComment', param);
      }
    };

    const clearEdit = () => { // 댓글 수정 초기화
      state.edit.id = 0;
      state.edit.content = '';
    };

    const editComment = (comment) => { // 댓글 수정
      if (state.edit.id === comment.id) { // close
        clearEdit();
      } else { // open
        state.edit.id = comment.id;
        state.edit.content = comment.content;
      }
    };

    const editSubmit = () => { // 댓글 수정 (POST)
      const confirm = window.confirm('수정하시겠습니까?');
      const data = {
        id: state.edit.id, // commentId
        content: state.edit.content,
        postId: state.post.id,
      };
      if (confirm) {
        instance.$store.dispatch('board/editComment', data);
        clearEdit();
      }
    };

    watch(() => state.post, (post) => {
      if (post !== null) {
        render(post);
      } else {
        alert('해당 게시글이 없습니다.');
        router.push({ name: 'NoticeList' });
      }
    });

    onMounted(():void => {
      const param = instance.$route.params.postId;
      // 게시글 조회 (GET)
      instance.$store.dispatch('board/getNoticePost', param);
      // 댓글 조회 (GET)
      instance.$store.dispatch('board/getComments', param);
    });

    return {
      ...toRefs(state),
      goBack,
      editPost,
      render,
      submit,
      deleteComment,
      editComment,
      editSubmit,
    };
  },
};
</script>

<style>
.notice .detail .content em {font-style: italic;}
</style>
<style scoped>
.content-inner {
  max-width: 1024px;
}
.detail .view {
  background-color: #fff;
  border-radius: 0.5rem;
  cursor: default;
}
.detail .title {
  padding: 1.3rem 1.5rem 0;
  font-weight: bold;
  font-size: 1.25rem;
}
.detail .content {
  padding: 1rem 1.5rem 1.5rem;
  font-size: 15px;
  line-height: 1.7;
}

.btn-area {
  padding-top: 1.3rem;
  padding-bottom: 1rem;
  text-align: right;
}
.btn-area button {
  min-width: 100px;
  height: 40px;
  margin-left: 1rem;
  padding: 2px 1rem 0;
  font-size: 15px;
  border-radius: 0.25rem;
}

.write {
  position: relative;
  display: flex;
  justify-content: center;
}
.write textarea {
  height: 90px;
  font-size: 15px;
  color: #555;
  border-radius: 0.375rem;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.btn-submit {
  flex: 0 0 100px;
  font-size: 15px;
  background-color: var(--KB-negative);
  border-radius: 0.375rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.btn-submit:disabled {
  background-color: #e4e4e4;
  color: #555;
}
.btn-submit[data-mode="edit"] {
  background-color: #a7acb3;
  color: #fff;
}

.btn-edit {
  background-color: #fbe8dd;
  color: #f36241;
}
.btn-list {
  background-color: var(--KB-gray);
  color: #fff;
}

.comment .count {
  padding-bottom: .5rem;
  font-size: 15px;
}
.comment .count .fi {
  margin-right: 2px;
  color: var(--KB-gray);
}
.comment .count .num {
  color: var(--rhea);
}

.comment-list {
  margin-top: 1rem;
}
.comment-list li {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  font-size: 14px;
  border-bottom: 1px solid rgb(0 0 0 / 5%);
}
.comment .info {
  display: flex;
  align-items: center;
  padding-bottom: .5rem;
  font-family: 'KBFGTextL';
}
.comment .name {
  color: #555;
}
.comment .date {
  margin-left: .5rem;
  padding-top: 2px;
  color: #888;
}
.comment .content {
  word-break: keep-all;
}
.comment .btns {
  position: absolute;
  right: 0;
  top: 10px;
}
.comment .btns .btn {
  display: inline-flex;
  width: 29px;
  height: 28px;
  justify-content: center;
  align-items: center;
  margin-left: .25rem;
  padding-left: 1px;
  vertical-align: top;
  font-size: 13px;
  color: var(--gray);
  border: 1px solid #aaa;
  border-radius: .5rem;
}
</style>
