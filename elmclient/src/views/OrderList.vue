<template>
	<div class="wrapper">
		<!-- header部分 -->
		<header>
			<p>我的订单</p>
		</header>

		<!-- 订单列表部分 -->
		<h3>未支付订单信息：</h3>
		<ul class="order">
			<template v-for="item in orderArr">
				<li v-if="item.orderState === 0">
					<div class="order-info">
						<p>
							{{ item.business.businessName }}
							<i class="fa fa-caret-down" @click="detailetShow(item)"></i>
						</p>
						<div class="order-info-right">
							<p>&#165;{{ item.orderTotal }}</p>
							<div class="order-info-right-icon"@click="navigateToPayment(item.orderId)">去支付</div>
						</div>
					</div>
					<ul class="order-detailet" v-show="item.isShowDetailet">
						<li v-for="de in detailet">
							<p> {{ de.foodName }} x{{ de.quantity }}</p>
							<p>&#165;{{(de.priceAtThatTime * de.quantity).toFixed(2) }}</p>
						</li>
						<li>
							<p>配送费</p>
							<p>&#165;{{ item.business.deliveryPrice }}</p>
						</li>
					</ul>
				</li>
			</template>
		</ul>

		<h3>已支付订单信息：</h3>
		<ul class="order">
			<template v-for="item in orderArr">
				<li v-if="item.orderState === 1">
					<div class="order-info">
						<p>
							{{ item.business.businessName }}
							<i class="fa fa-caret-down" @click="detailetShow(item)"></i>
						</p>
						<div class="order-info-right">
							<p>&#165;{{ item.orderTotal }}</p>
						</div>
					</div>
					<ul class="order-detailet" v-show="item.isShowDetailet">
						<li v-for="de in detailet">
							<p> {{ de.foodName }} x{{ de.quantity }}</p>
							<p>&#165;{{(de.priceAtThatTime * de.quantity).toFixed(2) }}</p>
						</li>
						<li>
							<p>配送费</p>
							<p>&#165;{{ item.business.deliveryPrice }}</p>
						</li>
					</ul>
				</li>
			</template>
		</ul>

		<!-- 底部菜单部分 -->

	
	</div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue';
import Footer from '../components/Footer.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import qs from 'qs';
export default {
	name: 'OrderList',
	components: {
		Footer
	},
	setup() {
		const orderArr = ref([]);
		const user = reactive({});
		const router = useRouter();
		const detailet = ref([])
		const index = ref([]);
		onMounted(async () => {
			user.value = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

			if (user.value) {
				await axios.post('OrdersController/listOrdersByUserId', {
					userId: user.value.userId
				}).then(response => {
					let result = response.data;
					console.log(result);
					result.forEach(order => {
						order.isShowDetailet = false;
					});
					orderArr.value = result;

				}).catch(handleError);
				
				
			} else {
				alert('用户未登录，请先登录！');
				router.push({ path: '/login' });
			}
		});

		const detailetShow = async (order) => {
			console.log(order.orderId);
			await axios.post('OrdersController/listOrderDetailetByOrderId' ,{orderId: order.orderId}).then(response => {
				console.log(response.data);
				detailet.value = response.data;
			}).catch(handleError);
			await axios.post('OrdersController/listOdIdByOrderId', {orderId: order.orderId}).then(response => {
				console.log(response.data);
				index.value = response.data;
			}).catch(handleError);
			console.log(index.value);
			console.log(detailet.value);
			order.isShowDetailet = !order.isShowDetailet;
		};
		const navigateToPayment = (orderId) => {
			console.log(orderId);
			router.push({ path: '/payment', query: { orderId } });
		};
		const navigateTo = (path) => {
			router.push(path);
		};

		const handleError = (error) => {
			console.error('Failed to fetch data:', error);
			alert('请求失败，请稍后重试！');
		};

		return {
			orderArr,
			user,
			detailetShow,
			navigateTo,
			navigateToPayment,
			detailet
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

/****************** 历史订单列表部分 ******************/
.wrapper h3 {
	margin-top: 12vw;
	box-sizing: border-box;
	padding: 4vw;
	font-size: 4vw;
	font-weight: 300;
	color: #999;
}

.wrapper .order {
	width: 100%;
}

.wrapper .order li {
	width: 100%;
}

.wrapper .order li .order-info {
	box-sizing: border-box;
	padding: 2vw 4vw;
	font-size: 4vw;
	color: #666;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.wrapper .order li .order-info .order-info-right {
	display: flex;
}

.wrapper .order li .order-info .order-info-right .order-info-right-icon {
	background-color: #f90;
	color: #fff;
	border-radius: 3px;
	margin-left: 2vw;
	user-select: none;
	cursor: pointer;
}

.wrapper .order li .order-detailet {
	width: 100%;
}

.wrapper .order li .order-detailet li {
	width: 100%;
	box-sizing: border-box;
	padding: 1vw 4vw;
	color: #666;
	font-size: 3vw;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>