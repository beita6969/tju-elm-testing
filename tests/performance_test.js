// 系统性能测试脚本
const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'http://localhost:8084';
const API_URL = 'http://localhost:8080';

// 测试配置
const performanceConfig = {
  iterations: 3, // 每个测试重复次数
  concurrentUsers: [1, 5, 10], // 并发用户数测试
  pages: [
    { name: '首页', url: '/' },
    { name: '商家列表', url: '/#/index' },
    { name: '登录页', url: '/#/login' },
    { name: '注册页', url: '/#/register' },
    { name: '我的页面', url: '/#/my' }
  ],
  // 性能阈值
  thresholds: {
    FCP: 1500, // First Contentful Paint < 1.5s
    LCP: 2500, // Largest Contentful Paint < 2.5s
    TTI: 3500, // Time to Interactive < 3.5s
    CLS: 0.1,  // Cumulative Layout Shift < 0.1
    pageLoad: 3000, // 页面加载时间 < 3s
    apiResponse: 500 // API响应时间 < 500ms
  }
};

// 测试结果收集
const testResults = {
  pagePerformance: [],
  apiPerformance: [],
  loadTest: [],
  resourceMetrics: [],
  summary: {
    totalTests: 0,
    passed: 0,
    failed: 0
  }
};

// 记录测试结果
function recordTest(category, testName, metrics, passed) {
  testResults.summary.totalTests++;
  if (passed) {
    testResults.summary.passed++;
    console.log(`  ✅ ${testName}`);
  } else {
    testResults.summary.failed++;
    console.log(`  ❌ ${testName}`);
  }
  
  testResults[category].push({
    name: testName,
    metrics,
    passed,
    timestamp: new Date().toISOString()
  });
}

// 获取页面性能指标
async function measurePagePerformance(page, pageName, url) {
  console.log(`\n测试页面: ${pageName}`);
  
  const metrics = {
    navigationStart: 0,
    loadComplete: 0,
    FCP: 0,
    LCP: 0,
    TTI: 0,
    CLS: 0,
    resources: []
  };
  
  try {
    // 开始导航
    const startTime = Date.now();
    await page.goto(BASE_URL + url, { waitUntil: 'networkidle' });
    metrics.loadComplete = Date.now() - startTime;
    
    // 获取性能指标
    const performanceData = await page.evaluate(() => {
      const perf = {
        timing: {},
        paint: {},
        resources: []
      };
      
      // Navigation Timing
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        perf.timing = {
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          loadComplete: timing.loadEventEnd - timing.navigationStart,
          domInteractive: timing.domInteractive - timing.navigationStart,
          domainLookup: timing.domainLookupEnd - timing.domainLookupStart,
          connect: timing.connectEnd - timing.connectStart,
          responseTime: timing.responseEnd - timing.requestStart
        };
      }
      
      // Paint Timing
      if (window.performance && window.performance.getEntriesByType) {
        const paintEntries = window.performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            perf.paint.FCP = entry.startTime;
          }
        });
        
        // Resource Timing
        const resourceEntries = window.performance.getEntriesByType('resource');
        perf.resources = resourceEntries.map(entry => ({
          name: entry.name.split('/').pop(),
          type: entry.initiatorType,
          duration: entry.duration,
          size: entry.transferSize || 0
        }));
      }
      
      return perf;
    });
    
    // 设置性能指标
    if (performanceData.paint.FCP) {
      metrics.FCP = Math.round(performanceData.paint.FCP);
    }
    metrics.resources = performanceData.resources;
    
    // 简单的LCP估算（实际应使用PerformanceObserver）
    metrics.LCP = metrics.loadComplete;
    
    // TTI近似值
    metrics.TTI = performanceData.timing.domInteractive || metrics.loadComplete;
    
    // 检查性能阈值
    const passed = 
      metrics.loadComplete < performanceConfig.thresholds.pageLoad &&
      metrics.FCP < performanceConfig.thresholds.FCP;
    
    console.log(`  页面加载时间: ${metrics.loadComplete}ms`);
    console.log(`  FCP: ${metrics.FCP}ms`);
    console.log(`  资源数量: ${metrics.resources.length}`);
    
    recordTest('pagePerformance', `${pageName}页面性能`, metrics, passed);
    
    // 截图
    await page.screenshot({ 
      path: `tests/screenshots/perf-${pageName.replace(/\s/g, '-')}.png` 
    });
    
  } catch (error) {
    console.error(`  错误: ${error.message}`);
    recordTest('pagePerformance', `${pageName}页面性能`, { error: error.message }, false);
  }
}

// API性能测试
async function measureAPIPerformance() {
  console.log('\n📍 API性能测试\n');
  
  const apiEndpoints = [
    { name: '获取商家列表', method: 'POST', url: '/BusinessController/listBusinessByOrderTypeId', data: { orderTypeId: 1 } },
    { name: '获取菜品列表', method: 'GET', url: '/FoodController/listFoodByBusinessId/10001' },
    { name: '用户登录', method: 'POST', url: '/BusinessController/checkBusiness', data: { businessId: '13888888888', businessPassword: '123456' } }
  ];
  
  for (const api of apiEndpoints) {
    console.log(`测试接口: ${api.name}`);
    
    const startTime = Date.now();
    try {
      const response = await fetch(API_URL + api.url, {
        method: api.method,
        headers: { 'Content-Type': 'application/json' },
        body: api.data ? JSON.stringify(api.data) : undefined
      });
      
      const responseTime = Date.now() - startTime;
      const passed = responseTime < performanceConfig.thresholds.apiResponse;
      
      console.log(`  响应时间: ${responseTime}ms`);
      console.log(`  状态码: ${response.status}`);
      
      recordTest('apiPerformance', api.name, {
        responseTime,
        status: response.status,
        size: response.headers.get('content-length') || 0
      }, passed);
      
    } catch (error) {
      console.log(`  错误: ${error.message}`);
      recordTest('apiPerformance', api.name, { error: error.message }, false);
    }
  }
}

// 并发负载测试
async function loadTest(concurrentUsers) {
  console.log(`\n📍 并发负载测试 (${concurrentUsers}个用户)\n`);
  
  const browser = await chromium.launch({ headless: true });
  const startTime = Date.now();
  const results = [];
  
  try {
    // 创建多个并发用户
    const userPromises = [];
    for (let i = 0; i < concurrentUsers; i++) {
      userPromises.push(simulateUser(browser, i + 1));
    }
    
    // 等待所有用户完成
    const userResults = await Promise.all(userPromises);
    results.push(...userResults);
    
    const totalTime = Date.now() - startTime;
    const avgResponseTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    const successRate = (results.filter(r => r.success).length / results.length) * 100;
    
    console.log(`  总耗时: ${totalTime}ms`);
    console.log(`  平均响应时间: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`  成功率: ${successRate.toFixed(2)}%`);
    
    recordTest('loadTest', `${concurrentUsers}用户并发测试`, {
      concurrentUsers,
      totalTime,
      avgResponseTime,
      successRate,
      results
    }, successRate > 95 && avgResponseTime < 3000);
    
  } catch (error) {
    console.error(`  错误: ${error.message}`);
    recordTest('loadTest', `${concurrentUsers}用户并发测试`, { error: error.message }, false);
  } finally {
    await browser.close();
  }
}

// 模拟用户行为
async function simulateUser(browser, userId) {
  const startTime = Date.now();
  let success = true;
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // 1. 访问首页
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    
    // 2. 点击商家
    await page.waitForTimeout(Math.random() * 1000); // 随机延迟
    const businesses = await page.locator('.business-item, [class*="business"]').all();
    if (businesses.length > 0) {
      await businesses[Math.floor(Math.random() * Math.min(3, businesses.length))].click();
    }
    
    // 3. 浏览商品
    await page.waitForTimeout(Math.random() * 2000);
    
    await context.close();
  } catch (error) {
    success = false;
  }
  
  return {
    userId,
    duration: Date.now() - startTime,
    success
  };
}

// 资源分析
async function analyzeResources(page) {
  console.log('\n📍 资源加载分析\n');
  
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  
  const resourceMetrics = await page.evaluate(() => {
    const resources = window.performance.getEntriesByType('resource');
    const metrics = {
      total: resources.length,
      byType: {},
      slowest: [],
      largest: []
    };
    
    // 按类型分组
    resources.forEach(resource => {
      const type = resource.initiatorType;
      if (!metrics.byType[type]) {
        metrics.byType[type] = { count: 0, totalSize: 0, totalDuration: 0 };
      }
      metrics.byType[type].count++;
      metrics.byType[type].totalDuration += resource.duration;
      metrics.byType[type].totalSize += resource.transferSize || 0;
    });
    
    // 找出最慢的资源
    metrics.slowest = resources
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)
      .map(r => ({
        name: r.name.split('/').pop(),
        duration: Math.round(r.duration),
        type: r.initiatorType
      }));
    
    // 找出最大的资源
    metrics.largest = resources
      .filter(r => r.transferSize)
      .sort((a, b) => b.transferSize - a.transferSize)
      .slice(0, 5)
      .map(r => ({
        name: r.name.split('/').pop(),
        size: r.transferSize,
        type: r.initiatorType
      }));
    
    return metrics;
  });
  
  console.log(`  总资源数: ${resourceMetrics.total}`);
  console.log('\n  资源类型分布:');
  for (const [type, data] of Object.entries(resourceMetrics.byType)) {
    console.log(`    ${type}: ${data.count}个, 总耗时${data.totalDuration.toFixed(0)}ms`);
  }
  
  console.log('\n  最慢的资源:');
  resourceMetrics.slowest.forEach(r => {
    console.log(`    ${r.name} (${r.type}): ${r.duration}ms`);
  });
  
  testResults.resourceMetrics = resourceMetrics;
}

// 主测试函数
async function runPerformanceTests() {
  console.log('🚀 开始执行系统性能测试');
  console.log('================================\n');
  console.log(`测试环境: ${BASE_URL}`);
  console.log(`测试时间: ${new Date().toLocaleString('zh-CN')}\n`);
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // 1. 页面性能测试
    console.log('📍 1. 页面性能测试');
    console.log('================================');
    
    const page = await browser.newPage();
    
    for (const pageConfig of performanceConfig.pages) {
      await measurePagePerformance(page, pageConfig.name, pageConfig.url);
    }
    
    await page.close();
    
    // 2. API性能测试
    console.log('\n📍 2. API性能测试');
    console.log('================================');
    await measureAPIPerformance();
    
    // 3. 并发负载测试
    console.log('\n📍 3. 并发负载测试');
    console.log('================================');
    
    for (const users of performanceConfig.concurrentUsers) {
      await loadTest(users);
    }
    
    // 4. 资源分析
    console.log('\n📍 4. 资源加载分析');
    console.log('================================');
    const analysisPage = await browser.newPage();
    await analyzeResources(analysisPage);
    await analysisPage.close();
    
    // 生成报告
    console.log('\n================================');
    console.log('📊 测试结果汇总:');
    console.log(`总测试项: ${testResults.summary.totalTests}`);
    console.log(`✅ 通过: ${testResults.summary.passed}`);
    console.log(`❌ 失败: ${testResults.summary.failed}`);
    console.log(`通过率: ${(testResults.summary.passed / testResults.summary.totalTests * 100).toFixed(2)}%`);
    
    // 保存详细报告
    const reportContent = generateDetailedReport();
    fs.writeFileSync('test-reports/performance-test-report.md', reportContent);
    console.log('\n📝 详细测试报告已保存到 test-reports/performance-test-report.md');
    
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error.message);
  } finally {
    await browser.close();
  }
}

// 生成详细测试报告
function generateDetailedReport() {
  const timestamp = new Date().toISOString();
  
  let report = `# 系统性能测试报告

## 测试概述
- **测试时间**: ${new Date().toLocaleString('zh-CN')}
- **测试环境**: ${BASE_URL}
- **测试工具**: Playwright + Node.js

## 测试结果统计
- **总测试项**: ${testResults.summary.totalTests}
- **通过数量**: ${testResults.summary.passed}
- **失败数量**: ${testResults.summary.failed}
- **通过率**: ${(testResults.summary.passed / testResults.summary.totalTests * 100).toFixed(2)}%

## 1. 页面性能测试结果

### 性能指标说明
- **FCP (First Contentful Paint)**: 首次内容绘制时间，应 < 1.5秒
- **LCP (Largest Contentful Paint)**: 最大内容绘制时间，应 < 2.5秒
- **TTI (Time to Interactive)**: 可交互时间，应 < 3.5秒
- **页面加载时间**: 完整加载时间，应 < 3秒

### 测试结果

| 页面 | 加载时间(ms) | FCP(ms) | 资源数 | 状态 |
|------|-------------|---------|--------|------|
`;

  testResults.pagePerformance.forEach(test => {
    const metrics = test.metrics;
    report += `| ${test.name} | ${metrics.loadComplete || 'N/A'} | ${metrics.FCP || 'N/A'} | ${metrics.resources?.length || 0} | ${test.passed ? '✅' : '❌'} |\n`;
  });

  report += `
## 2. API性能测试结果

### 性能阈值
- API响应时间应 < 500ms

### 测试结果

| 接口 | 响应时间(ms) | 状态码 | 测试结果 |
|------|-------------|--------|----------|
`;

  testResults.apiPerformance.forEach(test => {
    const metrics = test.metrics;
    report += `| ${test.name} | ${metrics.responseTime || 'N/A'} | ${metrics.status || 'N/A'} | ${test.passed ? '✅' : '❌'} |\n`;
  });

  report += `
## 3. 并发负载测试结果

| 并发用户数 | 总耗时(ms) | 平均响应时间(ms) | 成功率(%) | 测试结果 |
|-----------|-----------|----------------|----------|----------|
`;

  testResults.loadTest.forEach(test => {
    const metrics = test.metrics;
    report += `| ${metrics.concurrentUsers} | ${metrics.totalTime} | ${metrics.avgResponseTime?.toFixed(2)} | ${metrics.successRate?.toFixed(2)} | ${test.passed ? '✅' : '❌'} |\n`;
  });

  report += `
## 4. 资源加载分析
`;

  if (testResults.resourceMetrics) {
    const metrics = testResults.resourceMetrics;
    report += `
- **总资源数**: ${metrics.total}

### 资源类型分布
| 类型 | 数量 | 总耗时(ms) |
|------|------|-----------|
`;
    
    for (const [type, data] of Object.entries(metrics.byType)) {
      report += `| ${type} | ${data.count} | ${data.totalDuration.toFixed(0)} |\n`;
    }
    
    report += `
### 最慢的资源
| 资源名 | 类型 | 加载时间(ms) |
|--------|------|-------------|
`;
    
    metrics.slowest.forEach(r => {
      report += `| ${r.name} | ${r.type} | ${r.duration} |\n`;
    });
  }

  report += `
## 性能优化建议

`;

  // 根据测试结果生成建议
  const slowPages = testResults.pagePerformance.filter(t => !t.passed);
  if (slowPages.length > 0) {
    report += `### 页面性能优化
`;
    slowPages.forEach(page => {
      report += `- **${page.name}**: 加载时间过长(${page.metrics.loadComplete}ms)，建议优化资源加载\n`;
    });
  }

  const slowAPIs = testResults.apiPerformance.filter(t => !t.passed);
  if (slowAPIs.length > 0) {
    report += `
### API性能优化
`;
    slowAPIs.forEach(api => {
      report += `- **${api.name}**: 响应时间过长(${api.metrics.responseTime}ms)，建议优化查询或添加缓存\n`;
    });
  }

  report += `
## 总体评估

`;

  const passRate = (testResults.summary.passed / testResults.summary.totalTests * 100);
  if (passRate >= 90) {
    report += '✅ **优秀**: 系统性能表现优秀，满足性能要求';
  } else if (passRate >= 70) {
    report += '🟡 **良好**: 系统性能基本满足要求，但仍有优化空间';
  } else {
    report += '❌ **需改进**: 系统性能存在明显问题，需要进行优化';
  }

  report += `

---
**生成时间**: ${timestamp}
`;

  return report;
}

// 执行测试
runPerformanceTests().catch(console.error);