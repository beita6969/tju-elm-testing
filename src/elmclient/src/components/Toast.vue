<template>
  <transition name="toast-fade">
    <div v-if="visible" class="toast-wrapper" :class="type">
      <div class="toast-content">
        <i :class="iconClass"></i>
        <span>{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, onMounted, computed } from 'vue';

export default {
  name: 'Toast',
  props: {
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 2000
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'info', 'warning'].indexOf(value) !== -1
    }
  },
  setup(props, { emit }) {
    const visible = ref(false);

    const iconClass = computed(() => {
      const icons = {
        success: 'fa fa-check-circle',
        error: 'fa fa-times-circle',
        info: 'fa fa-info-circle',
        warning: 'fa fa-exclamation-circle'
      };
      return icons[props.type];
    });

    onMounted(() => {
      visible.value = true;
      setTimeout(() => {
        visible.value = false;
        setTimeout(() => {
          emit('close');
        }, 300);
      }, props.duration);
    });

    return {
      visible,
      iconClass
    };
  }
};
</script>

<style scoped>
.toast-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  padding: 4vw 6vw;
  border-radius: 2vw;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  font-size: 4vw;
  max-width: 80vw;
  box-shadow: 0 1vw 2vw rgba(0, 0, 0, 0.2);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 2vw;
}

.toast-content i {
  font-size: 5vw;
}

/* 类型样式 */
.success {
  background: rgba(56, 202, 115, 0.9);
}

.error {
  background: rgba(245, 108, 108, 0.9);
}

.warning {
  background: rgba(255, 159, 67, 0.9);
}

.info {
  background: rgba(0, 151, 255, 0.9);
}

/* 动画效果 */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -30%);
}
</style> 