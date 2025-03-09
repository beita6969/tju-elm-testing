<template>
	<div class="wrapper">
	  <!-- header部分 -->
	  <header>
		<p>用户登陆</p>
	  </header>
  
	  <!-- 表单部分 -->
	  <ul class="form-box">
		<li>
		  <div class="title">
			手机号码：
		  </div>
		  <div class="content">
			<input type="text" v-model="userId" placeholder="手机号码">
		  </div>
		</li>
		<li>
		  <div class="title">
			密码：
		  </div>
		  <div class="content">
			<input type="password" v-model="password" placeholder="密码">
		  </div>
		</li>
	  </ul>
  
	  <div class="button-login">
		<button @click="login">登陆</button>
	  </div>
	  <div class="button-register">
		<button @click="register">去注册</button>
	  </div>
  
	  <!-- 底部菜单部分 -->

	</div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios'; // 假设axios是从这里导入的
  import qs from 'qs'; // 假设qs是从这里导入的
  import Footer from '../components/Footer.vue';
  
  export default {
	name: 'Login',
	setup() {
	  const userId = ref('');
	  const password = ref('');
	  const router = useRouter();


	  const setSessionStorage = (key, value) => {
      window.sessionStorage.setItem(key, JSON.stringify(value)); // 自定义会话存储函数
    };
	  const login = () => {
		if (userId.value === '') {
		  alert('手机号码不能为空！');
		  return;
		}
		if (password.value === '') {
		  alert('密码不能为空！');
		  return;
		}
  
		// 登录请求
		const loginData = {
		  userId: userId.value,
		  password: password.value
		};
  
		axios({
		  method: 'post',
		  url: 'UserController/getUserByIdByPass',
		  data: loginData,
		  headers: {
			'Content-Type': 'application/json'
		  }
		}).then(response => {
		  const user = response.data;
		  if (!user) {
			alert('用户名或密码不正确！');
		  } else {
			setSessionStorage('user', user);
			router.push({ path: '/index' });
		  }
		}).catch(error => {
		  console.error('登录错误:', error);
		  if (error.response) {
			// 服务器返回错误状态码
			if (error.response.status === 404) {
			  alert('接口不存在，请检查API路径！');
			} else if (error.response.status === 500) {
			  alert('服务器内部错误，请稍后重试！');
			} else if (error.response.status === 415) {
			  alert('请求格式错误，请检查数据格式！');
			} else {
			  alert('登录失败：' + (error.response.data?.message || '未知错误'));
			}
		  } else if (error.request) {
			// 请求发出但没有收到响应
			alert('无法连接到服务器，请检查网络连接！');
		  } else {
			// 请求配置出错
			alert('请求配置错误，请稍后重试！');
		  }
		});
	  };
  
	  const register = () => {
		router.push({ path: 'register' });
	  };
  
	  return {
		userId,
		password,
		login,
		register
	  };
	},
	components: {
	  Footer
	}
  }
  </script>
  
  <style scoped>
		 /****************** 总容器 ******************/
		 .wrapper {
		 	width: 100%;
		 	height: 100%;
		 }
	
		 /****************** header部分 ******************/
		 .wrapper header {
		 	width: 100%;
		 	height: 12vw;
		 	background-color: #0097FF;
		 	color: #fff;
		 	font-size: 4.8vw;
		 	position: fixed;
		 	left: 0;
		 	top: 0;
		 	z-index: 1000;
		 	display: flex;
		 	justify-content: center;
		 	align-items: center;
		 }
	
		 /****************** 表单部分 ******************/
		 .wrapper .form-box {
		 	width: 100%;
		 	margin-top: 12vw;
		 }
	
		 .wrapper .form-box li {
		 	box-sizing: border-box;
		 	padding: 4vw 3vw 0 3vw;
		 	display: flex;
		 	align-items: center;
		 }
	
		 .wrapper .form-box li .title {
		 	flex: 0 0 18vw;
		 	font-size: 3vw;
		 	font-weight: 700;
		 	color: #666;
		 }
	
		 .wrapper .form-box li .content {
		 	flex: 1;
		 }
	
		 .wrapper .form-box li .content input {
		 	border: none;
		 	outline: none;
		 	width: 100%;
		 	height: 4vw;
		 	font-size: 3vw;
		 }
	
		 .wrapper .button-login {
		 	width: 100%;
		 	box-sizing: border-box;
		 	padding: 4vw 3vw 0 3vw;
		 }
	
		 .wrapper .button-login button {
		 	width: 100%;
		 	height: 10vw;
		 	font-size: 3.8vw;
		 	font-weight: 700;
		 	color: #fff;
		 	background-color: #38CA73;
		 	border-radius: 4px;
		 	border: none;
		 	outline: none;
		 }
	
		 .wrapper .button-register {
		 	width: 100%;
		 	box-sizing: border-box;
		 	padding: 4vw 3vw 0 3vw;
		 }
	
		 .wrapper .button-register button {
		 	width: 100%;
		 	height: 10vw;
		 	font-size: 3.8vw;
		 	font-weight: 700;
		 	/*与上面登陆按钮不同的只有颜色、背景色、边框不同*/
		 	color: #666;
		 	background-color: #EEE;
		 	border: solid 1px #DDD;
		 	border-radius: 4px;
		 	border: none;
		 	outline: none;
		 }
	
		 /****************** 底部菜单部分 ******************/
		 .wrapper .footer {
		 	width: 100%;
		 	height: 14vw;
		 	border-top: solid 1px #DDD;
		 	background-color: #fff;
		 	position: fixed;
		 	left: 0;
		 	bottom: 0;
		 	display: flex;
		 	justify-content: space-around;
		 	align-items: center;
		 }
	
		 .wrapper .footer li {
		 	display: flex;
		 	flex-direction: column;
		 	justify-content: center;
		 	align-items: center;
		 	color: #999;
		 	user-select: none;
		 	cursor: pointer;
		 }
	
		 .wrapper .footer li p {
		 	font-size: 2.8vw;
		 }
	
		 .wrapper .footer li i {
		 	font-size: 5vw;
		 }
  
</style>