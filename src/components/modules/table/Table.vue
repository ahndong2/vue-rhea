<template>
  <div class="tbl" :class="className" :style="{ height: height }">
    <div :id="id" class="table-container">
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
    id: {
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
      className: computed(() => props.type),
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style>
.tbl {
  position: relative;
  width: 100%;
  background-color: #fff;
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
  height: 2.5rem;
  font-weight: normal;
  font-size: 12px;
  line-height: 1.1;
  color: #666;
  background-color: #eee;
  border-width: 1px 0 0;
  border-color: rgb(204 204 204 / 70%);
}
.tbl tbody th,
.tbl tbody td {
  font-size: 13px;
  white-space: nowrap;
  border-width: 0 0 1px;
  border-color: rgb(0 0 0 / 5%);
}
.tbl tbody th {
  font-weight: normal;
}
.tbl tbody td {
  padding: 0.25rem 0.5rem;
  color: #555;
}
.tbl tbody .empty {
  text-align: center !important;
  font-family: 'KBFGTextL';
  font-size: 14px;
  color: var(--gray);
}

/* basic type */
.tbl.basic thead th,
.tbl.basic tbody td {
  text-align: center;
}
.tbl.basic tbody th {
  height: 2.5rem;
  text-align: left;
}
.tbl.basic tbody td {
  height: 2.5rem;
}

/* data type */
.tbl.data thead th {
  padding: 0 0.5rem;
  white-space: nowrap;
}
.tbl.data thead th:not(.text-center),
.tbl.data tbody td:not(.text-center) {
  text-align: left;
}
.tbl.data tbody td {
  height: 45px;
}
.tbl.data thead th:first-child,
.tbl.data tbody td:first-child {
  padding-left: 20px;
}
.tbl.data tbody td a:hover {
  color: var(--KB-gold);
  text-decoration: underline;
}
.tbl.data tbody td > .text {
  display: inline-flex;
  vertical-align: middle;
}
</style>

<style scoped>
.chk-item {
  position: relative;
  /* width: 50px; */
  padding-left: 10px !important;
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

/* buttons */
.tbl.data .btn {
  display: inline-flex;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
}
/* 상세, 상태, 사유 */
.btn.status,
.btn.cause,
.btn.detail {
  height: 26px;
  padding: 1px 0.55rem 0;
  color: #888;
  border: 1px solid #eee;
  border-radius: 1rem;
}
.btn.status {
  min-width: 3.3rem;
}
.tbl.data .btn .fi {
  margin-right: 0.2rem;
}
</style>
