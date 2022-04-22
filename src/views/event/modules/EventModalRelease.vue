<template>
  <modal :visible="proxyVisible" size="md" @closeModal="closeModal">
    <template #header>
      <h3>미등록 자원 등록</h3>
    </template>

    <template #body>
      <div class="modal-top">
        <p class="guide">
          <i class="fi fi-rr-exclamation" />
          [Data Source] 선택 후 [이동] 클릭하시면 Project 등록 팝업창으로 이동합니다.
        </p>
      </div>
      <table-container id="eventListTable" type="data" :height="dataSourceList.length > 10 ? '500px' : ''">
        <caption>미등록 자원</caption>
        <colgroup>
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
        </colgroup>
        <thead>
          <tr>
            <th scope="col" />
            <th scope="col">
              <span>Organization 명</span>
            </th>
            <th scope="col">
              <span>Organization 하위 명</span>
            </th>
            <th scope="col">
              <span>Data Source 명</span>
            </th>
            <th scope="col">
              <span>설명</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="dataSourceList.length === 0">
            <td colspan="4" class="empty">
              Data가 없습니다.
            </td>
          </tr>
          <tr v-for="(data,idx) in dataSourceList" :key="idx">
            <td class="chk-item">
              <input :id="idx" type="radio" name="radio" class="inp" :checked="idx === selectIdx"
                     @change="selectCheckbox(idx)"
              >
              <label :for="idx" class="ico" />
            </td>
            <td>
              <span class="text clip">
                {{ data.oneDepthOrganizationName }}
              </span>
            </td>
            <td>
              <span class="text clip">
                {{ data.twoDepthOrganizationName }}
              </span>
            </td>
            <td>
              <span class="text clip">
                {{ data.name }}
              </span>
            </td>
            <td>
              <span class="text clip">
                {{ data.description }}
              </span>
            </td>
          </tr>
        </tbody>
      </table-container>
    </template>

    <template #footer>
      <button class="modal-button" @click="cancel">
        취소
      </button>
      <button class="modal-button primary" @click="save">
        이동
      </button>
    </template>
  </modal>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, computed,
} from '@vue/composition-api';
import { Modal, TableContainer } from '@/components';
import { getInstance } from '@/composable';

interface Props {
  id?:string;
  visible?:boolean;
}
interface Data {
  dataSourceUrl?:string;
  externalLabel?:string;
}
export default defineComponent({
  name: 'EventModalRelease',
  components: {
    Modal,
    TableContainer,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props:Props, { emit }) {
    const { instance } = getInstance();

    const state = reactive({
      proxyVisible: props.visible,
      data: {} as Data,
      ignoreReason: '',
      dataSourceList: computed(() => instance.$store.state.event.unknownDataSourceList),
      selectIdx: 0,
    });

    const selectCheckbox = (idx:string):void => {
      state.selectIdx = Number(idx);
    };

    const openModal = (data):void => {
      if (!data) return;
      state.proxyVisible = true;
      state.data = data;
      state.selectIdx = 0;

      const param = {
        dataSourceUrl: state.data.dataSourceUrl,
        externalLabel: state.data.externalLabel,
      };
      instance.$store.dispatch('event/getUnknownDataSourceList', param);
    };
    const closeModal = ():void => {
      state.proxyVisible = false;
      state.ignoreReason = '';
      instance.$store.commit('event/setUnknownDataSourceList', []);
    };

    const cancel = ():void => {
      const confirm = window.confirm('저장하지 않고 나가시겠습니까?');
      if (confirm) { closeModal(); }
    };

    const save = ():void => {
      const obj = {
        ...state.data,
        ...state.dataSourceList[state.selectIdx],
      };
      const data = {
        prometheusId: obj.prometheusId || '',
        prometheusName: obj.name || '',
        oneDepthOrganizationName: obj.oneDepthOrganizationName || '',
        twoDepthOrganizationName: obj.twoDepthOrganizationName || '',
        projectName: obj.projectName || '',
        jobName: obj.jobName || '',
        groupName: obj.groupName || '',
        description: obj.description || '',
      };
      emit('save', data);
    };

    return {
      ...toRefs(state),
      openModal,
      closeModal,
      cancel,
      save,
      selectCheckbox,
    };
  },
});
</script>
