<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>美食推荐</p>
    </header>

    <!-- 输入框部分 -->
    <div class="input-section">
      <input
        v-model="userQuery"
        type="text"
        placeholder="请输入您的问题"
        class="query-input"
      />
      <button @click="askWenxin" class="query-button">发送</button>
    </div>

    <!-- 返回结果部分 -->
    <div class="response-section">
      <p v-if="response" class="response-text">文心一言回答：{{ re }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
  name: 'QueryWenxin',
  setup() {
    const userQuery = ref(''); // 用户输入的问题
    const re = ref(''); // 文心一言的回答
    const result = ref(null); // 文心一言接口返回的结果
    // 点击按钮发送请求到文心一言接口
    const askWenxin = async () => {
      if (userQuery.value.trim() === '') {
        alert('请输入问题');
        return;
      }

      try {
        await axios.post('wenxincontroller/query', {role: 'user', content: userQuery.value}).then(response => { 
          console.log(response.data)
          result.value = response.data 
        });
        console.log('请求结果:', result.value);
        re.value = result.value || '未找到合适的回答';
      } catch (error) {
        console.error('接口请求失败:', error);
        alert('请求失败，请稍后重试！');
      }
    };

    return {
      userQuery,
      re,
      askWenxin,
    };
  }
};
</script>

<style scoped>
/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/****************** header部分 ******************/
header {
  width: 100%;
  height: 12vw;
  background-color: #0097FF;
  color: #fff;
  font-size: 4.8vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

/****************** 输入框部分 ******************/
.input-section {
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.query-input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}

.query-button {
  background-color: #0097FF;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.query-button:hover {
  background-color: #007acc;
}

/****************** 文心一言回答部分 ******************/
.response-section {
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.response-text {
  font-size: 18px;
  color: #333;
}
</style>
