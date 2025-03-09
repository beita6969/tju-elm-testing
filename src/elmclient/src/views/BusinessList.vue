<template>
	<div class="wrapper">
	
		<!-- header部分 -->
		<header>
			<p>商家列表</p>
		</header>

		<!-- 商家列表部分 -->
		<div class="business-list">
			<div class="business-item" v-for="business in businessArr" :key="business.businessId">
				<div class="business-info" @click="toBusinessInfo(business.businessId)">
					<img :src="business.businessImg" :alt="business.businessName">
					<div class="business-details">
						<div class="business-header">
							<h3>{{ business.businessName }}</h3>
							<div class="business-rating">
								<span class="stars">
									<i class="fa fa-star" v-for="n in 5" :key="n"></i>
								</span>
								<span class="rating-score">{{ business.rating || '4.9' }}</span>
								<span class="rating-count">月售{{ business.monthSales || '345' }}单</span>
							</div>
						</div>
						<p class="description">{{ business.businessExplain }}</p>
						<div class="business-info-bottom">
							<div class="price-info">
								<span>起送 ¥{{ business.starPrice }}</span>
								<span>配送 ¥{{ business.deliveryPrice }}</span>
								<span>{{ business.deliveryTime || '30分钟' }}</span>
								<span>{{ business.distance || '3.22km' }}</span>
							</div>
							<div class="business-tags" v-if="business.promotions && business.promotions.length">
								<span class="tag" v-for="(promo, index) in business.promotions" :key="index">
									{{ promo }}
								</span>
							</div>
							<div class="business-tags" v-else>
								<span class="tag new">新用户立减9元</span>
								<span class="tag special">特价商品5元起</span>
							</div>
						</div>
					</div>
				</div>
				<div class="business-actions">
					<div class="action-buttons">
						<button class="action-btn like" :class="{ active: likes[business.businessId]?.liked }" @click.stop="likeBusiness(business.businessId)">
							<i class="fa fa-thumbs-up"></i>
							<span>{{ likes[business.businessId]?.count || 0 }}</span>
						</button>
						<button class="action-btn favorite" :class="{ active: favorites[business.businessId]?.favorited }" @click.stop="favoriteBusiness(business.businessId)">
							<i class="fa fa-star"></i>
							<span>{{ favorites[business.businessId]?.count || 0 }}</span>
						</button>
						<button class="action-btn comment" @click.stop="commentBusiness(business.businessId)">
							<i class="fa fa-comment"></i>
							<span>{{ remarks[business.businessId]?.count || 0 }}</span>
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- 底部菜单部分 -->
		<!-- <Footer /> -->
	</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Footer from '../components/Footer.vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

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
		const favorites = ref({});
		const remarks = ref({});

		// 初始化likes、favorites和remarks对象
		const initializeLikesAndFavorites = async (businessId) => {
			try {
				// 初始化likes
				const likeCountResponse = await axios.post('LikesController/getLikesBybusinessId', { 
					businessId: businessId 
				});
				const likeCount = likeCountResponse.data;
				
				const userLikeResponse = await axios.post('LikesController/getLikesByUserIdByBusinessId', { 
					userId: user.value.userId, 
					businessId: businessId 
				});
				const isLiked = userLikeResponse.data === 1;

				likes.value[businessId] = {
					liked: isLiked,
					count: likeCount || 0
				};

				// 初始化favorites
				const favoriteCountResponse = await axios.post('FavoriteController/getFavoriteCountByBusinessId', { 
					businessId: businessId,
					userId: user.value.userId  // 添加userId参数
				});
				const favoriteCount = favoriteCountResponse.data;
				
				favorites.value[businessId] = {
					favorited: favarr.value.includes(businessId),
					count: favoriteCount || 0
				};
				
				// 初始化remarks
				const remarkCountResponse = await axios.post('RemarkController/getRemarkCountByBusinessId', { 
					businessId: businessId 
				});
				const remarkCount = remarkCountResponse.data;
				
				remarks.value[businessId] = {
					count: remarkCount || 0
				};
			} catch (error) {
				console.error('初始化点赞、收藏和评论状态失败:', error);
				console.error(error);  // 添加详细错误日志
				likes.value[businessId] = { liked: false, count: 0 };
				favorites.value[businessId] = { favorited: false, count: 0 };
				remarks.value[businessId] = { count: 0 };
			}
		};

		onMounted(async () => {
			orderTypeId.value = route.query.orderTypeId;
			user.value = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

			if (!user.value) {
				alert('用户未登录，请先登录！');
				router.push({ path: '/login' });
				return;
			}

			try {
				// 获取收藏列表
				const favoriteResponse = await axios.post('FavoriteController/listFavoriteByUserId', { 
					userId: user.value.userId,
					businessId: null  // 添加businessId参数，即使为null也需要传递
				});
				favarr.value = favoriteResponse.data;

				// 获取商家列表
				const businessResponse = await axios.post('BusinessController/listBusinessByOrderTypeId', { 
					orderTypeId: orderTypeId.value 
				});
				businessArr.value = businessResponse.data;

				// 初始化每个商家的likes、favorites和remarks状态
				for (const business of businessArr.value) {
					await initializeLikesAndFavorites(business.businessId);
				}

				// 如果用户已登录，获取购物车信息
				await listCart();
			} catch (error) {
				console.error('加载数据失败:', error);
			}
		});

		const listCart = async () => {
			try {
				const response = await axios.post('CartController/listCart', { 
					userId: user.value.userId 
				});
				const cartArr = response.data;
				
				businessArr.value.forEach(businessItem => {
					businessItem.quantity = 0;
					cartArr.forEach(cartItem => {
						if (cartItem.businessId === businessItem.businessId) {
							businessItem.quantity += cartItem.quantity;
						}
					});
				});
			} catch (error) {
				console.error('获取购物车信息失败:', error);
			}
		};

		const likeBusiness = async (businessId) => {
			try {
				if (!likes.value[businessId]) {
					likes.value[businessId] = { liked: false, count: 0 };
				}

				if (likes.value[businessId].liked) {
					await axios.post('LikesController/removeLikes', { 
						userId: user.value.userId, 
						businessId 
					});
				} else {
					await axios.post('LikesController/saveLikes', { 
						userId: user.value.userId, 
						businessId 
					});
				}

				// 更新点赞数
				const likeCountResponse = await axios.post('LikesController/getLikesBybusinessId', { 
					businessId 
				});
				
				likes.value[businessId] = {
					liked: !likes.value[businessId].liked,
					count: likeCountResponse.data || 0
				};
			} catch (error) {
				console.error('点赞操作失败:', error);
			}
		};

		const favoriteBusiness = async (businessId) => {
			try {
				if (!favorites.value[businessId]) {
					favorites.value[businessId] = { favorited: false, count: 0 };
				}

				if (favorites.value[businessId].favorited) {
					await axios.post('FavoriteController/removeFavoriteBusinessId', { 
						userId: user.value.userId, 
						businessId: businessId 
					});
					favorites.value[businessId].favorited = false;
				} else {
					await axios.post('FavoriteController/saveFavoriteBusinessId', { 
						userId: user.value.userId, 
						businessId: businessId 
					});
					favorites.value[businessId].favorited = true;
				}

				// 更新收藏数
				const favoriteCountResponse = await axios.post('FavoriteController/getFavoriteCountByBusinessId', { 
					businessId: businessId,
					userId: user.value.userId  // 添加userId参数
				});
				favorites.value[businessId].count = favoriteCountResponse.data || 0;

				// 更新收藏列表
				const favoriteResponse = await axios.post('FavoriteController/listFavoriteByUserId', { 
					userId: user.value.userId,
					businessId: null
				});
				favarr.value = favoriteResponse.data;
			} catch (error) {
				console.error('收藏操作失败:', error);
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
			favorites,
			remarks,
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
	padding-top: 12vw;
	background-color: #f5f5f5;
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
.wrapper .business-list {
	padding: 2vw;
}

.wrapper .business-item {
	background: #fff;
	border-radius: 3vw;
	margin-bottom: 3vw;
	padding: 3vw;
	box-shadow: 0 0.5vw 2vw rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
}

.wrapper .business-item:active {
	transform: scale(0.98);
}

.wrapper .business-info {
	display: flex;
	gap: 3vw;
	margin-bottom: 2vw;
	cursor: pointer;
}

.wrapper .business-info img {
	width: 20vw;
	height: 20vw;
	border-radius: 2vw;
	object-fit: cover;
}

.wrapper .business-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2vw;
}

.wrapper .business-header {
	display: flex;
	flex-direction: column;
	gap: 1vw;
}

.wrapper .business-details h3 {
	font-size: 4.2vw;
	margin: 0;
	color: #333;
	font-weight: 600;
}

.wrapper .business-rating {
	display: flex;
	align-items: center;
	gap: 2vw;
	font-size: 3.2vw;
}

.wrapper .stars {
	color: #ffd700;
}

.wrapper .rating-score {
	color: #ff6b00;
	font-weight: 500;
}

.wrapper .rating-count {
	color: #666;
}

.wrapper .description {
	font-size: 3.2vw;
	color: #666;
	line-height: 1.4;
	margin: 0;
}

.wrapper .business-info-bottom {
	margin-top: auto;
}

.wrapper .price-info {
	display: flex;
	flex-wrap: wrap;
	gap: 2vw 3vw;
	font-size: 3vw;
	color: #666;
}

.wrapper .business-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 2vw;
	margin-top: 2vw;
}

.wrapper .tag {
	font-size: 2.8vw;
	padding: 0.5vw 2vw;
	border-radius: 3vw;
	background: #f0f7ff;
	color: #0097ff;
}

.wrapper .tag.new {
	background: #e8f5ff;
	color: #0097ff;
}

.wrapper .tag.special {
	background: #fff0e5;
	color: #ff6b00;
}

.wrapper .business-actions {
	border-top: 0.2vw solid #f5f5f5;
	padding-top: 2vw;
	margin-top: 2vw;
}

.wrapper .action-buttons {
	display: flex;
	justify-content: flex-end;
	gap: 3vw;
}

.wrapper .action-btn {
	display: flex;
	align-items: center;
	gap: 1vw;
	padding: 2vw 4vw;
	border: none;
	border-radius: 6vw;
	background: #f5f7fa;
	color: #666;
	font-size: 3.2vw;
	cursor: pointer;
	transition: all 0.3s ease;
}

.wrapper .action-btn i {
	font-size: 3.6vw;
}

.wrapper .action-btn.like {
	background: #f0f7ff;
	color: #0097ff;
}

.wrapper .action-btn.like.active {
	background: #0097ff;
	color: white;
}

.wrapper .action-btn.favorite {
	background: #fff5f0;
	color: #ff6b00;
}

.wrapper .action-btn.favorite.active {
	background: #ff6b00;
	color: white;
}

.wrapper .action-btn.comment {
	background: #f0fff5;
	color: #38ca73;
}

.wrapper .action-btn:hover {
	transform: translateY(-0.5vw);
	box-shadow: 0 0.5vw 1vw rgba(0, 0, 0, 0.1);
}

.wrapper .action-btn:active {
	transform: scale(0.95);
}
</style>