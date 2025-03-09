<template>
  <ul class="footer">
    <li @click="toBusinessView">
      <i class="fa fa-store"></i>
      <p>商品管理</p>
    </li>
    <li @click="toBusinessInfo">
      <i class="fa fa-user-o"></i>
      <p>商家信息</p>
    </li>
  </ul>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'BusinessFooter',
  setup() {
    const router = useRouter();
    const route = useRoute();

    const checkBusinessLogin = () => {
      const businessUser = sessionStorage.getItem('businessUser') ? JSON.parse(sessionStorage.getItem('businessUser')) : null;
      if (!businessUser || !businessUser.isBusiness) {
        alert('登录已过期，请重新登录！');
        router.push('/businessLogin');
        return false;
      }
      return businessUser;
    };

    const toBusinessView = () => {
      const businessUser = checkBusinessLogin();
      if (businessUser) {
        router.push({ 
          path: '/businessView',
          query: { businessId: businessUser.businessId }
        });
      }
    };

    const toBusinessInfo = () => {
      const businessUser = checkBusinessLogin();
      if (businessUser) {
        router.push({ 
          path: '/businessInformation',
          query: { businessId: businessUser.businessId }
        });
      }
    };

    return {
      toBusinessView,
      toBusinessInfo
    };
  },
});
</script>

<style scoped>
.footer {
  width: 100%;
  height: 8vh;
  border-top: solid 1px #ddd;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
}

.footer > li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
  user-select: none;
  cursor: pointer;
  flex: 1;
}

.footer > li p {
  font-size: 1.8vh;
}

.footer > li i {
  font-size: 3.5vh;
}

.footer > li:hover {
  color: #0097FF;
}
</style> 