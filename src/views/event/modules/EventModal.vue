<template>
  <fragment>
    <modal :visible="modalVisible">
      <template v-slot:header>
        <h3>Event 예외 처리</h3>
      </template>
      <!-- content -->
      <ul class="data-list">
        <li>
          <strong class="label">Organization</strong>
          <span>KB은행</span>
        </li>
        <li>
          <strong class="label">Prometheus</strong>
          <span>마이데이터</span>
        </li>
        <li>
          <strong class="label">Group&amp;Job</strong>
          <span>JTL_market</span>
        </li>
        <li>
          <strong class="label">발생 자원</strong>
          <span>VM(123.1.11.223)</span>
        </li>
        <li>
          <strong class="label">Event Type</strong>
          <span>CPU Usage</span>
        </li>
        <li>
          <strong class="label">예외 사유</strong>
          <span>
            <textarea id="" name="" cols="30" rows="10" style="height: 130px;" />
          </span>
        </li>
      </ul>
      <!-- // content -->
    </modal>
  </fragment>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs,
} from '@vue/composition-api';
import { Fragment } from 'vue-fragment';
import { Modal } from '@/components';

export default defineComponent({
  name: 'EventModal',
  components: {
    Fragment,
    Modal,
  },
  setup() {
    // state
    const state = reactive({
      modalVisible: false,
    });

    const openModal = () => {
      state.modalVisible = true;
    };

    return {
      ...toRefs(state),
      openModal,
    };
  },
});
</script>

<style scoped>
.data-list {}
.data-list textarea {
  background-color: #eee;
}
</style>
