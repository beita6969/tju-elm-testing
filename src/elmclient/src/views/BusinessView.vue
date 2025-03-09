<template>
    <div class="wrapper">
        <!-- header部分 -->
        <header>
            <p>商家信息</p>
        </header>
        
        <!-- 信息未完善提示 -->
        <div v-if="!isInfoCompleted" class="info-incomplete-warning">
            <p>您的商家信息尚未完善，部分功能可能无法使用</p>
            <button @click="goToCompleteInfo">去完善信息</button>
        </div>

        <div class="content-container">
            <!-- 商家logo部分 -->
            <div class="business-logo">
                <template v-if="business.businessImg">
                    <img :src="business.businessImg" @error="handleImageError" alt="商家logo">
                </template>
                <template v-else>
                    <div class="default-logo">
                        <i class="fa fa-store"></i>
                    </div>
                </template>
            </div>

            <!-- 商家信息部分 -->
            <div class="business-info">
                <h1>{{ business.businessName }}</h1>
                <p>&#165;{{ business.starPrice }}起送 &#165;{{ business.deliveryPrice }}配送</p>
                <p>{{ business.businessExplain }}</p>
            </div>

            <!-- 食品列表部分 -->
            <ul class="food">
                <li v-for="item in foodArr" :key="item.foodId">
                    <div class="food-left">
                        <img :src="item.foodImg">
                        <div class="food-left-info">
                            <h3>{{ item.foodName }}</h3>
                            <p>{{ item.foodExplain }}</p>
                            <p>&#165;{{ item.foodPrice }}</p>
                        </div>
                    </div>
                </li>
            </ul>
            <!-- 上架商品按钮部分 -->
            <div class="edit-info-button">
                <button @click="handleEditInfo">修改商家信息</button>
            </div>
            <div class="bottom-button">
                <button @click="handleAddProduct">上架商品</button>
            </div>
            <!-- 退出登录按钮 -->
            <div class="logout-button">
                <button @click="handleLogout">退出登录</button>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, reactive, onMounted, computed } from 'vue';
import axios from 'axios';
import qs from 'qs';
import { useRoute, useRouter } from 'vue-router';

export default {
    name: 'BusinessView',
    setup() {
        const businessId = ref(null);
        const business = ref({});
        const foodArr = ref([]);
        const user = ref(null);
        const route = useRoute();
        const router = useRouter();
        const isInfoCompleted = ref(true);
        
        // 默认图片处理
        const defaultImage = '/src/assets/default-business.png';
        const setDefaultImage = `this.src='${defaultImage}'`;
        
        const handleImageError = (e) => {
            console.error('商家图片加载失败');
            e.target.src = defaultImage;
        };

        const handleLogout = () => {
            sessionStorage.removeItem('businessUser');
            router.push('/businessLogin');
        };

        const goToCompleteInfo = () => {
            const businessUser = sessionStorage.getItem('businessUser') ? JSON.parse(sessionStorage.getItem('businessUser')) : null;
            if (!businessUser) {
                alert('登录已过期，请重新登录！');
                router.push('/businessLogin');
                return;
            }

            // 设置标记表示这是从商家主页来完善信息
            businessUser.isNewRegistered = false;
            businessUser.infoCompleted = false;
            sessionStorage.setItem('businessUser', JSON.stringify(businessUser));

            router.push({
                path: '/businessInformation',
                query: { 
                    businessId: businessId.value,
                    from: 'businessView'
                }
            });
        };

        onMounted(() => {
            const businessUser = sessionStorage.getItem('businessUser') ? JSON.parse(sessionStorage.getItem('businessUser')) : null;
            
            if (!businessUser || !businessUser.isBusiness) {
                alert('请先登录商家账号！');
                router.push('/businessLogin');
                return;
            }

            isInfoCompleted.value = businessUser.infoCompleted;
            businessId.value = businessUser.businessId;

            // 根据businessId查询商家信息
            axios.post('BusinessController/getBusinessById', {
                businessId: businessId.value
            }).then(response => {
                business.value = response.data;
                // 再次检查信息完整性
                if (!business.value.businessName || !business.value.businessAddress || 
                    !business.value.businessExplain || !business.value.businessImg || 
                    business.value.startPrice === null || business.value.deliveryPrice === null || 
                    !business.value.orderTypeId) {
                    isInfoCompleted.value = false;
                }
            }).catch(error => {
                console.error('获取商家信息失败:', error);
            });

            // 根据businessId查询所属食品信息
            axios.post('FoodController/listFoodByBusinessId', {
                businessId: businessId.value
            }).then(response => {
                foodArr.value = response.data.map(item => ({ ...item, quantity: 0 }));
            }).catch(handleError);
        });

        const handleError = (error) => {
            console.error('Failed to fetch data:', error);
            alert('请求失败，请稍后重试！');
        };
        const listCart = () => {
            axios.post('CartController/listCart', {
                businessId: businessId.value,
                userId: user.value.userId
            }).then(response => {
                let cartArr = response.data;
                foodArr.value.forEach(foodItem => {
                    foodItem.quantity = cartArr.find(cartItem => cartItem.foodId === foodItem.foodId)?.quantity || 0;
                });
            }).catch(error => {
                console.error(error);
            });
        };
        const handleAddProduct = () => {
            const businessUser = sessionStorage.getItem('businessUser') ? JSON.parse(sessionStorage.getItem('businessUser')) : null;
            if (!businessUser || !businessUser.isBusiness) {
                alert('登录已过期，请重新登录！');
                router.push('/businessLogin');
                return;
            }
            router.push({ 
                name: 'SubmitItems', 
                query: { businessId: businessUser.businessId } 
            });
        };

        const handleEditInfo = () => {
            const businessUser = sessionStorage.getItem('businessUser') ? JSON.parse(sessionStorage.getItem('businessUser')) : null;
            if (!businessUser || !businessUser.isBusiness) {
                alert('登录已过期，请重新登录！');
                router.push('/businessLogin');
                return;
            }
            router.push({ 
                path: '/businessInformation',
                query: { 
                    businessId: businessUser.businessId,
                    from: 'businessView'
                }
            });
        };

        return {
            business,
            foodArr,
            businessId,
            handleAddProduct,
            handleImageError,
            setDefaultImage,
            handleLogout,
            isInfoCompleted,
            goToCompleteInfo,
            handleEditInfo
        };
    }
}
</script>

<style scoped>
.wrapper {
    width: 100%;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 180px; /* 为底部按钮留出空间 */
}

.content-container {
    padding-top: 60px; /* 为固定定位的header留出空间 */
}

header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    background-color: #0097FF;
    color: #fff;
    font-size: 18px;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.info-incomplete-warning {
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    padding: 10px;
    background-color: #fff7e6;
    border: 1px solid #ffe7ba;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info-incomplete-warning p {
    margin: 0;
    color: #fa8c16;
}

.info-incomplete-warning button {
    padding: 4px 8px;
    background-color: #fa8c16;
    color: white;
    border: none;
    border-radius: 4px;
}

.business-logo {
    width: 100%;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
}

.business-logo img {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    object-fit: cover;
}

.business-logo .default-logo {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.business-logo .default-logo i {
    font-size: 48px;
    color: #999;
}

.business-info {
    padding: 20px;
    background-color: #fff;
    margin-bottom: 10px;
}

.business-info h1 {
    margin: 0 0 10px 0;
    font-size: 24px;
    color: #333;
}

.business-info p {
    margin: 5px 0;
    color: #666;
    font-size: 14px;
}

.food {
    background-color: #fff;
    padding: 0;
    margin: 0;
    list-style: none;
}

.food li {
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
}

.food-left {
    display: flex;
    align-items: center;
}

.food-left img {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    margin-right: 15px;
    object-fit: cover;
}

.food-left-info {
    flex: 1;
}

.food-left-info h3 {
    margin: 0 0 5px 0;
    font-size: 16px;
    color: #333;
}

.food-left-info p {
    margin: 3px 0;
    color: #666;
    font-size: 14px;
}

.edit-info-button,
.bottom-button,
.logout-button {
    position: fixed;
    left: 0;
    right: 0;
    padding: 10px 15px;
    background-color: #fff;
}

.edit-info-button {
    bottom: 120px;
}

.bottom-button {
    bottom: 60px;
}

.logout-button {
    bottom: 0;
}

.edit-info-button button,
.bottom-button button {
    width: 100%;
    height: 40px;
    background-color: #0097FF;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 16px;
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
</style>
