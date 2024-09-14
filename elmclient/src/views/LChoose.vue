<template>
  <!-- Top Bar -->
  <div class="top-bar">
    请选择登陆方式
  </div>

  <!-- Middle section with buttons -->
  <div class="container">
    <button class="btn" @click="handleMerchantLogin">商家登录</button>
    <button class="btn" @click="handlePersonalLogin">个人登录</button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'LChoose',
  setup() {
    const router = useRouter();

    const handleMerchantLogin = () => {
      // Handle merchant registration logic
      router.push({ path: '/businessLogin' });
    };

    const handlePersonalLogin = () => {
      router.push({ path: '/login' });
    };

    return {
      handleMerchantLogin,
      handlePersonalLogin
    };
  }
}
</script>


<style scoped>
/* Top bar style */
.top-bar {
  background-color: #2196F3;
  color: white;
  text-align: center;
  padding: 15px;
  font-size: 6vw;
}

/* Centered content */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 92vh;
  flex-direction: column;
  background-color: rgb(233, 236, 236);
}

/* Button styles */
.btn {
  background-color: #2196F3;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 5px;
  font-size: 6vw;
  margin: 10px;
  cursor: pointer;
}

.btn:hover {
  background-color: #1976D2;
}
</style>