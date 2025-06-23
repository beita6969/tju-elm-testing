// 使用Playwright进行用户认证模块测试 - 更新版
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
    // 点击"我的"标签
    await page.locator('text=我的').click();
    await page.waitForTimeout(1000);
    
    // 查找并点击注册按钮
    const registerButton = await page.locator('text=注册').first();
    if (await registerButton.isVisible()) {
      await registerButton.click();
      await page.waitForLoadState('networkidle');
      console.log('✅ 成功进入注册选择页面');
    }
    
    // 截图保存注册选择页面
    await page.screenshot({ path: 'tests/screenshots/register-choice.png' });
    console.log('📸 已保存注册选择页面截图\n');
    
    // 测试3: 选择个人注册
    console.log('📍 测试3: 选择个人注册');
    await page.locator('text=个人注册').click();
    await page.waitForLoadState('networkidle');
    console.log('✅ 进入个人注册页面');
    
    // 等待页面加载
    await page.waitForTimeout(2000);
    
    // 截图保存个人注册页面
    await page.screenshot({ path: 'tests/screenshots/personal-register.png' });
    console.log('📸 已保存个人注册页面截图\n');
    
    // 测试4: 注册页面UI元素检查
    console.log('📍 测试4: 个人注册页面UI元素检查');
    
    // 尝试多种可能的选择器
    const possibleSelectors = {
      '手机号输入框': [
        'input[type="tel"]',
        'input[placeholder*="手机"]',
        'input[name*="phone"]',
        'input[placeholder*="请输入"]',
        'input[type="text"]'
      ],
      '密码输入框': [
        'input[type="password"]',
        'input[placeholder*="密码"]'
      ],
      '注册按钮': [
        'button:has-text("注册")',
        'button:has-text("确定")',
        'button:has-text("提交")',
        'input[type="submit"]'
      ]
    };
    
    for (const [elementName, selectors] of Object.entries(possibleSelectors)) {
      let found = false;
      for (const selector of selectors) {
        try {
          const element = await page.locator(selector).first();
          if (await element.isVisible({ timeout: 1000 })) {
            console.log(`  ✅ ${elementName} - 找到 (${selector})`);
            found = true;
            break;
          }
        } catch (e) {
          // 继续尝试下一个选择器
        }
      }
      if (!found) {
        console.log(`  ❌ ${elementName} - 未找到`);
      }
    }
    
    // 测试5: 尝试填写注册信息
    console.log('\n📍 测试5: 填写注册信息');
    
    // 查找所有输入框
    const allInputs = await page.locator('input').all();
    console.log(`  找到 ${allInputs.length} 个输入框`);
    
    if (allInputs.length >= 2) {
      // 假设第一个是手机号，第二个是密码
      await allInputs[0].fill(testUser.phone);
      console.log(`  📝 在第一个输入框填入: ${testUser.phone}`);
      
      await allInputs[1].fill(testUser.password);
      console.log(`  📝 在第二个输入框填入密码`);
      
      if (allInputs.length >= 3) {
        // 可能有确认密码框
        await allInputs[2].fill(testUser.password);
        console.log(`  📝 在第三个输入框填入确认密码`);
      }
    }
    
    // 截图保存填写后的页面
    await page.screenshot({ path: 'tests/screenshots/register-filled.png' });
    console.log('📸 已保存填写后的注册页面\n');
    
    // 测试6: 提交注册
    console.log('📍 测试6: 提交注册');
    
    // 查找提交按钮
    const submitButtons = [
      'button:has-text("注册")',
      'button:has-text("确定")',
      'button:has-text("提交")',
      'button[type="submit"]',
      'button'  // 最后尝试所有按钮
    ];
    
    let submitClicked = false;
    for (const selector of submitButtons) {
      try {
        const button = await page.locator(selector).last(); // 使用last()以防有多个按钮
        if (await button.isVisible({ timeout: 1000 })) {
          await button.click();
          console.log(`  🔄 点击了提交按钮 (${selector})`);
          submitClicked = true;
          break;
        }
      } catch (e) {
        // 继续尝试下一个
      }
    }
    
    if (!submitClicked) {
      console.log('  ⚠️  未找到提交按钮');
    }
    
    // 等待注册结果
    await page.waitForTimeout(3000);
    
    // 截图保存注册结果
    await page.screenshot({ path: 'tests/screenshots/register-result.png' });
    console.log('📸 已保存注册结果截图');
    
    // 检查是否注册成功
    const currentUrl = page.url();
    console.log(`  当前URL: ${currentUrl}`);
    
    if (currentUrl.includes('login') || currentUrl === BASE_URL + '/') {
      console.log('  ✅ 可能注册成功，页面已跳转');
    } else {
      // 检查是否有错误提示
      const errorTexts = ['已存在', '错误', '失败', '请输入'];
      for (const errorText of errorTexts) {
        if (await page.locator(`text=${errorText}`).isVisible()) {
          console.log(`  ⚠️  发现提示信息: ${errorText}`);
        }
      }
    }
    
    console.log('\n================================');
    console.log('🎉 测试执行完成！');
    console.log('📁 所有截图保存在 tests/screenshots/ 目录');
    
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error.message);
    // 错误时也截图
    await page.screenshot({ path: 'tests/screenshots/error-screenshot.png' });
    console.log('📸 已保存错误截图');
  } finally {
    await browser.close();
  }
}

// 执行测试
runAuthTests().catch(console.error);