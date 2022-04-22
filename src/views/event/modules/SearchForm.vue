<template>
  <div id="toolbar" class="toolbar mb-6">
    <h3 class="hide">
      검색 영역
    </h3>
    <div class="both-part">
      <!-- [S] Form -->
      <div v-if="type !== 'EventIgnore'" class="tool">
        <select-box id="organizationId" name="organizationId" :value="formData.organizationId" none="Org 전체"
                    :options="organizationList" @change="changeSelectBox"
        />
      </div>
      <div v-if="type !== 'EventIgnore'" class="tool">
        <select-box id="childOrganizationId" name="childOrganizationId" :value="formData.childOrganizationId" none="Org 하위 전체"
                    :options="childOrganizationsList" :disabled="!formData.organizationId || formData.organizationId === ''" @change="changeSelectBox"
        />
      </div>
      <div class="tool">
        <select-box id="prometheusId" name="prometheusId" :value="formData.prometheusId" none="Data Source 전체"
                    :options="dataSourceList" :disabled="type !== 'EventIgnore'&& (!formData.organizationId || formData.organizationId === '')" @change="changeSelectBox"
        />
      </div>
      <div class="tool">
        <select-box id="groupId" name="groupId" :value="formData.groupId" none="Project 분류 전체"
                    :options="projectList" :disabled="type !== 'EventIgnore'&& (!formData.prometheusId || formData.prometheusId === '')" @change="changeSelectBox"
        />
      </div>
      <div v-if="type !== 'EventIgnore'" class="tool">
        <input v-model.trim="formData.resourceVal" type="text" class="inp-t" placeholder="발생 자원 입력" spellcheck="false">
        <button v-if="formData.resourceVal" name="resourceVal" class="btn-clear" @click="clearInput">
          <i class="fi fi-rr-cross-small" />
          <span class="hide">삭제</span>
        </button>
      </div>
      <div v-if="type !== 'EventIgnore'" class="tool">
        <select id="thresholdResourceType" v-model="formData.thresholdResourceType" name="thresholdResourceType" class="slt"
                @change="changeSelectBox"
        >
          <option value="">
            Event Type 전체
          </option>
          <optgroup v-for="(group,name) in selectThresholdResourceType" :key="name" :label="name">
            <option v-for="(opt,key) in group" :key="key" :value="opt.searchType">
              {{ opt.searchType }}
            </option>
          </optgroup>
        </select>
      </div>
      <div v-if="type !== 'EventIgnore'" class="tool">
        <select-box id="status" name="status" :value="formData.status" none="상태 전체"
                    :options="selectStatus" @change="changeSelectBox"
        />
      </div>
      <!-- [E] Form -->
      <div v-if="type !== 'EventIgnore'&& (formData.organizationId || formData.childOrganizationId || formData.prometheusId || formData.groupId || formData.resourceVal || formData.thresholdResourceType || formData.status)"
           class="tool"
      >
        <button type="button" title="초기화" class="btn btn-reset" @click="resetData">
          <i class="fi fi-rr-rotate-right mr-1 text-xs" />
          <span class="text">초기화</span>
        </button>
      </div>
      <div class="tool">
        <button type="button" class="btn" @click="searchAlert">
          <span class="text">검색</span>
        </button>
      </div>
      <div class="tool ml-auto">
        <button v-if="type === 'EventOccurred'" type="button" class="btn" @click="openModal">
          Event 예외 처리
        </button>
        <button v-if="type === 'EventIgnore'" type="button" class="btn" @click="openModal">
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
  onMounted,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { SelectBox } from '@/components';
import { NO_HIERARCHY, SELECT_OPTIONS } from '@/views/event/constants';
import { MONITORING_INFO } from '@/constants';
import { GroupInfo, Prometheus, OrgMonitoringList } from '@/store/type';

interface Props{
  type?: string;
}
interface SelectDefault {
  id?: string;
  label?:string;
  value?:string;
}
interface TypeChildOrganizations extends SelectDefault{
  childOrganizations?: OrgMonitoringList[];
  prometheuses?: Prometheus[];
}
interface TypeDataSource extends SelectDefault{
  groupinfo?: GroupInfo[]
}

export default defineComponent({
  name: 'SearchForm',
  components: {
    SelectBox,
  },
  props: {
    type: {
      type: String,
      default: 'EventOccurred',
    },
    searchData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props:Props, { emit }) {
    const { instance } = getInstance();
    const {
      STATUS,
    } = SELECT_OPTIONS;

    const defaultData = {
      organizationId: '',
      organizationName: '',
      childOrganizationId: '',
      prometheusId: '',
      prometheusName: '',
      groupId: '',
      groupJobName: '',
      resourceVal: '',
      thresholdResourceType: '',
      status: '',
      parentId: '',
    };

    const state = reactive({
      organizationList: computed(() => instance.$store.state.event.organizationList),
      childOrganizationsList: [] as TypeChildOrganizations[],
      dataSourceList: [] as TypeDataSource[],
      projectList: [] as SelectDefault[],
      selectThresholdResourceType: {},
      selectStatus: computed(() => (
        props.type === 'EventOccurred'
          ? STATUS.filter((item) => item.value !== 'NR')
          : STATUS.filter((item) => item.value !== 'G')
      )),
      formData: {
        ...defaultData,
      },
    });
    const initData = ():void => {
      state.childOrganizationsList = [{ ...NO_HIERARCHY }];
      state.dataSourceList = [];
      state.projectList = [];
      state.formData = {
        ...defaultData,
      };
    };

    const setChildOrganizationsList = (data):TypeChildOrganizations[] => {
      const rtn = data.map((v) => ({
        id: v.id,
        label: v.name,
        value: v.id,
        childOrganizations: v.childOrganizations,
        prometheuses: v.prometheuses,
      }));
      rtn.unshift(NO_HIERARCHY);
      return rtn;
    };

    const setDataSourceList = (data):TypeDataSource[] => data.map((v) => ({
      id: v.id,
      label: v.name,
      value: v.id,
      groupinfo: v.groupinfo,
    }));

    const setProjectList = (data): SelectDefault[] => data.map((v) => ({
      id: v.id,
      label: v.name,
      value: v.id,
    })) as SelectDefault[];

    const changeSelectBox = (e:Event):void => {
      const target = e.target as HTMLInputElement;
      const { id, value } = target;
      if (id === 'organizationId') {
        initData();
        const organization = state.organizationList.filter((org) => Number(org.id) === Number(value))[0];
        state.childOrganizationsList = setChildOrganizationsList(organization.childOrganizations);
        state.dataSourceList = setDataSourceList(organization.prometheuses);
      } else if (id === 'childOrganizationId') {
        if (value === '' || value === '-1') {
          // 하위 계층 없음 선택시 기존 org datasource 로 복구
          const organization = state.organizationList.filter((org) => Number(org.id) === Number(state.formData.organizationId))[0];
          state.dataSourceList = setDataSourceList(organization.prometheuses);
        } else {
          // 이외의 경우엔 해당 하위 org의 datasource 선택
          const subOrganization = state.childOrganizationsList.filter((org) => Number(org.id) === Number(value))[0];
          state.dataSourceList = setDataSourceList(subOrganization.prometheuses);
        }
        state.formData.prometheusId = '';
      } else if (id === 'prometheusId') {
        if (value === '') {
          state.projectList = [];
          state.formData.groupId = '';
        } else {
          const groupinfos = state.dataSourceList.filter((d) => Number(d.id) === Number(value))[0];
          state.projectList = setProjectList(groupinfos.groupinfo);
          state.formData.groupId = '';
        }
      }

      state.formData[id] = value;
    };

    const searchAlert = ():void => {
      const searchData = { ...state.formData };
      if (state.formData.childOrganizationId) {
        if (state.formData.childOrganizationId === '-1') {
          // 하위계층없음 선택
          searchData.parentId = '-1';
        } else {
          searchData.parentId = state.formData.organizationId;
          searchData.organizationId = state.formData.childOrganizationId;
        }
      }
      emit('search', searchData);
    };

    const openModal = ():void => {
      emit('openModal');
    };

    const clearInput = (e):void => {
      const target = e.currentTarget.name;
      state.formData[target] = '';
    };

    const resetData = ():void => {
      initData();
    };

    const updateState = (data):void => {
      initData();

      let prometheuses;
      let groupinfo;
      if (data.parentId === -1 || data.parentId === '-1') {
        // 하위계층 없을때
        prometheuses = state.organizationList.filter((o) => Number(o.id) === Number(data.organizationId))[0].prometheuses;
        groupinfo = prometheuses.filter((p) => Number(p.id) === Number(data.prometheusId))[0].groupinfo;
      } else {
        // 하위계층이 선택되었을때
        const childOrganizations = state.organizationList.filter((o) => Number(o.id) === Number(data.parentId))[0].childOrganizations;
        prometheuses = childOrganizations.filter((o) => Number(o.id) === Number(data.organizationId))[0].prometheuses;
        groupinfo = prometheuses.filter((p) => Number(p.id) === Number(data.prometheusId))[0].groupinfo;
        data.childOrganizationId = data.organizationId;
        data.organizationId = data.parentId;
        state.childOrganizationsList = setChildOrganizationsList(childOrganizations);
      }

      state.dataSourceList = setDataSourceList(prometheuses);
      state.projectList = setProjectList(groupinfo);
      state.formData = {
        ...data,
        resourceVal: '',
        status: '',
      };
    };

    onMounted(async ():Promise<void> => {
      // 예외 처리
      const data = JSON.parse(JSON.stringify(MONITORING_INFO));
      Object.keys(data).forEach((name) => {
        if (name === 'K8S') {
          const group = data[name];
          Object.keys(group).forEach((key) => {
            const value = group[key];
            if (value.searchType === 'PodCPU' || value.searchType === 'PodMemory') {
              delete group[key];
            }
          });
        }
      });
      state.selectThresholdResourceType = data;

      if (props.type === 'EventIgnore') {
        const datasource = await instance.$store.dispatch('event/getDataSource');
        state.dataSourceList = datasource;
      }
    });

    return {
      ...toRefs(state),
      changeSelectBox,
      searchAlert,
      openModal,
      clearInput,
      updateState,
      initData,
      resetData,
    };
  },
});
</script>
