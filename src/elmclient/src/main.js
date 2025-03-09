import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { toast } from './utils/toast';

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

// 设置 axios 的基础配置
// axios.defaults.baseURL = process.env.VITE_API_BASE_URL;
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.timeout = 10000; // 设置超时时间为 10 秒
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers.common['Accept'] = 'application/json';

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    if (config.method === 'post') {
      // 如果是POST请求，确保数据是JSON格式
      if (typeof config.data === 'object') {
        config.data = JSON.stringify(config.data);
      }
    }
    return config;
  },
  error => { 
    // 对请求错误做些什么
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response;
  },
  error => {
    // 对响应错误做点什么
    console.error('响应错误:', error);
    if (error.response && error.response.status === 500) {
      console.error('服务器错误:', error.response.data);
    }
    return Promise.reject(error);
  }
);

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

// 注册全局 toast 服务
app.config.globalProperties.$toast = toast;

// 路由守卫
router.beforeEach((to, from, next) => {
  const businessUser = sessionStorage.getItem('businessUser') ? JSON.parse(sessionStorage.getItem('businessUser')) : null;
  const user = sessionStorage.getItem('user');
  
  // 商家专属页面的路径
  const businessPaths = ['/businessView', '/businessInformation', '/submitItems'];
  
  // 如果是访问商家专属页面
  if (businessPaths.includes(to.path)) {
    if (!businessUser || !businessUser.isBusiness) {
      // 如果没有商家登录，重定向到首页
      return next('/index');
    }
  }
  
  // 普通用户页面的验证逻辑
  if (!(to.path === '/' || to.path === '/index' || to.path === '/businessList' || 
      to.path === '/businessInfo' || to.path === '/login' || to.path === '/register' || 
      to.path === '/lChoose' || to.path === '/rChoose' || to.path === '/businessLogin' || 
      to.path === '/businessRegister')) {
    if (user === null && !businessUser) {
      return next('/login');
    }
  }
  
  next();
});

// 使用 Vue Router
app.use(router);

// 挂载 Vue 应用
app.mount('#app');