<template>
  <div class="wrapper">
    <div class="personal-info">
      <header>
        <h1>个人信息</h1>
      </header>
      
      <div class="content">
        <div class="user-info-container">
          <div class="info-section">
            <div class="info-item nickname" @click="modifyNickname">
              <span class="label">昵称:</span>
              <span class="value">{{ userInfo.userName }}</span>
            </div>
            <div class="info-item">
              <span class="label">电话:</span>
              <span class="value">{{ userInfo.userId }}</span>
            </div>
            <div class="info-item">
              <span class="label">性别:</span>
              <span class="value">{{ userInfo.userSex === 1 ? '男' : '女' }}</span>
            </div>
          </div>
          
          <div class="avatar">
            <img :src="userInfo.userImg || 'https://via.placeholder.com/150'" alt="用户头像">
          </div>
        </div>
        
        <div class="buttons-section">
          <div class="btn" @click="modifyPassword">
            修改密码
          </div>
          
          <div class="btn" @click="logout">
            退出登录
          </div>
          
          <div class="btn" @click="$router.push('/favorites')">
            收藏列表
          </div>
          
          <div class="btn" @click="$router.push('/likes')">
            点赞列表
          </div>
          
          <div class="btn" @click="$router.push('/comments')">
            评论列表
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'PersonalInfo',
  setup() {
    const router = useRouter();
    const userInfo = ref({});
    
    onMounted(() => {
      // 从sessionStorage获取用户信息
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        userInfo.value = JSON.parse(userStr);
      } else {
        // 未登录则跳转到登录页
        router.push('/login');
      }
    });
    
    const logout = () => {
      sessionStorage.removeItem('user');
      router.push({ path: '/index' });
    };
    
    const modifyNickname = () => {
      router.push('/myInformation');
    };
    
    const modifyPassword = () => {
      router.push('/myInformation');
    };
    
    return {
      userInfo,
      logout,
      modifyNickname,
      modifyPassword
    };
  }
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 20px 0;
}

.personal-info {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
}

header {
  width: 100%;
  height: 50px;
  background-color: #0097FF;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

header h1 {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

.content {
  background-color: #fff;
  border-radius: 12px;
  margin: 15px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.user-info-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #0097FF;
  box-shadow: 0 4px 12px rgba(0, 151, 255, 0.2);
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.info-section {
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.info-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
  font-size: 14px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.info-item.nickname {
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
}

.info-item.nickname::after {
  content: '点击修改';
  margin-left: auto;
  color: #999;
  font-size: 12px;
  padding-left: 12px;
}

.info-item .label {
  color: #666;
  width: 60px;
}

.info-item .value {
  color: #2c3e50;
  font-weight: 500;
}

.buttons-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  height: 44px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn:active {
  transform: translateY(0);
}

/* 彩虹色按钮 - 调整顺序 */
.btn:nth-child(1) {
  background-color: #ff3b30; /* 红色 */
}

.btn:nth-child(2) {
  background-color: #ff9500; /* 橙色 */
}

.btn:nth-child(3) {
  background-color: #4cd964; /* 绿色 */
}

.btn:nth-child(4) {
  background-color: #0097ff; /* 蓝色 */
}

.btn:nth-child(5) {
  background-color: #9932cc; /* 紫色 */
}

@media (min-width: 768px) {
  .content {
    margin: 20px;
    padding: 25px;
  }

  .user-info-container {
    gap: 30px;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
  }

  .info-item {
    font-size: 15px;
  }

  .btn {
    height: 48px;
    font-size: 16px;
  }
}
</style> 