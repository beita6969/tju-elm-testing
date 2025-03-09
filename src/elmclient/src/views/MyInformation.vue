<template>
  <div class="wrapper">
    <div class="my-information">
      <div class="header">
        <h1>个人信息</h1>
      </div>
      <div class="content">
        <div class="avatar_name">用户头像</div>
        <div class="avatar" @click="showUpload">
          <img :src="user2?.userImg || user?.userImg" alt="点击更换头像" />
          <div class="avatar-overlay">
            <span>点击更换头像</span>
          </div>
        </div>
        <div class="details">
          <p class="nickname">昵称: {{ user?.userName }}</p>
          <p class="phone">电话: {{ user?.userId }}</p>
          <p class="gender">性别: {{ user?.userSex === 1 ? '男' : '女' }}</p>
        </div>
        <div class="actions">
          <button @click="editNickname">修改昵称</button>
          <div class="edit-nickname" v-if="showEditNickname">
            <input v-model="newNickname" placeholder="输入新昵称" />
            <button @click="submitNickname">提交</button>
          </div>
          <button @click="editpasswd">修改密码</button>
          <div class="ep" v-if="showEditPassword">
            <div class="edit-password" v-if="showEditPassword">
              <input type="password" v-model="oldPassword" placeholder="输入旧密码" />
              <input type="password" v-model="newPassword" placeholder="输入新密码" />
            </div>
            <button @click="submitPassword">提交</button>
          </div>
          <input type="file" ref="fileInput" @change="uploadAvatar" accept="image/*" style="display:none;" />
          <button @click="logout">退出登录</button>
          <button @click="myfavorite">收藏列表</button>
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
      router.push({ path: '/myfavorite' });
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
      myfavorite
    };
  },
  components: {
    Footer,
  },
};
</script>

<style scoped>
/* 调整整体布局的高度和间距 */
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 8vh;
  /* 预留footer的空间，防止内容被遮挡 */
}

.my-information {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

}

.wrapper .my-information .header {
  width: 100%;
  height: 15vw;
  /* 增加 header 高度 */
  background-color: #0097ff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper .my-information .header h1 {
  color: white;
  font-size: 6vw;
  /* 增加标题字体大小 */
  margin: 0;
}

.wrapper .my-information .content .avatar_name {
  font-size: 5vw;
  /* 增加字体大小 */
  font-weight: bold;
  margin: 3vw;
}

.wrapper .my-information .avatar {
  position: relative;
  cursor: pointer;
  width: 25vw;
  height: 25vw;
  margin: 5vw;
  border-radius: 50%;
  overflow: hidden;
}

.wrapper .my-information .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: filter 0.3s ease;
}

.wrapper .my-information .avatar:hover img {
  filter: brightness(70%);
}

.wrapper .my-information .avatar-overlay {
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

.wrapper .my-information .avatar:hover .avatar-overlay {
  opacity: 1;
}

.wrapper .my-information .avatar-overlay span {
  font-size: 3vw;
  text-align: center;
}

.wrapper .my-information .content {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f1eeee;
}

.wrapper .my-information .details,
.wrapper .my-information .actions {
  width: 80%;
  max-width: 500px;
  margin: 5vw;
}

.wrapper .my-information .details {
  margin-bottom: 5vw;
}

.wrapper .my-information .nickname,
.wrapper .my-information .phone,
.wrapper .my-information .gender {
  font-size: 4vw;
  /* 增加文本字体大小 */
  font-weight: bold;
  margin: 2vw 0;
  text-align: center;
}

.wrapper .my-information .actions {
  display: flex;
  flex-direction: column;
  gap: 4vw;
  /* 增加按钮之间的间距 */
}

.wrapper .my-information .actions button {
  padding: 3vw;
  /* 增加按钮高度 */
  border: none;
  border-radius: 2vw;
  cursor: pointer;
  background-color: #0097ff;
  color: white;
  font-size: 4vw;
  /* 增加按钮字体大小 */
  width: 100%;
  text-align: center;
  /* 确保按钮内文本居中 */
}

.wrapper .my-information .actions .edit-nickname {
  display: flex;
  flex-direction: row;
  /* 调整为垂直布局，保持按钮居中 */
  align-items: center;
}

.wrapper .my-information .actions .edit-nickname input {
  margin-right: 2vw;
  height: 10vw;
  /* 增加输入框高度 */
  font-size: 3vw;
  /* 增加输入框字体大小 */
  flex: 1;
}

.wrapper .my-information .actions .edit-nickname button {
  width: 100%;
  /* 确保提交按钮宽度为100% */

  font-size: 4vw;
  text-align: center;
  /* 确保提交按钮文本居中 */
}

.wrapper .my-information .actions .ep {
  display: flex;
  flex-direction: row;

}

.wrapper .my-information .actions .edit-password {
  display: flex;
  flex-direction: column;
  /* 横向布局 */
  gap: 1vw;
  align-items: center;
}

.wrapper .my-information .actions .edit-password input {
  flex: 1;
  /* 使输入框占据可用空间 */
  height: 6vw;
  font-size: 4vw;
  margin-right: 2vw;
}

.wrapper .my-information .actions .edit-password button {
  height: 6vw;
  font-size: 4vw;
  padding: 0 3vw;
  /* 适当调整按钮宽度 */
}

.wrapper .my-information .actions button:hover {
  background-color: #0086e6;
}
</style>