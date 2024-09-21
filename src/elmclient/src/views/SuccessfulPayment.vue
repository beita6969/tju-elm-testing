<template>
  <div class="container">
    <div class="top-green"></div>
    <div class="gou">
      <img :src='myimage' class="goutu">
    </div>
    <div class="logo">
      <h2>支付成功</h2>
      <img :src="paymentDetails.merchantLogo">
    </div>
    <div class="details">
      <p>商家名称：{{ paymentDetails.merchantName }}</p>
      <p>金额：¥{{ paymentDetails.amount }}</p>
      <p>支付时间：{{ paymentDetails.paymentTime }}</p>
    </div>
    <div class="back-home">
      <button @click="goBack">返回首页</button>
    </div>
  </div>

</template>

<script>
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import myimage from '/src/assets/R-C.png';
export default {
  setup() {
    const route = useRoute();
    const orderId = ref(route.query.orderId); // 获取路由参数中的 orderId
    const router = useRouter();
    const paymentDetails = ref({});
    const orders = ref({});
    const business = ref({});
    const goBack = () => {
      router.push('/index'); // 返回首页
    };
    onBeforeMount(async () => {
      try {
        const response = await axios.post('OrdersController/getOrdersById', { orderId: orderId.value });
        orders.value = response.data;
        console.log(orders.value.orderState);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }

      if (orders.value && orders.value.businessId) {
        try {
          const response = await axios.post('BusinessController/getBusinessById', { businessId: orders.value.businessId });
          business.value = response.data;
        } catch (error) {
          console.error('Error fetching business:', error);
        }
      }

      // 模拟根据 orderId 获取支付信息

      // 在此处替换为实际的数据获取逻辑

      // 示例数据
      paymentDetails.value = {
        merchantLogo: business.value.businessImg, // 假设获取到了商家Logo
        amount: orders.value.orderTotal, // 假设获取到了 200.00
        paymentTime: orders.value.orderDate, // 假设获取到了新的时间
        merchantName: business.value.businessName // 假设获取到了商家名称
      };

    });


    return {
      paymentDetails,
      myimage,
      goBack
    };
  }
};


</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Arial, sans-serif;
  background-color: #f0f0f5;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f0f5;
  padding-top: 0;
}

.top-green {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 12vw; /* 相对高度，确保随屏幕变化 */
  background-color: #4caf50;
}

.content {
  max-width: 80vw; /* 相对宽度 */
  width: 100%;
  background-color: #fff;
  padding: 5vw;
  border-radius: 2vw;
  box-shadow: 0 0 1vw rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 15vh; /* 距离绿色块的距离 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: auto; /* 使内容自适应 */
}

.gou {
  margin-bottom: 5vh; /* 增加图片和文字之间的距离，适应屏幕 */
  margin-top: 15vw;
}

.goutu {
  width: 12vw; /* 相对宽度 */
  height: 12vw; /* 相对高度 */
  border-radius: 50%;
  background-color: #4caf50;
  padding: 3vw;
  box-shadow: 0 0 1vw rgba(0, 0, 0, 0.1);
}

.logo {
  text-align: center;
  margin-bottom: 5vh; /* 增加图片和文字之间的距离，适应屏幕 */
  display: flex;
  flex-direction: column;
  align-items: center;
  width:10vw;
  height:10vw;
}

.logo img {
  width:12vw; /* 相对宽度 */
  height: 12vw; /* 相对高度 */

  border-radius: 2vw;
  box-shadow: 0 0 1vw rgba(0, 0, 0, 0.1);
}
.logo h2 {  
  font-size: 3.5vw; /* 相对字体大小 */
  color: black;

}
.details {
  text-align: center;
  margin-bottom: 5vh; /* 增加图片和文字之间的距离，适应屏幕 */
}

.details h2 {
  color: #4caf50;
  font-size: 6vw; /* 相对字体大小 */
  margin-bottom: 2vh;
}

.details p {
  font-size: 4vw; /* 相对字体大小 */
  color: #555;
  margin-bottom: 1vh;
}

.back-home {
  margin-top: 5vh; /* 适应屏幕 */
}

.back-home button {
  padding: 2vw 4vw;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 1vw;
  cursor: pointer;
  font-size: 4vw;
  transition: background-color 0.3s ease;
}

.back-home button:hover {
  background-color: #45a049;
}

</style>