<template>
  <modal :id="id" :visible="proxyVisible" size="sm" @closeModal="closeModal">
    <template #header>
      <h3>상태 등록/조회</h3>
    </template>

    <template #body>
      <div v-if="statusType === 0" class="modal-top">
        <p class="guide">
          <i class="fi fi-rr-exclamation" />
          Event Type 항목 중 <em class="code">Pod</em>, <em class="code">PodError</em>, <em class="code">Job</em>, <em class="code">WebHook</em> 은 &lsquo;해제&rsquo;로 변경 시<br>
          <u class="highlight">수동해제</u> 되어 <u class="highlight">해제 탭</u>으로 이동됩니다.
        </p>
      </div>
      <ul class="data-list">
        <li class="flex-row">
          <strong class="tit leading-8">상태</strong>
          <div class="con">
            <select-box id="status" name="status" :value="data.status"
                        :options="selectStatus" @change="changeSelectBox"
            />
          </div>
        </li>
        <li class="flex-row">
          <strong class="tit leading-8">메모</strong>
          <div class="con">
            <textarea v-model.trim="data.memo" cols="30" rows="10" maxlength="500" style="height: 100px;" spellcheck="false" />
            <div v-if="data.memoModifier && data.memoModifyDate"
                 class="memo-info pt-2"
            >
              <span class="writer">작성자 : {{ data.memoModifier }} /</span>
              <span class="date pl-1">작성일자 : {{ data.memoModifyDate }}</span>
            </div>
          </div>
        </li>
        <li class="flex-row">
          <strong class="tit leading-8">조치 담당자</strong>
          <div class="con">
            <input v-model.trim="data.solver" type="text" class="inp-t" spellcheck="false" placeholder="김국민">
          </div>
        </li>
        <li class="flex-row">
          <strong class="tit leading-8">조치 일시</strong>
          <div class="con">
            <input v-model.trim="data.processingDate" type="text" class="inp-t" spellcheck="false" placeholder="YYYY-MM-DD HH:MM:SS">
          </div>
        </li>
        <li class="flex-row">
          <strong class="tit">상태 History</strong>
          <div class="con">
            <ul class="history">
              <li v-for="(item, idx) in impactFlowData.impactFlowLog" :key="idx">
                <span>{{ item.status | changeStatusStr }}</span>
                <span class="date">{{ item.registDate }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </template>

    <template #footer>
      <button class="modal-button" @click="cancel">
        취소
      </button>
      <button class="modal-button primary" @click="updateStatus">
        저장
      </button>
    </template>
  </modal>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, computed,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { Modal, SelectBox } from '@/components';
import { SELECT_OPTIONS } from '@/views/event/constants';

interface Props {
  id?: string;
  visible?: boolean;
  statusType?: number;
}
interface SearchParam {
  id: number; // impactFlowId
  status?: string;
  solver?: string;
  processingDate?: string;
  memo?: string;
  memoModifier?: string;
  memoModifyDate?: string;
  statusType?: number;
}
const defaultData = {
  id: 0,
  status: '',
  solver: '',
  processingDate: '',
  memo: '',
  memoModifier: '',
  memoModifyDate: '',
} as SearchParam;

export default defineComponent({
  name: 'EventModalStatus',
  components: {
    Modal,
    SelectBox,
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
    statusType: { // 0 발생 , 1 해제
      type: Number,
      default: 0,
    },
  },
  filters: {
    changeStatusStr: (value):string|undefined => {
      const { STATUS } = SELECT_OPTIONS;
      const status = STATUS.find((s) => s.value === value);
      return status?.label;
    },
  },
  setup(props: Props) {
    const { instance } = getInstance();
    const { STATUS } = SELECT_OPTIONS;
    const state = reactive({
      proxyVisible: props.visible,
      data: defaultData,
      selectStatus: computed(() => (
        props.statusType === 0
          ? STATUS.filter((item) => item.value !== 'NR')
          : STATUS.filter((item) => item.value !== 'G').map((item) => ({
            ...item,
            disabled: item.value === 'NR',
          }))
      )),
      impactFlowData: computed(() => instance.$store.state.event.impactFlowData),
    });

    const changeSelectBox = (e:Event):void => {
      const target = e.target as HTMLInputElement;
      state.data[target.name] = target.value;
    };

    const openModal = async (data):Promise<void> => {
      if (!data) return;
      state.proxyVisible = true;

      const param = { impactFlowId: data.impactFlowId };
      await instance.$store.dispatch('event/getImpactFlow', param);

      const impact = state.impactFlowData;
      state.data = {
        ...data,
        memo: impact.memo,
        memoModifier: impact.memoModifier,
        memoModifyDate: impact.memoModifyDate,
        solver: impact.solver,
        processingDate: impact.processingDate,
      };
    };

    const closeModal = ():void => {
      state.proxyVisible = false;
      state.data = defaultData;
    };

    const cancel = ():void => {
      const confirm = window.confirm('저장하지 않고 나가시겠습니까?');
      if (confirm) closeModal();
    };

    const updateStatus = async ():Promise<void> => {
      // validate
      const type = state.impactFlowData.thresholdResourceType;
      const isManual:boolean = type === 'Pod' || type === 'PodError' || type === 'Job' || type === 'WebHook';
      if (isManual && state.data.status === 'R') {
        if (!state.data.processingDate) {
          alert('수동해제의 경우 조치 일시는 필수 항목입니다.');
          return;
        }
      }
      if (state.data.processingDate) {
        const regExp = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/; // YYYY-MM-DD HH:MM:SS
        const flag = regExp.test(state.data.processingDate);
        if (!flag) {
          alert('조치 일시는 YYYY-MM-DD HH:MM:SS 형식입니다.');
          return;
        }
      }
      const param:SearchParam = {
        id: state.impactFlowData.id,
        status: state.data.status,
        memo: state.data.memo,
        solver: state.data.solver,
        processingDate: state.data.processingDate,
        statusType: props.statusType,
      };
      instance.$store.dispatch('event/setImpactFlow', param);
      closeModal();
    };

    return {
      ...toRefs(state),
      changeSelectBox,
      openModal,
      closeModal,
      cancel,
      updateStatus,
    };
  },
});
</script>

<style scoped>
.slt, .inp-t {
  height: 2rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
}
.slt {
  width: 8rem;
  padding: 2px 2rem 0 10px;
  background-position: right 0.5rem center;
}
.slt:focus {
  border-color: #5e5d5b;
}
.inp-t {
  width: 100%;
  padding: 2px 10px 0;
}
.data-list textarea {
  padding: 10px;
}
.memo-info {
  color: #888;
}

.history {
  overflow: hidden auto;
  max-height: 100px;
}
.history li {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 0.5rem 0 1rem;
  line-height: 1.5rem;
}
.history li::after {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(2px,-4px);
  width: 6px;
  height: 6px;
  background: var(--lightgray);
  border-radius: 50%;
  content: ' ';
}
.history .date {
  font-family: 'KBFGTextL';
  color: #888;
}
</style>
