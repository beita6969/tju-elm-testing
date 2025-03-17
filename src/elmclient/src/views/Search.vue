<template>
  <div class="container">
    <!-- 顶部蓝色部分 -->
    <div class="header">
      <h1>搜索</h1>
    </div>

    <!-- 输入框和按钮 -->
    <div class="search-box-container">
    <div class="search-box">
      <input v-model="searchQuery" type="text" placeholder="请输入商家名称" @keyup.enter="performSearch" />
      <button @click="performSearch">搜索</button>
    </div>
  </div>

    <!-- 搜索历史 -->
    <div v-if="searchHistory.length > 0" class="history">
      <h2>搜索历史</h2>
      <ul>
        <li v-for="( history, index) in searchHistory" :key="index" @click="handleHistoryClick(history)" class="history-item">
          {{ history }}
        </li>
      </ul>
    </div>

    <!-- 搜索结果 -->
    <div v-if="searchResults.length > 0" class="results">
      <h2>搜索结果</h2>
      <ul>
        <li v-for="item in searchResults" :key="item.businessId" @click="toBusinessInfo(item.businessId)">
          <div class="business-item">
            <div class="business-img">
              <img :src="item.businessImg">
            </div>
            <div class="business-info">
              <h3>{{ item.businessName }}</h3>
              <p>&#165;{{ item.starPrice }}起送 | &#165;{{ item.deliveryPrice }}配送</p>
              <p>{{ item.businessExplain }}</p>
            </div>
          </div>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
export default {
  setup() {
    const searchQuery = ref(''); // 搜索输入框的内容
    const searchHistory = ref([]); // 搜索历史
    const searchResults = ref([]); // 搜索结果
    const user = ref(null); // 假设的用户ID，实际开发中可以从用户信息中获取
    const router = useRouter();
    // 页面加载时获取用户的历史搜索
    onMounted(async () => {
      user.value = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
      await getSearchHistory();
    });

    // 获取用户的搜索历史
    const getSearchHistory = async () => {
      try {
        const response = await axios.post('/SearchController/getHistoryByUserId', {
          userId: user.value.userId,
        });
        searchHistory.value = response.data ? [response.data] : [];
        console.log(searchHistory.value);
      } catch (error) {
        console.error('获取搜索历史失败:', error);
      }
    };
    const toBusinessInfo = (businessId) => {
      router.push({ path: '/businessInfo', query: { businessId } });
    };
    // 执行搜索的函数
    const performSearch = async () => {
      if (searchQuery.value.trim() !== '') {
        try {
          // 调用搜索接口
          const response = await axios.post('/SearchController/listBusiness', {
            searchContent: searchQuery.value,
            userId: user.value.userId,
          });

          // 更新搜索结果
          searchResults.value = response.data;
          console.log(searchResults.value);
          console.log(searchResults.value.length);
          // 清空搜索框
          searchQuery.value = '';

          // 清空搜索历史
          searchHistory.value = [];

        } catch (error) {
          console.error('搜索失败:', error);
        }
      }
      else {
        console.error('搜索内容不能为空');
      };
    }
    const handleHistoryClick = (history) => {
      searchQuery.value = history;
      performSearch();
    };
    return {
      searchQuery,
      searchHistory,
      searchResults,
      performSearch,
      toBusinessInfo,
      handleHistoryClick
    };
  },
};
</script>

<style scoped>
/* 容器样式 */
.container {
  max-width: 600px;
  margin: 0 auto;

}

/* 顶部蓝色部分 */
.header {
  background-color: #0097FF;
  padding: 10px;
  color: white;
  text-align: center;
  margin-bottom: 20px;
}

/* 搜索框容器样式 */
.search-box-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  margin-bottom: 20px;
}

/* 搜索框样式 */
.search-box {
  display: flex;
}

.search-box input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-box button {

  padding: 10px;
  background-color: #0097FF;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.search-box button:hover {
  background-color: #0097FF;
}

/* 搜索历史 */
.history {
  margin: 20px 0;
}

.history h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.history ul {
  list-style-type: none;
  padding: 0;
}

.history li {
  background-color: #f1f1f1;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.history li:hover {
  background-color: #e0e0e0;
}

/* 搜索结果 */
.results {
  margin: 20px 0;

}

.results h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.results ul {
  list-style-type: none;
  padding: 0;
}

.results li {
  background-color: #e7f3ff;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 4px;
}

.business-item {
  display: flex;
  align-items: center;
  /* 垂直居中对齐 */
  background-color: #e7f3ff;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 5px;
}

.business-img {
  margin-right: 10px;
  /* 图片和文字之间的间距 */
}

.business-img img {
  width: 60px;
  /* 图片宽度 */
  height: 60px;
  /* 图片高度 */
  border-radius: 4px;
}

.business-info h3 {
  font-size: 16px;
  margin: 0 0 5px 0;
}

.business-info p {
  font-size: 14px;
  color: #666;
  margin: 0;
}
</style>
