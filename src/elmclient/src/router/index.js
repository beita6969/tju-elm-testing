import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
import BusinessList from '../views/BusinessList.vue'
import BusinessInfo from '../views/BusinessInfo.vue'
import Login from '../views/Login.vue'
import Orders from '../views/Orders.vue'
import UserAddress from '../views/UserAddress.vue'
import Payment from '../views/Payment.vue'
import OrderList from '../views/OrderList.vue'
import AddUserAddress from '../views/AddUserAddress.vue'
import EditUserAddress from '../views/EditUserAddress.vue'
import Register from '../views/Register.vue'
import SuccessfulPayment from '../views/SuccessfulPayment.vue'
import MyInformation from '@/views/MyInformation.vue'
import CommentBusiness from '@/views/CommentBusiness.vue'
import Search from '@/views/Search.vue'
import Cart from '@/views/Cart.vue'
import Discover from '@/views/Discover.vue'
import LChoose from '@/views/LChoose.vue'
import RChoose from '@/views/RChoose.vue'
import BusinessLogin from '@/views/BusinessLogin.vue'
import BusinessRegister from '@/views/BusinessRegister.vue'
import BusinessInformation from '@/views/BusinessInformation.vue'
import BusinessView from '@/views/BusinessView.vue'
import SubmitItems from '@/views/SubmitItems.vue'
import Myfavorite from '@/views/Myfavorite.vue'
import LikesList from '@/views/LikesList.vue'
import CommentsList from '@/views/CommentsList.vue'
// 定义路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index
  },
  {
    path: '/Index',
    name: 'Index',
    component: Index
  },
  {
    path: '/businessList',
    name: 'BusinessList',
    component: BusinessList
  },
  {
    path: '/businessInfo',
    name: 'BusinessInfo',
    component: BusinessInfo
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders
  },
  {
    path: '/userAddress',
    name: 'UserAddress',
    component: UserAddress
  },
  {
    path: '/payment',
    name: 'Payment',
    component: Payment
  },
  {
    path: '/orderList',
    name: 'OrderList',
    component: OrderList
  },
  {
    path: '/addUserAddress',
    name: 'AddUserAddress',
    component: AddUserAddress
  },
  {
    path: '/editUserAddress',
    name: 'EditUserAddress',
    component: EditUserAddress
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/successfulPayment',
    name: 'SuccessfulPayment',
    component: SuccessfulPayment
  },
  {
    path: '/myInformation',
    name: 'MyInformation',
    component: MyInformation
  },
  {
    path: '/commentBusiness',
    name: 'CommentBusiness',
    component: CommentBusiness
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/discover',
    name: 'Discover',
    component: Discover
  },
  {
    path: '/lChoose',
    name: 'LChoose',
    component: LChoose
  },
  {
    path: '/rChoose',
    name: 'RChoose',
    component: RChoose
  },
  {
    path:'/businessLogin',
    name:'BusinessLogin',
    component:BusinessLogin
  },
  {
    path:'/businessRegister',
    name:'BusinessRegister',
    component:BusinessRegister
  },
  {
    path:'/businessInformation',
    name:'BusinessInformation',
    component:BusinessInformation
  },
  {
    path:'/businessView',
    name:'BusinessView',
    component:BusinessView
  },
  {
    path:'/submitItems',
    name:'SubmitItems',
    component:SubmitItems
  },
  {
    path:'/myfavorite',
    name:'Myfavorite',
    component:Myfavorite
  },
  {
    path:'/favorites',
    name:'Favorites',
    component:Myfavorite
  },
  {
    path:'/likes',
    name:'LikesList',
    component:LikesList
  },
  {
    path:'/comments',
    name:'CommentsList',
    component:CommentsList
  }
]

// 解决重复路由报异常问题
const originalPush = createRouter.prototype.push;
createRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 创建路由实例
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
