<template>
  <div class="wrapper">
    <!-- 头部 -->
    <header>
      <div class="back-button" @click="$router.go(-1)">
        <i class="fa fa-arrow-left"></i>
      </div>
      <p>我的评论</p>
    </header>

    <!-- 评论列表 -->
    <div class="comments-container">
      <div v-if="loading" class="loading">
        <p>加载中...</p>
      </div>
      
      <div v-else-if="commentsList.length === 0" class="empty-list">
        <p>您还没有发表任何评论</p>
      </div>
      
      <div v-else class="comments-list">
        <div v-for="(item, index) in commentsList" :key="index" class="comment-item" @click="navigateToDetail(item)">
          <div class="comment-item-content">
            <img :src="item.businessImg" alt="商家图片" class="business-thumbnail">
            <div class="comment-info">
              <h3>{{ item.businessName }}</h3>
              <div class="rating">
                <span v-for="n in 5" :key="n" class="star" :class="{ active: n <= item.deliveryRating }">★</span>
                <span class="rating-text">{{ item.deliveryRating }}分</span>
              </div>
              <p class="comment-text">{{ item.content }}</p>
              <p class="comment-date">{{ formatDate(item.commentTime) }}</p>
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
  name: 'CommentsList',
  setup() {
    const router = useRouter();
    const commentsList = ref([]);
    const loading = ref(true);
    
    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };
    
    // 获取评论列表
    const fetchComments = async () => {
      const userId = JSON.parse(sessionStorage.getItem('user')).userId;
      try {
        const response = await axios.post('/CommentController/getCommentsByUserId', { userId });
        commentsList.value = response.data;
        loading.value = false;
      } catch (error) {
        console.error('获取评论列表失败:', error);
        loading.value = false;
      }
    };
    
    // 导航到详情页
    const navigateToDetail = (item) => {
      router.push({
        path: '/businessInfo',
        query: { businessId: item.businessId }
      });
    };
    
    onMounted(() => {
      fetchComments();
    });
    
    return {
      commentsList,
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

.comments-container {
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

.comment-item {
  background-color: #fff;
  border-radius: 2vw;
  margin-bottom: 3vw;
  padding: 3vw;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.comment-item-content {
  display: flex;
}

.business-thumbnail {
  width: 15vw;
  height: 15vw;
  border-radius: 1.5vw;
  object-fit: cover;
  margin-right: 3vw;
}

.comment-info {
  flex: 1;
}

.comment-info h3 {
  margin: 0;
  font-size: 4vw;
  color: #333;
  margin-bottom: 1vw;
}

.rating {
  display: flex;
  align-items: center;
  margin: 1vw 0;
}

.star {
  color: #ddd;
  font-size: 3.5vw;
}

.star.active {
  color: #ffcc00;
}

.rating-text {
  margin-left: 1vw;
  font-size: 3.2vw;
  color: #ff6000;
}

.comment-text {
  margin: 1.5vw 0;
  font-size: 3.5vw;
  color: #333;
  line-height: 1.5;
}

.comment-date {
  color: #999;
  font-size: 3vw;
  text-align: right;
}
</style> 