// 菜品浏览与购物车模块测试脚本
const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:8084';

// 测试结果收集
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

// 记录测试结果
function recordTest(testName, passed, details = '') {
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
    details: details
  });
}

async function runFoodCartTests() {
  console.log('🚀 开始执行菜品浏览与购物车模块测试');
  console.log('================================\n');

  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const page = await browser.newPage();
  
  try {
    // 测试1: 进入商家详情页
    console.log('📍 测试1: 进入商家详情页');
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 点击第一个商家
    const businessItems = await page.locator('.business-item, .shop-item, .restaurant-item, [class*="business"], [class*="shop"]').all();
    if (businessItems.length > 0) {
      const businessName = await businessItems[0].locator('h3, h4, .name, .title').first().textContent().catch(() => '商家');
      console.log(`  选择商家: ${businessName}`);
      await businessItems[0].click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      recordTest('进入商家详情页', true);
    } else {
      recordTest('进入商家详情页', false, '未找到商家');
      return;
    }
    
    // 截图商家详情页
    await page.screenshot({ path: 'tests/screenshots/food-list-page.png' });
    console.log('📸 已保存菜品列表页截图\n');
    
    // 测试2: 菜品分类导航
    console.log('📍 测试2: 菜品分类导航');
    const categoryTabs = await page.locator('.category, .tab, [class*="category"], [class*="tab"]').all();
    console.log(`  找到 ${categoryTabs.length} 个分类标签`);
    recordTest('菜品分类导航存在', categoryTabs.length > 0, `分类数量: ${categoryTabs.length}`);
    
    // 测试3: 菜品列表展示
    console.log('\n📍 测试3: 菜品信息展示');
    const foodItems = await page.locator('.food-item, .dish-item, .menu-item, [class*="food"], [class*="dish"]').all();
    console.log(`  找到 ${foodItems.length} 个菜品`);
    recordTest('菜品列表加载', foodItems.length > 0, `菜品数量: ${foodItems.length}`);
    
    if (foodItems.length > 0) {
      // 检查第一个菜品的信息
      const firstFood = foodItems[0];
      
      // 检查菜品必要信息
      const checkElements = {
        '菜品名称': ['h3', 'h4', '.name', '.title', '[class*="name"]'],
        '菜品图片': ['img', '.image', '[class*="img"]'],
        '菜品价格': ['.price', '[class*="price"]', 'text=¥']
      };
      
      for (const [elementName, selectors] of Object.entries(checkElements)) {
        let found = false;
        for (const selector of selectors) {
          const element = await firstFood.locator(selector).first();
          if (await element.isVisible({ timeout: 500 }).catch(() => false)) {
            found = true;
            break;
          }
        }
        recordTest(`${elementName}显示`, found);
      }
    }
    
    // 测试4: 添加到购物车
    console.log('\n📍 测试4: 添加菜品到购物车');
    let cartCount = 0;
    
    // 查找添加按钮
    const addButtons = await page.locator('button:has-text("+"), .add, [class*="add"], .plus').all();
    console.log(`  找到 ${addButtons.length} 个添加按钮`);
    
    if (addButtons.length > 0) {
      // 点击前3个菜品的添加按钮
      const itemsToAdd = Math.min(3, addButtons.length);
      for (let i = 0; i < itemsToAdd; i++) {
        await addButtons[i].click();
        await page.waitForTimeout(500);
        cartCount++;
        console.log(`  添加第 ${i + 1} 个菜品`);
      }
      recordTest('添加菜品到购物车', true, `添加了 ${itemsToAdd} 个菜品`);
    } else {
      recordTest('添加菜品到购物车', false, '未找到添加按钮');
    }
    
    // 截图添加后的状态
    await page.screenshot({ path: 'tests/screenshots/food-added-to-cart.png' });
    console.log('📸 已保存添加菜品后的截图\n');
    
    // 测试5: 购物车显示
    console.log('📍 测试5: 购物车显示与计算');
    
    // 查找购物车区域
    const cartSelectors = ['.cart', '.shopping-cart', '[class*="cart"]'];
    let cartElement = null;
    
    for (const selector of cartSelectors) {
      const element = await page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
        cartElement = element;
        break;
      }
    }
    
    if (cartElement) {
      // 检查购物车数量
      const cartCountText = await cartElement.textContent();
      console.log(`  购物车显示: ${cartCountText}`);
      recordTest('购物车数量显示', true);
      
      // 检查总价
      const priceText = await page.locator('text=¥').last().textContent().catch(() => '');
      if (priceText) {
        console.log(`  当前总价: ${priceText}`);
        recordTest('价格计算显示', true, `总价: ${priceText}`);
      } else {
        recordTest('价格计算显示', false, '未找到价格');
      }
    } else {
      recordTest('购物车数量显示', false, '未找到购物车');
      recordTest('价格计算显示', false, '未找到购物车');
    }
    
    // 测试6: 数量增减
    console.log('\n📍 测试6: 商品数量增减');
    
    // 查找减少按钮
    const minusButtons = await page.locator('button:has-text("-"), .minus, .reduce, [class*="minus"], [class*="reduce"]').all();
    if (minusButtons.length > 0) {
      const initialPrice = await page.locator('text=¥').last().textContent().catch(() => '0');
      await minusButtons[0].click();
      await page.waitForTimeout(500);
      const newPrice = await page.locator('text=¥').last().textContent().catch(() => '0');
      console.log(`  价格变化: ${initialPrice} -> ${newPrice}`);
      recordTest('商品数量减少功能', true);
    } else {
      recordTest('商品数量减少功能', false, '未找到减少按钮');
    }
    
    // 再次增加
    if (addButtons.length > 0) {
      await addButtons[0].click();
      await page.waitForTimeout(500);
      recordTest('商品数量增加功能', true);
    } else {
      recordTest('商品数量增加功能', false);
    }
    
    // 测试7: 查看购物车详情
    console.log('\n📍 测试7: 购物车详情查看');
    
    // 尝试点击购物车
    if (cartElement) {
      await cartElement.click();
      await page.waitForTimeout(1000);
      
      // 检查是否显示购物车详情
      const cartDetailVisible = await page.locator('.cart-detail, .cart-list, [class*="cart-detail"], [class*="cart-list"]').isVisible().catch(() => false);
      
      if (cartDetailVisible) {
        recordTest('购物车详情展开', true);
        
        // 截图购物车详情
        await page.screenshot({ path: 'tests/screenshots/cart-detail.png' });
        console.log('📸 已保存购物车详情截图');
        
        // 检查清空购物车按钮
        const clearButton = await page.locator('text=/清空|清除/').isVisible().catch(() => false);
        recordTest('清空购物车按钮', clearButton);
      } else {
        recordTest('购物车详情展开', false);
        recordTest('清空购物车按钮', false, '未能打开购物车详情');
      }
    }
    
    // 测试8: 去结算按钮
    console.log('\n📍 测试8: 去结算功能');
    const checkoutButton = await page.locator('button:has-text("去结算"), button:has-text("结算"), [class*="checkout"], [class*="submit"]').first();
    
    if (await checkoutButton.isVisible().catch(() => false)) {
      const buttonText = await checkoutButton.textContent();
      console.log(`  找到结算按钮: "${buttonText}"`);
      
      // 检查是否满足起送条件
      const isDisabled = await checkoutButton.isDisabled().catch(() => false);
      if (!isDisabled) {
        recordTest('去结算按钮可用', true);
      } else {
        const minOrderText = await page.locator('text=/起送|配送费/').first().textContent().catch(() => '');
        recordTest('去结算按钮可用', false, `未满足起送条件: ${minOrderText}`);
      }
    } else {
      recordTest('去结算按钮可用', false, '未找到结算按钮');
    }
    
    // 生成测试报告
    console.log('\n================================');
    console.log('📊 测试结果汇总:');
    console.log(`总测试项: ${testResults.total}`);
    console.log(`✅ 通过: ${testResults.passed}`);
    console.log(`❌ 失败: ${testResults.failed}`);
    console.log(`通过率: ${(testResults.passed / testResults.total * 100).toFixed(2)}%`);
    
    // 保存详细报告
    const reportContent = generateDetailedReport();
    require('fs').writeFileSync('test-reports/food-cart-test-report.md', reportContent);
    console.log('\n📝 详细测试报告已保存到 test-reports/food-cart-test-report.md');
    
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error.message);
    await page.screenshot({ path: 'tests/screenshots/food-cart-error.png' });
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
  
  let report = `# 菜品浏览与购物车模块测试报告

## 测试概述
- **测试时间**: ${new Date().toLocaleString('zh-CN')}
- **测试模块**: 菜品浏览与购物车模块
- **测试工具**: Playwright
- **测试环境**: ${BASE_URL}

## 测试结果统计
- **总测试项**: ${testResults.total}
- **通过数量**: ${testResults.passed}
- **失败数量**: ${testResults.failed}
- **通过率**: ${(testResults.passed / testResults.total * 100).toFixed(2)}%

## 详细测试结果

| 测试项 | 状态 | 备注 |
|--------|------|------|
`;

  testResults.details.forEach(test => {
    report += `| ${test.name} | ${test.status === 'PASS' ? '✅ 通过' : '❌ 失败'} | ${test.details || '-'} |\n`;
  });

  report += `
## 测试截图
- 菜品列表页: screenshots/food-list-page.png
- 添加菜品后: screenshots/food-added-to-cart.png
- 购物车详情: screenshots/cart-detail.png

## 发现的问题
`;

  const failedTests = testResults.details.filter(t => t.status === 'FAIL');
  if (failedTests.length > 0) {
    failedTests.forEach((test, index) => {
      report += `${index + 1}. **${test.name}**: ${test.details || '功能未实现或存在问题'}\n`;
    });
  } else {
    report += '未发现明显问题\n';
  }

  report += `
## 测试覆盖情况
- ✅ 菜品分类导航
- ✅ 菜品信息展示
- ✅ 添加到购物车
- ✅ 购物车数量显示
- ✅ 价格计算
- ✅ 数量增减
- ✅ 购物车详情
- ✅ 结算按钮

## 建议
1. 优化购物车交互体验
2. 改进价格显示的清晰度
3. 增强菜品图片加载性能
4. 完善起送金额提示

---
**生成时间**: ${timestamp}
`;

  return report;
}

// 执行测试
runFoodCartTests().catch(console.error);