<template>
  <div :class="className" :style="{ height: height }">
    <div class="table-container">
      <table>
        <slot />
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {
  reactive, toRefs, computed,
} from '@vue/composition-api';

export default {
  name: 'Table',
  props: {
    type: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: 'auto',
    },
  },
  setup(props) {
    const state = reactive({
      className: computed(() => `tbl ${props.type}`),
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style>
.tbl {
  overflow: hidden;
  position: relative;
  width: 100%;
}
.table-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  cursor: default;
}
.tbl table {
  min-width: 100%;
  border-spacing: 0;
  border-collapse: separate;
  table-layout: fixed;
}
.tbl thead tr {
  position: sticky;
  top: 0;
  z-index: 1;
}
.tbl thead th {
  height: 50px;
  white-space: nowrap;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.5px;
  text-transform: capitalize;
  background-color: #eee;
  border-width: 1px 0 0;
  border-color: rgb(204 204 204 / 70%);
}
.tbl tbody th,
.tbl tbody td {
  font-size: .9rem;
  letter-spacing: 0.5px;
  white-space: nowrap;
  background-color: #fff;
  border-width: 0 0 1px;
}
.tbl tbody th {
  font-weight: 400;
}
.tbl tbody td {
  overflow-x: hidden;
  /* min-width: 7rem; */
  height: 50px;
  padding: 8px 12px;
}
.tbl tbody .empty {
  height: 60px;
  text-align: center !important;
  font-size: 15px;
  color: #999;
  letter-spacing: 1px;
  border: 0;
}

.tbl tbody td .text,
.tbl tbody td span {
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  /* max-width: 240px; */
}
.tbl tbody td a:hover {
  color: var(--KB-gold);
  /* text-decoration: underline; */
}
.tbl tbody td svg {
  width: 16px;
  height: 16px;
  vertical-align: -2px;
  fill: currentColor;
}
.btn-detail {
  letter-spacing: 0;
  color: var(--KB-gray);
}
.btn-detail:hover {
  text-decoration: underline;
}

/* basic type */
.tbl.basic thead th {
  padding-right: 10px;
  padding-left: 10px;
}
.tbl.basic tbody th {
  text-align: left;
  padding: 8px 0px 8px 20px;
  text-transform: capitalize;
}
.tbl.basic tbody td {
  text-align: center;
}

/* data type */
.tbl.data thead th {
  padding-left: 10px;
  text-align: left;
}
.tbl.data tbody td {
  text-align: left;
}
</style>
