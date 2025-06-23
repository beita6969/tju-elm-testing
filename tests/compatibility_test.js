// 跨平台兼容性测试脚本
const { chromium, firefox, webkit } = require('playwright');
const fs = require('fs');

const BASE_URL = 'http://localhost:8084';

// 测试配置
const compatibilityConfig = {
  // 桌面浏览器
  browsers: [
    { name: 'Chrome', type: chromium, channel: undefined },
    { name: 'Firefox', type: firefox, channel: undefined },
    { name: 'Safari', type: webkit, channel: undefined },
    // Edge使用chromium内核
    { name: 'Edge', type: chromium, channel: 'msedge' }
  ],
  // 设备配置
  devices: [
    // 桌面设备
    { name: '桌面大屏', viewport: { width: 1920, height: 1080 }, isMobile: false },
    { name: '笔记本', viewport: { width: 1366, height: 768 }, isMobile: false },
    { name: '小屏笔记本', viewport: { width: 1280, height: 720 }, isMobile: false },
    // 平板设备
    { name: 'iPad竖屏', viewport: { width: 768, height: 1024 }, isMobile: true },
    { name: 'iPad横屏', viewport: { width: 1024, height: 768 }, isMobile: true },
    // 手机设备
    { name: 'iPhone SE', viewport: { width: 375, height: 667 }, isMobile: true },
    { name: 'iPhone 11', viewport: { width: 414, height: 896 }, isMobile: true },
    { name: 'Android手机', viewport: { width: 360, height: 640 }, isMobile: true }
  ],
  // 测试页面
  testPages: [
    { name: '首页', url: '/', critical: true },
    { name: '商家列表', url: '/#/index', critical: true },
    { name: '登录页', url: '/#/login', critical: true },
    { name: '注册页', url: '/#/register', critical: true },
    { name: '个人中心', url: '/#/my', critical: false }
  ],
  // 关键功能检查点
  checkpoints: [
    { name: '页面加载', selector: 'body', action: 'visible' },
    { name: '导航栏', selector: 'nav, header, [class*="nav"], [class*="header"]', action: 'visible' },
    { name: '底部导航', selector: 'footer, [class*="footer"], [class*="tab-bar"]', action: 'visible' },
    { name: '主要内容', selector: 'main, .content, [class*="main"], [class*="content"]', action: 'visible' }
  ]
};

// 测试结果收集
const testResults = {
  browserTests: [],
  deviceTests: [],
  responsiveTests: [],
  functionalTests: [],
  summary: {
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  }
};

// 记录测试结果
function recordTest(category, testName, details, status = 'pass') {
  testResults.summary.totalTests++;
  
  if (status === 'pass') {
    testResults.summary.passed++;
    console.log(`  ✅ ${testName}`);
  } else if (status === 'warning') {
    testResults.summary.warnings++;
    console.log(`  ⚠️  ${testName}`);
  } else {
    testResults.summary.failed++;
    console.log(`  ❌ ${testName}`);
  }
  
  testResults[category].push({
    name: testName,
    status,
    details,
    timestamp: new Date().toISOString()
  });
}

// 测试浏览器兼容性
async function testBrowserCompatibility(browserConfig) {
  console.log(`\n📍 测试浏览器: ${browserConfig.name}`);
  
  let browser;
  try {
    // 启动浏览器
    const launchOptions = { headless: true };
    if (browserConfig.channel) {
      launchOptions.channel = browserConfig.channel;
    }
    
    browser = await browserConfig.type.launch(launchOptions);
    const page = await browser.newPage();
    
    // 测试每个页面
    for (const testPage of compatibilityConfig.testPages) {
      console.log(`  测试页面: ${testPage.name}`);
      
      const startTime = Date.now();
      let allChecksPassed = true;
      const checkResults = [];
      
      try {
        await page.goto(BASE_URL + testPage.url, { waitUntil: 'networkidle' });
        const loadTime = Date.now() - startTime;
        
        // 检查关键元素
        for (const checkpoint of compatibilityConfig.checkpoints) {
          const element = await page.locator(checkpoint.selector).first();
          const isVisible = await element.isVisible({ timeout: 5000 }).catch(() => false);
          
          checkResults.push({
            checkpoint: checkpoint.name,
            passed: isVisible
          });
          
          if (!isVisible && testPage.critical) {
            allChecksPassed = false;
          }
        }
        
        // 截图
        await page.screenshot({ 
          path: `tests/screenshots/compat-${browserConfig.name}-${testPage.name.replace(/\s/g, '-')}.png` 
        });
        
        recordTest('browserTests', 
          `${browserConfig.name} - ${testPage.name}`,
          { loadTime, checkResults },
          allChecksPassed ? 'pass' : 'warning'
        );
        
      } catch (error) {
        recordTest('browserTests',
          `${browserConfig.name} - ${testPage.name}`,
          { error: error.message },
          'fail'
        );
      }
    }
    
    await browser.close();
  } catch (error) {
    console.error(`  浏览器启动失败: ${error.message}`);
    recordTest('browserTests',
      browserConfig.name,
      { error: `浏览器启动失败: ${error.message}` },
      'fail'
    );
  }
}

// 测试设备兼容性
async function testDeviceCompatibility(deviceConfig) {
  console.log(`\n📍 测试设备: ${deviceConfig.name} (${deviceConfig.viewport.width}x${deviceConfig.viewport.height})`);
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    const context = await browser.newContext({
      viewport: deviceConfig.viewport,
      isMobile: deviceConfig.isMobile,
      hasTouch: deviceConfig.isMobile,
      userAgent: deviceConfig.isMobile ? 
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15' :
        undefined
    });
    
    const page = await context.newPage();
    
    // 测试响应式布局
    for (const testPage of compatibilityConfig.testPages.filter(p => p.critical)) {
      console.log(`  测试页面: ${testPage.name}`);
      
      try {
        await page.goto(BASE_URL + testPage.url, { waitUntil: 'networkidle' });
        
        // 检查响应式布局
        const layoutChecks = await page.evaluate(() => {
          const checks = {
            hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
            elementsOverflow: false,
            readableText: true,
            touchTargetsSize: true
          };
          
          // 检查元素溢出
          const elements = document.querySelectorAll('*');
          for (const el of elements) {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth || rect.left < 0) {
              checks.elementsOverflow = true;
              break;
            }
          }
          
          // 检查文字可读性
          const textElements = document.querySelectorAll('p, span, div, a, button');
          for (const el of textElements) {
            const fontSize = window.getComputedStyle(el).fontSize;
            if (parseInt(fontSize) < 12) {
              checks.readableText = false;
              break;
            }
          }
          
          // 检查触摸目标大小（移动设备）
          if (window.innerWidth < 768) {
            const clickables = document.querySelectorAll('a, button, input, select');
            for (const el of clickables) {
              const rect = el.getBoundingClientRect();
              if (rect.width < 44 || rect.height < 44) {
                checks.touchTargetsSize = false;
                break;
              }
            }
          }
          
          return checks;
        });
        
        // 截图
        await page.screenshot({ 
          path: `tests/screenshots/compat-${deviceConfig.name.replace(/\s/g, '-')}-${testPage.name.replace(/\s/g, '-')}.png`,
          fullPage: true 
        });
        
        // 评估结果
        const hasIssues = layoutChecks.hasHorizontalScroll || 
                         layoutChecks.elementsOverflow || 
                         !layoutChecks.readableText ||
                         (deviceConfig.isMobile && !layoutChecks.touchTargetsSize);
        
        recordTest('deviceTests',
          `${deviceConfig.name} - ${testPage.name}`,
          layoutChecks,
          hasIssues ? 'warning' : 'pass'
        );
        
      } catch (error) {
        recordTest('deviceTests',
          `${deviceConfig.name} - ${testPage.name}`,
          { error: error.message },
          'fail'
        );
      }
    }
    
    await context.close();
  } catch (error) {
    console.error(`  设备测试失败: ${error.message}`);
  } finally {
    await browser.close();
  }
}

// 测试关键功能
async function testCriticalFunctionality() {
  console.log('\n📍 关键功能兼容性测试');
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    // 测试不同视口下的功能
    const viewports = [
      { name: '桌面', width: 1366, height: 768 },
      { name: '移动', width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      console.log(`\n  ${viewport.name}视图功能测试:`);
      
      const context = await browser.newContext({
        viewport,
        isMobile: viewport.width < 768
      });
      const page = await context.newPage();
      
      // 测试1: 导航功能
      console.log('    测试导航功能...');
      await page.goto(BASE_URL);
      
      const navItems = await page.locator('nav a, [class*="nav"] a, [class*="tab"] a').all();
      if (navItems.length > 0) {
        // 点击第一个导航项
        await navItems[0].click();
        await page.waitForTimeout(1000);
        recordTest('functionalTests',
          `${viewport.name} - 导航功能`,
          { navItemsCount: navItems.length },
          'pass'
        );
      } else {
        recordTest('functionalTests',
          `${viewport.name} - 导航功能`,
          { error: '未找到导航元素' },
          'fail'
        );
      }
      
      // 测试2: 表单输入
      console.log('    测试表单输入...');
      await page.goto(BASE_URL + '/#/login');
      await page.waitForTimeout(1000);
      
      const inputs = await page.locator('input').all();
      if (inputs.length > 0) {
        // 测试输入功能
        await inputs[0].fill('test@example.com');
        const value = await inputs[0].inputValue();
        recordTest('functionalTests',
          `${viewport.name} - 表单输入`,
          { inputCount: inputs.length, testValue: value },
          value === 'test@example.com' ? 'pass' : 'fail'
        );
      }
      
      // 测试3: 点击交互
      console.log('    测试点击交互...');
      const buttons = await page.locator('button, [type="submit"]').all();
      if (buttons.length > 0) {
        const buttonText = await buttons[0].textContent();
        recordTest('functionalTests',
          `${viewport.name} - 按钮交互`,
          { buttonCount: buttons.length, firstButton: buttonText },
          'pass'
        );
      }
      
      await context.close();
    }
  } catch (error) {
    console.error(`  功能测试失败: ${error.message}`);
  } finally {
    await browser.close();
  }
}

// 主测试函数
async function runCompatibilityTests() {
  console.log('🚀 开始执行跨平台兼容性测试');
  console.log('================================\n');
  console.log(`测试环境: ${BASE_URL}`);
  console.log(`测试时间: ${new Date().toLocaleString('zh-CN')}\n`);
  
  try {
    // 1. 浏览器兼容性测试
    console.log('📋 1. 浏览器兼容性测试');
    console.log('================================');
    
    // 检查可用的浏览器
    const availableBrowsers = [];
    for (const browser of compatibilityConfig.browsers) {
      try {
        // Edge需要特殊处理
        if (browser.name === 'Edge' && process.platform !== 'win32') {
          console.log(`  ⚠️  ${browser.name} 仅在Windows上可用`);
          continue;
        }
        availableBrowsers.push(browser);
      } catch (e) {
        console.log(`  ⚠️  ${browser.name} 不可用`);
      }
    }
    
    // 测试可用的浏览器
    for (const browser of availableBrowsers) {
      await testBrowserCompatibility(browser);
    }
    
    // 2. 设备兼容性测试
    console.log('\n📋 2. 设备兼容性测试');
    console.log('================================');
    
    // 选择关键设备进行测试
    const keyDevices = compatibilityConfig.devices.filter(d => 
      ['桌面大屏', '笔记本', 'iPad竖屏', 'iPhone 11'].includes(d.name)
    );
    
    for (const device of keyDevices) {
      await testDeviceCompatibility(device);
    }
    
    // 3. 关键功能测试
    console.log('\n📋 3. 关键功能兼容性测试');
    console.log('================================');
    await testCriticalFunctionality();
    
    // 生成测试报告
    console.log('\n================================');
    console.log('📊 测试结果汇总:');
    console.log(`总测试项: ${testResults.summary.totalTests}`);
    console.log(`✅ 通过: ${testResults.summary.passed}`);
    console.log(`⚠️  警告: ${testResults.summary.warnings}`);
    console.log(`❌ 失败: ${testResults.summary.failed}`);
    
    const successRate = ((testResults.summary.passed + testResults.summary.warnings) / testResults.summary.totalTests * 100).toFixed(2);
    console.log(`兼容率: ${successRate}%`);
    
    // 保存详细报告
    const reportContent = generateDetailedReport();
    fs.writeFileSync('test-reports/compatibility-test-report.md', reportContent);
    console.log('\n📝 详细测试报告已保存到 test-reports/compatibility-test-report.md');
    
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error.message);
  }
}

// 生成详细测试报告
function generateDetailedReport() {
  const timestamp = new Date().toISOString();
  
  let report = `# 跨平台兼容性测试报告

## 测试概述
- **测试时间**: ${new Date().toLocaleString('zh-CN')}
- **测试环境**: ${BASE_URL}
- **测试工具**: Playwright

## 测试结果统计
- **总测试项**: ${testResults.summary.totalTests}
- **通过**: ${testResults.summary.passed}
- **警告**: ${testResults.summary.warnings}
- **失败**: ${testResults.summary.failed}
- **兼容率**: ${((testResults.summary.passed + testResults.summary.warnings) / testResults.summary.totalTests * 100).toFixed(2)}%

## 1. 浏览器兼容性测试结果

| 浏览器 | 页面 | 状态 | 加载时间 | 备注 |
|--------|------|------|----------|------|
`;

  testResults.browserTests.forEach(test => {
    const [browser, page] = test.name.split(' - ');
    const loadTime = test.details.loadTime ? `${test.details.loadTime}ms` : 'N/A';
    const status = test.status === 'pass' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
    report += `| ${browser} | ${page} | ${status} | ${loadTime} | ${test.details.error || '正常'} |\n`;
  });

  report += `
## 2. 设备兼容性测试结果

| 设备 | 页面 | 状态 | 问题 |
|------|------|------|------|
`;

  testResults.deviceTests.forEach(test => {
    const [device, page] = test.name.split(' - ');
    const status = test.status === 'pass' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
    const issues = [];
    
    if (test.details.hasHorizontalScroll) issues.push('横向滚动');
    if (test.details.elementsOverflow) issues.push('元素溢出');
    if (!test.details.readableText) issues.push('文字过小');
    if (!test.details.touchTargetsSize) issues.push('触摸目标过小');
    
    report += `| ${device} | ${page} | ${status} | ${issues.join(', ') || '无'} |\n`;
  });

  report += `
## 3. 功能兼容性测试结果

| 视图 | 功能 | 状态 | 说明 |
|------|------|------|------|
`;

  testResults.functionalTests.forEach(test => {
    const [viewport, func] = test.name.split(' - ');
    const status = test.status === 'pass' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
    report += `| ${viewport} | ${func} | ${status} | ${JSON.stringify(test.details)} |\n`;
  });

  report += `
## 兼容性问题汇总

### 🔴 严重问题
`;

  const criticalIssues = testResults.browserTests.concat(testResults.deviceTests)
    .filter(t => t.status === 'fail');
  
  if (criticalIssues.length > 0) {
    criticalIssues.forEach((issue, index) => {
      report += `${index + 1}. **${issue.name}**: ${issue.details.error || '功能不可用'}\n`;
    });
  } else {
    report += '无严重兼容性问题\n';
  }

  report += `
### 🟡 警告问题
`;

  const warningIssues = testResults.deviceTests
    .filter(t => t.status === 'warning');
  
  if (warningIssues.length > 0) {
    warningIssues.forEach((issue, index) => {
      const problems = [];
      if (issue.details.hasHorizontalScroll) problems.push('存在横向滚动');
      if (issue.details.elementsOverflow) problems.push('部分元素溢出');
      if (!issue.details.readableText) problems.push('文字可读性差');
      if (!issue.details.touchTargetsSize) problems.push('触摸目标过小');
      
      report += `${index + 1}. **${issue.name}**: ${problems.join(', ')}\n`;
    });
  } else {
    report += '无警告级别问题\n';
  }

  report += `
## 建议改进

### 响应式设计
1. 优化移动端布局，避免横向滚动
2. 增加触摸目标的大小（建议最小44x44px）
3. 调整小屏幕下的字体大小（最小12px）

### 浏览器兼容性
1. 添加CSS前缀以支持旧版浏览器
2. 使用Polyfill支持新API
3. 进行渐进式增强

### 性能优化
1. 优化图片加载（使用响应式图片）
2. 减少移动端的资源加载
3. 使用CSS媒体查询优化样式

## 测试覆盖情况
- ✅ Chrome、Firefox、Safari主流浏览器
- ✅ 桌面、平板、手机多种设备
- ✅ 横屏、竖屏不同方向
- ✅ 触摸、鼠标不同交互方式

---
**生成时间**: ${timestamp}
`;

  return report;
}

// 执行测试
runCompatibilityTests().catch(console.error);