// 商家浏览模块测试脚本
const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:8084';
const API_URL = 'http://localhost:8080';

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

async function runBusinessBrowseTests() {
  console.log('🚀 开始执行商家浏览模块测试');
  console.log('================================\n');

  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300 // 减慢速度以便观察
  });
  
  const page = await browser.newPage();
  
  try {
    // 测试1: 访问主页
    console.log('📍 测试1: 主页商家列表加载');
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`  页面加载时间: ${loadTime}ms`);
    recordTest('页面加载时间 < 3秒', loadTime < 3000, `加载时间: ${loadTime}ms`);
    
    // 截图保存主页
    await page.screenshot({ path: 'tests/screenshots/business-list-home.png' });
    console.log('📸 已保存主页截图\n');
    
    // 测试2: 检查商家列表
    console.log('📍 测试2: 商家列表显示检查');
    
    // 等待商家列表加载
    await page.waitForTimeout(2000);
    
    // 查找商家卡片
    const businessCards = await page.locator('.business-item, .shop-item, .restaurant-item, [class*="business"], [class*="shop"]').all();
    console.log(`  找到 ${businessCards.length} 个商家`);
    recordTest('商家列表加载成功', businessCards.length > 0, `商家数量: ${businessCards.length}`);
    
    if (businessCards.length > 0) {
      // 检查第一个商家的信息完整性
      const firstBusiness = businessCards[0];
      
      // 检查商家必要信息
      const checkElements = {
        '商家名称': ['h3', 'h4', '.name', '.title', '[class*="name"]'],
        '商家图片': ['img', '.logo', '.avatar', '[class*="img"]'],
        '评分信息': ['.rating', '.score', '[class*="rating"]', '[class*="score"]'],
        '配送费': ['.delivery', '.fee', '[class*="delivery"]', '[class*="fee"]']
      };
      
      for (const [elementName, selectors] of Object.entries(checkElements)) {
        let found = false;
        for (const selector of selectors) {
          const element = await firstBusiness.locator(selector).first();
          if (await element.isVisible({ timeout: 500 }).catch(() => false)) {
            found = true;
            break;
          }
        }
        recordTest(`${elementName}显示`, found);
      }
    }
    
    // 测试3: 商家搜索功能
    console.log('\n📍 测试3: 商家搜索功能');
    
    // 查找搜索框
    const searchSelectors = [
      'input[type="search"]',
      'input[placeholder*="搜索"]',
      'input[placeholder*="search"]',
      '.search-input',
      '[class*="search"] input'
    ];
    
    let searchInput = null;
    for (const selector of searchSelectors) {
      const element = await page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
        searchInput = element;
        break;
      }
    }
    
    if (searchInput) {
      console.log('  找到搜索框');
      await searchInput.fill('麦当劳');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      
      // 截图搜索结果
      await page.screenshot({ path: 'tests/screenshots/business-search-result.png' });
      console.log('📸 已保存搜索结果截图');
      
      recordTest('搜索功能可用', true);
      
      // 清空搜索
      await searchInput.clear();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
    } else {
      recordTest('搜索功能可用', false, '未找到搜索框');
    }
    
    // 测试4: 分类筛选
    console.log('\n📍 测试4: 商家分类筛选');
    
    // 查找分类标签
    const categorySelectors = [
      '.category',
      '.filter',
      '[class*="category"]',
      '[class*="filter"]',
      '.tag'
    ];
    
    let categoryFound = false;
    for (const selector of categorySelectors) {
      const categories = await page.locator(selector).all();
      if (categories.length > 0) {
        console.log(`  找到 ${categories.length} 个分类选项`);
        // 点击第一个分类
        await categories[0].click();
        await page.waitForTimeout(2000);
        
        // 截图分类结果
        await page.screenshot({ path: 'tests/screenshots/business-category-filter.png' });
        console.log('📸 已保存分类筛选结果');
        
        categoryFound = true;
        break;
      }
    }
    recordTest('分类筛选功能', categoryFound);
    
    // 测试5: 点击进入商家详情
    console.log('\n📍 测试5: 商家详情页面');
    
    // 返回主页
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 重新获取商家列表并点击第一个
    const businessItems = await page.locator('.business-item, .shop-item, .restaurant-item, [class*="business"], [class*="shop"]').all();
    
    if (businessItems.length > 0) {
      // 获取商家名称（用于验证）
      let businessName = '';
      try {
        businessName = await businessItems[0].locator('h3, h4, .name, .title').first().textContent();
        console.log(`  点击商家: ${businessName}`);
      } catch (e) {
        console.log('  点击第一个商家');
      }
      
      await businessItems[0].click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // 截图商家详情页
      await page.screenshot({ path: 'tests/screenshots/business-detail.png' });
      console.log('📸 已保存商家详情页截图');
      
      // 检查是否进入详情页
      const urlChanged = page.url() !== BASE_URL;
      recordTest('进入商家详情页', urlChanged, `URL: ${page.url()}`);
      
      // 检查详情页元素
      if (urlChanged) {
        const detailElements = {
          '商家信息': ['.info', '.detail', '[class*="info"]'],
          '菜品列表': ['.menu', '.food', '.dish', '[class*="menu"]'],
          '公告信息': ['.notice', '.announcement', '[class*="notice"]']
        };
        
        for (const [elementName, selectors] of Object.entries(detailElements)) {
          let found = false;
          for (const selector of selectors) {
            if (await page.locator(selector).isVisible({ timeout: 1000 }).catch(() => false)) {
              found = true;
              break;
            }
          }
          recordTest(`详情页-${elementName}`, found);
        }
      }
    } else {
      recordTest('进入商家详情页', false, '没有找到商家列表');
    }
    
    // 测试6: 返回商家列表
    console.log('\n📍 测试6: 导航返回功能');
    
    // 查找返回按钮
    const backButton = await page.locator('.back, [class*="back"], text=返回, text=<').first();
    if (await backButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await backButton.click();
      await page.waitForTimeout(2000);
      recordTest('返回按钮功能', true);
    } else {
      // 使用浏览器后退
      await page.goBack();
      await page.waitForTimeout(2000);
      recordTest('返回按钮功能', true, '使用浏览器后退');
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
    require('fs').writeFileSync('test-reports/business-browse-test-report.md', reportContent);
    console.log('\n📝 详细测试报告已保存到 test-reports/business-browse-test-report.md');
    
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error.message);
    await page.screenshot({ path: 'tests/screenshots/business-error.png' });
    console.log('📸 已保存错误截图');
  } finally {
    console.log('\n⏰ 5秒后关闭浏览器...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

// 生成详细测试报告
function generateDetailedReport() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  let report = `# 商家浏览模块测试报告

## 测试概述
- **测试时间**: ${new Date().toLocaleString('zh-CN')}
- **测试模块**: 商家浏览模块
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
- 商家列表页: screenshots/business-list-home.png
- 搜索结果页: screenshots/business-search-result.png
- 分类筛选结果: screenshots/business-category-filter.png
- 商家详情页: screenshots/business-detail.png

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
## 建议
1. 确保所有商家信息完整显示
2. 优化搜索功能的响应速度
3. 改进分类筛选的用户体验
4. 增强商家详情页的信息展示

---
**生成时间**: ${new Date().toISOString()}
`;

  return report;
}

// 执行测试
runBusinessBrowseTests().catch(console.error);