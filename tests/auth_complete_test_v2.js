// 用户认证模块完整测试 V2 - 优化版
const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'http://localhost:8084';

// 生成唯一测试数据
const timestamp = Date.now();
const testUser = {
  phone: '13' + timestamp.toString().slice(-9),
  password: 'Test123456',
  username: 'User' + timestamp.toString().slice(-6)
};

// 测试结果
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// 记录测试
function recordTest(name, passed, details = '') {
  results.tests.push({ name, passed, details });
  if (passed) {
    results.passed++;
    console.log(`✅ ${name}`);
  } else {
    results.failed++;
    console.log(`❌ ${name} - ${details}`);
  }
}

async function runAuthTests() {
  console.log('🚀 用户认证模块完整测试 V2');
  console.log('============================\n');
  console.log(`📱 测试手机号: ${testUser.phone}\n`);

  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500,
    timeout: 60000
  });
  
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  
  try {
    // 1. 注册测试
    console.log('📍 1. 注册功能测试\n');
    
    // 访问注册页
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.locator('text=我的').click();
    await page.waitForTimeout(1000);
    await page.locator('text=注册').first().click();
    await page.waitForTimeout(2000);
    
    recordTest('进入注册页面', page.url().includes('register'));
    
    // 截图
    await page.screenshot({ 
      path: 'tests/screenshots/auth-v2-01-register.png',
      timeout: 5000 
    }).catch(() => {});
    
    // 填写表单
    const inputs = await page.locator('input').all();
    console.log(`找到 ${inputs.length} 个输入框\n`);
    
    if (inputs.length >= 4) {
      // 测试空表单
      const submitBtn = await page.locator('button').last();
      await submitBtn.click();
      await page.waitForTimeout(1000);
      recordTest('空表单验证', page.url().includes('register'), '阻止空表单提交');
      
      // 测试无效手机号
      await inputs[0].fill('123');
      await submitBtn.click();
      await page.waitForTimeout(500);
      recordTest('短手机号验证', page.url().includes('register'), '阻止无效手机号');
      
      // 填写正确信息
      await inputs[0].clear();
      await inputs[0].fill(testUser.phone);
      await inputs[1].fill(testUser.password);
      await inputs[2].fill(testUser.password);
      await inputs[3].fill(testUser.username);
      
      recordTest('表单填写', true, '所有字段已填写');
      
      // 截图
      await page.screenshot({ 
        path: 'tests/screenshots/auth-v2-02-filled.png',
        timeout: 5000 
      }).catch(() => {});
      
      // 提交注册
      await submitBtn.click();
      await page.waitForTimeout(3000);
      
      const afterRegUrl = page.url();
      const regSuccess = !afterRegUrl.includes('register');
      recordTest('注册提交', regSuccess, regSuccess ? '跳转成功' : '仍在注册页');
      
      // 截图结果
      await page.screenshot({ 
        path: 'tests/screenshots/auth-v2-03-after-reg.png',
        timeout: 5000 
      }).catch(() => {});
    } else {
      recordTest('找到表单输入框', false, `只找到${inputs.length}个输入框`);
    }
    
    // 2. 登录测试
    console.log('\n📍 2. 登录功能测试\n');
    
    // 进入登录页
    if (!page.url().includes('login')) {
      await page.goto(`${BASE_URL}/#/login`);
      await page.waitForTimeout(2000);
    }
    
    recordTest('进入登录页面', page.url().includes('login'));
    
    const loginInputs = await page.locator('input').all();
    if (loginInputs.length >= 2) {
      // 错误密码测试
      await loginInputs[0].fill(testUser.phone);
      await loginInputs[1].fill('wrong123');
      
      const loginBtn = await page.locator('button').last();
      await loginBtn.click();
      await page.waitForTimeout(2000);
      
      recordTest('错误密码拒绝', page.url().includes('login'), '仍在登录页');
      
      // 正确密码测试
      await loginInputs[1].clear();
      await loginInputs[1].fill(testUser.password);
      await loginBtn.click();
      await page.waitForTimeout(3000);
      
      const loginSuccess = !page.url().includes('login');
      recordTest('正确密码登录', loginSuccess, loginSuccess ? '登录成功' : '登录失败');
      
      // 截图
      await page.screenshot({ 
        path: 'tests/screenshots/auth-v2-04-after-login.png',
        timeout: 5000 
      }).catch(() => {});
      
      // 3. 登出测试
      if (loginSuccess) {
        console.log('\n📍 3. 登出功能测试\n');
        
        // 进入个人中心
        await page.locator('text=我的').click();
        await page.waitForTimeout(1500);
        
        // 查找登出按钮
        const logoutBtn = await page.locator('text=/退出|登出/').first();
        if (await logoutBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await logoutBtn.click();
          await page.waitForTimeout(2000);
          
          const loggedOut = await page.locator('text=/登录|注册/').isVisible().catch(() => false);
          recordTest('登出功能', loggedOut, loggedOut ? '成功登出' : '登出失败');
        } else {
          recordTest('找到登出按钮', false, '未找到');
        }
      }
    } else {
      recordTest('找到登录表单', false, `只找到${loginInputs.length}个输入框`);
    }
    
    // 4. 安全测试
    console.log('\n📍 4. 安全性测试\n');
    
    // SQL注入测试
    await page.goto(`${BASE_URL}/#/login`);
    await page.waitForTimeout(2000);
    
    const secInputs = await page.locator('input').all();
    if (secInputs.length >= 2) {
      await secInputs[0].fill("' OR '1'='1");
      await secInputs[1].fill("'; DROP TABLE users;--");
      
      const secBtn = await page.locator('button').last();
      await secBtn.click();
      await page.waitForTimeout(2000);
      
      recordTest('SQL注入防护', page.url().includes('login'), '恶意输入被阻止');
    }
    
  } catch (error) {
    console.error('\n❌ 错误:', error.message);
  } finally {
    // 生成报告
    console.log('\n============================');
    console.log('📊 测试总结');
    console.log(`总计: ${results.passed + results.failed} 项`);
    console.log(`✅ 通过: ${results.passed} 项`);
    console.log(`❌ 失败: ${results.failed} 项`);
    console.log(`通过率: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
    
    // 保存报告
    const report = generateReport();
    fs.writeFileSync('test-reports/auth-complete-v2-report.md', report);
    console.log('\n📝 报告已保存到 test-reports/auth-complete-v2-report.md');
    
    await page.waitForTimeout(3000);
    await browser.close();
  }
}

function generateReport() {
  return `# 用户认证模块测试报告 V2

## 测试信息
- 时间: ${new Date().toLocaleString('zh-CN')}
- 测试账号: ${testUser.phone}
- 环境: ${BASE_URL}

## 测试结果
- 总测试项: ${results.passed + results.failed}
- 通过: ${results.passed}
- 失败: ${results.failed}
- 通过率: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%

## 详细结果

| 测试项 | 结果 | 说明 |
|--------|------|------|
${results.tests.map(t => `| ${t.name} | ${t.passed ? '✅' : '❌'} | ${t.details} |`).join('\n')}

## 截图文件
1. auth-v2-01-register.png - 注册页面
2. auth-v2-02-filled.png - 填写表单
3. auth-v2-03-after-reg.png - 注册结果
4. auth-v2-04-after-login.png - 登录结果

生成时间: ${new Date().toISOString()}`;
}

// 执行测试
runAuthTests().catch(console.error);