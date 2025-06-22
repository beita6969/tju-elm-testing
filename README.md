# 🍕 TJU-ELM外卖平台测试项目

> 天津大学软件工程综合实践 - ELM外卖平台测试工程

[![GitHub issues](https://img.shields.io/github/issues/beita6969/tju-elm-testing)](https://github.com/beita6969/tju-elm-testing/issues)
[![GitHub forks](https://img.shields.io/github/forks/beita6969/tju-elm-testing)](https://github.com/beita6969/tju-elm-testing/network)
[![GitHub stars](https://img.shields.io/github/stars/beita6969/tju-elm-testing)](https://github.com/beita6969/tju-elm-testing/stargazers)

## 📋 项目概述

本项目是基于Vue3 + SpringBoot + MySQL技术栈的外卖平台系统测试项目，涵盖功能测试、接口测试、性能测试、兼容性测试等多个维度的全面测试方案。

### 🏗️ 项目架构
- **前端**: Vue3 + Vue Router + Axios
- **后端**: SpringBoot + MyBatis + MySQL
- **测试**: Jest + Playwright + Postman + GitHub CLI

### 🌐 在线访问
- **前端应用**: http://localhost:8084
- **后端API**: http://localhost:8080  
- **GitHub仓库**: https://github.com/beita6969/tju-elm-testing

## 🚀 快速开始

### 1. 环境准备

确保已安装以下工具：
- Node.js 16+
- Java 8+
- MySQL 5.7+
- Git
- GitHub CLI

### 2. 项目启动

```bash
# 克隆项目
git clone https://github.com/JHM2004/tju_elm_project.git
cd tju_elm_project

# 启动数据库 (MySQL)
# 导入数据: src/elmboot-sql/elm.sql

# 启动后端 (SpringBoot)
cd src/elmboot
mvn spring-boot:run

# 启动前端 (Vue3)
cd src/elmclient
npm install
npm run serve
```

### 3. 测试环境验证

```bash
# 使用测试助手脚本检查环境
./scripts/test_helper.sh env
```

## 📚 测试文档

### 📖 核心文档
- [📋 测试计划](./TEST_PLAN.md) - 详细的测试计划和用例
- [📊 测试跟踪](./TEST_TRACKING.md) - 测试进度和任务管理
- [🤖 测试助手](./scripts/test_helper.sh) - 自动化测试管理脚本

### 🎯 测试范围

| 测试类型 | 覆盖范围 | 状态 |
|---------|----------|------|
| **功能测试** | 用户认证、商家浏览、购物车、订单处理 | 🆕 待开始 |
| **接口测试** | REST API、数据验证、错误处理 | 🆕 待开始 |
| **性能测试** | 页面加载、API响应、并发处理 | 🆕 待开始 |
| **兼容性测试** | 跨浏览器、响应式布局、设备适配 | 🆕 待开始 |
| **自动化测试** | E2E、单元测试、CI/CD集成 | 🆕 待开始 |

## 🔧 GitHub CLI 使用指南

### 基础命令

```bash
# 查看所有测试任务
gh issue list

# 查看特定类型测试任务  
gh issue list --label "功能测试"
gh issue list --label "接口测试"
gh issue list --label "性能测试"

# 开始执行测试任务
./scripts/test_helper.sh start 1

# 为任务添加测试结果
gh issue comment 1 --body "✅ 登录功能测试通过"

# 完成测试任务
./scripts/test_helper.sh complete 1
```

### 测试管理助手

```bash
# 查看帮助
./scripts/test_helper.sh help

# 列出所有测试任务
./scripts/test_helper.sh list

# 生成测试报告
./scripts/test_helper.sh report

# 检查环境状态
./scripts/test_helper.sh env
```

## 📊 当前测试状态

### 📈 进度概览
- **总任务数**: 8
- **已完成**: 0
- **进行中**: 0  
- **未开始**: 8
- **完成率**: 0%

### 🏷️ 任务分布

| Issue | 标题 | 类型 | 状态 | 链接 |
|-------|------|------|------|------|
| #1 | 🔐 用户认证模块 | 功能测试 | 🆕 Open | [查看](https://github.com/beita6969/tju-elm-testing/issues/1) |
| #2 | 🏪 商家浏览模块 | 功能测试 | 🆕 Open | [查看](https://github.com/beita6969/tju-elm-testing/issues/2) |
| #3 | 🍔 菜品购物车模块 | 功能测试 | 🆕 Open | [查看](https://github.com/beita6969/tju-elm-testing/issues/3) |
| #4 | 📋 订单处理模块 | 功能测试 | 🆕 Open | [查看](https://github.com/beita6969/tju-elm-testing/issues/4) |
| #5 | 🔌 后端API测试 | 接口测试 | 🆕 Open | [查看](https://github.com/beita6969/tju-elm-testing/issues/5) |
| #6 | ⚡ 系统性能验证 | 性能测试 | 🆕 Open | [查看](https://github.com/beita6969/tju-elm-testing/issues/6) |
| #7 | 🌐 跨平台兼容性 | 兼容性测试 | 🆕 Open | [查看](https://github.com/beita6969/tju-elm-testing/issues/7) |
| #8 | 🤖 自动化测试框架 | 自动化测试 | 🆕 Open | [查看](https://github.com/beita6969/tju-elm-testing/issues/8) |

## 🧪 测试执行流程

### 1. 开始测试
```bash
# 选择一个测试任务开始执行
./scripts/test_helper.sh start 1

# 这将会：
# - 为Issue添加 "in-progress" 标签
# - 添加开始测试的评论
# - 记录开始时间和测试人员
```

### 2. 执行测试
根据测试计划文档中的具体测试用例进行测试：
- 按照测试步骤逐项执行
- 记录测试结果（通过/失败/阻塞）
- 发现问题时及时记录缺陷信息

### 3. 记录结果
```bash
# 添加测试进度评论
gh issue comment 1 --body "🔄 测试进度更新:
- ✅ 用户注册功能正常
- ✅ 用户登录功能正常  
- ❌ 密码重置功能异常 - 邮件发送失败
- 🔄 继续测试登出功能..."
```

### 4. 完成测试
```bash
# 完成测试任务
./scripts/test_helper.sh complete 1

# 这将会：
# - 添加完成评论
# - 关闭Issue
# - 标记任务为已完成
```

## 🐛 缺陷管理

### 缺陷等级定义
- **P0 (阻塞)**: 系统无法启动、核心功能完全不可用
- **P1 (严重)**: 主要功能异常、数据丢失  
- **P2 (一般)**: 功能缺陷、体验问题
- **P3 (轻微)**: UI问题、优化建议

### 缺陷报告模板
```markdown
## 🐛 缺陷报告

**缺陷标题**: 简要描述问题
**发现时间**: 2025-06-22 
**测试人员**: 测试工程师
**严重程度**: P1/P2/P3
**影响范围**: 功能模块

### 🔍 问题描述
详细描述发现的问题

### 📝 重现步骤
1. 步骤一
2. 步骤二  
3. 步骤三

### ✅ 期望结果
应该出现的正确结果

### ❌ 实际结果  
实际观察到的错误结果

### 📱 测试环境
- 浏览器: Chrome 90+
- 操作系统: macOS
- 屏幕分辨率: 1920x1080
```

## 📈 测试报告

使用以下命令生成实时测试报告：

```bash
# 生成测试进度报告
./scripts/test_helper.sh report

# 查看详细统计
gh issue list --state all --json number,title,state,labels --jq '.[] | {number, title, state, labels: [.labels[].name]}'
```

## 🤝 团队协作

### 任务分配
1. 在GitHub Issues中选择测试任务
2. 使用 `./scripts/test_helper.sh start <issue_num>` 开始任务
3. 定期更新测试进度
4. 完成后使用 `./scripts/test_helper.sh complete <issue_num>` 关闭任务

### 沟通协作
- 所有测试相关讨论在对应的GitHub Issue中进行
- 发现问题及时在Issue中@相关人员
- 使用GitHub CLI快速更新任务状态
- 定期在团队会议中同步测试进度

## 📞 支持与反馈

- **GitHub Issues**: [提交问题](https://github.com/beita6969/tju-elm-testing/issues)
- **项目Wiki**: [查看文档](https://github.com/beita6969/tju-elm-testing/wiki)
- **原项目**: [TJU-ELM](https://github.com/JHM2004/tju_elm_project)

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

---

**🎯 让我们一起保证ELM外卖平台的质量！**

*最后更新: 2025-06-22*