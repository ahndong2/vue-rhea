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

</style>
