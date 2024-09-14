<template>
	<div class="app-container">
	  <BackButton />
	  <div class="content">
		<router-view />
	  </div>
	  <Footer v-if="showFooter" />
	</div>
  </template>
<script>
import BackButton from './components/BackButton.vue';
import Footer from './components/Footer.vue';
import { computed } from 'vue'; // 确保导入 computed
import { useRoute } from 'vue-router'; // 确保导入 useRoute

export default {
	components: {
		BackButton,
		Footer,
	},
	setup() {
    const route = useRoute();

    // 根据当前路径决定是否显示 footer
    const showFooter = computed(() => {
		return !['BusinessInfo', 'Payment', 'SuccessfulPayment','Orders','Cart'].includes(route.name);
	});
    return { showFooter };
  },
};
</script>
<style>
html,
body,
div,
span,
h1,
h2,
h3,
h4,
h5,
h6,
ul,
ol,
li,
p {
	margin: 0;
	padding: 0;
}

html,
body,
#app {
	width: 100%;
	height: 100%;
	font-family: "微软雅黑";
}

html,
body {
	margin: 0;
	padding: 0;
	height: 100%;
}

ul,
ol {
	list-style: none;
}

a {
	text-decoration: none;
}
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 确保整个页面至少占满视口 */
}

.content {
  flex: 1; /* 让内容区域占据剩余空间 */
  overflow-y: auto; /* 允许内容区域滚动 */
 /* 为 footer 保留空间 */
}


</style>