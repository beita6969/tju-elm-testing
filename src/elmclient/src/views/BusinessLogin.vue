<template>
	<div class="wrapper">
	  <!-- header部分 -->
	  <header>
		<p>商家登陆</p>
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
  import axios from 'axios';
  import qs from 'qs';

  export default {
	name: 'BusinessLogin',
	setup() {
	  const userId = ref('');
	  const password = ref('');
	  const router = useRouter();
	  const businessId = ref('');

	  const setSessionStorage = (key, value) => {
		window.sessionStorage.setItem(key, JSON.stringify(value));
	  };

	  const login = async () => {
		if (userId.value === '') {
		  alert('手机号码不能为空！');
		  return;
		}
		if (password.value === '') {
		  alert('密码不能为空！');
		  return;
		}
		console.log(userId.value);
		await axios.post('BusinessController/getBusinessIdByPhoneNumber', {
		  phoneNumber: userId.value
		}).then(response => {
		  businessId.value = response.data;
		});
		
		// 登录请求
		await axios.post('BusinessController/getBusinessByIdByPass', {
		  userId: userId.value,
		  password: password.value
		}).then(async response => {
		  const user = response.data;
		  if (user === 0) {
			alert('用户名或密码不正确！');
		  } else {
			// 检查商家信息是否已完善
			const businessInfoResponse = await axios.post('BusinessController/getBusinessById', {
				businessId: businessId.value
			});
			
			const businessInfo = businessInfoResponse.data;
			const infoCompleted = !!(businessInfo && businessInfo.businessName && 
				businessInfo.businessAddress && businessInfo.businessExplain && 
				businessInfo.businessImg && businessInfo.startPrice !== null && 
				businessInfo.deliveryPrice !== null && businessInfo.orderTypeId);

			// 设置商家登录标识
			setSessionStorage('businessUser', { 
			  userId: userId.value,
			  businessId: businessId.value,
			  isBusiness: true,
			  infoCompleted: infoCompleted,
			  isNewRegistered: false
			});
			
			if (!infoCompleted) {
				if (confirm('检测到您的商家信息尚未完善，是否现在完善？\n完善信息后才能使用商家功能。')) {
					router.push({ 
						path: '/businessInformation', 
						query: { businessId: businessId.value } 
					});
				} else {
					alert('您可以稍后在商家主页中完善信息。');
					router.push({ 
						path: '/businessView', 
						query: { businessId: businessId.value } 
					});
				}
			} else {
				router.push({ 
					path: '/businessView', 
					query: { businessId: businessId.value } 
				});
			}
		  }
		}).catch(error => {
		  console.error(error);
		  alert('登录失败，请稍后重试！');
		});
	  };

	  const register = () => {
		router.push({ path: 'businessRegister' });
	  };

	  return {
		userId,
		password,
		login,
		register
	  };
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