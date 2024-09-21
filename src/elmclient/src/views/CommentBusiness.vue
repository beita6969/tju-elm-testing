<template>
  <div class="wrapper">
    <div class="comment-wrapper">
      <!-- 顶部蓝色部分 -->
      <header class="header">
        <p>商家评论</p>
      </header>

      <!-- 商家图片部分 -->
      <div class="business-image">
        <img :src="business.businessImg" alt="商家图片" />
      </div>

      <!-- 输入框和提交按钮 -->
      <div class="comment-input">
        <input type="text" v-model="newComment" placeholder="写点儿想对商家说的..." />
        <button @click="submitComment">提交</button>
      </div>

      <!-- 用户评论列表 -->
      <div class="comments">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <p><strong>{{ comment.userName }}:</strong> {{ comment.remark }}</p>
        </div>
      </div>




    </div>
    <!-- 底部菜单部分 -->

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Footer from '../components/Footer.vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
  components: {
    Footer
  },
  setup() {
    const route = useRoute();
    const businessId = route.query.businessId;
    const business = ref({});
    const user = ref(null);
    const comments = ref([]);
    const newComment = ref('');
    user.value = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
    onMounted(() => {
      // 获取商家图片
      axios.post('BusinessController/getBusinessById', { businessId: businessId })
        .then(response => {

          business.value = response.data;

        }).catch(error => {
          console.error(error);
        });
      // 获取评论列表
      axios.post('RemarkController/listRemarksByBussinessId', { businessId: businessId })
        .then(response => {

          comments.value = response.data;
          console.log(comments.value);
        }).catch(error => {
          console.error(error);
        });

    });

    const submitComment = () => {
      if (newComment.value.trim() !== '') {
        const commentToAdd = {
          id: Date.now(), // 使用时间戳作为临时ID
          userName: user.value.userName,
          remark: newComment.value
        };

        // 将新评论添加到评论列表
        comments.value.push(commentToAdd);

        // 提交评论到服务器
        axios.post('RemarkController/saveRemarks', {
          remark: newComment.value,
          userId: user.value.userId,
          userName: user.value.userName,
          businessId: businessId
        }).then(response => {
          // 提交成功后清空输入框
          newComment.value = '';
        }).catch(error => {
          console.error(error);
          // 如果提交失败，从评论列表中移除刚才添加的评论
          comments.value = comments.value.filter(comment => comment.id !== commentToAdd.id);
        });
      } else {
        alert('评论内容不能为空');
      }
    };

    return {
      business,
      comments,
      newComment,
      submitComment,
      user
    };
  }
};
</script>

<style scoped>
.comment-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  width: 100%;
  height: 10vh;
  background-color: #0097FF;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.business-image {
  margin-top: 16vh;
  margin-bottom: 5vh;
  width: 100%;
  height: auto;
  text-align: center;
}

.business-image img {
  max-width: 100%;
  height: auto;
}

.comments {
  width: 90%;
  margin-top: 20px;
  margin-bottom: 20px;
  overflow-y: auto;
  max-height: 40vh;
}

.comment-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.comment-input {
  width: 90%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5vh;
}

.comment-input input {
  flex-grow: 1;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.comment-input button {
  padding: 10px 20px;
  margin-left: 10px;
  background-color: #0097FF;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.comment-input button:hover {
  background-color: #007ACC;
}
</style>