<template>
	<ul class="footer">
	  <li @click="toIndex">
		<i class="fa fa-home"></i>
		<p>首页</p>
	  </li>
	  <li @click="toDiscover">
		<i class="fa fa-compass"></i>
		<p>发现</p>
	  </li>
	  <li @click="toOrderList">
		<i class="fa fa-file-text-o"></i>
		<p>订单</p>
	  </li>
	  <li @click="toMyInformation">
		<i class="fa fa-user-o"></i>
		<p>我的</p>
	  </li>
	</ul>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  export default defineComponent({
	name: 'Footer',
	setup() {
	  const router = useRouter();
	  const toIndex = () => {
		router.push({ path: '/index' });
	  };
  
	  const toOrderList = () => {
		router.push({ path: '/orderList' });
	  };
	  const toMyInformation = () => {
		router.push({ path: '/myInformation' });
	  };
	  const toDiscover = () => {
		router.push({ path: '/discover' });
	  };
	  return {
		toIndex,
		toOrderList,
		toMyInformation,
		toDiscover
	  };
	},
  });
  </script>
  
  <style scoped>
  .footer {
	width: 100%;
	height: 8vh; /* 使用视口高度单位，适应不同屏幕 */
	border-top: solid 1px #ddd;
	background-color: #fff;
  
	position: fixed;
	left: 0;
	bottom: 0;
  
	display: flex;
	justify-content: space-around;
	align-items: center;
	z-index: 1000;
  }
  
  .footer > li {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #999;
	user-select: none;
	cursor: pointer;
	flex: 1; /* 使每个 li 平均分配宽度 */
  }
  
  .footer > li p {
	font-size: 1.8vh; /* 使用视口高度单位 */
  }
  
  .footer > li i {
	font-size: 3.5vh; /* 使用视口高度单位 */
  }
  </style>
  