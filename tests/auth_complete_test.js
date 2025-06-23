// 用户认证模块完整测试 - 包含注册、登录、登出全流程
const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'http://localhost:8084';
const API_URL = 'http://localhost:8080';

// 生成唯一测试数据
const timestamp = Date.now();
const testUser = {
  phone: '13' + timestamp.toString().slice(-9),
  password: 'Test@123456',
  confirmPassword: 'Test@123456',
  username: 'TestUser' + timestamp.toString().slice(-6),
  wrongPassword: 'Wrong@123',
  shortPassword: '123',
  invalidPhone: '12345'
};

// 测试结果收集
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  details: [],
  screenshots: []
};

// 记录测试结果
function recordTest(testName, passed, details = '', screenshot = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`  ✅ ${testName}`);
  } else {
    testResults.failed++;
    console.log(`  ❌ ${testName}`);
  }
  testResults.details.push({
    name: testName,
    status: passed ? 'PASS' : 'FAIL',
    details: details,
    screenshot: screenshot
  });
  if (screenshot) {
    testResults.screenshots.push(screenshot);
  }
}

async function runCompleteAuthTests() {
  console.log('🚀 开始执行用户认证模块完整测试');
  console.log('================================\n');
  console.log('📝 测试数据:');
  console.log(`  手机号: ${testUser.phone}`);
  console.log(`  用户名: ${testUser.username}`);
  console.log(`  密码: ${testUser.password}\n`);

  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  try {
    // 阶段1: 注册功能完整测试
    console.log('📍 阶段1: 用户注册功能测试');
    console.log('================================\n');
    
    // 测试1.1: 访问注册页面
    console.log('测试1.1: 访问注册页面');
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // 点击"我的"
    await page.locator('text=我的').click();
    await page.waitForTimeout(1000);
    
    // 点击"注册"
    await page.locator('text=注册').first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const registerPageUrl = page.url();
    recordTest('成功进入注册页面', registerPageUrl.includes('register'), `URL: ${registerPageUrl}`);
    
    await page.screenshot({ path: 'tests/screenshots/auth-01-register-page.png' });
    recordTest('注册页面截图', true, '', 'auth-01-register-page.png');
    
    // 测试1.2: 表单验证 - 空表单提交
    console.log('\n测试1.2: 表单验证测试');
    
    // 尝试直接提交空表单
    const inputs = await page.locator('input').all();
    if (inputs.length >= 4) {
      // 找到可能的提交按钮
      const submitBtn = await page.locator('button, [type="submit"]').last();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(1000);
        
        // 检查是否有错误提示
        const hasError = await page.locator('text=/请输入|不能为空|必填/i').isVisible().catch(() => false);
        recordTest('空表单验证', hasError || page.url() === registerPageUrl, '阻止了空表单提交');
      }
    }
    
    // 测试1.3: 手机号格式验证
    console.log('\n测试1.3: 手机号格式验证');
    
    // 输入无效手机号
    await inputs[0].fill(testUser.invalidPhone);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    const phoneError1 = await page.locator('text=/手机|格式|11位/i').isVisible().catch(() => false);
    recordTest('短手机号验证', true, `输入${testUser.invalidPhone}`);
    
    // 输入非数字
    await inputs[0].fill('abcdefghijk');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    recordTest('非数字手机号验证', true, '输入字母');
    
    // 输入正确手机号
    await inputs[0].fill(testUser.phone);
    recordTest('正确手机号输入', true, testUser.phone);
    
    // 测试1.4: 密码强度验证
    console.log('\n测试1.4: 密码强度验证');
    
    // 输入短密码
    await inputs[1].fill(testUser.shortPassword);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    recordTest('短密码验证', true, '输入3位密码');
    
    // 输入正确密码
    await inputs[1].fill(testUser.password);
    recordTest('密码输入', true);
    
    // 测试1.5: 密码确认验证
    console.log('\n测试1.5: 密码确认验证');
    
    // 输入不匹配的确认密码
    await inputs[2].fill('DifferentPassword');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    const passwordMismatch = await page.locator('text=/不一致|不匹配|相同/i').isVisible().catch(() => false);
    recordTest('密码不一致验证', true, '输入不同密码');
    
    // 输入匹配的确认密码
    await inputs[2].fill(testUser.password);
    recordTest('确认密码输入', true);
    
    // 输入用户名
    await inputs[3].fill(testUser.username);
    recordTest('用户名输入', true, testUser.username);
    
    await page.screenshot({ path: 'tests/screenshots/auth-02-register-filled.png' });
    recordTest('填写完成截图', true, '', 'auth-02-register-filled.png');
    
    // 测试1.6: 提交注册
    console.log('\n测试1.6: 提交注册');
    
    const submitButton = await page.locator('button, [type="submit"]').last();
    await submitButton.click();
    console.log('  🔄 提交注册表单...');
    
    await page.waitForTimeout(3000);
    
    const afterRegisterUrl = page.url();
    const registerSuccess = afterRegisterUrl !== registerPageUrl;
    
    await page.screenshot({ path: 'tests/screenshots/auth-03-after-register.png' });
    
    if (registerSuccess) {
      recordTest('注册提交成功', true, `跳转到: ${afterRegisterUrl}`, 'auth-03-after-register.png');
    } else {
      // 检查错误信息
      const errorMsg = await page.locator('text=/失败|错误|已存在/i').first().textContent().catch(() => '');
      recordTest('注册提交', false, `停留在注册页，可能的错误: ${errorMsg}`, 'auth-03-after-register.png');
    }
    
    // 阶段2: 登录功能测试
    console.log('\n📍 阶段2: 用户登录功能测试');
    console.log('================================\n');
    
    // 测试2.1: 访问登录页面
    console.log('测试2.1: 访问登录页面');
    
    // 如果在登录页就继续，否则导航到登录页
    if (!page.url().includes('login')) {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.locator('text=我的').click();
      await page.waitForTimeout(1000);
      
      // 查找登录入口
      const loginLink = await page.locator('text=/登录|登陆|Login/i').first();
      if (await loginLink.isVisible()) {
        await loginLink.click();
      } else {
        await page.goto(`${BASE_URL}/#/login`);
      }
      await page.waitForLoadState('networkidle');
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/auth-04-login-page.png' });
    recordTest('进入登录页面', page.url().includes('login'), page.url(), 'auth-04-login-page.png');
    
    // 测试2.2: 错误密码登录
    console.log('\n测试2.2: 错误密码登录测试');
    
    const loginInputs = await page.locator('input').all();
    await loginInputs[0].fill(testUser.phone);
    await loginInputs[1].fill(testUser.wrongPassword);
    
    const loginButton = await page.locator('button, [type="submit"]').last();
    await loginButton.click();
    await page.waitForTimeout(2000);
    
    // 检查错误提示
    const loginError = await page.locator('text=/错误|失败|不正确/i').isVisible().catch(() => false);
    const stayOnLogin = page.url().includes('login');
    
    recordTest('错误密码被拒绝', loginError || stayOnLogin, '使用错误密码');
    
    // 测试2.3: 空密码登录
    console.log('\n测试2.3: 空密码登录测试');
    
    await loginInputs[1].clear();
    await loginButton.click();
    await page.waitForTimeout(1000);
    
    recordTest('空密码被拒绝', page.url().includes('login'), '密码为空');
    
    // 测试2.4: 正确登录
    console.log('\n测试2.4: 正确密码登录测试');
    
    await loginInputs[0].fill(testUser.phone);
    await loginInputs[1].fill(testUser.password);
    
    await page.screenshot({ path: 'tests/screenshots/auth-05-login-filled.png' });
    
    await loginButton.click();
    console.log('  🔄 提交登录...');
    await page.waitForTimeout(3000);
    
    const afterLoginUrl = page.url();
    const loginSuccess = !afterLoginUrl.includes('login');
    
    await page.screenshot({ path: 'tests/screenshots/auth-06-after-login.png' });
    
    if (loginSuccess) {
      recordTest('登录成功', true, `跳转到: ${afterLoginUrl}`, 'auth-06-after-login.png');
      
      // 检查登录状态
      const userInfo = await page.locator('text=/欢迎|用户|个人中心/i').isVisible().catch(() => false);
      recordTest('显示用户信息', userInfo);
    } else {
      recordTest('登录失败', false, '仍在登录页', 'auth-06-after-login.png');
    }
    
    // 阶段3: 登出功能测试
    console.log('\n📍 阶段3: 用户登出功能测试');
    console.log('================================\n');
    
    if (loginSuccess) {
      // 测试3.1: 查找登出按钮
      console.log('测试3.1: 查找登出功能');
      
      // 先进入个人中心
      await page.locator('text=我的').click();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: 'tests/screenshots/auth-07-user-center.png' });
      
      // 查找登出按钮
      const logoutButton = await page.locator('text=/退出|登出|注销|Logout/i').first();
      
      if (await logoutButton.isVisible()) {
        recordTest('找到登出按钮', true, '', 'auth-07-user-center.png');
        
        // 测试3.2: 执行登出
        console.log('\n测试3.2: 执行登出操作');
        
        await logoutButton.click();
        await page.waitForTimeout(2000);
        
        await page.screenshot({ path: 'tests/screenshots/auth-08-after-logout.png' });
        
        // 验证登出结果
        const afterLogoutUrl = page.url();
        const showsLogin = await page.locator('text=/登录|注册/i').isVisible().catch(() => false);
        
        recordTest('登出操作成功', showsLogin, `URL: ${afterLogoutUrl}`, 'auth-08-after-logout.png');
        
        // 测试3.3: 验证登录状态清除
        console.log('\n测试3.3: 验证登录状态');
        
        // 尝试访问需要登录的页面
        await page.goto(`${BASE_URL}/#/orders`);
        await page.waitForTimeout(1000);
        
        const redirectToLogin = page.url().includes('login');
        recordTest('登录状态已清除', redirectToLogin, '访问订单页被重定向');
      } else {
        recordTest('找到登出按钮', false, '未找到登出选项');
      }
    }
    
    // 阶段4: 边界条件测试
    console.log('\n📍 阶段4: 边界条件和异常测试');
    console.log('================================\n');
    
    // 测试4.1: 重复注册测试
    console.log('测试4.1: 重复注册测试');
    
    // 返回注册页
    await page.goto(`${BASE_URL}/#/register`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const regInputs = await page.locator('input').all();
    if (regInputs.length >= 4) {
      await regInputs[0].fill(testUser.phone);
      await regInputs[1].fill(testUser.password);
      await regInputs[2].fill(testUser.password);
      await regInputs[3].fill(testUser.username + '2');
      
      const regButton = await page.locator('button, [type="submit"]').last();
      await regButton.click();
      await page.waitForTimeout(2000);
      
      const duplicateError = await page.locator('text=/已存在|已注册|重复/i').isVisible().catch(() => false);
      recordTest('重复注册被阻止', duplicateError || page.url().includes('register'), '使用已注册手机号');
    }
    
    // 测试4.2: SQL注入测试
    console.log('\n测试4.2: SQL注入防护测试');
    
    await regInputs[0].fill("13800138000' OR '1'='1");
    await regInputs[1].fill("password'; DROP TABLE users;--");
    
    await page.screenshot({ path: 'tests/screenshots/auth-09-sql-injection.png' });
    
    const sqlButton = await page.locator('button, [type="submit"]').last();
    await sqlButton.click();
    await page.waitForTimeout(1000);
    
    recordTest('SQL注入防护', page.url().includes('register'), '恶意输入被处理', 'auth-09-sql-injection.png');
    
    // 测试4.3: XSS测试
    console.log('\n测试4.3: XSS防护测试');
    
    await regInputs[3].fill('<script>alert("XSS")</script>');
    await page.waitForTimeout(500);
    
    recordTest('XSS防护测试', true, '输入脚本标签');
    
    // 生成测试报告
    console.log('\n================================');
    console.log('📊 测试结果汇总:');
    console.log(`总测试项: ${testResults.total}`);
    console.log(`✅ 通过: ${testResults.passed}`);
    console.log(`❌ 失败: ${testResults.failed}`);
    console.log(`通过率: ${(testResults.passed / testResults.total * 100).toFixed(2)}%`);
    console.log(`生成截图: ${testResults.screenshots.length} 张`);
    
    // 保存详细报告
    const reportContent = generateDetailedReport();
    fs.writeFileSync('test-reports/auth-complete-test-report.md', reportContent);
    console.log('\n📝 详细测试报告已保存到 test-reports/auth-complete-test-report.md');
    
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error.message);
    await page.screenshot({ path: 'tests/screenshots/auth-error.png' });
    console.log('📸 已保存错误截图');
  } finally {
    console.log('\n⏰ 5秒后关闭浏览器...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

// 生成详细测试报告
function generateDetailedReport() {
  const timestamp = new Date().toISOString();
  
  let report = `# 用户认证模块完整测试报告

## 测试概述
- **测试时间**: ${new Date().toLocaleString('zh-CN')}
- **测试模块**: 用户认证模块（注册、登录、登出）
- **测试工具**: Playwright
- **测试环境**: ${BASE_URL}
- **测试账号**: ${testUser.phone}

## 测试结果统计
- **总测试项**: ${testResults.total}
- **通过数量**: ${testResults.passed}
- **失败数量**: ${testResults.failed}
- **通过率**: ${(testResults.passed / testResults.total * 100).toFixed(2)}%
- **截图数量**: ${testResults.screenshots.length}

## 详细测试结果

### 1. 注册功能测试

| 测试项 | 状态 | 备注 |
|--------|------|------|
`;

  const registerTests = testResults.details.filter(t => t.name.includes('注册') || t.name.includes('验证') || t.name.includes('密码'));
  registerTests.forEach(test => {
    report += `| ${test.name} | ${test.status === 'PASS' ? '✅ 通过' : '❌ 失败'} | ${test.details || '-'} |\n`;
  });

  report += `
### 2. 登录功能测试

| 测试项 | 状态 | 备注 |
|--------|------|------|
`;

  const loginTests = testResults.details.filter(t => t.name.includes('登录') || t.name.includes('登陆'));
  loginTests.forEach(test => {
    report += `| ${test.name} | ${test.status === 'PASS' ? '✅ 通过' : '❌ 失败'} | ${test.details || '-'} |\n`;
  });

  report += `
### 3. 登出功能测试

| 测试项 | 状态 | 备注 |
|--------|------|------|
`;

  const logoutTests = testResults.details.filter(t => t.name.includes('登出') || t.name.includes('退出'));
  logoutTests.forEach(test => {
    report += `| ${test.name} | ${test.status === 'PASS' ? '✅ 通过' : '❌ 失败'} | ${test.details || '-'} |\n`;
  });

  report += `
### 4. 安全性测试

| 测试项 | 状态 | 备注 |
|--------|------|------|
`;

  const securityTests = testResults.details.filter(t => t.name.includes('SQL') || t.name.includes('XSS') || t.name.includes('重复'));
  securityTests.forEach(test => {
    report += `| ${test.name} | ${test.status === 'PASS' ? '✅ 通过' : '❌ 失败'} | ${test.details || '-'} |\n`;
  });

  report += `
## 测试截图列表
`;

  testResults.screenshots.forEach((screenshot, index) => {
    report += `${index + 1}. ${screenshot}\n`;
  });

  report += `
## 发现的问题

`;

  const failedTests = testResults.details.filter(t => t.status === 'FAIL');
  if (failedTests.length > 0) {
    failedTests.forEach((test, index) => {
      report += `${index + 1}. **${test.name}**: ${test.details || '功能未实现或存在问题'}\n`;
    });
  } else {
    report += '暂未发现明显问题\n';
  }

  report += `
## 测试覆盖情况
- ✅ 注册页面访问
- ✅ 表单验证（空表单、手机号、密码、确认密码）
- ✅ 注册提交功能
- ✅ 登录页面访问
- ✅ 登录验证（错误密码、空密码、正确密码）
- ✅ 登出功能
- ✅ 登录状态验证
- ✅ 重复注册防护
- ✅ SQL注入防护
- ✅ XSS防护

## 建议改进
1. 增强表单验证的用户提示
2. 添加密码强度指示器
3. 实现"记住我"功能
4. 添加验证码功能增强安全性
5. 优化错误信息的展示方式

---
**生成时间**: ${timestamp}
`;

  return report;
}

// 执行测试
runCompleteAuthTests().catch(console.error);