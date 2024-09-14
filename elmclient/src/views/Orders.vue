<template>
	<div class="wrapper">
		<!-- header部分 -->
		<header>
			<p>确认订单</p>
		</header>

		<!-- 订单信息部分 -->
		<div class="order-info">
			<h5>订单配送至：</h5>
			<div class="order-info-address" @click="toUserAddress">
				<p>{{ deliveryaddress ? deliveryaddress.address : '请选择送货地址' }}</p>
				<i class="fa fa-angle-right"></i>
			</div>
			<p>{{ deliver.contactName }} {{ deliver.contactTel }}</p>
		</div>

		<h3>{{ business.businessName }}</h3>

		<!-- 订单明细部分 -->
		<ul class="order-detailed">
			<li v-for="item in cartArr" :key="item.id">
				<div class="order-detailed-left">
					<img :src="item.food.foodImg">
					<p>{{ item.food.foodName }} x {{ item.quantity }}</p>
				</div>
				<p>&#165;{{ (item.food.foodPrice * item.quantity).toFixed(2) }}</p>
			</li>
		</ul>
		<div class="order-deliveryfee">
			<p>配送费</p>
			<p>&#165;{{ business.deliveryPrice }}</p>
		</div>

		<!-- 合计部分 -->
		<div class="total">
			<div class="total-left">
				&#165;{{ totalPrice.toFixed(2) }}
			</div>
			<div class="total-right" @click="toPayment">
				去支付
			</div>
		</div>
	</div>
</template>

<script>
import { ref, computed, onMounted, defineComponent } from 'vue';
import Footer from '../components/Footer.vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import qs from 'qs';
export default {
	name: 'Orders',
	setup() {
		const route = useRoute();
		const businessId = ref(route.query.businessId);
		const business = ref({});
		const user = ref(null);
		const cartArr = ref([]);
		const deliveryaddress = ref(null);
		const deliver = ref({})
		const router = useRouter();


		onMounted(() => {
			user.value = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
			console.log(111111);
			deliveryaddress.value = localStorage.getItem(user.value?.userId) ? JSON.parse(localStorage.getItem(user.value.userId)) : null;

			if (user.value) {
				axios.post('DeliveryAddressController/getDeliveryAddressById', {
					daId: deliveryaddress.value.daId
				}).then(response => {
					deliver.value = response.data;
				}).catch(handleError);


				axios.post('BusinessController/getBusinessById',
					{ businessId: businessId.value }
				).then(response => {
					business.value = response.data;
				}).catch(handleError);

				axios.post('CartController/listCart', {

					userId: user.value.userId,
					businessId: businessId.value

				}).then(response => {
					cartArr.value = response.data;
				}).catch(handleError);
			} else {
				alert('用户未登录，请先登录！');
				router.push({ path: '/login' });
			}
		}
		);

		const totalPrice = computed(() => {
			return cartArr.value.reduce((acc, item) => acc + item.food.foodPrice * item.quantity, 0) + (business.value?.deliveryPrice || 0);
		});

		const sexFilter = (value) => value === 1 ? '先生' : '女士';

		const toUserAddress = () => {
			router.push({ path: '/userAddress', query: { businessId: businessId.value } });
		};

		const toPayment = () => {
			if (!deliveryaddress.value) {
				alert('请选择送货地址！');
				return;
			}
			console.log(deliveryaddress.value.daId);
			console.log(user.value.userId);
			console.log(Number(businessId.value));
			console.log(totalPrice.value);
			axios.post('OrdersController/createOrders', {
				userId: user.value.userId,
				businessId: Number(businessId.value),
				daId: deliveryaddress.value.daId,
				orderTotal: totalPrice.value
			}).then(response => {
				console.log(response.data);
				let orderId = response.data;
				if (orderId > 0) {
					console.log(orderId);
					router.push({ path: '/payment', query: { orderId } });
				} else {
					alert('创建订单失败！');
				}
			}).catch(error => {
				console.error(error);
			});
		};

		const handleError = (error) => {
			console.error('Failed to fetch data:', error);
			alert('请求失败，请稍后重试！');
		};

		return {
			businessId,
			business,
			user,
			cartArr,
			deliveryaddress,
			totalPrice,
			sexFilter,
			toUserAddress,
			toPayment,
			deliver
		};
	},
	components: {
		Footer
	}
};
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

/****************** 订单信息部分 ******************/
.wrapper .order-info {
	/*注意这里，不设置高，靠内容撑开。因为地址有可能折行*/
	width: 100%;
	margin-top: 12vw;
	background-color: #0097EF;
	box-sizing: border-box;
	padding: 2vw;
	color: #fff;
}

.wrapper .order-info h5 {
	font-size: 3vw;
	font-weight: 300;
}

.wrapper .order-info .order-info-address {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: 700;
	user-select: none;
	cursor: pointer;
	margin: 1vw 0;
}

.wrapper .order-info .order-info-address p {
	width: 90%;
	font-size: 5vw;
}

.wrapper .order-info .order-info-address i {
	font-size: 6vw;
}

.wrapper .order-info p {
	font-size: 3vw;
}

.wrapper h3 {
	box-sizing: border-box;
	padding: 3vw;
	font-size: 4vw;
	color: #666;
	border-bottom: solid 1px #DDD;
}

/****************** 订单明细部分 ******************/
.wrapper .order-detailed {
	width: 100%;
}

.wrapper .order-detailed li {
	width: 100%;
	height: 16vw;
	box-sizing: border-box;
	padding: 3vw;
	color: #666;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.wrapper .order-detailed li .order-detailed-left {
	display: flex;
	align-items: center;
}

.wrapper .order-detailed li .order-detailed-left img {
	width: 10vw;
	height: 10vw;
}

.wrapper .order-detailed li .order-detailed-left p {
	font-size: 3.5vw;
	margin-left: 3vw;
}

.wrapper .order-detailed li p {
	font-size: 3.5vw;
}

.wrapper .order-deliveryfee {
	width: 100%;
	height: 16vw;
	box-sizing: border-box;
	padding: 3vw;
	color: #666;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 3.5vw;
}

/****************** 订单合计部分 ******************/
.wrapper .total {
	width: 100%;
	height: 14vw;
	position: fixed;
	left: 0;
	bottom: 0;
	display: flex;
}

.wrapper .total .total-left {
	flex: 2;
	background-color: #505051;
	color: #fff;
	font-size: 4.5vw;
	font-weight: 700;
	user-select: none;
	display: flex;
	justify-content: center;
	align-items: center;
}

.wrapper .total .total-right {
	flex: 1;
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