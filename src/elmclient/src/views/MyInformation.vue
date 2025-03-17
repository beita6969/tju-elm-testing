<template>
  <div class="wrapper">
    <div class="my-information">
      <div class="header">
        <h1>个人信息</h1>
      </div>
      <div class="content">
        <div class="user-info-container">
          <div class="details">
            <p class="nickname" @click="editNickname">昵称: {{ user?.userName }}</p>
            <p class="phone">电话: {{ user?.userId }}</p>
            <p class="gender">性别: {{ user?.userSex === 1 ? '男' : '女' }}</p>
          </div>
          <div class="avatar" @click="showUpload">
            <img :src="user2?.userImg || user?.userImg" alt="点击更换头像" />
            <div class="avatar-overlay">
              <span>点击更换头像</span>
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="edit-nickname" v-if="showEditNickname">
            <input v-model="newNickname" placeholder="输入新昵称" />
            <button @click="submitNickname">提交</button>
          </div>
          <div class="ep" v-if="showEditPassword">
            <div class="edit-password">
              <input type="password" v-model="oldPassword" placeholder="输入旧密码" />
              <input type="password" v-model="newPassword" placeholder="输入新密码" />
            </div>
            <button @click="submitPassword">提交</button>
          </div>
          <input type="file" ref="fileInput" @change="uploadAvatar" accept="image/*" style="display:none;" />
          <div class="main-buttons">
            <button class="btn-red" @click="editpasswd">修改密码</button>
            <button class="btn-orange" @click="myfavorite">收藏列表</button>
            <button class="btn-yellow" @click="goToLikesList">点赞列表</button>
            <button class="btn-blue" @click="goToCommentsList">评论列表</button>
            <button class="btn-purple" @click="logout">退出登录</button>
          </div>
        </div>
      </div>
    </div>
    <Footer /> <!-- Footer组件放在页面底部 -->
  </div>
</template>

<script>
import { ref, onMounted, onBeforeMount } from 'vue';
import Footer from '../components/Footer.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { toast } from '../utils/toast';

export default {
  name: 'MyInformation',
  setup() {
    const router = useRouter();
    const user = ref();
    const user2 = ref();
    const showEditNickname = ref(false);
    const newNickname = ref('');
    const showEditPassword = ref(false);
    const newPassword = ref('');
    const oldPassword = ref('');
    const fileInput = ref(null);

    const showUpload = () => {
      fileInput.value.click();
    };

    const uploadAvatar = async (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log('选择的文件:', file);
        console.log('文件类型:', file.type);
        console.log('文件大小:', file.size);

        // 放宽文件类型限制，只要是图片就可以
        if (!file.type.includes('image')) {
          toast.warning('请选择图片文件！');
          event.target.value = '';
          return;
        }
        // 放宽文件大小限制到10MB
        if (file.size > 10 * 1024 * 1024) {
          toast.warning('图片大小不能超过10MB！');
          event.target.value = '';
          return;
        }

        try {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const base64String = e.target.result;
            console.log('图片转base64长度:', base64String.length);

            try {
              console.log('准备发送的数据:', {
                userId: user.value.userId,
                userImg: base64String.substring(0, 100) + '...' // 只打印开头部分避免日志过长
              });

              const response = await axios.post('UserController/changeUserAvatar', {
                userId: user.value.userId,
                userImg: base64String
              });

              console.log('服务器响应:', response);

              if (response.data.code === 1) {
                // 更新头像显示
                user.value.userImg = base64String;
                if (user2.value) {
                  user2.value.userImg = base64String;
                }
                // 更新sessionStorage中的用户信息
                sessionStorage.setItem('user', JSON.stringify(user.value));
                toast.success('头像修改成功！');
              } else {
                console.error('服务器返回错误:', response.data);
                toast.error(response.data.msg || '头像修改失败，请重试！');
              }
            } catch (error) {
              console.error('修改头像请求失败:', error);
              console.error('错误详情:', error.response?.data || error.message);
              toast.error('头像上传失败，请重试！');
            }
          };

          reader.onerror = (error) => {
            console.error('文件读取错误:', error);
            toast.error('读取文件失败，请重试！');
          };

          reader.readAsDataURL(file);
        } catch (error) {
          console.error('文件处理错误:', error);
          toast.error('处理文件失败，请重试！');
        }
      }
      // 清空文件输入框，允许选择相同的文件
      event.target.value = '';
    };

    onBeforeMount(async () => {
      user.value = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
      if (!user.value) {
        toast.warning('用户未登录，请先登录！');
        router.push({ path: '/login' });
        return;
      }

      try {
        const response = await axios.post('UserController/getUserByIdByPass', {
          userId: user.value.userId,
          password: user.value.password,
        });
        
        if (response.data) {
          user2.value = response.data;
          // 如果返回的用户数据中有新的头像URL，更新本地状态
          if (response.data.userImg) {
            user.value.userImg = response.data.userImg;
            sessionStorage.setItem('user', JSON.stringify(user.value));
          }
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        toast.error('获取用户信息失败，请重试！');
      }
    });

    const logout = () => {
      sessionStorage.removeItem('user');
      router.push({ path: '/index' });
    };

    const editNickname = () => {
      showEditNickname.value = true;
    };

    const submitNickname = () => {
      if (newNickname.value.trim() === '') {
        toast.warning('昵称不能为空！');
        return;
      }
      if (newNickname.value.length > 8) {
        toast.warning('昵称不能超过8个字符！');
        return;
      }
      axios
        .post('UserController/changeUserName', {
          userId: user.value.userId,
          userName: newNickname.value,
        })
        .then((response) => {
          if (response.data === 1) {
            user.value.userName = newNickname.value;
            sessionStorage.setItem('user', JSON.stringify(user.value));
            toast.success('昵称修改成功！');
            showEditNickname.value = false;
            newNickname.value = '';
          } else {
            toast.error('昵称修改失败！');
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error('昵称修改失败！');
        });
    };

    const editpasswd = () => {
      showEditPassword.value = true;
    };

    const submitPassword = () => {
      if (oldPassword.value.trim() === '') {
        toast.warning('旧密码不能为空！');
        return;
      }
      if (newPassword.value.trim() === '') {
        toast.warning('新密码不能为空！');
        return;
      }

      axios
        .post('UserController/changeUserPassword', {
          userId: user.value.userId,
          oldPassword: oldPassword.value,
          newPassword: newPassword.value,
        })
        .then((response) => {
          if (response.data === 1) {
            toast.success('密码修改成功！');
            showEditPassword.value = false;
            oldPassword.value = '';
            newPassword.value = '';
          } else {
            toast.error('密码修改失败！');
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error('密码修改失败！');
        });
    };

    const myfavorite = () => {
      router.push({ path: '/favorites' });
    };

    const goToLikesList = () => {
      router.push({ path: '/likes' });
    };

    const goToCommentsList = () => {
      router.push({ path: '/comments' });
    };

    return {
      user,
      user2,
      logout,
      editNickname,
      submitNickname,
      showEditNickname,
      newNickname,
      editpasswd,
      submitPassword,
      showEditPassword,
      newPassword,
      oldPassword,
      showUpload,
      uploadAvatar,
      fileInput,
      myfavorite,
      goToLikesList,
      goToCommentsList
    };
  },
  components: {
    Footer,
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 8vh;
  background-color: #f8f9fa;
}

.my-information {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  width: 100%;
  height: 10vw;
  background-color: #0097ff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header h1 {
  color: white;
  font-size: 4.5vw;
  margin: 0;
  font-weight: 500;
}

.content {
  width: 92%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  margin-top: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 15px 0;
}

.user-info-container {
  width: 90%;
  max-width: 500px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 2vw auto;
}

.avatar {
  position: relative;
  cursor: pointer;
  width: 20vw;
  height: 20vw;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #0097ff;
  box-shadow: 0 4px 12px rgba(0, 151, 255, 0.2);
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.avatar:hover img {
  filter: brightness(85%);
  transform: scale(1.05);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.avatar:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay span {
  font-size: 2.5vw;
  text-align: center;
  padding: 1vw;
}

.details {
  flex: 1;
  background-color: #f8f9fa;
  padding: 3vw;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.nickname {
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  padding: 1.5vw;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  margin-bottom: 1.5vw;
}

.nickname::after {
  content: '点击修改';
  margin-left: auto;
  color: #999;
  font-size: 2.8vw;
  padding-left: 2vw;
}

.phone,
.gender {
  font-size: 3.5vw;
  margin: 1.5vw 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  padding: 1.5vw;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.actions {
  width: 90%;
  max-width: 500px;
  margin: 2vw auto;
  display: flex;
  flex-direction: column;
  gap: 2vw;
}

.main-buttons {
  display: flex;
  flex-direction: column;
  gap: 2vw;
  width: 100%;
}

.main-buttons button {
  padding: 2.5vw;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-size: 4vw;
  width: 100%;
  text-align: center;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.main-buttons button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.main-buttons button:active {
  transform: translateY(0);
}

.btn-red {
  background-color: #ff3b30 !important;
}

.btn-orange {
  background-color: #ff9500 !important;
}

.btn-yellow {
  background-color: #05cf37 !important;
}

.btn-blue {
  background-color: #0097ff !important;
}

.btn-purple {
  background-color: #9932cc !important;
}

.edit-nickname,
.edit-password,
.ep {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5vw;
  margin-top: -1vw;
  margin-bottom: 1vw;
  background-color: #f8f9fa;
  padding: 2.5vw;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.edit-nickname input,
.edit-password input {
  height: 9vw;
  font-size: 3.5vw;
  padding: 0 2.5vw;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: white;
}

.edit-nickname button,
.ep button {
  margin-top: 1.5vw;
  height: 9vw;
}

@media (min-width: 768px) {
  .content {
    width: 85%;
    max-width: 600px;
  }
  
  .user-info-container {
    gap: 30px;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
  }
  
  .nickname::after {
    font-size: 12px;
  }
  
  .nickname,
  .phone,
  .gender,
  .avatar_name {
    font-size: 16px;
  }
  
  .main-buttons button {
    font-size: 16px;
    padding: 12px;
  }
  
  .avatar-overlay span {
    font-size: 14px;
  }
  
  .header {
    height: 60px;
  }
  
  .header h1 {
    font-size: 20px;
  }
}
</style>