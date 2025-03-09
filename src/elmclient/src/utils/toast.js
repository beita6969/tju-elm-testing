import { createVNode, render } from 'vue';
import Toast from '../components/Toast.vue';

let toastContainer = null;

const createToast = (options) => {
  // 创建容器
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  // 创建 Toast 实例
  const vnode = createVNode(Toast, {
    ...options,
    onClose: () => {
      render(null, toastContainer);
    }
  });

  // 渲染 Toast
  render(vnode, toastContainer);
};

// 导出不同类型的提示方法
export const toast = {
  info(message, duration = 2000) {
    createToast({ message, type: 'info', duration });
  },
  success(message, duration = 2000) {
    createToast({ message, type: 'success', duration });
  },
  error(message, duration = 2000) {
    createToast({ message, type: 'error', duration });
  },
  warning(message, duration = 2000) {
    createToast({ message, type: 'warning', duration });
  }
}; 