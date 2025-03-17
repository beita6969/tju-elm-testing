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
                    <input type="text" v-model="user.userName" placeholder="商户名称（必填）">
                </div>
            </li>
            <li>
                <div class="title">
                    商户地址：
                </div>
                <div class="content">
                    <input type="text" v-model="user.userAddress" placeholder="商户地址（必填）">
                </div>
            </li>
            <li>
                <div class="title">
                    商家简介：
                </div>
                <div class="content">
                    <input type="text" v-model="user.userExplain" placeholder="商家简介（必填）">
                </div>
            </li>
            <li>
                <div class="title">
                    上传商家图片：
                </div>
                <div class="content">
                    <div class="business-logo">
                        <template v-if="previewImage || user.userImg">
                            <img :src="previewImage || user.userImg" alt="商家logo">
                        </template>
                        <template v-else>
                            <div class="default-logo">
                                <i class="fa fa-store"></i>
                                <div class="optional-text">选填</div>
                            </div>
                        </template>
                        <input type="file" @change="handleFileUpload" accept="image/*" ref="fileInput">
                    </div>
                </div>
            </li>

            <li>
                <div class="title">
                    起送费：
                </div>
                <div class="content">
                    <input type="number" v-model="user.userqi" placeholder="起送费（必填，不能为负数）">
                </div>
            </li>
            <li>
                <div class="title">
                    配送费：
                </div>
                <div class="content">
                    <input type="number" v-model="user.userpei" placeholder="配送费（必填，不能为负数）">
                </div>
            </li>


            <li>
                <div class="title">
                    店铺类型：
                </div>
                <div class="content">
                    <select v-model="user.usertype" class="shop-type-select" placeholder="店铺类型（必填）">
                        <option value="" disabled>请选择店铺类型（必填）</option>
                        <option value="1">美食</option>
                        <option value="2">早餐</option>
                        <option value="3">跑腿代购</option>
                        <option value="4">汉堡披萨</option>
                        <option value="5">甜品饮品</option>
                        <option value="6">速食简餐</option>
                        <option value="7">地方小吃</option>
                        <option value="8">米粉面馆</option>
                        <option value="9">包子粥铺</option>
                        <option value="10">炸鸡炸串</option>
                    </select>
                </div>
            </li>
        </ul>

        <div class="button-login">
            <button @click="register">提交信息</button>
        </div>
        <!-- 退出登录按钮 -->
        <div class="logout-button">
            <button @click="handleLogout">退出登录</button>
        </div>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

export default {
    name: 'BusinessInformation',
    setup() {
        const router = useRouter();
        const route = useRoute();

        const handleLogout = () => {
            sessionStorage.removeItem('businessUser');
            router.push('/businessLogin');
        };

        onMounted(() => {
            const businessUser = sessionStorage.getItem('businessUser') ? JSON.parse(sessionStorage.getItem('businessUser')) : null;
            
            if (!businessUser || !businessUser.isBusiness) {
                alert('请先登录商家账号！');
                router.push('/businessLogin');
                return;
            }

            // 获取商家信息
            axios.post('BusinessController/getBusinessById', {
                businessId: businessUser.businessId
            }).then(response => {
                if (response.data) {
                    // 填充已有的商家信息到表单中
                    const business = response.data;
                    user.userName = business.businessName || '';
                    user.userAddress = business.businessAddress || '';
                    user.userExplain = business.businessExplain || '';
                    user.userImg = business.businessImg || '';
                    user.userqi = business.startPrice || 0;
                    user.userpei = business.deliveryPrice || 0;
                    user.usertype = business.orderTypeId || '1';

                    // 如果有商家图片，设置预览
                    if (business.businessImg) {
                        previewImage.value = business.businessImg;
                    }
                }
            }).catch(error => {
                console.error('获取商家信息失败:', error);
                alert('获取商家信息失败，请稍后重试！');
            });
        });

        const businessId = route.query.businessId;
        const previewImage = ref('');
        const user = reactive({
            userId: businessId,
            userAddress: '',
            userName: '',
            userExplain: '',
            userImg: '',
            userqi: 0,
            userpei: 0,
            usertype: '1'
        });

        const avatar = ref(null); // 用于存储头像文件

        const handleFileUpload = (event) => {
            const file = event.target.files[0];
            console.log('选择的文件:', file);
            if (file) {
                // 验证文件类型
                if (!file.type.includes('image')) {
                    alert('请选择图片文件！');
                    event.target.value = '';
                    return;
                }
                // 验证文件大小（10MB）
                if (file.size > 10 * 1024 * 1024) {
                    alert('图片大小不能超过10MB！');
                    event.target.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const base64 = e.target.result;
                        console.log('图片转base64长度:', base64.length);
                        user.userImg = base64;
                    } catch (error) {
                        console.error('处理图片失败:', error);
                        alert('处理图片失败，请重试！');
                    }
                };

                reader.onerror = (error) => {
                    console.error('读取文件失败:', error);
                    alert('读取文件失败，请重试！');
                };

                reader.readAsDataURL(file);
            }
            // 清空文件输入框，允许选择相同的文件
            event.target.value = '';
        };


        const register = async () => {
            try {
                // 验证所有必填字段
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
                if (user.userqi === null || user.userqi === undefined || user.userqi < 0) {
                    alert('起送费不能为空且必须为非负数！');
                    return;
                }
                if (user.userpei === null || user.userpei === undefined || user.userpei < 0) {
                    alert('配送费不能为空且必须为非负数！');
                    return;
                }
                if (!user.usertype) {
                    alert('请选择店铺类型！');
                    return;
                }

                const businessUser = JSON.parse(sessionStorage.getItem('businessUser'));
                
                const response = await axios.post('BusinessController/updateBusiness', {
                    businessId: businessUser.businessId,
                    businessAddress: user.userAddress,
                    businessName: user.userName,
                    businessExplain: user.userExplain,
                    businessImg: user.userImg,
                    starPrice: user.userqi,
                    deliveryPrice: user.userpei,
                    orderTypeId: parseInt(user.usertype)
                });

                if (response.data > 0) {
                    alert('商家信息提交成功！');
                    // 更新商家信息完整标志
                    businessUser.infoCompleted = true;
                    businessUser.isNewRegistered = false;
                    sessionStorage.setItem('businessUser', JSON.stringify(businessUser));
                    
                    // 如果是从商家主页来的，返回商家主页
                    if (route.query.from === 'businessView') {
                        router.back();
                    } else {
                        router.push({ 
                            path: '/businessView',
                            query: { businessId: businessUser.businessId }
                        });
                    }
                } else {
                    alert('商家信息提交失败，请重试！');
                }
            } catch (error) {
                console.error('提交商家信息时发生错误:', error);
                alert('提交商家信息失败，请检查网络连接后重试！');
            }
        };


        return {
            user,
            handleFileUpload,
            register,
            handleLogout
        };
    }
}
</script>

<style scoped>
.wrapper {
    padding-top: 60px;
    min-height: 100vh;
    background-color: #f5f5f5;
}

header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    background-color: #0097ff;
    color: #fff;
    text-align: center;
    line-height: 50px;
    font-size: 18px;
    z-index: 1000;
}

header p {
    margin: 0;
}

.form-box {
    padding: 15px;
    margin-top: 10px;
    background-color: #fff;
    list-style: none;
}

.form-box li {
    padding: 15px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
}

.form-box .title {
    width: 100px;
    font-size: 16px;
    color: #333;
}

.form-box .content {
    flex: 1;
}

.form-box input,
.form-box select {
    width: 100%;
    height: 36px;
    padding: 0 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.button-login {
    margin: 20px 15px;
}

.button-login button {
    width: 100%;
    height: 40px;
    background-color: #0097ff;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 16px;
}

.logout-button {
    margin: 10px 15px;
}

.logout-button button {
    width: 100%;
    height: 40px;
    background-color: #ff4d4f;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 16px;
}

.business-logo {
    width: 120px;
    height: 120px;
    border: 1px dashed #ddd;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.business-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.business-logo input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.default-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #999;
}

.default-logo i {
    font-size: 40px;
    margin-bottom: 10px;
}

.optional-text {
    font-size: 12px;
}

.shop-type-select {
    appearance: none;
    background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E") no-repeat right 8px center;
    background-color: #fff;
    padding-right: 24px;
    height: 36px;
    position: relative;
}

/* 添加下拉菜单样式 */
.shop-type-select option {
    padding: 8px;
    height: 36px;
    line-height: 36px;
}

/* 设置下拉列表的样式 */
.shop-type-select:focus {
    height: 36px;
}

/* 控制下拉列表样式 */
select.shop-type-select {
    position: relative;
}

/* 设置下拉列表的最大高度和滚动条 */
.shop-type-select option:checked {
    background-color: #e6f7ff;
    color: #333;
}

/* 自定义下拉列表样式 */
select.shop-type-select:not([size]):focus option {
    max-height: calc(36px * 5);
    overflow-y: auto;
}

/* 美化滚动条样式 */
.shop-type-select::-webkit-scrollbar {
    width: 6px;
}

.shop-type-select::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.shop-type-select::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

.shop-type-select::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>