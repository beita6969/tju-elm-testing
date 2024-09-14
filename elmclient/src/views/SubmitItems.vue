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
                    食品名称：
                </div>
                <div class="content">
                    <input type="text" v-model="user.foodName" placeholder="食品名称">
                </div>
            </li>
            <li>
                <div class="title">
                    食品简介：
                </div>
                <div class="content">
                    <input type="text" v-model="user.foodExplain" placeholder="食品简介">
                </div>
            </li>

            <li>
                <div class="title">
                    上传食品图片：
                </div>
                <div class="content">
                    <input type="file" @change="handleFileUpload" accept="image/*">
                </div>
            </li>

            <li>
                <div class="title">
                    食品价格：
                </div>
                <div class="content">
                    <input type="number" v-model="user.foodPrice" placeholder="食品价格">
                </div>
            </li>

        </ul>

        <div class="button-login">
            <button @click="register">上架商品</button>
        </div>


    </div>
</template>

<script>
import { ref, reactive } from 'vue';
import Footer from '../components/Footer.vue';
import qs from 'qs';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

export default {
    name: 'SubimitItems',
    setup() {
        const router = useRouter();
        const route = useRoute();
        const businessId = route.query.businessId;
        const user = reactive({
            userId: businessId,
            foodName: '',
            foodExplain: '',
            foodImg: '',
            foodPrice: 0
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
                   
                    user.foodImg = base64;
                    console.log(user.foodImg);
                };
                reader.readAsDataURL(file);
            }

        };


        const register = async () => {
            if (!user.foodName) {
                alert('食品名称不能为空！');
                return;
            }
            if (!user.foodExplain) {
                alert('商户简介不能为空！');
                return;
            }

            if (!user.foodImg) {
                alert('食品图片不能为空！');
                return;
            }
            if (user.foodPrice === null || user.foodPrice === undefined || user.foodPrice < 0) {
                alert('食品价格不能为空且必须为非负数！');
                return;
            }

            // 注册请求
            await axios.post('FoodController/addFood', {businessId: businessId, foodName: user.foodName, foodExplain: user.foodExplain, foodImg: user.foodImg, foodPrice: user.foodPrice});
            router.push({ path: '/businessView', query: { businessId: businessId } })
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

/****************** 上架商品按钮部分 ******************/
.wrapper .bottom-button {
    width: 100%;
    height: 14vw;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 8vh;
    left: 0;
    background-color: #0097ff;
    /* 按钮颜色与顶部保持一致 */
}

.wrapper .bottom-button button {
    width: 90%;
    height: 10vw;
    font-size: 4vw;
    font-weight: 700;
    color: white;
    background-color: #0097ff;
    /* 按钮颜色与顶部保持一致 */
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.wrapper .bottom-button button:hover {
    background-color: #007acc;
}
</style>