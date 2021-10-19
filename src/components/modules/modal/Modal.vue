<template>
  <section :id="id" class="modal">
    <transition name="fade">
      <div v-if="modalVisible" class="modal-backdrop" @click.self="closeModal(id)">
        <div class="modal-dialog" :class="size">
          <article class="modal-inner">
            <div v-if="slot.header" class="modal-header">
              <slot name="header" />
              <button class="btn-close" @click="closeModal(id)">
                <icon name="close" size="30" />
                <span class="hide">닫기</span>
              </button>
            </div>
            <div class="modal-content">
              <slot name="body" />
            </div>
            <div v-if="slot.footer" class="modal-footer">
              <slot name="footer" />
            </div>
          </article>
        </div>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import {
  reactive, toRefs, watch,
} from '@vue/composition-api';
import Icon from '@/components/modules/icon/Icon.vue';
import { getInstance } from '@/composable';

export default {
  name: 'Modal',
  components: {
    Icon,
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
    size: {
      type: String,
      default: 'md',
    },
  },
  setup(props, { emit }) {
    const { instance } = getInstance();
    const state = reactive({
      modalVisible: props.visible,
      slot: instance.$slots,
    });

    const closeModal = (id) => {
      emit('closeModal', id);
    };

    watch(() => props.visible, (newValue) => {
      state.modalVisible = newValue;
    });

    return {
      ...toRefs(state),
      closeModal,
    };
  },
};
</script>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.25);
  transition: opacity .5s ease;
}
.modal-dialog {
  overflow: hidden;
  display: flex;
  width: 90vw;
  max-width: var(--inner-width);
  max-height: 800px;
}
.modal-dialog.sm {
  width: 600px;
}
.modal-dialog.lg {
  width: calc(100vw - 60px);
  /* min-height: 80vh; */
  max-height: calc(100vh - 60px);
}
.modal-inner {
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 5px rgb(0 0 0 / 20%);
}
.modal-header {
  position: relative;
  display: flex;
  height: 61px;
  padding: 0rem 1.5rem;
  border-bottom: 1px solid var(--KB-gray);
}
.modal-header h3 {
  font-size: 22px;
  height: 60px;
  line-height: 62px;
}
.modal-header .btn-close {
  position: absolute;
  top: 0;
  right: 1rem;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 40px;
  margin: auto;
}
.modal-content {
  overflow: auto;
  flex: 1;
  /* max-height: calc(100vh - 20rem); */
  padding: 1.5rem;
}
.modal-footer {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: -1rem;
  padding: 1rem 1.5rem;
}
.modal-footer .modal-button {
  min-width: 100px;
  height: 40px;
  margin-left: 1rem;
  padding: 0 1rem;
  font-weight: 700;
  border-radius: 0.25rem;
}
.modal-button.transparent {
  background-color: transparent;
  color: #333;
}
.modal-button.primary {
  background-color: var(--KB-positive);
  color: #fff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
