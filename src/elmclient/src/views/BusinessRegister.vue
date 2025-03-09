<template>
	<div class="wrapper">
		<!-- header部分 -->
		<header>
			<p>商户注册</p>
		</header>

		<!-- 表单部分 -->
		<ul class="form-box">
			<li>
				<div class="title">
					手机号码：
				</div>
				<div class="content">
					<input type="text" @blur="checkUserId" v-model="user.userId" placeholder="手机号码">
				</div>
			</li>
			<li>
				<div class="title">
					密码：
				</div>
				<div class="content">
					<input type="password" v-model="user.password" placeholder="密码">
				</div>
			</li>
			<li>
				<div class="title">
					确认密码：
				</div>
				<div class="content">
					<input type="password" v-model="confirmPassword" placeholder="确认密码">
				</div>
			</li>
			
		</ul>

		<div class="button-login">
			<button @click="register">去审核</button>
		</div>

		<!-- 底部菜单部分 -->

	</div>
</template>

<script>
import { ref, reactive } from 'vue';
import Footer from '../components/Footer.vue';
import qs from 'qs';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
	name: 'BusinessRegister',
	setup() {
		const router = useRouter();
		const user = reactive({
			userId: '',
			password: ''

		
		});
		const confirmPassword = ref('');
		const reg = /^1[3456789]\d{9}$/;
		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
		const businessId = ref(null); // 商家id
		const exist = ref(false); // 用于判断手机号是否已存在
		const checkUserId = async () => {
			try {
				if (!user.userId) return;
				
				const response = await axios.post('BusinessController/checkBusiness', {
					phoneNumber: user.userId
				});
				
				if (response.data === 1) {
					exist.value = true;
					user.userId = '';
					alert('此手机号码已注册！');
				} else {
					exist.value = false;
				}
			} catch (error) {
				console.error('检查手机号时发生错误:', error);
				alert('验证手机号失败，请稍后重试！');
			}
		};
	
		const register = async () => {
			try {
				if (user.userId === '') {
					alert('手机号码不能为空！');
					return;
				}
				if (!reg.test(user.userId)) {
					alert('手机号码格式不正确！');
					return;
				}
				if (user.password === '') {
					alert('密码不能为空！');
					return;
				}
				if (!regex.test(user.password)) {
					alert('密码必须包含大小写字母和数字，且长度不少于8位！');
					return;
				}
				if (confirmPassword.value === '') {
					alert('请确认密码！');
					return;
				}
				if (user.password !== confirmPassword.value) {
					alert('两次输入的密码不一致！');
					return;
				}

				// 检查手机号是否已存在
				const checkResponse = await axios.post('BusinessController/checkBusiness', {
					phoneNumber: user.userId
				});
				
				if (checkResponse.data === 1) {
					alert('此手机号码已注册！');
					return;
				}

				// 注册请求
				const response = await axios.post('BusinessController/saveBusiness', {
					phoneNumber: user.userId,
					password: user.password
				});

				if (response.data > 0) {
					// 获取商家ID
					const businessIdResponse = await axios.post('BusinessController/getBusinessIdByPhoneNumber', {
						phoneNumber: user.userId
					});
					
					const businessId = businessIdResponse.data;
					
					alert('注册成功！请完善商家信息。');
					// 设置商家登录状态
					sessionStorage.setItem('businessUser', JSON.stringify({
						userId: user.userId,
						businessId: businessId,
						isBusiness: true,
						infoCompleted: false,
						isNewRegistered: true
					}));
					
					// 跳转到完善信息页面
					router.push({
						path: '/businessInformation',
						query: { businessId: businessId }
					});
				} else {
					alert('注册失败，请重试！');
				}
			} catch (error) {
				console.error('注册失败:', error);
				alert('注册失败，请稍后重试！');
			}
		};


		return {
			user,
			confirmPassword,
			checkUserId,

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
	color: #666;
	background-color: #EEE;
	border-radius: 4px;
	border: none;
	outline: none;
	border: solid 1px #DDD;
}

.wrapper .form-box li .content input[type="file"] {
	width: 100%;
	height: 4vw;
	font-size: 3vw;
	border: none;
	outline: none;
	color: #666;
}
</style>