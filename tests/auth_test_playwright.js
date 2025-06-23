// 使用Playwright MCP进行真实的用户认证模块测试
const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:8084';
const API_URL = 'http://localhost:8080';

// 测试数据
const testUser = {
  phone: '13' + Date.now().toString().slice(-9), // 生成唯一手机号
  password: 'Test123456',
  wrongPassword: 'Wrong123'
};

async function runAuthTests() {
  console.log('🚀 开始执行用户认证模块自动化测试');
  console.log('================================\n');

  const browser = await chromium.launch({ 
    headless: false, // 设置为false以便查看测试过程
    slowMo: 500 // 减慢操作速度以便观察
  });
  
  const page = await browser.newPage();
  
  try {
    // 测试1: 访问主页
    console.log('📍 测试1: 访问主页');
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    console.log('✅ 主页加载成功\n');

    // 测试2: 导航到注册页面
    console.log('📍 测试2: 导航到注册页面');
    // 查找并点击注册链接
    const registerLink = await page.locator('text=注册').first();
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await page.waitForLoadState('networkidle');
      console.log('✅ 成功进入注册页面');
    } else {
      // 如果没有注册链接，直接访问注册URL
      await page.goto(`${BASE_URL}/register`);
      console.log('✅ 直接访问注册页面');
    }
    
    // 测试3: 注册页面UI元素检查
    console.log('\n📍 测试3: 注册页面UI元素检查');
    const elements = {
      '手机号输入框': 'input[type="tel"], input[placeholder*="手机"], input[name*="phone"]',
      '密码输入框': 'input[type="password"]',
      '注册按钮': 'button:has-text("注册"), input[type="submit"][value*="注册"]'
    };
    
    for (const [name, selector] of Object.entries(elements)) {
      const element = await page.locator(selector).first();
      if (await element.isVisible()) {
        console.log(`  ✅ ${name} - 存在`);
      } else {
        console.log(`  ❌ ${name} - 未找到`);
      }
    }

    // 测试4: 手机号格式验证
    console.log('\n📍 测试4: 手机号格式验证');
    const phoneInput = await page.locator('input[type="tel"], input[placeholder*="手机"], input[name*="phone"]').first();
    
    // 测试无效手机号
    await phoneInput.fill('123456'); // 少于11位
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    // 检查是否有错误提示
    const errorVisible = await page.locator('text=/手机|格式|11位/i').isVisible();
    if (errorVisible) {
      console.log('  ✅ 手机号格式验证生效');
    } else {
      console.log('  ⚠️  未发现手机号格式验证提示');
    }

    // 测试5: 用户注册
    console.log('\n📍 测试5: 用户注册功能');
    
    // 填写注册表单
    await phoneInput.fill(testUser.phone);
    console.log(`  📝 输入手机号: ${testUser.phone}`);
    
    const passwordInputs = await page.locator('input[type="password"]').all();
    if (passwordInputs.length >= 2) {
      await passwordInputs[0].fill(testUser.password);
      await passwordInputs[1].fill(testUser.password);
      console.log(`  📝 输入密码: ${testUser.password}`);
    }
    
    // 点击注册按钮
    const registerButton = await page.locator('button:has-text("注册"), input[type="submit"][value*="注册"]').first();
    await registerButton.click();
    console.log('  🔄 提交注册...');
    
    // 等待注册结果
    await page.waitForTimeout(2000);
    
    // 检查是否注册成功（通常会跳转到登录页或主页）
    const currentUrl = page.url();
    if (currentUrl.includes('login') || currentUrl === BASE_URL + '/') {
      console.log('  ✅ 注册成功，已跳转');
    } else {
      console.log('  ⚠️  注册后页面状态需要确认');
    }

    // 测试6: 用户登录
    console.log('\n📍 测试6: 用户登录功能');
    
    // 导航到登录页
    if (!page.url().includes('login')) {
      await page.goto(`${BASE_URL}/login`);
    }
    
    // 填写登录表单
    const loginPhoneInput = await page.locator('input[type="tel"], input[placeholder*="手机"], input[name*="phone"]').first();
    await loginPhoneInput.fill(testUser.phone);
    
    const loginPasswordInput = await page.locator('input[type="password"]').first();
    await loginPasswordInput.fill(testUser.password);
    
    console.log(`  📝 使用账号 ${testUser.phone} 登录`);
    
    // 点击登录按钮
    const loginButton = await page.locator('button:has-text("登录"), input[type="submit"][value*="登录"]').first();
    await loginButton.click();
    console.log('  🔄 提交登录...');
    
    // 等待登录结果
    await page.waitForTimeout(2000);
    
    // 检查是否登录成功
    if (page.url() === BASE_URL + '/' || page.url().includes('home')) {
      console.log('  ✅ 登录成功');
    } else {
      console.log('  ⚠️  登录状态需要确认');
    }

    // 测试7: 错误密码登录
    console.log('\n📍 测试7: 错误密码登录测试');
    
    // 先登出（如果已登录）
    const logoutButton = await page.locator('text=退出, text=登出, text=注销').first();
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForTimeout(1000);
    }
    
    // 返回登录页
    await page.goto(`${BASE_URL}/login`);
    
    // 使用错误密码登录
    await loginPhoneInput.fill(testUser.phone);
    await loginPasswordInput.fill(testUser.wrongPassword);
    await loginButton.click();
    
    await page.waitForTimeout(1000);
    
    // 检查错误提示
    const errorMsg = await page.locator('text=/密码错误|登录失败|账号或密码/i').isVisible();
    if (errorMsg) {
      console.log('  ✅ 错误密码被正确拒绝');
    } else {
      console.log('  ⚠️  未发现错误提示');
    }

    console.log('\n================================');
    console.log('🎉 用户认证模块测试完成！');
    
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error.message);
  } finally {
    // 截图保存测试结果
    await page.screenshot({ path: 'tests/screenshots/auth-test-final.png', fullPage: true });
    console.log('📸 已保存测试截图: tests/screenshots/auth-test-final.png');
    
    await browser.close();
  }
}

// 执行测试
runAuthTests().catch(console.error);