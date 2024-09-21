<template>
	<div class="wrapper">
		<!-- header部分 -->
		<header>
			<p>购物车</p>
		</header>

		<!-- 购物车列表部分 -->
		<ul class="cart">
			<li v-for="item in cartItems" :key="item.foodId">
				<div class="cart-img" >
					<img :src="food[item.foodId].foodImg">
					<div class="cart-img-quantity" v-show="item.quantity > 0">{{ item.quantity }}</div>
				</div>
				<div class="cart-info">
					<h3>{{ food[item.foodId].foodName }}</h3>
					<p>&#165;{{ food[item.foodId].foodPrice }} / 份</p>
				</div>
				
			</li>
		</ul>

		<!-- 底部菜单部分 -->
		<!-- <Footer /> -->
	</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

export default {
	name: 'Cart',
	setup() {
		const cartItems = ref([]);
		const user = ref(null);
		const route = useRoute();
		const router = useRouter();
        const businessId = route.query.businessId;
        const food = ref({});
        console.log(businessId);
		onMounted(() => {
			user.value = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

			if (user.value) {
                axios.post('FoodController/listFoodByBusinessId', {businessId: businessId})
				.then(response => {
					food.value = response.data;
				}).catch(error => {
					console.error(error);
				});
				listCart();
			} else {
				alert('用户未登录，请先登录！');
				router.push({ path: '/login' });
			}
		});

		const listCart = () => {
			axios.post('CartController/listCart', { userId: user.value.userId ,businessId: businessId})
				.then(response => {
					cartItems.value = response.data;
				}).catch(error => {
					console.error(error);
				});
		};

	

		return {
			cartItems,
            listCart,
            food
		};
	}
}
</script>

<style scoped>
/****************** 总容器 ******************/
.wrapper {
	width: 100%;
	height: 100%;
	position: relative;
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

/****************** 购物车列表部分 ******************/
.wrapper .cart {
	width: 100%;
	margin-top: 12vw;
	margin-bottom: 60px;
}

.wrapper .cart li {
	width: 100%;
	box-sizing: border-box;
	padding: 2.5vw;
	border-bottom: solid 1px #DDD;
	user-select: none;
	cursor: pointer;
	display: flex;
	align-items: center;
}

.wrapper .cart li .cart-img {
	/*这里设置为相当定位，成为cart-img-quantity元素的父元素*/
	position: relative;
}

.wrapper .cart li .cart-img img {
	width: 20vw;
	height: 20vw;
}

.wrapper .cart li .cart-img .cart-img-quantity {
	width: 5vw;
	height: 5vw;
	background-color: red;
	color: #fff;
	font-size: 3.6vw;
	border-radius: 2.5vw;
	display: flex;
	justify-content: center;
	align-items: center;
	/*设置成绝对定位，不占文档流空间*/
	position: absolute;
	right: -1.5vw;
	top: -1.5vw;
}

.wrapper .cart li .cart-info {
	margin-left: 3vw;
}

.wrapper .cart li .cart-info h3 {
	font-size: 3.8vw;
	color: #555;
}

.wrapper .cart li .cart-info p {
	font-size: 3vw;
	color: #888;
	margin-top: 2vw;
}

.wrapper .cart li .cart-actions {
	margin-left: auto;
	display: flex;
	align-items: center;
	gap: 10px;
}

.wrapper .cart li .cart-actions button {
	padding: 5px 10px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	background-color: #0097FF;
	color: white;
}

.wrapper .cart li .cart-actions button:hover {
	background-color: #007ACC;
}

.wrapper .cart li .cart-actions span {
	font-size: 3vw;
	color: #555;
}
</style>