# 🧪 TJU-ELM 测试指南

## 快速开始

### 1. 安装依赖
```bash
npm install
npx playwright install
```

### 2. 启动测试环境
```bash
# 1. 启动MySQL
mysql.server start

# 2. 启动后端
cd elm_springboot
mvn spring-boot:run

# 3. 启动前端
cd elm_vue
npm run dev
```

### 3. 运行测试
```bash
# 运行所有测试
npm test

# 运行单个测试
node tests/auth_test_final.js
node tests/business_browse_test.js
node tests/food_cart_test_v2.js
```

## 测试文件结构

```
tests/
├── auth_test_final.js          # 用户认证模块测试
├── business_browse_test.js     # 商家浏览模块测试
├── food_cart_test_v2.js        # 菜品购物车模块测试
└── screenshots/                # 测试截图目录

test-reports/
├── TEST_SUMMARY_REPORT.md      # 测试总结报告
├── auth-module-test-report.md  # 认证模块报告
├── business-browse-test-report.md # 商家模块报告
└── food-cart-test-report-v2.md   # 购物车模块报告
```

## GitHub Issues 跟踪

| Issue | 模块 | 状态 | 链接 |
|-------|------|------|------|
| #1 | 用户认证 | 🟡 60% | [查看](https://github.com/beita6969/tju-elm-testing/issues/1) |
| #2 | 商家浏览 | ✅ 完成 | [查看](https://github.com/beita6969/tju-elm-testing/issues/2) |
| #3 | 菜品购物车 | ✅ 完成 | [查看](https://github.com/beita6969/tju-elm-testing/issues/3) |
| #4 | 订单处理 | ⏸️ 待测 | [查看](https://github.com/beita6969/tju-elm-testing/issues/4) |
| #5 | API测试 | ⏸️ 待测 | [查看](https://github.com/beita6969/tju-elm-testing/issues/5) |
| #6 | 性能测试 | ⏸️ 待测 | [查看](https://github.com/beita6969/tju-elm-testing/issues/6) |
| #7 | 兼容性 | ⏸️ 待测 | [查看](https://github.com/beita6969/tju-elm-testing/issues/7) |
| #8 | 自动化框架 | ⏸️ 待测 | [查看](https://github.com/beita6969/tju-elm-testing/issues/8) |

## 使用测试助手脚本

```bash
# 查看所有测试任务
./scripts/test_helper.sh list

# 开始测试任务
./scripts/test_helper.sh start 4

# 完成测试任务
./scripts/test_helper.sh complete 4

# 生成测试报告
./scripts/test_helper.sh report
```

## CI/CD 集成

项目已配置GitHub Actions，每次推送都会自动运行测试：
- 文件位置: `.github/workflows/test.yml`
- 触发条件: push到main/develop分支，PR到main分支
- 定时运行: 每天凌晨2点

## 测试最佳实践

1. **编写新测试时**
   - 使用Playwright进行UI自动化
   - 保存关键步骤的截图
   - 生成详细的测试报告

2. **发现问题时**
   - 在对应的GitHub Issue中记录
   - 附上截图和复现步骤
   - 标记问题严重程度

3. **测试完成后**
   - 更新测试报告
   - 提交代码到GitHub
   - 更新Issue状态

## 常见问题

### Q: 测试超时怎么办？
A: 增加`slowMo`参数值或使用`waitForTimeout`

### Q: 元素定位失败？
A: 使用多个选择器策略，优先使用data-testid

### Q: 如何调试测试？
A: 设置`headless: false`查看浏览器执行过程

## 联系方式

如有问题，请在GitHub Issues中提出或联系测试负责人。