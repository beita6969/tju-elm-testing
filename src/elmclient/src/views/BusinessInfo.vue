<template>
	<div class="wrapper">
		<!-- header部分 -->
		<header>
			<p>商家信息</p>
		</header>
		<!-- 商家logo部分 -->
		<div class="business-logo">
			<img :src="business.businessImg">
		</div>

		<!-- 商家信息部分 -->
		<div class="business-info">
			<h1>{{ business.businessName }}</h1>
			<p>&#165;{{ business.starPrice }}起送 &#165;{{ business.deliveryPrice }}配送</p>
			<p>{{ business.businessExplain }}</p>
		</div>

		<!-- 食品列表部分 -->
		<ul class="food">
			<li v-for="(item, index) in foodArr" :key="item.foodId">
				<div class="food-left">
					<img :src="item.foodImg">
					<div class="food-left-info">
						<h3>{{ item.foodName }}</h3>
						<p>{{ item.foodExplain }}</p>
						<p>&#165;{{ item.foodPrice }}</p>
					</div>
				</div>
				<div class="food-right">
					<div>
						<i class="fa fa-minus-circle" @click="minus(index)" v-show="item.quantity != 0"></i>
					</div>
					<p><span v-show="item.quantity != 0">{{ item.quantity }}</span></p>
					<div>
						<i class="fa fa-plus-circle" @click="add(index)"></i>
					</div>
				</div>
			</li>
		</ul>

		<!-- 购物车部分 -->
		<div class="cart">
			<div class="cart-left">
				<div class="cart-left-icon"
					:style="totalQuantity == 0 ? 'background-color:#505051;' : 'background-color:#3190E8;'"@click="goToCart(businessId.value)">
					<i class="fa fa-shopping-cart"></i>
					<div class="cart-left-icon-quantity" v-show="totalQuantity != 0">{{ totalQuantity }}</div>
				</div>
				<div class="cart-left-info">
					<p>&#165;{{ totalPrice.toFixed(2) }}</p>
					<p>另需配送费{{ business.deliveryPrice }}元</p>
				</div>
			</div>
			<div class="cart-right">
				<!-- 不够起送费 -->
				<div class="cart-right-item" v-show="totalSettle < business.starPrice"
					style="background-color: #535356; cursor: default;">
					&#165;{{ business.starPrice }}起送
				</div>
				<!-- 达到起送费 -->
				 
			

				<div class="cart-right-item" @click="toOrder" v-show="totalSettle >= business.starPrice">
					去结算
				</div>
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
	name: 'BusinessInfo',
	setup() {
		const businessId = ref(null);
		const business = ref({});
		const foodArr = ref([]);
		const user = ref(null);
		const route = useRoute(); // 定义 route
		const router = useRouter(); // 定义 router

		onMounted(() => {
			// 确保businessId是数字类型
			businessId.value = parseInt(route.query.businessId);
			console.log('BusinessInfo - 获取到的商家ID:', businessId.value);
			user.value = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

			// 根据businessId查询商家信息
			axios.post('BusinessController/getBusinessById', { 
				businessId: businessId.value 
			}).then(response => {
				console.log('Business data:', response.data);
				business.value = response.data;
			}).catch(error => {
				console.error('获取商家信息失败:', error);
				handleError(error);
			});

			// 根据businessId查询所属食品信息
			axios.post('FoodController/listFoodByBusinessId', {
				 businessId: businessId.value 
			}).then(response => {
				console.log('Food data:', response.data);
				foodArr.value = response.data.map(item => ({ ...item, quantity: 0 }));
				if (user.value !== null) {
					listCart();
				}
			}).catch(error => {
				console.error('获取食品信息失败:', error);
				handleError(error);
			});
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

		const add = (index) => {
			if (user.value === null) {
				router.push({ path: '/login' });
				return;
			}
			const item = foodArr.value[index];
			if (item.quantity === 0) {
				savaCart(index);
			} else {
				updateCart(index, 1);
			}
		};

		const minus = (index) => {
			if (user.value === null) {
				router.push({ path: '/login' });
				return;
			}
			const item = foodArr.value[index];
			if (item.quantity > 1) {
				updateCart(index, -1);
			} else {
				removeCart(index);
			}
		};

		const savaCart = (index) => {
			axios.post('CartController/saveCart', {
				businessId: businessId.value,
				userId: user.value.userId,
				foodId: foodArr.value[index].foodId
			}).then(response => {
				if (response.data === 1) {
					foodArr.value[index].quantity = 1;
				} else {
					alert('向购物车中添加食品失败！');
				}
			}).catch(error => {
				console.error(error);
			});
		};

		const updateCart = (index, num) => {
			axios.post('CartController/updateCart',{
				businessId: businessId.value,
				userId: user.value.userId,
				foodId: foodArr.value[index].foodId,
				quantity: foodArr.value[index].quantity + num
			}).then(response => {
				if (response.data === 1) {
					foodArr.value[index].quantity += num;
				} else {
					alert('向购物车中更新食品失败！');
				}
			}).catch(error => {
				console.error(error);
			});
		};

		const removeCart = (index) => {
			axios.post('CartController/removeCart', {
				businessId: businessId.value,
				userId: user.value.userId,
				foodId: foodArr.value[index].foodId
			}).then(response => {
				if (response.data === 1) {
					foodArr.value[index].quantity = 0;
				} else {
					alert('从购物车中删除食品失败！');
				}
			}).catch(error => {
				console.error(error);
			});
		};

		const toOrder = () => {
			if (business.value && business.value.businessId) {
				console.log(business.value.businessId)
				router.push({ path: '/orders', query: { businessId: business.value.businessId } });
			} else {
				alert('商家信息未加载完成，请稍后再试！');
			}
		};
		const goToCart = (businessId) => {
			if (user.value === null) {
				router.push({ path: '/login' });
				return;
			}
			router.push({ path: '/cart', query: { businessId: business.value.businessId } });
		};
		const totalPrice = computed(() => {
			return foodArr.value.reduce((total, item) => total + item.foodPrice * item.quantity, 0);
		});

		const totalQuantity = computed(() => {
			return foodArr.value.reduce((total, item) => total + item.quantity, 0);
		});

		const totalSettle = computed(() => totalPrice.value + business.value.deliveryPrice);

		return {
			business,
			foodArr,
			add,
			minus,
			toOrder,
			totalQuantity,
			totalPrice,
			totalSettle,
			goToCart,
			businessId
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

/****************** 商家logo部分 ******************/
.wrapper .business-logo {
	width: 100%;
	height: 35vw;
	/*使用上外边距避开header部分*/
	margin-top: 12vw;
	display: flex;
	justify-content: center;
	align-items: center;
}

.wrapper .business-logo img {
	width: 40vw;
	height: 30vw;
	border-radius: 5px;
}

/****************** 商家信息部分 ******************/
.wrapper .business-info {
	width: 100%;
	height: 20vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.wrapper .business-info h1 {
	font-size: 5vw;
}

.wrapper .business-info p {
	font-size: 3vw;
	color: #666;
	margin-top: 1vw;
}

/****************** 食品列表部分 ******************/
.wrapper .food {
	width: 100%;
	/*使用下外边距避开footer部分*/
	margin-bottom: 14vw;
}

.wrapper .food li {
	width: 100%;
	box-sizing: border-box;
	padding: 2.5vw;
	user-select: none;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.wrapper .food li .food-left {
	display: flex;
	align-items: center;
}

.wrapper .food li .food-left img {
	width: 20vw;
	height: 20vw;
}

.wrapper .food li .food-left .food-left-info {
	margin-left: 3vw;
}

.wrapper .food li .food-left .food-left-info h3 {
	font-size: 3.8vw;
	color: #555;
}

.wrapper .food li .food-left .food-left-info p {
	font-size: 3vw;
	color: #888;
	margin-top: 2vw;
}

.wrapper .food li .food-right {
	width: 16vw;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.wrapper .food li .food-right .fa-minus-circle {
	font-size: 5.5vw;
	color: #999;
	cursor: pointer;
}

.wrapper .food li .food-right p {
	font-size: 3.6vw;
	color: #333;
}

.wrapper .food li .food-right .fa-plus-circle {
	font-size: 5.5vw;
	color: #0097EF;
	cursor: pointer;
}

/****************** 购物车部分 ******************/
.wrapper .cart {
	width: 100%;
	height: 14vw;
	position: fixed;
	left: 0;
	bottom: 0;
	display: flex;
}

.wrapper .cart .cart-left {
	flex: 2;
	background-color: #505051;
	display: flex;
}

.wrapper .cart .cart-left .cart-left-icon {
	width: 16vw;
	height: 16vw;
	box-sizing: border-box;
	border: solid 1.6vw #444;
	border-radius: 8vw;
	background-color: #3190E8;
	font-size: 7vw;
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: -4vw;
	margin-left: 3vw;
	position: relative;
}

.wrapper .cart .cart-left .cart-left-icon-quantity {
	width: 5vw;
	height: 5vw;
	border-radius: 2.5vw;
	background-color: red;
	color: #fff;
	font-size: 3.6vw;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	right: -1.5vw;
	top: -1.5vw;
}

.wrapper .cart .cart-left .cart-left-info p:first-child {
	font-size: 4.5vw;
	color: #fff;
	margin-top: 1vw;
}

.wrapper .cart .cart-left .cart-left-info p:last-child {
	font-size: 2.8vw;
	color: #AAA;
}

.wrapper .cart .cart-right {
	flex: 1;
}

/*达到起送费时的样式*/
.wrapper .cart .cart-right .cart-right-item {
	width: 100%;
	height: 100%;
	background-color: #38CA73;
	color: #fff;
	font-size: 4.5vw;
	font-weight: 700;
	user-select: none;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>