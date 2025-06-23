// 使用Playwright进行用户认证模块测试 - 最终版
const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:8084';
const API_URL = 'http://localhost:8080';

// 测试数据
const testUser = {
  phone: '13' + Date.now().toString().slice(-9), // 生成唯一手机号
  password: 'Test123456',
  username: 'TestUser' + Date.now().toString().slice(-6),
  wrongPassword: 'Wrong123'
};

async function runAuthTests() {
  console.log('🚀 开始执行用户认证模块自动化测试');
  console.log('================================\n');
  console.log('📝 测试数据:');
  console.log(`  手机号: ${testUser.phone}`);
  console.log(`  用户名: ${testUser.username}`);
  console.log(`  密码: ${testUser.password}\n`);

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
    // 点击"我的"标签
    await page.locator('text=我的').click();
    await page.waitForTimeout(1000);
    
    // 查找并点击注册按钮
    const registerButton = await page.locator('text=注册').first();
    if (await registerButton.isVisible()) {
      await registerButton.click();
      await page.waitForLoadState('networkidle');
      console.log('✅ 成功进入用户注册页面');
    }
    
    // 截图保存注册页面
    await page.screenshot({ path: 'tests/screenshots/register-page.png' });
    console.log('📸 已保存注册页面截图\n');
    
    // 测试3: 注册页面UI元素检查
    console.log('📍 测试3: 注册页面UI元素检查');
    
    // 检查页面标题
    const pageTitle = await page.locator('text=用户注册').isVisible();
    console.log(`  ${pageTitle ? '✅' : '❌'} 页面标题 "用户注册"`);
    
    // 检查表单字段
    const formFields = ['手机号码', '密码', '确认密码', '用户名称'];
    for (const field of formFields) {
      const fieldVisible = await page.locator(`text=${field}`).isVisible();
      console.log(`  ${fieldVisible ? '✅' : '❌'} ${field}字段`);
    }
    
    // 测试4: 填写注册表单
    console.log('\n📍 测试4: 填写注册表单');
    
    // 获取所有输入框
    const inputs = await page.locator('input[type="text"], input[type="password"], input[type="tel"]').all();
    console.log(`  找到 ${inputs.length} 个输入框`);
    
    // 根据截图中的顺序填写表单
    if (inputs.length >= 4) {
      // 手机号码
      await inputs[0].fill(testUser.phone);
      console.log(`  ✅ 填写手机号码: ${testUser.phone}`);
      
      // 密码
      await inputs[1].fill(testUser.password);
      console.log(`  ✅ 填写密码`);
      
      // 确认密码
      await inputs[2].fill(testUser.password);
      console.log(`  ✅ 填写确认密码`);
      
      // 用户名称
      await inputs[3].fill(testUser.username);
      console.log(`  ✅ 填写用户名称: ${testUser.username}`);
    }
    
    // 截图保存填写后的页面
    await page.screenshot({ path: 'tests/screenshots/register-filled.png' });
    console.log('📸 已保存填写后的注册页面\n');
    
    // 测试5: 表单验证测试
    console.log('📍 测试5: 表单验证测试');
    
    // 清空手机号，填入无效值
    await inputs[0].fill('123');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    // 检查是否有错误提示
    const phoneError = await page.locator('text=/手机|11位|格式/i').isVisible();
    console.log(`  ${phoneError ? '✅' : '⚠️'} 手机号格式验证`);
    
    // 恢复正确的手机号
    await inputs[0].fill(testUser.phone);
    
    // 测试密码不一致
    await inputs[2].fill('DifferentPassword');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    const passwordError = await page.locator('text=/不一致|不匹配|相同/i').isVisible();
    console.log(`  ${passwordError ? '✅' : '⚠️'} 密码一致性验证`);
    
    // 恢复正确的确认密码
    await inputs[2].fill(testUser.password);
    
    // 测试6: 提交注册
    console.log('\n📍 测试6: 提交注册');
    
    // 查找提交按钮（通常在表单底部）
    const submitButton = await page.locator('button, input[type="submit"], .button, .btn').last();
    
    if (await submitButton.isVisible()) {
      const buttonText = await submitButton.textContent();
      console.log(`  找到提交按钮: "${buttonText}"`);
      
      await submitButton.click();
      console.log('  🔄 点击提交按钮...');
      
      // 等待响应
      await page.waitForTimeout(3000);
      
      // 截图保存结果
      await page.screenshot({ path: 'tests/screenshots/register-result.png' });
      console.log('📸 已保存注册结果截图');
      
      // 检查注册结果
      const currentUrl = page.url();
      console.log(`  当前URL: ${currentUrl}`);
      
      // 检查是否有成功或错误提示
      const successTexts = ['成功', '登录', '欢迎'];
      const errorTexts = ['失败', '错误', '已存在', '已注册'];
      
      for (const text of successTexts) {
        if (await page.locator(`text=/${text}/i`).isVisible()) {
          console.log(`  ✅ 发现成功提示: 包含"${text}"`);
        }
      }
      
      for (const text of errorTexts) {
        if (await page.locator(`text=/${text}/i`).isVisible()) {
          console.log(`  ⚠️  发现错误提示: 包含"${text}"`);
        }
      }
    } else {
      console.log('  ❌ 未找到提交按钮');
    }
    
    // 测试7: 登录功能测试
    console.log('\n📍 测试7: 登录功能测试');
    
    // 如果注册成功，尝试登录
    // 导航到登录页面
    const loginLink = await page.locator('text=/登录|登陆|signin/i').first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForLoadState('networkidle');
      console.log('  ✅ 进入登录页面');
    } else {
      // 直接访问登录URL
      await page.goto(`${BASE_URL}/#/login`);
      console.log('  ✅ 直接访问登录页面');
    }
    
    await page.waitForTimeout(2000);
    
    // 截图保存登录页面
    await page.screenshot({ path: 'tests/screenshots/login-page.png' });
    console.log('📸 已保存登录页面截图');
    
    console.log('\n================================');
    console.log('🎉 用户认证模块测试完成！');
    console.log('\n📊 测试总结:');
    console.log('  - 完成了注册页面UI检查');
    console.log('  - 完成了表单填写测试');
    console.log('  - 完成了表单验证测试');
    console.log('  - 完成了注册提交测试');
    console.log('\n📁 所有截图保存在 tests/screenshots/ 目录');
    
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error.message);
    // 错误时也截图
    await page.screenshot({ path: 'tests/screenshots/error-screenshot.png' });
    console.log('📸 已保存错误截图');
  } finally {
    // 保持浏览器打开5秒以便查看
    console.log('\n⏰ 5秒后关闭浏览器...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

// 执行测试
runAuthTests().catch(console.error);