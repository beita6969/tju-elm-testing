<template>
	<div class="wrapper">
	  <!-- header部分 -->
	  <header>
		<p>在线支付</p>
	  </header>
  
	  <!-- 加载中提示 -->
	  <div v-if="loading" class="loading">
		<p>加载中...</p>
	  </div>
  
	  <template v-else>
		<div class="content">
		  <!-- 订单信息部分 -->
		  <div class="section order-section" v-if="orders">
			<div class="section-header">
			  <h3>订单信息</h3>
			  <span class="total-amount">&#165;{{ orders.orderTotal || '0.00' }}</span>
			</div>
			<div class="merchant-info" @click="detailetShow">
			  <img :src="orders.business?.businessImg" :alt="orders.business?.businessName" class="merchant-logo">
			  <div class="merchant-name">
				{{ orders.business?.businessName || '未知商家' }}
				<i class="fa fa-angle-down" :class="{ 'rotate': isShowDetailet }"></i>
			  </div>
			</div>
  
			<!-- 订单明细部分 -->
			<div class="order-details" v-show="isShowDetailet">
			  <template v-if="orderDetails.length > 0">
				<div class="detail-item" v-for="item in orderDetails" :key="item.odId">
				  <span class="item-name">{{ item.foodName || '未知商品' }} × {{ item.quantity || 0 }}</span>
				  <span class="item-price">&#165;{{ (item.priceAtThatTime * item.quantity).toFixed(2) }}</span>
				</div>
			  </template>
			  <div class="detail-item delivery-fee">
				<span>配送费</span>
				<span>&#165;{{ orders.business?.deliveryPrice || '0.00' }}</span>
			  </div>
			</div>
		  </div>
  
		  <!-- 支付方式部分 -->
		  <div class="section payment-section">
			<h3>选择支付方式</h3>
			<div class="payment-options">
			  <div class="payment-option" :class="{ active: selectedPayment === 'alipay' }" @click="selectPayment('alipay')">
				<img src="../assets/alipay.png" alt="支付宝支付">
				<i class="fa fa-check-circle"></i>
			  </div>
			  <div class="payment-option" :class="{ active: selectedPayment === 'wechat' }" @click="selectPayment('wechat')">
				<img src="../assets/wechat.png" alt="微信支付">
				<i class="fa fa-check-circle"></i>
			  </div>
			</div>
		  </div>
  
		  <!-- 支付按钮 -->
		  <div class="payment-action">
			<button 
			  class="pay-button" 
			  @click="toSuccessfulPayment" 
			  :disabled="!isOrderValid">
			  确认支付 &#165;{{ orders?.orderTotal || '0.00' }}
			</button>
		  </div>
		</div>
	  </template>
  
	  <!-- 底部菜单部分 -->

	</div>
  </template>
  
  <script>
import { ref, onBeforeMount, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Footer from '../components/Footer.vue';
import axios from 'axios';
  
  export default {
	name: 'Payment',
	setup() {
	
	  const orders = ref(null);
	  const orderDetails = ref([]);
	  const isShowDetailet = ref(false);
	  const route = useRoute();
	  const router = useRouter();
	  const orderId = ref(route.query.orderId);
	  const loading = ref(true);
	  const selectedPayment = ref('alipay');
	  
	  // 计算属性：检查订单是否有效
	  const isOrderValid = computed(() => {
		return !loading.value && orders.value && orders.value.orderId;
	  });
  
	  // 获取订单详情
	  const fetchOrderDetails = async () => {
		try {
		  const response = await axios.post('OrdersController/listOrderDetailetByOrderId', {
			orderId: orderId.value
		  });
		  if (response.data) {
			orderDetails.value = response.data;
		  }
		} catch (error) {
		  console.error('获取订单详情失败:', error);
		}
	  };
  
	  // 初始化订单数据
	  const initializeOrder = async () => {
		if (!orderId.value) {
		  alert('订单信息有误，请重试！');
		  router.push({ path: '/index' });
		  return;
		}
  
		loading.value = true;
		try {
		  const response = await axios.post('OrdersController/getOrdersById', { 
			orderId: orderId.value 
		  });
  
		  if (response.data && response.data.orderId) {
			orders.value = response.data;
			// 获取订单详情
			await fetchOrderDetails();
		  } else {
			throw new Error('未获取到订单数据');
		  }
		} catch (error) {
		  console.error('获取订单信息失败:', error);
		  alert('获取订单信息失败，请重试！');
		  router.push({ path: '/index' });
		} finally {
		  loading.value = false;
		}
	  };
  
	  onBeforeMount(async () => {
		await initializeOrder();
		history.pushState(null, null, document.URL);
		window.onpopstate = () => router.push({ path: '/index' });
	  });
  
	  const detailetShow = () => {
		isShowDetailet.value = !isShowDetailet.value;
	  };
  
	  const toSuccessfulPayment = async () => {
		if (!isOrderValid.value) {
		  alert('订单信息有误，请重试！');
		  return;
		}
  
		try {
		  await axios.post('OrdersController/payOk', { orderId: orderId.value });
		  router.push({ path: '/successfulPayment', query: { orderId: orderId.value } });
		} catch (error) {
		  console.error('支付失败:', error);
		  alert('支付失败，请重试！');
		}
	  };
  
	  const selectPayment = (type) => {
		selectedPayment.value = type;
	  };
  
	  onUnmounted(() => {
		window.onpopstate = null;
	  });
  
	  return {
		orderId,
		orders,
		orderDetails,
		isShowDetailet,
		detailetShow,
		toSuccessfulPayment,
		isOrderValid,
		loading,
		selectedPayment,
		selectPayment
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
		 	min-height: 100vh;
		 	background-color: #f5f7fa;
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
	
		 .content {
		 	padding-top: 14vw;
		 	padding-bottom: 32vw;
		 }
	
		 .section {
		 	background: white;
		 	border-radius: 3vw;
		 	margin: 3vw;
		 	padding: 4vw;
		 	box-shadow: 0 0.2vw 1vw rgba(0, 0, 0, 0.05);
		 }
	
		 .section-header {
		 	display: flex;
		 	justify-content: space-between;
		 	align-items: center;
		 	margin-bottom: 4vw;
		 }
	
		 .section-header h3 {
		 	font-size: 4.2vw;
		 	color: #333;
		 	font-weight: 500;
		 	margin: 0;
		 }
	
		 .total-amount {
		 	font-size: 5vw;
		 	color: #ff6b00;
		 	font-weight: bold;
		 }
	
		 .merchant-info {
		 	display: flex;
		 	align-items: center;
		 	padding: 3vw 0;
		 	cursor: pointer;
		 }
	
		 .merchant-logo {
		 	width: 12vw;
		 	height: 12vw;
		 	border-radius: 2vw;
		 	object-fit: cover;
		 	margin-right: 3vw;
		 }
	
		 .merchant-name {
		 	flex: 1;
		 	font-size: 4vw;
		 	color: #333;
		 	display: flex;
		 	align-items: center;
		 	gap: 2vw;
		 }
	
		 .fa-angle-down {
		 	transition: transform 0.3s ease;
		 }
	
		 .fa-angle-down.rotate {
		 	transform: rotate(180deg);
		 }
	
		 .order-details {
		 	margin-top: 3vw;
		 	padding-top: 3vw;
		 	border-top: 0.2vw solid #f5f7fa;
		 }
	
		 .detail-item {
		 	display: flex;
		 	justify-content: space-between;
		 	align-items: center;
		 	padding: 2vw 0;
		 	font-size: 3.6vw;
		 	color: #666;
		 }
	
		 .delivery-fee {
		 	border-top: 0.2vw dashed #eee;
		 	margin-top: 2vw;
		 	padding-top: 2vw;
		 	color: #333;
		 }
	
		 .payment-options {
		 	display: flex;
		 	gap: 3vw;
		 	margin-top: 4vw;
		 }
	
		 .payment-option {
		 	flex: 1;
		 	padding: 4vw;
		 	border: 0.2vw solid #eee;
		 	border-radius: 2vw;
		 	display: flex;
		 	align-items: center;
		 	justify-content: space-between;
		 	cursor: pointer;
		 	transition: all 0.3s ease;
		 	background: #f9f9f9;
		 }
	
		 .payment-option img {
		 	height: 8vw;
		 	width: auto;
		 	object-fit: contain;
		 }
	
		 .payment-option .fa-check-circle {
		 	font-size: 5vw;
		 	color: #ddd;
		 	transition: all 0.3s ease;
		 }
	
		 .payment-option.active {
		 	border-color: #38CA73;
		 	background: #f0fff5;
		 }
	
		 .payment-option.active .fa-check-circle {
		 	color: #38CA73;
		 }
	
		 .payment-action {
		 	position: fixed;
		 	bottom: 0;
		 	left: 0;
		 	right: 0;
		 	padding: 4vw;
		 	background: white;
		 	box-shadow: 0 -0.2vw 1vw rgba(0, 0, 0, 0.05);
		 }
	
		 .pay-button {
		 	width: 100%;
		 	height: 12vw;
		 	border: none;
		 	border-radius: 6vw;
		 	background: linear-gradient(to right, #38CA73, #2EAF62);
		 	color: white;
		 	font-size: 4.2vw;
		 	font-weight: bold;
		 	display: flex;
		 	align-items: center;
		 	justify-content: center;
		 	cursor: pointer;
		 	transition: all 0.3s ease;
		 }
	
		 .pay-button:disabled {
		 	background: #ccc;
		 	cursor: not-allowed;
		 }
	
		 .pay-button:not(:disabled):active {
		 	transform: scale(0.98);
		 }
  
		 .loading {
		 	width: 100%;
		 	height: 100vh;
		 	display: flex;
		 	justify-content: center;
		 	align-items: center;
		 	font-size: 4vw;
		 	color: #666;
		 }
  
</style>