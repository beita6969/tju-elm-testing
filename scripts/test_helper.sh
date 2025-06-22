#!/bin/bash

# TJU-ELM测试助手脚本
# 使用GitHub CLI进行测试任务管理

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 显示帮助信息
show_help() {
    echo "TJU-ELM测试助手脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  list                显示所有测试任务"
    echo "  start <issue_num>   开始执行指定测试任务"
    echo "  complete <issue_num> 标记测试任务为完成"
    echo "  comment <issue_num> 为测试任务添加评论"
    echo "  report              生成测试进度报告"
    echo "  env                 检查测试环境状态"
    echo "  help                显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 list             # 查看所有测试任务"
    echo "  $0 start 1          # 开始执行Issue #1"
    echo "  $0 complete 1       # 完成Issue #1"
    echo "  $0 env              # 检查环境状态"
}

# 列出所有测试任务
list_issues() {
    print_message $BLUE "📋 测试任务列表"
    echo ""
    
    print_message $YELLOW "🔥 高优先级任务 (功能测试):"
    gh issue list --label "功能测试" --state open
    
    echo ""
    print_message $YELLOW "🔌 接口测试任务:"
    gh issue list --label "接口测试" --state open
    
    echo ""
    print_message $YELLOW "⚡ 性能测试任务:"
    gh issue list --label "性能测试" --state open
    
    echo ""
    print_message $YELLOW "🌐 兼容性测试任务:"
    gh issue list --label "兼容性测试" --state open
    
    echo ""
    print_message $YELLOW "🤖 自动化测试任务:"
    gh issue list --label "自动化测试" --state open
}

# 开始执行测试任务
start_task() {
    local issue_num=$1
    if [ -z "$issue_num" ]; then
        print_message $RED "❌ 错误: 请指定Issue编号"
        return 1
    fi
    
    print_message $BLUE "🚀 开始执行测试任务 #$issue_num"
    
    # 添加进行中标签
    gh issue edit $issue_num --add-label "in-progress"
    
    # 添加开始评论
    local comment="🔄 **测试开始**
    
**开始时间**: $(date)
**测试人员**: $(git config user.name)
**测试环境**: 
- 前端: http://localhost:8084
- 后端: http://localhost:8080
- 数据库: MySQL 3306

准备开始执行测试用例..."

    gh issue comment $issue_num --body "$comment"
    
    print_message $GREEN "✅ 任务 #$issue_num 已标记为进行中"
}

# 完成测试任务
complete_task() {
    local issue_num=$1
    if [ -z "$issue_num" ]; then
        print_message $RED "❌ 错误: 请指定Issue编号"
        return 1
    fi
    
    print_message $BLUE "✅ 完成测试任务 #$issue_num"
    
    # 添加完成评论
    local comment="✅ **测试完成**
    
**完成时间**: $(date)
**测试结果**: 请手动更新测试结果
**测试总结**: 请添加测试总结

所有测试用例已执行完毕，任务关闭。"

    gh issue comment $issue_num --body "$comment"
    
    # 关闭Issue
    gh issue close $issue_num
    
    print_message $GREEN "✅ 任务 #$issue_num 已完成并关闭"
}

# 添加测试评论
add_comment() {
    local issue_num=$1
    if [ -z "$issue_num" ]; then
        print_message $RED "❌ 错误: 请指定Issue编号"
        return 1
    fi
    
    print_message $BLUE "💬 为任务 #$issue_num 添加评论"
    echo "请输入评论内容 (按Ctrl+D结束):"
    
    local comment=$(cat)
    
    if [ ! -z "$comment" ]; then
        gh issue comment $issue_num --body "$comment"
        print_message $GREEN "✅ 评论已添加到任务 #$issue_num"
    else
        print_message $YELLOW "⚠️  未输入评论内容，操作取消"
    fi
}

# 生成测试报告
generate_report() {
    print_message $BLUE "📊 生成测试进度报告"
    echo ""
    
    # 统计各种状态的Issue数量
    local total_issues=$(gh issue list --state all --json number | jq length)
    local open_issues=$(gh issue list --state open --json number | jq length)
    local closed_issues=$(gh issue list --state closed --json number | jq length)
    
    echo "## 📈 测试进度统计"
    echo "- 总任务数: $total_issues"
    echo "- 进行中: $open_issues"
    echo "- 已完成: $closed_issues"
    echo "- 完成率: $(echo "scale=1; $closed_issues * 100 / $total_issues" | bc -l)%"
    echo ""
    
    # 按标签统计
    echo "## 📋 按测试类型统计"
    
    local func_total=$(gh issue list --label "功能测试" --state all --json number | jq length)
    local func_closed=$(gh issue list --label "功能测试" --state closed --json number | jq length)
    echo "- 功能测试: $func_closed/$func_total 完成"
    
    local api_total=$(gh issue list --label "接口测试" --state all --json number | jq length)
    local api_closed=$(gh issue list --label "接口测试" --state closed --json number | jq length)
    echo "- 接口测试: $api_closed/$api_total 完成"
    
    local perf_total=$(gh issue list --label "性能测试" --state all --json number | jq length)
    local perf_closed=$(gh issue list --label "性能测试" --state closed --json number | jq length)
    echo "- 性能测试: $perf_closed/$perf_total 完成"
    
    local compat_total=$(gh issue list --label "兼容性测试" --state all --json number | jq length)
    local compat_closed=$(gh issue list --label "兼容性测试" --state closed --json number | jq length)
    echo "- 兼容性测试: $compat_closed/$compat_total 完成"
    
    local auto_total=$(gh issue list --label "自动化测试" --state all --json number | jq length)
    local auto_closed=$(gh issue list --label "自动化测试" --state closed --json number | jq length)
    echo "- 自动化测试: $auto_closed/$auto_total 完成"
}

# 检查测试环境
check_environment() {
    print_message $BLUE "🔍 检查测试环境状态"
    echo ""
    
    # 检查前端服务
    print_message $YELLOW "检查前端服务 (端口8084)..."
    if curl -s http://localhost:8084 > /dev/null; then
        print_message $GREEN "✅ 前端服务正常运行"
    else
        print_message $RED "❌ 前端服务未运行"
    fi
    
    # 检查后端服务  
    print_message $YELLOW "检查后端服务 (端口8080)..."
    if curl -s http://localhost:8080 > /dev/null; then
        print_message $GREEN "✅ 后端服务正常运行"
    else
        print_message $RED "❌ 后端服务未运行"
    fi
    
    # 检查数据库连接
    print_message $YELLOW "检查数据库连接..."
    if command -v mysql &> /dev/null; then
        if mysql -u root -p123456 -e "SELECT 1;" &> /dev/null; then
            print_message $GREEN "✅ 数据库连接正常"
        else
            print_message $RED "❌ 数据库连接失败"
        fi
    else
        print_message $YELLOW "⚠️  MySQL客户端未安装"
    fi
    
    # 检查GitHub CLI
    print_message $YELLOW "检查GitHub CLI..."
    if command -v gh &> /dev/null; then
        print_message $GREEN "✅ GitHub CLI已安装"
        gh auth status
    else
        print_message $RED "❌ GitHub CLI未安装"
    fi
}

# 主函数
main() {
    case "$1" in
        "list")
            list_issues
            ;;
        "start")
            start_task "$2"
            ;;
        "complete")
            complete_task "$2"
            ;;
        "comment")
            add_comment "$2"
            ;;
        "report")
            generate_report
            ;;
        "env")
            check_environment
            ;;
        "help"|"")
            show_help
            ;;
        *)
            print_message $RED "❌ 未知选项: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"