import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import qs from 'qs';
import {
  getCurDate,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  setLocalStorage,  
  getLocalStorage,
  removeLocalStorage
} from './common.js';

// 设置 axios 的基础 url 部分
axios.defaults.baseURL = 'http://localhost:8080/';

// 创建 Vue 应用实例
const app = createApp(App);

// 将 axios 挂载到 Vue 实例上
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$qs = qs;

app.config.globalProperties.$getCurDate = getCurDate;
app.config.globalProperties.$setSessionStorage = setSessionStorage;
app.config.globalProperties.$getSessionStorage = getSessionStorage;
app.config.globalProperties.$removeSessionStorage = removeSessionStorage;
app.config.globalProperties.$setLocalStorage = setLocalStorage;
app.config.globalProperties.$getLocalStorage = getLocalStorage;
app.config.globalProperties.$removeLocalStorage = removeLocalStorage;

// 路由守卫
router.beforeEach((to, from, next) => {
  let user = sessionStorage.getItem('user');
  // 除了登录、注册、首页、商家列表、商家信息之外，都需要判断是否登录
  if (!(to.path === '/' || to.path === '/index' || to.path === '/businessList' || to.path === '/businessInfo' || to.path === '/login' || to.path === '/register'||to.path === '/lChoose'|| to.path === '/rChoose'|| to.path === '/businessLogin'|| to.path === '/businessRegister'||  to.path === '/businessInformation'||to.path === '/businessView'||to.path === '/submitItems')) {
    if (user === null) {
      return next( '/login' )
    }
  }
  next();
});

// 使用 Vue Router
app.use(router);

// 挂载 Vue 应用
app.mount('#app');