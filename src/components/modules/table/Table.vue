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
  padding: 0 10px;
  font-weight: 400;
  font-size: 13px;
  line-height: 15px;
  letter-spacing: 0.5px;
  white-space: nowrap;
  text-transform: capitalize;
  background-color: #eee;
  border-width: 1px 0 0;
  border-color: rgb(204 204 204 / 70%);
}
.tbl tbody th,
.tbl tbody td {
  font-size: 13px;
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
  padding: 10px;
}
.tbl tbody .empty {
  text-align: center !important;
  font-size: 14px;
  color: #999;
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
  text-decoration: underline;
}
.tbl tbody td svg {
  width: 16px;
  height: 16px;
  vertical-align: -2px;
  fill: currentColor;
}
.btn-detail {
  color: var(--KB-gray);
}
.btn-detail:hover {
  text-decoration: underline;
}

/* basic type */
.tbl.basic thead th,
.tbl.basic tbody td {
  text-align: center;
}
.tbl.basic tbody th {
  text-align: left;
  padding: 10px;
  padding-left: 20px;
  text-transform: capitalize;
}

/* data type */
.tbl.data thead th,
.tbl.data tbody td {
  text-align: left;
}
</style>

<style scoped>
.chk-item {
  position: relative;
  /* width: 50px; */
}
.chk-item .inp {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  clip: rect(0, 0, 0, 0);
}
.chk-item .ico {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  background-color: #eaeaea;
  border-radius: 50%;
}
.chk-item .inp:checked + .ico {
  background-color: var(--KB-positive);
}
.chk-item .ico::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 6px;
  height: 6px;
  margin: auto;
  background-color: #fff;
  border-radius: 50%;
  content: ' ';
}
</style>
