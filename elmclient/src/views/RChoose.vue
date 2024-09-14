<template>
    <!-- Top Bar -->
    <div class="top-bar">
      请选择注册方式
    </div>
  
    <!-- Middle section with buttons -->
    <div class="container">
      <button class="btn" @click="handleMerchantRegister">商家注册</button>
      <button class="btn" @click="handlePersonalRegister">个人注册</button>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'RChoose',
    setup() {
      const router = useRouter();
  
      const handleMerchantRegister = () => {
        // Handle merchant registration logic
        router.push('/businessRegister');
      };
  
      const handlePersonalRegister = () => {
        // Handle personal registration logic
        router.push('/register');
      };
  
      return {
        handleMerchantRegister,
        handlePersonalRegister
      };
    }
  };
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
  