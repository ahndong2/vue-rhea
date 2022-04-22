<template>
  <modal :id="id" :visible="proxyVisible" size="sm" @closeModal="closeModal">
    <template #header>
      <h3>Event 예외 처리</h3>
    </template>

    <template #body>
      <div class="modal-top">
        <p class="guide">
          <i class="fi fi-rr-exclamation" />
          아래 항목에 해당되는 Event Type의 모든 이벤트 로그는 전체 예외 처리 됩니다.
        </p>
      </div>
      <ul class="data-list">
        <li class="flex-row">
          <strong class="tit">Organization</strong>
          <div class="con">
            <span v-if="data.parentOrgName">{{ data.parentOrgName }}-</span>{{ data.orgNm }}
          </div>
        </li>
        <li class="flex-row">
          <strong class="tit">Data Source</strong>
          <div class="con">
            {{ data.prometheusNm }}
          </div>
        </li>
        <li class="flex-row">
          <strong class="tit">Project 분류</strong>
          <div class="con">
            {{ data.groupInfoNm }}
          </div>
        </li>
        <li class="flex-row">
          <strong class="tit">Event Type</strong>
          <div class="con">
            {{ data.thresholdResourceType }}
          </div>
        </li>
        <li class="flex-col">
          <strong class="tit">예외 사유</strong>
          <div class="con">
            <textarea v-model.trim="ignoreReason" cols="30" rows="10" maxlength="400" style="height: 130px;" spellcheck="false" />
          </div>
        </li>
      </ul>
    </template>

    <template #footer>
      <button class="modal-button" @click="cancel">
        취소
      </button>
      <button class="modal-button primary" @click="save">
        저장
      </button>
    </template>
  </modal>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs,
} from '@vue/composition-api';
import { Modal } from '@/components';
import { EventLog } from '@/store/type';

interface Props {
  id?:string;
  visible?:boolean;
}

export default defineComponent({
  name: 'EventModalExcCreate',
  components: {
    Modal,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props:Props, { emit }) {
    const state = reactive({
      proxyVisible: props.visible,
      data: {} as EventLog,
      ignoreReason: '',
    });

    const openModal = (data):void => {
      if (!data) return;
      state.proxyVisible = true;
      state.data = data;
    };
    const closeModal = ():void => {
      state.proxyVisible = false;
      state.ignoreReason = '';
    };

    const cancel = ():void => {
      const confirm = window.confirm('저장하지 않고 나가시겠습니까?');
      if (confirm) closeModal();
    };
    const save = ():void => {
      if (state.ignoreReason) {
        const saveData = {
          ...state.data,
          ignoreReason: state.ignoreReason,
          thresholdResourceType: state.data.thresholdResourceType,
        };
        emit('createEventExc', saveData);
        closeModal();
        return;
      }
      window.alert('입력하지 않은 항목이 있습니다.');
    };

    return {
      ...toRefs(state),
      openModal,
      closeModal,
      cancel,
      save,
    };
  },
});
</script>
