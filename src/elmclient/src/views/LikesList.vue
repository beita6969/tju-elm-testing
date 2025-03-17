<template>
  <div class="wrapper">
    <!-- 头部 -->
    <header>
      <div class="back-button" @click="$router.go(-1)">
        <i class="fa fa-arrow-left"></i>
      </div>
      <p>我的点赞</p>
    </header>

    <!-- 点赞列表 -->
    <div class="likes-container">
      <div v-if="loading" class="loading">
        <p>加载中...</p>
      </div>
      
      <div v-else-if="likesList.length === 0" class="empty-list">
        <p>您还没有点赞过任何内容</p>
      </div>
      
      <div v-else class="likes-list">
        <div v-for="(item, index) in likesList" :key="index" class="like-item" @click="navigateToDetail(item)">
          <div class="like-item-content">
            <img :src="item.img" alt="缩略图" class="thumbnail">
            <div class="like-info">
              <h3>{{ item.name }}</h3>
              <p v-if="item.type === 'business'">商家</p>
              <p v-else-if="item.type === 'food'">食品</p>
              <p class="like-date">{{ formatDate(item.likeTime) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'LikesList',
  setup() {
    const router = useRouter();
    const likesList = ref([]);
    const loading = ref(true);
    
    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };
    
    // 获取点赞列表
    const fetchLikes = async () => {
      const userId = JSON.parse(sessionStorage.getItem('user')).userId;
      try {
        const response = await axios.post('/LikeController/getLikesByUserId', { userId });
        likesList.value = response.data;
        loading.value = false;
      } catch (error) {
        console.error('获取点赞列表失败:', error);
        loading.value = false;
      }
    };
    
    // 导航到详情页
    const navigateToDetail = (item) => {
      if (item.type === 'business') {
        router.push({
          path: '/businessInfo',
          query: { businessId: item.businessId }
        });
      } else if (item.type === 'food') {
        router.push({
          path: '/businessInfo',
          query: { 
            businessId: item.businessId,
            highlightFood: item.foodId
          }
        });
      }
    };
    
    onMounted(() => {
      fetchLikes();
    });
    
    return {
      likesList,
      loading,
      formatDate,
      navigateToDetail
    };
  }
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

header {
  width: 100%;
  height: 12vw;
  background-color: #0097FF;
  color: #fff;
  font-size: 4.8vw;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  padding: 0 4vw;
}

.back-button {
  font-size: 5vw;
  padding: 2vw;
  cursor: pointer;
}

header p {
  flex: 1;
  text-align: center;
  margin-right: 7vw;
}

.likes-container {
  margin-top: 12vw;
  padding: 3vw;
  overflow-y: auto;
  flex: 1;
}

.loading, .empty-list {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
  color: #999;
  font-size: 4vw;
}

.like-item {
  background-color: #fff;
  border-radius: 2vw;
  margin-bottom: 3vw;
  padding: 3vw;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.like-item-content {
  display: flex;
  align-items: center;
}

.thumbnail {
  width: 15vw;
  height: 15vw;
  border-radius: 1.5vw;
  object-fit: cover;
  margin-right: 3vw;
}

.like-info {
  flex: 1;
}

.like-info h3 {
  margin: 0;
  font-size: 4vw;
  color: #333;
  margin-bottom: 1vw;
}

.like-info p {
  margin: 1vw 0;
  font-size: 3.2vw;
  color: #666;
}

.like-date {
  color: #999;
  font-size: 3vw;
}
</style> 