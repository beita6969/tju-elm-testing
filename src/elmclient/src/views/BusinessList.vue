<template>
	<div class="wrapper">
	
		<!-- header部分 -->
		<header>
			<p>商家列表</p>
		</header>

		<!-- 商家列表部分 -->
		<ul class="business">
			<li v-for="item in businessArr" :key="item.businessId" @click="toBusinessInfo(item.businessId)">
				<div class="business-img">
					<img :src="item.businessImg">
					<div class="business-img-quantity" v-show="item.quantity > 0">{{ item.quantity }}</div>
				</div>
				<div class="business-info">
					<h3>{{ item.businessName }}</h3>
					<p>&#165;{{ item.starPrice }}起送 | &#165;{{ item.deliveryPrice }}配送</p>
					<p>{{ item.businessExplain }}</p>
				</div>
				<div class="business-actions">
					<div class="dianzan">
						<button @click.stop="likeBusiness(item.businessId)"
							:class="{ 'liked': likes[item.businessId].liked }">
							<i class="fa fa-thumbs-up"></i>
						</button>
						<span v-if="likes[item.businessId].count >= 0" class="like-count">{{
							likes[item.businessId].count
							}}</span>
					</div>
					<button @click.stop="favoriteBusiness(item.businessId)"
						:class="{ 'favorited': favorites[item.businessId].favorited }">
						<i class="fa fa-star"></i>
					</button>
					<button @click.stop="commentBusiness(item.businessId)"><i class="fa fa-comment"></i></button>
				</div>

			</li>
		</ul>

		<!-- 底部菜单部分 -->
		<!-- <Footer /> -->
	</div>
</template>

<script>
import { ref, onMounted, onBeforeMount } from 'vue';
import Footer from '../components/Footer.vue';
import axios from 'axios';
import qs from 'qs';
import { useRoute, useRouter } from 'vue-router';
import BackButton from '../components/BackButton.vue';
export default {
	name: 'BusinessList',
	components: {
		Footer
	},
	setup() {
		const orderTypeId = ref(null);
		const businessArr = ref([]);
		const favarr = ref([]);
		const user = ref(null);
		const route = useRoute();
		const router = useRouter();
		const likes = ref({});
		const iflike = ref(0);
		const favornum = ref([]);
		const favorites = ref({});
		onMounted(() => {
			orderTypeId.value = route.query.orderTypeId;
			user.value = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

			// 根据orderTypeId查询商家信息
			if (user.value) {
				axios.post('FavoriteController/listFavoriteByUserId', { userId: user.value.userId })
					.then(response => {
						favarr.value = response.data;
						console.log( response.data);
						axios.post('BusinessController/listBusinessByOrderTypeId', { orderTypeId: orderTypeId.value })
							.then(response => {
								businessArr.value = response.data;

								businessArr.value.forEach(item => {

									axios.post('LikesController/getLikesBybusinessId', { businessId: item.businessId })
										.then(response => {
											favornum.value[item.businessId] = response.data;
											axios.post('LikesController/getLikesByUserIdByBusinessId', { userId: user.value.userId, businessId: item.businessId })
												.then(response => {
													iflike.value = response.data;
													console.log(favornum.value[item.businessId]);
													if (iflike.value === 1) {
														likes.value[item.businessId] = {
															liked: true,
															count: favornum.value[item.businessId] || 0
														};
													}
													else {
														likes.value[item.businessId] = {
															liked: false,
															count: favornum.value[item.businessId] || 0
														};
													}

												
													if (favarr.value.includes(item.businessId)) {
														favorites.value[item.businessId] = {
															favorited: true
														}
													}
													else {
														favorites.value[item.businessId] = {
															favorited: false
														}
													}
												})
										})
								});
							});


						// 判断是否登录
						if (user.value !== null) {
							listCart();
						}
					}).catch(error => {
						console.error(error);
					});


			}
			else {
				alert('用户未登录，请先登录！');
				router.push({ path: '/login' });
			}
		});

		const listCart = () => {
			axios.post('CartController/listCart', { userId: user.value.userId })
				.then(response => {
					let cartArr = response.data;
					// 遍历所有商家列表
					businessArr.value.forEach(businessItem => {
						businessItem.quantity = 0;
						cartArr.forEach(cartItem => {
							if (cartItem.businessId === businessItem.businessId) {
								businessItem.quantity += cartItem.quantity;
							}
						});
					});
					businessArr.value.sort();
				}).catch(error => {
					console.error(error);
				});
		};
		const likeBusiness = async (businessId) => {
			console.log(businessId);
			if (likes.value[businessId].liked) {

				// 发送取消点赞请求
				await axios.post('LikesController/removeLikes', { userId: user.value.userId, businessId: businessId })
					.then(() => {
						console.log('取消点赞成功');
					}).catch(error => {
						console.error(error);
					});
				// 取消点赞
				await axios.post('LikesController/getLikesBybusinessId', { businessId: businessId })
					.then(response => {
						favornum.value = response.data;
					})
				likes.value[businessId] = {
					liked: false,
					count: favornum.value || 0
				};
	
			} else {

				// 发送点赞请求
				await axios.post('LikesController/saveLikes', { userId: user.value.userId, businessId: businessId })
					.then(() => {
						console.log('点赞成功');
					}).catch(error => {
						console.error(error);
					});
				// 点赞
				await axios.post('LikesController/getLikesBybusinessId', { businessId: businessId })
					.then(response => {
						favornum.value = response.data;
					})
				likes.value[businessId] = {
					liked: true,
					count: favornum.value || 0
				};
		
			}
		};
		const favoriteBusiness = (businessId) => {
			if (favorites.value[businessId].favorited) {
				// 发送取消收藏请求
				axios.post('FavoriteController/removeFavoriteBusinessId', { userId: user.value.userId, businessId: businessId })
					.then(() => {
						console.log('取消收藏成功');
					}).catch(error => {
						console.error(error);
					});
				// 取消收藏
				favorites.value[businessId].favorited = false;
			} else {
				// 发送收藏请求
				axios.post('FavoriteController/saveFavoriteBusinessId', { userId: user.value.userId, businessId: businessId })
					.then(() => {
						console.log('收藏成功');
					}).catch(error => {
						console.error(error);
					});
				// 收藏
				favorites.value[businessId].favorited = true;
			}
		};
		const commentBusiness = (businessId) => {
			router.push({ path: '/commentBusiness', query: { businessId } });
		};

		const toBusinessInfo = (businessId) => {
			router.push({ path: '/businessInfo', query: { businessId } });
		};

		return {
			businessArr,
			user,
			listCart,
			toBusinessInfo,
			likeBusiness,
			likes,
			favornum,
			favorites,
			favoriteBusiness,
			commentBusiness
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

/****************** 商家列表部分 ******************/
.wrapper .business {
	width: 100%;
	margin-top: 12vw;
	margin-bottom: 60px;
}

.wrapper .business li {
	width: 100%;
	box-sizing: border-box;
	padding: 2.5vw;
	border-bottom: solid 1px #DDD;
	user-select: none;
	cursor: pointer;
	display: flex;
	align-items: center;
}

.wrapper .business li .business-img {
	/*这里设置为相当定位，成为business-img-quantity元素的父元素*/
	position: relative;
}

.wrapper .business li .business-img img {
	width: 20vw;
	height: 20vw;
}

.wrapper .business li .business-img .business-img-quantity {
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

.wrapper .business li .business-info {
	margin-left: 3vw;
}

.wrapper .business li .business-info h3 {
	font-size: 3.8vw;
	color: #555;
}

.wrapper .business li .business-info p {
	font-size: 3vw;
	color: #888;
	margin-top: 2vw;
}

.wrapper .business li .business-actions {
	margin-left: auto;
	display: flex;
	flex-direction: column;
	gap: 3vw;
	align-items: center;
}

.wrapper .business li .business-actions button {
	padding: 5vw 10vw;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	background-color: #0097FF;
	color: white;
	width:10vw;
	height: 5vw;
    display: flex;
	justify-content: center;
	align-items: center;
}

.wrapper .business li .business-actions button:hover {
	background-color: #007ACC;
}

.wrapper .business li .business-actions button i {
	font-size: 4vw;
	/* 调整图标大小 */
}

.wrapper .business li .business-actions button.liked {
	background-color: #ff6347;
	/* 点赞后的颜色 */
}

.wrapper .business li .business-actions .like-count {
	margin-left: 5px;
	font-size: 14px;
	color: #0097FF;

}

.wrapper .business li .business-actions button.favorited {
	background-color: #ffcc00;
	/* 收藏后的颜色 */
}
.wrapper .business li .business-actions .dianzan{
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
.wrapper .business li .business-actions .dianzan span{
	display: flex;
	font-size: 5vw;
	justify-content: center;
}
.wrapper .business li .business-actions .dianzan button{
	display:flex;
	flex: 1;
}
</style>