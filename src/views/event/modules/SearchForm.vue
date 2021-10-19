<template>
  <div id="toolbar" class="toolbar mb-6">
    <h3 class="hide">
      조회 영역
    </h3>
    <div class="left-part">
      <div v-if="type !=='EventIgnore'" class="tool">
        <select-box id="organizationName" name="organizationName" title="Organization 선택"
                    :value="organizationName" :options="selectOrganization" @change="changeSelectBox"
        />
      </div>
      <div class="tool">
        <input v-model="prometheusName" type="text" class="inp-t" placeholder="Prometheus 입력">
      </div>
      <div class="tool">
        <input v-model="groupJobName" type="text" class="inp-t" placeholder="Group&amp;Job 입력">
      </div>
      <div v-if="type !=='EventIgnore'" class="tool">
        <select-box id="alertLevel" name="alertLevel" title="Alert 레벨 전체"
                    :value="alertLevel" :options="selectAlertLevel" @change="changeSelectBox"
        />
      </div>
      <div class="tool">
        <button type="button" class="btn" @click="searchAlert">
          조회
        </button>
      </div>
      <div v-if="type==='EventUnresolved'" class="tool">
        <div class="chk-item">
          <input id="unread" type="checkbox" name="unread" class="inp">
          <label for="unread" class="label">미확인만 보기</label>
        </div>
      </div>
    </div>
    <div class="right-part">
      <div class="tool">
        <button v-if="type==='EventOccurred'" type="button" class="btn" @click="openModal()">
          Event 예외 처리
        </button>

        <button v-if="type==='EventIgnore'" type="button" class="btn" @click="openModal()">
          Event 예외 취소
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { SelectBox } from '@/components';
import { SELECT_OPTIONS } from '@/views/event/constants';

export default defineComponent({
  name: 'AlertCountSearchForm',
  components: {
    SelectBox,
  },
  props: {
    type: {
      type: String,
      default: 'EventOccurred',
    },
  },
  setup(props, { emit }) {
    const { instance } = getInstance();
    const {
      ALERT_LEVEL,
    } = SELECT_OPTIONS;
    // state
    const state = reactive({
      selectOrganization: computed(() => instance.$store.state.event.orgList),
      selectAlertLevel: ALERT_LEVEL,
      organizationName: '',
      prometheusName: '',
      groupJobName: '',
      alertLevel: '',
    });

    const changeSelectBox = (e) => {
      state[e.target.name] = e.target.value;
    };

    const searchAlert = () => {
      const searchData = {
        organizationName: state.organizationName,
        prometheusName: state.prometheusName || '',
        groupJobName: state.groupJobName || '',
        alertLevel: state.alertLevel || '',
      };

      emit('search', searchData);
    };

    const openModal = () => {
      emit('openModal');
    };

    return {
      ...toRefs(state),
      changeSelectBox,
      searchAlert,
      openModal,
    };
  },
});
</script>

<style scoped>
.chk-item {
  position: relative;
}
.chk-item .inp {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  clip: rect(0, 0, 0, 0);
}
.chk-item .label {
  position: relative;
  padding-left: 30px;
  font-size: 14px;
}
.chk-item .label::before,
.chk-item .label::after {
  content: ' ';
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
.chk-item .label::before {
  width: 24px;
  height: 24px;
  background-color: #ddd;
  border-radius: 12px;
}
.chk-item .inp:checked + .label::before {
  background-color: var(--KB-positive);
}
.chk-item .inp:checked + .label::after {
  left: 5px;
  width: 16px;
  height: 13px;
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><g fill='none' fill-rule='evenodd'><path d='M0 0h20v20H0z'/><path fill='%23ffffff' d='M1 10.243L7.321 17 19 4.763 17.156 3 7.321 13.346l-4.477-4.76z'/></g></svg>");
  background-repeat: no-repeat;
}
</style>
