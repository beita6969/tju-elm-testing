<template>
	<div class="wrapper">
		<!-- header部分 -->
		<header>
			<p>用户注册</p>
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
			<li>
				<div class="title">
					用户名称：
				</div>
				<div class="content">
					<input type="text" v-model="user.userName" placeholder="用户名称">
				</div>
			</li>
			<li>
				<div class="title">
					性别：
				</div>
				<div class="content" style="font-size: 3vw;">
					<input type="radio" v-model="user.userSex" value="1" style="width:6vw;height: 3.2vw;">男
					<input type="radio" v-model="user.userSex" value="0" style="width:6vw;height: 3.2vw;">女
				</div>
			</li>
			<li>
				<div class="title">
					上传头像：
				</div>
				<div class="content">
					<input type="file" @change="handleFileUpload" accept="image/*">
				</div>
			</li>
		</ul>

		<div class="button-login">
			<button @click="register">注册</button>
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
	name: 'Register',
	setup() {
		const router = useRouter();
		const user = reactive({
			userId: '',
			password: '',
			userName: '',
			userSex: 1,
			userImg: ''
		});
		const confirmPassword = ref('');
		const reg = /^1[3456789]\d{9}$/;
		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

		const exist = ref(false); // 用于判断手机号是否已存在
		const checkUserId = () => {
			axios.post('UserController/userIdExists', {
				userId: user.userId,
			}).then(response => {
				console.log(response.data);
				if (response.data == 1) {
					user.userId = '';
					alert('此手机号码已存在！');
				}
			}).catch(error => {
				console.error(error);
			});
		};
		const avatar = ref(null); // 用于存储头像文件

		const handleFileUpload = (event) => {
			const file = event.target.files[0];
			console.log(file);
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const base64 = e.target.result;
					avatar.value = base64;
					console.log(base64); // 可选：用于调试
				};
				reader.readAsDataURL(file);
				console.log(avatar.value); // 可选：用于调试
			}

		};


		const register = () => {
			if (!reg.test(user.userId)) {
				alert('手机号码格式错误，请重新输入！');
				return;
			}
			if (!regex.test(user.password)) {
				alert('密码格式错误，请确保包含至少一个大写字母、一个小写字母和一个数字，长度至少为8个字符。');
				return;
			}
			if (user.password != confirmPassword.value) {
				alert('两次输入的密码不一致！');
				return;
			}
			if (user.userName == '') {
				alert('用户名不能为空！');
				return;
			}
			if (user.userName.length>8) {
				alert('用户名过长！');
				return;
			}
			// 注册请求
			axios.post('UserController/saveUser', user)
				.then(response => {
					if (response.data > 0) {
						console.log(111111);
						alert('注册成功！');
						router.push({path: '/index'});
					} else {
						alert('注册失败！');
					}
				}).catch(error => {
					console.error(error);
				});
		};


		return {
			user,
			confirmPassword,
			checkUserId,
			handleFileUpload,
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