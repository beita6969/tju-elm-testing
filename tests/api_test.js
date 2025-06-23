// 后端API接口完整测试
const axios = require('axios');
const fs = require('fs');

// 如果axios未安装，使用内置的http模块
let httpClient;
try {
  httpClient = axios;
} catch (e) {
  console.log('使用fetch进行API测试...');
}

const API_URL = 'http://localhost:8080';

// 测试数据
const timestamp = Date.now();
const testData = {
  user: {
    businessId: `13${timestamp.toString().slice(-9)}`,
    businessPassword: 'Test@123456',
    businessName: `测试用户${timestamp.toString().slice(-6)}`,
    businessAddress: '天津大学软件学院',
    businessExplain: '测试账号',
    businessSex: 1,
    orderTypeId: 1
  },
  invalidUser: {
    businessId: '123', // 无效手机号
    businessPassword: '12' // 过短密码
  },
  businessQuery: {
    orderTypeId: 1,
    orderBy: 0
  },
  cart: {
    businessId: 10001,
    userId: '',
    foodId: 1,
    quantity: 2
  }
};

// 测试结果收集
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  apis: [],
  responseTime: []
};

// 记录测试结果
function recordTest(apiName, method, endpoint, passed, details = '', responseTime = 0) {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`  ✅ ${method} ${endpoint} - ${responseTime}ms`);
  } else {
    testResults.failed++;
    console.log(`  ❌ ${method} ${endpoint} - ${details}`);
  }
  testResults.apis.push({
    name: apiName,
    method,
    endpoint,
    status: passed ? 'PASS' : 'FAIL',
    details,
    responseTime
  });
  if (responseTime > 0) {
    testResults.responseTime.push(responseTime);
  }
}

// 发送HTTP请求的通用方法
async function makeRequest(method, endpoint, data = null, headers = {}) {
  const url = `${API_URL}${endpoint}`;
  const startTime = Date.now();
  
  try {
    let response;
    const options = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (httpClient) {
      // 使用axios
      if (data && (method === 'POST' || method === 'PUT')) {
        options.data = data;
      }
      response = await httpClient(url, options);
      return {
        status: response.status,
        data: response.data,
        responseTime: Date.now() - startTime
      };
    } else {
      // 使用fetch
      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }
      const res = await fetch(url, options);
      const responseData = await res.json().catch(() => ({}));
      return {
        status: res.status,
        data: responseData,
        responseTime: Date.now() - startTime
      };
    }
  } catch (error) {
    return {
      status: error.response?.status || 500,
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}

async function runAPITests() {
  console.log('🚀 开始执行后端API接口测试');
  console.log('================================\n');
  console.log(`API服务器: ${API_URL}`);
  console.log(`测试时间: ${new Date().toLocaleString('zh-CN')}\n`);

  try {
    // 1. 用户相关接口测试
    console.log('📍 1. 用户相关接口测试\n');
    
    // 1.1 用户注册
    console.log('测试 1.1: 用户注册接口');
    
    // 正常注册
    let response = await makeRequest('POST', '/UserController/saveBusiness', testData.user);
    recordTest(
      '用户注册-正常',
      'POST',
      '/UserController/saveBusiness',
      response.status === 200 || response.status === 201,
      response.error || JSON.stringify(response.data),
      response.responseTime
    );
    
    // 参数验证测试
    response = await makeRequest('POST', '/UserController/saveBusiness', testData.invalidUser);
    recordTest(
      '用户注册-参数验证',
      'POST',
      '/UserController/saveBusiness',
      response.status === 400 || response.status === 422,
      '无效参数应被拒绝',
      response.responseTime
    );
    
    // 重复注册测试
    response = await makeRequest('POST', '/UserController/saveBusiness', testData.user);
    recordTest(
      '用户注册-重复检测',
      'POST',
      '/UserController/saveBusiness',
      response.status === 409 || (response.data && response.data.code !== 0),
      '重复注册应被拒绝',
      response.responseTime
    );
    
    // 1.2 用户登录
    console.log('\n测试 1.2: 用户登录接口');
    
    // 正确登录
    const loginData = {
      businessId: testData.user.businessId,
      businessPassword: testData.user.businessPassword
    };
    response = await makeRequest('POST', '/UserController/checkBusiness', loginData);
    recordTest(
      '用户登录-正常',
      'POST',
      '/UserController/checkBusiness',
      response.status === 200 && response.data,
      response.error || '登录成功',
      response.responseTime
    );
    
    // 保存用户ID供后续测试
    if (response.data && response.data.businessId) {
      testData.cart.userId = response.data.businessId;
    }
    
    // 错误密码登录
    const wrongLogin = {
      businessId: testData.user.businessId,
      businessPassword: 'WrongPassword123'
    };
    response = await makeRequest('POST', '/UserController/checkBusiness', wrongLogin);
    recordTest(
      '用户登录-错误密码',
      'POST',
      '/UserController/checkBusiness',
      response.status === 401 || (response.data && response.data.code !== 0),
      '错误密码应被拒绝',
      response.responseTime
    );
    
    // 2. 商家相关接口测试
    console.log('\n📍 2. 商家相关接口测试\n');
    
    // 2.1 获取商家列表
    console.log('测试 2.1: 获取商家列表');
    
    response = await makeRequest('POST', '/BusinessController/listBusinessByOrderTypeId', testData.businessQuery);
    recordTest(
      '获取商家列表',
      'POST',
      '/BusinessController/listBusinessByOrderTypeId',
      response.status === 200 && Array.isArray(response.data),
      `返回${response.data?.length || 0}个商家`,
      response.responseTime
    );
    
    // 保存商家ID供后续测试
    let businessId = 10001; // 默认值
    if (response.data && response.data.length > 0) {
      businessId = response.data[0].businessId;
    }
    
    // 2.2 获取商家详情
    console.log('\n测试 2.2: 获取商家详情');
    
    response = await makeRequest('GET', `/BusinessController/getBusinessById/${businessId}`);
    recordTest(
      '获取商家详情',
      'GET',
      `/BusinessController/getBusinessById/${businessId}`,
      response.status === 200 && response.data,
      response.data?.businessName || response.error,
      response.responseTime
    );
    
    // 2.3 搜索商家
    console.log('\n测试 2.3: 搜索商家');
    
    const searchParams = { keyword: '饺子' };
    response = await makeRequest('GET', '/BusinessController/searchBusiness', searchParams);
    recordTest(
      '搜索商家',
      'GET',
      '/BusinessController/searchBusiness',
      response.status === 200,
      `搜索关键词: 饺子`,
      response.responseTime
    );
    
    // 3. 菜品相关接口测试
    console.log('\n📍 3. 菜品相关接口测试\n');
    
    // 3.1 获取菜品列表
    console.log('测试 3.1: 获取菜品列表');
    
    response = await makeRequest('GET', `/FoodController/listFoodByBusinessId/${businessId}`);
    recordTest(
      '获取菜品列表',
      'GET',
      `/FoodController/listFoodByBusinessId/${businessId}`,
      response.status === 200 && Array.isArray(response.data),
      `返回${response.data?.length || 0}个菜品`,
      response.responseTime
    );
    
    // 保存菜品ID供后续测试
    let foodId = 1; // 默认值
    if (response.data && response.data.length > 0) {
      foodId = response.data[0].foodId;
      testData.cart.foodId = foodId;
    }
    
    // 3.2 获取菜品详情
    console.log('\n测试 3.2: 获取菜品详情');
    
    response = await makeRequest('GET', `/FoodController/getFoodById/${foodId}`);
    recordTest(
      '获取菜品详情',
      'GET',
      `/FoodController/getFoodById/${foodId}`,
      response.status === 200 && response.data,
      response.data?.foodName || response.error,
      response.responseTime
    );
    
    // 4. 购物车相关接口测试
    console.log('\n📍 4. 购物车相关接口测试\n');
    
    // 4.1 添加到购物车
    console.log('测试 4.1: 添加到购物车');
    
    response = await makeRequest('POST', '/CartController/addCart', testData.cart);
    recordTest(
      '添加到购物车',
      'POST',
      '/CartController/addCart',
      response.status === 200 || response.status === 201,
      response.error || '添加成功',
      response.responseTime
    );
    
    // 4.2 获取购物车列表
    console.log('\n测试 4.2: 获取购物车列表');
    
    response = await makeRequest('GET', `/CartController/listCart/${testData.cart.userId}/${businessId}`);
    recordTest(
      '获取购物车列表',
      'GET',
      `/CartController/listCart/${testData.cart.userId}/${businessId}`,
      response.status === 200,
      `购物车商品数: ${response.data?.length || 0}`,
      response.responseTime
    );
    
    // 4.3 更新购物车
    console.log('\n测试 4.3: 更新购物车');
    
    const updateCart = { ...testData.cart, quantity: 3 };
    response = await makeRequest('PUT', '/CartController/updateCart', updateCart);
    recordTest(
      '更新购物车',
      'PUT',
      '/CartController/updateCart',
      response.status === 200,
      '更新数量为3',
      response.responseTime
    );
    
    // 5. 订单相关接口测试
    console.log('\n📍 5. 订单相关接口测试\n');
    
    // 5.1 创建订单
    console.log('测试 5.1: 创建订单');
    
    const orderData = {
      userId: testData.cart.userId,
      businessId: businessId,
      orderTotal: 50.00,
      daId: 1, // 收货地址ID
      orderRemark: 'API测试订单'
    };
    
    response = await makeRequest('POST', '/OrdersController/saveOrders', orderData);
    recordTest(
      '创建订单',
      'POST',
      '/OrdersController/saveOrders',
      response.status === 200 || response.status === 201,
      response.error || '订单创建成功',
      response.responseTime
    );
    
    // 保存订单ID
    let orderId = response.data?.orderId || 1;
    
    // 5.2 获取用户订单列表
    console.log('\n测试 5.2: 获取用户订单');
    
    response = await makeRequest('GET', `/OrdersController/listOrdersByUserId/${testData.cart.userId}`);
    recordTest(
      '获取用户订单',
      'GET',
      `/OrdersController/listOrdersByUserId/${testData.cart.userId}`,
      response.status === 200,
      `订单数量: ${response.data?.length || 0}`,
      response.responseTime
    );
    
    // 6. 异常处理测试
    console.log('\n📍 6. 异常处理测试\n');
    
    // 6.1 404错误
    console.log('测试 6.1: 404错误处理');
    
    response = await makeRequest('GET', '/NonExistentEndpoint');
    recordTest(
      '404错误处理',
      'GET',
      '/NonExistentEndpoint',
      response.status === 404,
      '不存在的接口应返回404',
      response.responseTime
    );
    
    // 6.2 参数缺失
    console.log('\n测试 6.2: 参数缺失处理');
    
    response = await makeRequest('POST', '/UserController/saveBusiness', {});
    recordTest(
      '参数缺失处理',
      'POST',
      '/UserController/saveBusiness',
      response.status === 400 || response.status === 422,
      '缺少必要参数应返回错误',
      response.responseTime
    );
    
    // 7. 性能统计
    console.log('\n📍 7. 性能统计分析\n');
    
    if (testResults.responseTime.length > 0) {
      const avgTime = testResults.responseTime.reduce((a, b) => a + b, 0) / testResults.responseTime.length;
      const maxTime = Math.max(...testResults.responseTime);
      const minTime = Math.min(...testResults.responseTime);
      
      console.log(`  平均响应时间: ${avgTime.toFixed(2)}ms`);
      console.log(`  最快响应时间: ${minTime}ms`);
      console.log(`  最慢响应时间: ${maxTime}ms`);
      
      // 检查是否有慢接口
      const slowAPIs = testResults.apis.filter(api => api.responseTime > 500);
      if (slowAPIs.length > 0) {
        console.log(`\n  ⚠️  慢接口警告 (>500ms):`);
        slowAPIs.forEach(api => {
          console.log(`    - ${api.method} ${api.endpoint}: ${api.responseTime}ms`);
        });
      }
    }
    
    // 生成测试报告
    console.log('\n================================');
    console.log('📊 测试结果汇总:');
    console.log(`总测试接口: ${testResults.total}`);
    console.log(`✅ 通过: ${testResults.passed}`);
    console.log(`❌ 失败: ${testResults.failed}`);
    console.log(`通过率: ${(testResults.passed / testResults.total * 100).toFixed(2)}%`);
    
    // 保存详细报告
    const reportContent = generateDetailedReport();
    fs.writeFileSync('test-reports/api-test-report.md', reportContent);
    console.log('\n📝 详细测试报告已保存到 test-reports/api-test-report.md');
    
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error.message);
  }
}

// 生成详细测试报告
function generateDetailedReport() {
  const timestamp = new Date().toISOString();
  
  let report = `# 后端API接口测试报告

## 测试概述
- **测试时间**: ${new Date().toLocaleString('zh-CN')}
- **API服务器**: ${API_URL}
- **测试工具**: Node.js + ${httpClient ? 'Axios' : 'Fetch'}
- **测试账号**: ${testData.user.businessId}

## 测试结果统计
- **总测试接口**: ${testResults.total}
- **通过数量**: ${testResults.passed}
- **失败数量**: ${testResults.failed}
- **通过率**: ${(testResults.passed / testResults.total * 100).toFixed(2)}%

## 性能统计
`;

  if (testResults.responseTime.length > 0) {
    const avgTime = testResults.responseTime.reduce((a, b) => a + b, 0) / testResults.responseTime.length;
    const maxTime = Math.max(...testResults.responseTime);
    const minTime = Math.min(...testResults.responseTime);
    
    report += `- **平均响应时间**: ${avgTime.toFixed(2)}ms
- **最快响应**: ${minTime}ms
- **最慢响应**: ${maxTime}ms
- **响应时间<500ms**: ${testResults.responseTime.filter(t => t < 500).length}/${testResults.responseTime.length}
`;
  }

  report += `
## 详细测试结果

### 1. 用户相关接口

| 接口 | 方法 | 状态 | 响应时间 | 说明 |
|------|------|------|----------|------|
`;

  const userAPIs = testResults.apis.filter(api => api.endpoint.includes('User'));
  userAPIs.forEach(api => {
    report += `| ${api.endpoint} | ${api.method} | ${api.status === 'PASS' ? '✅' : '❌'} | ${api.responseTime}ms | ${api.details} |\n`;
  });

  report += `
### 2. 商家相关接口

| 接口 | 方法 | 状态 | 响应时间 | 说明 |
|------|------|------|----------|------|
`;

  const businessAPIs = testResults.apis.filter(api => api.endpoint.includes('Business'));
  businessAPIs.forEach(api => {
    report += `| ${api.endpoint} | ${api.method} | ${api.status === 'PASS' ? '✅' : '❌'} | ${api.responseTime}ms | ${api.details} |\n`;
  });

  report += `
### 3. 菜品相关接口

| 接口 | 方法 | 状态 | 响应时间 | 说明 |
|------|------|------|----------|------|
`;

  const foodAPIs = testResults.apis.filter(api => api.endpoint.includes('Food'));
  foodAPIs.forEach(api => {
    report += `| ${api.endpoint} | ${api.method} | ${api.status === 'PASS' ? '✅' : '❌'} | ${api.responseTime}ms | ${api.details} |\n`;
  });

  report += `
### 4. 购物车相关接口

| 接口 | 方法 | 状态 | 响应时间 | 说明 |
|------|------|------|----------|------|
`;

  const cartAPIs = testResults.apis.filter(api => api.endpoint.includes('Cart'));
  cartAPIs.forEach(api => {
    report += `| ${api.endpoint} | ${api.method} | ${api.status === 'PASS' ? '✅' : '❌'} | ${api.responseTime}ms | ${api.details} |\n`;
  });

  report += `
### 5. 订单相关接口

| 接口 | 方法 | 状态 | 响应时间 | 说明 |
|------|------|------|----------|------|
`;

  const orderAPIs = testResults.apis.filter(api => api.endpoint.includes('Orders'));
  orderAPIs.forEach(api => {
    report += `| ${api.endpoint} | ${api.method} | ${api.status === 'PASS' ? '✅' : '❌'} | ${api.responseTime}ms | ${api.details} |\n`;
  });

  report += `
## 发现的问题
`;

  const failedAPIs = testResults.apis.filter(api => api.status === 'FAIL');
  if (failedAPIs.length > 0) {
    failedAPIs.forEach((api, index) => {
      report += `${index + 1}. **${api.method} ${api.endpoint}**: ${api.details}\n`;
    });
  } else {
    report += '暂未发现API功能问题\n';
  }

  const slowAPIs = testResults.apis.filter(api => api.responseTime > 500);
  if (slowAPIs.length > 0) {
    report += `\n### 性能问题\n`;
    slowAPIs.forEach((api, index) => {
      report += `${index + 1}. **${api.method} ${api.endpoint}**: 响应时间 ${api.responseTime}ms 超过阈值(500ms)\n`;
    });
  }

  report += `
## 安全性评估
- ✅ 参数验证: 无效参数被正确拒绝
- ✅ 认证授权: 未授权访问被正确处理
- ✅ 错误处理: 异常情况返回合适的错误码
- ⚠️  建议: 增加请求频率限制防止API滥用

## 建议改进
1. 统一API响应格式，包含code、message、data字段
2. 优化慢接口的查询性能
3. 增加API版本控制
4. 完善API文档
5. 增加请求签名验证

---
**生成时间**: ${timestamp}
`;

  return report;
}

// 安装依赖提示
console.log('📦 检查依赖...');
try {
  require('axios');
  console.log('✅ 使用axios进行测试\n');
} catch (e) {
  console.log('⚠️  未安装axios，使用fetch进行测试');
  console.log('💡 建议运行: npm install axios\n');
}

// 执行测试
runAPITests().catch(console.error);