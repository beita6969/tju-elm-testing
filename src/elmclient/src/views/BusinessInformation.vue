<template>
    <div class="wrapper">
        <!-- header部分 -->
        <header>
            <p>提交商家信息</p>
        </header>

        <!-- 表单部分 -->
        <ul class="form-box">

            <li>
                <div class="title">
                    商户名称：
                </div>
                <div class="content">
                    <input type="text" v-model="user.userName" placeholder="商户名称">
                </div>
            </li>
            <li>
                <div class="title">
                    商户地址：
                </div>
                <div class="content">
                    <input type="text" v-model="user.userAddress" placeholder="商户地址">
                </div>
            </li>
            <li>
                <div class="title">
                    商家简介：
                </div>
                <div class="content">
                    <input type="text" v-model="user.userExplain" placeholder="商家简介">
                </div>
            </li>
            <li>
                <div class="title">
                    上传商家图片：
                </div>
                <div class="content">
                    <input type="file" @change="handleFileUpload" accept="image/*">
                </div>
            </li>

            <li>
                <div class="title">
                    起送费：
                </div>
                <div class="content">
                    <input type="number" v-model="user.userqi" placeholder="起送费">
                </div>
            </li>
            <li>
                <div class="title">
                    配送费：
                </div>
                <div class="content">
                    <input type="number" v-model="user.userpei" placeholder="配送费">
                </div>
            </li>


            <li>
                <div class="title">
                    店铺类型：
                </div>
                <div class="content">
                    <input type="number" v-model="user.usertype" placeholder="店铺类型">
                </div>
            </li>
        </ul>

        <div class="button-login">
            <button @click="register">提交信息</button>
        </div>

        <!-- 底部菜单部分 -->

    </div>
</template>

<script>
import { ref, reactive } from 'vue';
import Footer from '../components/Footer.vue';
import qs from 'qs';
import { useRouter,useRoute } from 'vue-router';
import axios from 'axios';

export default {
    name: 'Register',
    setup() {
        const router = useRouter();
        const route = useRoute();
        const businessId = route.query.businessId;
        const user = reactive({
            userId: businessId,
            userAddress: '',
            userName: '',
            userExplain: '',
            userImg: '',
            userqi: 0,
            userpei: 0,
            usertype: 1
        });

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
                    user.userImg = base64;
                    console.log(user.userImg);
                };
                reader.readAsDataURL(file);
                
            }

        };


        const register = async () => {
            if (!user.userName) {
                alert('商户名称不能为空！');
                return;
            }
            if (!user.userAddress) {
                alert('商户地址不能为空！');
                return;
            }
            if (!user.userExplain) {
                alert('商家简介不能为空！');
                return;
            }
            if (!user.userImg) {
                alert('商家图片不能为空！');
                return;
            }
            if (user.userqi === null || user.userqi === undefined || user.userqi < 0) {
                alert('起送费不能为空且必须为非负数！');
                return;
            }
            if (user.userpei === null || user.userpei === undefined || user.userpei < 0) {
                alert('配送费不能为空且必须为非负数！');
                return;
            }
            if (user.usertype === null || user.usertype === undefined || user.usertype < 1) {
                alert('店铺类型不能为空且必须为正数！');
                return;
            }
            // 注册请求
            console.log(user);
            await axios.post('BusinessController/updateBusiness', { businessId: user.userId,businessAddress: user.userAddress, businessName: user.userName, businessExplain:user.userExplain, businessImg: user.userImg, startPrice: user.userqi, deliveryPrice: user.userpei, orderTypeId: user.usertype});
            router.push('/index')
        };


        return {
            user,
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