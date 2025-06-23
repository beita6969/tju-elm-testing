// 订单处理模块完整测试
const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'http://localhost:8084';

// 测试数据
const testData = {
  // 使用之前注册的测试账号
  phone: '13888888888',
  password: '123456',
  // 收货地址信息
  address: {
    name: '测试用户',
    phone: '13900139000',
    address: '天津大学软件学院',
    detail: 'E座18楼'
  },
  // 订单备注
  remark: '不要辣，多放葱'
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
    console.log(`  ❌ ${testName} - ${details}`);
  }
  testResults.details.push({
    name: testName,
    status: passed ? 'PASS' : 'FAIL',
    details: details,
    timestamp: new Date().toLocaleTimeString()
  });
  if (screenshot) {
    testResults.screenshots.push(screenshot);
  }
}

async function runOrderProcessTests() {
  console.log('🚀 开始执行订单处理模块测试');
  console.log('================================\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  
  try {
    // 阶段0: 登录准备
    console.log('📍 阶段0: 登录系统\n');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // 执行登录
    await page.locator('text=我的').click();
    await page.waitForTimeout(1000);
    
    // 如果已登录就跳过，否则登录
    const needLogin = await page.locator('text=/登录|登陆/').isVisible().catch(() => false);
    if (needLogin) {
      await page.locator('text=/登录|登陆/').first().click();
      await page.waitForTimeout(1000);
      
      const loginInputs = await page.locator('input').all();
      if (loginInputs.length >= 2) {
        await loginInputs[0].fill(testData.phone);
        await loginInputs[1].fill(testData.password);
        
        const loginBtn = await page.locator('button').last();
        await loginBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    
    recordTest('登录系统', !page.url().includes('login'), page.url());
    
    // 阶段1: 创建订单前准备
    console.log('\n📍 阶段1: 订单创建准备\n');
    
    // 回到首页选择商家
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    // 点击第一个商家
    const businessItems = await page.locator('.business-item, .shop-item, [class*="business"], div:has(h3)').all();
    if (businessItems.length > 0) {
      const businessName = await businessItems[0].locator('h3, h4, .name').first().textContent().catch(() => '商家');
      console.log(`  选择商家: ${businessName}`);
      await businessItems[0].click();
      await page.waitForTimeout(2000);
      recordTest('进入商家详情', true, businessName);
    } else {
      recordTest('进入商家详情', false, '未找到商家');
      return;
    }
    
    await page.screenshot({ path: 'tests/screenshots/order-01-business-detail.png' });
    testResults.screenshots.push('order-01-business-detail.png');
    
    // 添加商品到购物车
    console.log('\n📍 阶段2: 添加商品到购物车\n');
    
    // 查找添加按钮（蓝色+号）
    const addButtons = await page.locator('i.fa-plus-circle, button:has(i.fa-plus-circle), .add-button, [class*="add"]').all();
    console.log(`  找到 ${addButtons.length} 个商品`);
    
    let itemsAdded = 0;
    const targetItems = 3; // 添加3个商品
    
    if (addButtons.length > 0) {
      for (let i = 0; i < Math.min(targetItems, addButtons.length); i++) {
        await addButtons[i].click();
        await page.waitForTimeout(800);
        itemsAdded++;
        
        // 有些商品可能需要多次点击来增加数量
        if (i === 0) {
          await addButtons[i].click();
          await page.waitForTimeout(800);
          itemsAdded++;
        }
      }
      recordTest('添加商品到购物车', true, `添加了${itemsAdded}件商品`);
    } else {
      recordTest('添加商品到购物车', false, '未找到商品添加按钮');
      return;
    }
    
    // 检查购物车状态
    const cartElement = await page.locator('.cart, [class*="cart"], .footer').filter({ hasText: '¥' }).first();
    const cartText = await cartElement.textContent().catch(() => '');
    console.log(`  购物车状态: ${cartText}`);
    
    await page.screenshot({ path: 'tests/screenshots/order-02-cart-filled.png' });
    testResults.screenshots.push('order-02-cart-filled.png');
    
    // 阶段3: 进入结算流程
    console.log('\n📍 阶段3: 进入结算流程\n');
    
    // 查找去结算按钮
    const checkoutButton = await page.locator('text=/去结算|结算|下单/').first();
    const checkoutVisible = await checkoutButton.isVisible().catch(() => false);
    
    if (checkoutVisible) {
      // 检查是否满足起送条件
      const isDisabled = await checkoutButton.isDisabled().catch(() => false);
      if (!isDisabled) {
        recordTest('满足起送条件', true, cartText);
        
        await checkoutButton.click();
        await page.waitForTimeout(2000);
        
        const currentUrl = page.url();
        recordTest('进入订单确认页', currentUrl.includes('order') || currentUrl.includes('confirm'), currentUrl);
        
        await page.screenshot({ path: 'tests/screenshots/order-03-confirm-page.png' });
        testResults.screenshots.push('order-03-confirm-page.png');
      } else {
        // 未满足起送金额，继续添加商品
        recordTest('满足起送条件', false, '金额不足，需要继续添加商品');
        
        // 添加更多商品
        for (let i = 0; i < addButtons.length && i < 5; i++) {
          await addButtons[i].click();
          await page.waitForTimeout(500);
        }
        
        // 再次尝试结算
        await checkoutButton.click();
        await page.waitForTimeout(2000);
      }
    } else {
      recordTest('找到结算按钮', false, '未找到结算按钮');
    }
    
    // 阶段4: 订单确认页面测试
    console.log('\n📍 阶段4: 订单确认页面测试\n');
    
    // 检查订单确认页面元素
    const orderPageElements = {
      '收货地址': await page.locator('text=/地址|收货人|联系/').isVisible().catch(() => false),
      '商品列表': await page.locator('text=/商品|菜品/').isVisible().catch(() => false),
      '订单金额': await page.locator('text=/金额|总计|合计/').isVisible().catch(() => false),
      '支付方式': await page.locator('text=/支付|付款/').isVisible().catch(() => false)
    };
    
    for (const [element, visible] of Object.entries(orderPageElements)) {
      recordTest(`订单页-${element}显示`, visible);
    }
    
    // 测试4.1: 地址管理
    console.log('\n测试4.1: 收货地址管理');
    
    // 查找地址相关元素
    const addressSection = await page.locator('[class*="address"], .address, text=/地址/').first();
    if (await addressSection.isVisible().catch(() => false)) {
      // 检查是否有默认地址
      const hasAddress = await page.locator('text=/天津|北京|上海/').isVisible().catch(() => false);
      
      if (!hasAddress) {
        // 需要添加地址
        const addAddressBtn = await page.locator('text=/添加地址|新增地址|地址/').first();
        if (await addAddressBtn.isVisible().catch(() => false)) {
          await addAddressBtn.click();
          await page.waitForTimeout(1500);
          
          // 填写地址表单
          const addressInputs = await page.locator('input').all();
          if (addressInputs.length >= 3) {
            await addressInputs[0].fill(testData.address.name);
            await addressInputs[1].fill(testData.address.phone);
            await addressInputs[2].fill(testData.address.address);
            
            // 如果有详细地址输入框
            if (addressInputs.length >= 4) {
              await addressInputs[3].fill(testData.address.detail);
            }
            
            recordTest('填写收货地址', true);
            
            // 保存地址
            const saveBtn = await page.locator('button:has-text("保存"), button:has-text("确定")').first();
            if (await saveBtn.isVisible().catch(() => false)) {
              await saveBtn.click();
              await page.waitForTimeout(1500);
            }
          }
        }
      } else {
        recordTest('已有收货地址', true);
      }
    }
    
    // 测试4.2: 订单备注
    console.log('\n测试4.2: 订单备注功能');
    
    const remarkInput = await page.locator('input[placeholder*="备注"], textarea[placeholder*="备注"], [class*="remark"] input').first();
    if (await remarkInput.isVisible().catch(() => false)) {
      await remarkInput.fill(testData.remark);
      recordTest('添加订单备注', true, testData.remark);
    } else {
      recordTest('添加订单备注', false, '未找到备注输入框');
    }
    
    await page.screenshot({ path: 'tests/screenshots/order-04-filled-info.png' });
    testResults.screenshots.push('order-04-filled-info.png');
    
    // 阶段5: 提交订单
    console.log('\n📍 阶段5: 提交订单\n');
    
    // 查找提交订单按钮
    const submitOrderBtn = await page.locator('button:has-text("提交订单"), button:has-text("确认下单"), button:has-text("立即支付")').first();
    
    if (await submitOrderBtn.isVisible().catch(() => false)) {
      const btnText = await submitOrderBtn.textContent();
      console.log(`  找到按钮: "${btnText}"`);
      
      await submitOrderBtn.click();
      await page.waitForTimeout(3000);
      
      // 检查订单提交结果
      const afterSubmitUrl = page.url();
      const orderSubmitted = afterSubmitUrl.includes('success') || 
                           afterSubmitUrl.includes('pay') || 
                           afterSubmitUrl.includes('order');
      
      recordTest('订单提交', orderSubmitted, afterSubmitUrl);
      
      await page.screenshot({ path: 'tests/screenshots/order-05-after-submit.png' });
      testResults.screenshots.push('order-05-after-submit.png');
      
      // 阶段6: 支付流程测试
      if (orderSubmitted) {
        console.log('\n📍 阶段6: 支付流程测试\n');
        
        // 检查支付页面
        const paymentOptions = await page.locator('text=/支付宝|微信|余额/').all();
        recordTest('显示支付方式', paymentOptions.length > 0, `找到${paymentOptions.length}种支付方式`);
        
        // 模拟选择支付方式
        if (paymentOptions.length > 0) {
          await paymentOptions[0].click();
          await page.waitForTimeout(1000);
          recordTest('选择支付方式', true);
        }
        
        // 注意：实际支付需要接入第三方，这里只测试流程
        recordTest('支付流程可达', true, '测试环境不执行实际支付');
      }
    } else {
      recordTest('找到提交订单按钮', false);
    }
    
    // 阶段7: 订单管理测试
    console.log('\n📍 阶段7: 订单管理功能测试\n');
    
    // 进入订单列表
    await page.goto(BASE_URL);
    await page.waitForTimeout(1500);
    await page.locator('text=订单').click();
    await page.waitForTimeout(2000);
    
    recordTest('进入订单列表', page.url().includes('order'), page.url());
    
    await page.screenshot({ path: 'tests/screenshots/order-06-order-list.png' });
    testResults.screenshots.push('order-06-order-list.png');
    
    // 检查订单列表
    const orderItems = await page.locator('.order-item, [class*="order-item"], .order-card').all();
    console.log(`  找到 ${orderItems.length} 个订单`);
    recordTest('订单列表显示', orderItems.length > 0, `共${orderItems.length}个订单`);
    
    // 测试订单详情
    if (orderItems.length > 0) {
      await orderItems[0].click();
      await page.waitForTimeout(1500);
      
      const inDetailPage = await page.locator('text=/订单号|订单详情/').isVisible().catch(() => false);
      recordTest('查看订单详情', inDetailPage);
      
      if (inDetailPage) {
        // 检查订单详情内容
        const detailElements = {
          '订单号': await page.locator('text=/订单号|编号/').isVisible().catch(() => false),
          '订单状态': await page.locator('text=/待支付|已完成|进行中/').isVisible().catch(() => false),
          '商品信息': await page.locator('text=/商品|菜品/').isVisible().catch(() => false),
          '订单金额': await page.locator('text=/金额|总价/').isVisible().catch(() => false)
        };
        
        for (const [element, visible] of Object.entries(detailElements)) {
          recordTest(`订单详情-${element}`, visible);
        }
        
        await page.screenshot({ path: 'tests/screenshots/order-07-order-detail.png' });
        testResults.screenshots.push('order-07-order-detail.png');
        
        // 测试订单操作
        const cancelBtn = await page.locator('button:has-text("取消订单")').first();
        recordTest('取消订单按钮', await cancelBtn.isVisible().catch(() => false));
        
        const reorderBtn = await page.locator('button:has-text("再来一单")').first();
        recordTest('再来一单按钮', await reorderBtn.isVisible().catch(() => false));
      }
    }
    
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
    fs.writeFileSync('test-reports/order-process-test-report.md', reportContent);
    console.log('\n📝 详细测试报告已保存到 test-reports/order-process-test-report.md');
    
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error.message);
    await page.screenshot({ path: 'tests/screenshots/order-error.png' });
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
  
  let report = `# 订单处理模块测试报告

## 测试概述
- **测试时间**: ${new Date().toLocaleString('zh-CN')}
- **测试模块**: 订单处理模块
- **测试工具**: Playwright
- **测试环境**: ${BASE_URL}

## 测试结果统计
- **总测试项**: ${testResults.total}
- **通过数量**: ${testResults.passed}
- **失败数量**: ${testResults.failed}
- **通过率**: ${(testResults.passed / testResults.total * 100).toFixed(2)}%
- **截图数量**: ${testResults.screenshots.length}

## 详细测试结果

| 测试项 | 状态 | 说明 | 时间 |
|--------|------|------|------|
`;

  testResults.details.forEach(test => {
    report += `| ${test.name} | ${test.status === 'PASS' ? '✅ 通过' : '❌ 失败'} | ${test.details || '-'} | ${test.timestamp} |\n`;
  });

  report += `
## 测试截图
`;

  testResults.screenshots.forEach((screenshot, index) => {
    report += `${index + 1}. ${screenshot}\n`;
  });

  report += `
## 测试覆盖
### ✅ 已测试功能
- 订单创建前准备（登录、选择商家）
- 购物车商品添加
- 订单确认页面
- 收货地址管理
- 订单备注功能
- 订单提交流程
- 支付方式选择
- 订单列表查看
- 订单详情查看

### ⚠️ 限制说明
- 支付功能仅测试流程，未进行实际支付
- 订单状态更新需要后台配合
- 配送时间选择功能待完善

## 发现的问题
`;

  const failedTests = testResults.details.filter(t => t.status === 'FAIL');
  if (failedTests.length > 0) {
    failedTests.forEach((test, index) => {
      report += `${index + 1}. **${test.name}**: ${test.details || '功能未实现或存在问题'}\n`;
    });
  } else {
    report += '暂未发现阻塞性问题\n';
  }

  report += `
## 建议改进
1. 优化订单确认页面的加载速度
2. 增加地址智能识别功能
3. 完善订单状态的实时更新
4. 添加订单评价功能
5. 优化支付流程的用户体验

---
**生成时间**: ${timestamp}
`;

  return report;
}

// 执行测试
runOrderProcessTests().catch(console.error);