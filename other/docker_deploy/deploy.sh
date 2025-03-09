#!/bin/bash

# 定义颜色
RED='\033[1;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # 无颜色
CYAN='\033[0;36m'
echo
# 显示脚本来源
echo -e "${CYAN}================= TJU-SPRINGBOOT-ELM一键部署配置工具 =================\n${NC}"
sleep 0.5
# 打印 TJU-ELM 的大字效果
echo -e "${CYAN}"
echo "     _______    _  _    _          ______  _       __  __  "
echo "     |__   __|  | || |  | |        |  ____|| |     |  \/  | "
echo "        | |     | || |  | | ______ | |__   | |     | \  / |"
echo "        | | _   | || |  | ||______||  __|  | |     | |\/| | "
echo "        | || |__| || |__| |        | |____ | |____ | |  | |"
echo "        |_| \____/  \____/         |______||______||_|  |_| "
echo "                                                            "
echo -e "${NC}"
echo
sleep 0.5
echo -e "${YELLOW}>> 本脚本将引导您完成所有必要的配置步骤${NC}"
sleep 0.5
echo -e "${YELLOW}>> 此脚本由 天津大学22级软工本科生 - JHM2004 - 制作，时间：2025.03.09${NC}"
sleep 0.5
echo -e "${YELLOW}>> 源码地址1：https://github.com/JHM2004/tju_elm_project ${NC}"
sleep 0.5
echo -e "${YELLOW}>> 源码地址2：https://gitee.com/Yang_yuxin123/tju_elm_project\n${NC}"
sleep 0.5
echo -e "${GREEN}>> 如有任何问题：请加 QQ 2011342963 进行反馈${NC}"
sleep 0.5
echo -e "${GREEN}>> 也可以加 QQ群 一起交流 165309200 \n${NC}"
sleep 0.5

# 提示用户是否继续
while true; do
    echo -e "${YELLOW}此脚本适用于在 Linux 系统上首次部署 TJU-SPRINGBOOT-ELM ，是否继续？${NC}"
    echo -e "${YELLOW}输入 y 继续，输入 n 取消${NC}"
    echo -n ">>> "
    read input
    case $input in
    [yY])
        echo -e "${GREEN}开始执行部署脚本...${NC}"
        break
        ;;
    [nN])
        echo -e "${RED}已取消${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}无效输入，请输入 y 或 n。${NC}"
        ;;
    esac
done

# 建议添加更详细的错误处理函数
handle_error() {
    local exit_code=$?
    local line_number=$1
    echo -e "${RED}错误发生在第 $line_number 行, 退出码: $exit_code${NC}"
    cleanup
    exit $exit_code
}

# 使用 ERR trap 时指定行号
trap 'handle_error ${LINENO}' ERR

# 在成功完成后取消 trap
trap - ERR

# 检查并安装 Docker
if ! command -v docker &>/dev/null; then
    echo -e "${YELLOW}检测到 Docker 未安装，即将安装 Docker...${NC}"
    if curl -s https://ipinfo.io/country | grep -q "CN"; then
        echo -e "${YELLOW}当前环境：中国大陆，正在安装 Docker，请稍等...${NC}"
        echo -e "${YELLOW}安装时间可能较长，请耐心等待...${NC}"
        if ! sudo curl -fsSL https://gitee.com/tech-shrimp/docker_installer/releases/download/latest/linux.sh | bash -s docker --mirror Aliyun >/dev/null 2>&1; then
            echo -e "${RED}Docker 安装失败${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}当前环境：中国大陆以外地区，正在安装 Docker，请稍等...${NC}"
        echo -e "${YELLOW}安装时间可能较长，请耐心等待...${NC}"
        if ! curl -fsSL https://get.docker.com -o get-docker.sh >/dev/null 2>&1; then
            echo -e "${RED}Docker 安装脚本下载失败${NC}"
            exit 1
        fi
        if ! sh get-docker.sh >/dev/null 2>&1; then
            echo -e "${RED}Docker 安装失败${NC}"
            exit 1
        fi
        rm get-docker.sh >/dev/null 2>&1
    fi
    sudo systemctl start docker >/dev/null 2>&1
    sudo systemctl enable docker >/dev/null 2>&1
    echo -e "${GREEN}Docker 安装完成${NC}"
else
    echo -e "${GREEN}Docker 已安装${NC}"
fi

# 检查并安装 Docker Compose
if ! docker compose version &>/dev/null; then
    echo -e "${YELLOW}检测到 Docker Compose 未安装，即将安装Docker Compose...${NC}"
    DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
    mkdir -p $DOCKER_CONFIG/cli-plugins
    if curl -s https://ipinfo.io/country | grep -q "CN"; then
        echo -e "${YELLOW}当前环境：中国大陆，正在安装 Docker Compose，请稍等...${NC}"
        echo -e "${YELLOW}安装时间可能较长，请耐心等待...${NC}"
        if ! curl -L "https://get.daocloud.io/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o $DOCKER_CONFIG/cli-plugins/docker-compose >/dev/null 2>&1; then
            echo -e "${RED}Docker Compose 安装失败${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}当前环境：中国大陆以外地区，正在安装 Docker Compose，请稍等...${NC}"
        echo -e "${YELLOW}安装时间可能较长，请耐心等待...${NC}"
        if ! curl -SL https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose >/dev/null 2>&1; then
            echo -e "${RED}Docker Compose 安装失败${NC}"
            exit 1
        fi
    fi
    chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
    echo -e "${GREEN}Docker Compose 安装完成${NC}"
else
    echo -e "${GREEN}Docker Compose 已安装${NC}"
fi

# 检测是否在中国大陆，并配置 Docker 镜像源
if curl -s https://ipinfo.io/country | grep -q "CN"; then
    echo -e "${YELLOW}检测到当前环境位于中国大陆地区，正在配置 Docker 镜像源...${NC}"
    sudo mkdir -p /etc/docker
    sudo rm -f /etc/docker/daemon.json
    sudo tee /etc/docker/daemon.json >/dev/null <<EOF
{
    "registry-mirrors": [
        "https://docker.m.daocloud.io",
        "https://docker.1panel.live",
        "https://hub.rat.dev",
        "https://docker-proxy.lazyshare.top"
    ]
}
EOF
    sudo systemctl daemon-reload
    sudo systemctl restart docker
    echo -e "${GREEN}Docker 镜像源配置完成${NC}"
fi




echo -e "${GREEN}开始创建 elmboot-app 和 elmboot-mysql 容器...${NC}"

# 检查 docker-compose.yaml 文件是否存在，最多重试10次
max_retries=10
retry_count=0

while [ $retry_count -lt $max_retries ]; do
    if [ -f "$HOME/docker-compose.yaml" ]; then
        break  # 文件存在，跳出循环
    else
        retry_count=$((retry_count+1))
        echo -e "${RED}错误：$HOME/docker-compose.yaml 文件不存在！正在重试（${retry_count}/${max_retries}）...${NC}"
        sleep 2  # 等待2秒后重试
    fi
done

# 如果达到最大重试次数文件仍不存在，则报错退出
if [ ! -f "$HOME/docker-compose.yaml" ]; then
    echo -e "${RED}错误：$HOME/docker-compose.yaml 文件不存在，已达到最大重试次数！${NC}"
    exit 1
fi

# 设置环境变量 VM_IP
export VM_IP=$(curl -s https://ifconfig.me)

# 最多重试2次
max_retries=10
retry_count=0

while [ $retry_count -lt $max_retries ]; do
    # 在后台执行 docker compose，并记录进程 ID
    docker compose -f "$HOME/docker-compose.yaml" up -d &
    PID=$!  # 获取后台进程的 PID

    # 等待后台进程完成
    wait $PID

    # 检查 docker compose 是否成功
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}容器创建成功！${NC}"
        break  # 成功，跳出循环
    else
        retry_count=$((retry_count+1))
        echo -e "${RED}容器创建失败，正在重试（${retry_count}/${max_retries}）...${NC}"
        
        # 重启 docker 服务
        systemctl restart docker
        sleep 2  # 等待2秒后重试
    fi
done

# 如果达到最大重试次数仍未成功，则报错退出
if [ $retry_count -ge $max_retries ]; then
    echo -e "${RED}容器创建失败，已达到最大重试次数！${NC}"
    exit 1
fi


# 数据库连接信息
DB_USER="root"
DB_PASSWORD="123456"
DB_PORT="11000"
DB_NAME="elm" 

# 定义容器名称或 ID
CONTAINER_NAME="elmboot-mysql"

# 打印初始化信息
echo -e "${GREEN}正在初始化数据库...${NC}"

# 进度条函数
progress_bar() {
    local duration=${1}  # 进度条总时长
    local width=60       # 进度条宽度

    # 循环显示进度条
    for (( i=0; i<=width; i++ )); do
        # 计算已过去的时间比例
        local percent=$(echo "scale=2; $i / $width * 100" | bc)
        local bar=$(printf "%-${i}s" ">" | tr ' ' '#')
        
        # 动态显示进度条
        printf "\r[%-${width}s] %s%%" "$bar" "$(printf "%.0f" $percent)"
        sleep $(echo "scale=2; $duration / $width" | bc)
    done
    printf "\n"
}

# 调用进度条函数，设置时长为10秒
progress_bar 10

# 继续其他操作
echo -e "${GREEN}正在创建数据库表结构...${NC}"


SQL_FILE="$HOME/elm.sql"

# 尝试执行 SQL 文件，最多重试100次
MAX_RETRIES=100
retries=0
success=0

while [ $retries -lt $MAX_RETRIES ]; do
    docker exec -i ${CONTAINER_NAME} mysql -u${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < ${SQL_FILE}
    exit_status=$?
    
    if [ $exit_status -eq 0 ]; then
        echo -e "${GREEN}数据库表结构初始化完成。${NC}"
        success=1
        break
    else
        retries=$((retries+1))
        echo -e "${RED}数据库初始化失败，正在重试（${retries}/${MAX_RETRIES}）...${NC}"
        sleep 2  # 等待2秒后重试
    fi
done

# 如果达到最大重试次数仍未成功，则报错退出
if [ $success -ne 1 ]; then
    echo -e "${RED}数据库初始化失败，已达到最大重试次数。${NC}"
    exit 1
fi

sleep 2

# 成功完成时的提示
echo -e "\n${CYAN}🎉🎉🎉 恭喜你，TJU-SPRINGBOOT-ELM已成功完成部署！ 🎉🎉🎉${NC}"
sleep 1
echo -e "--------------------------------------------------------------"
echo -e "| ${GREEN}elmboot-app ${NC}公网访问地址为: http://${VM_IP}:10000     |"
echo "|                                                            |"
 
echo -e "| ${GREEN}elmboot-mysql ${NC}连接信息如下：                               |"
echo -e "| ${CYAN}IP地址:${NC} ${VM_IP}                                      |"
echo -e "| ${CYAN}端口:${NC}   ${DB_PORT}                                              |"
echo -e "| ${CYAN}用户名:${NC} ${DB_USER}                                               |"
echo -e "| ${CYAN}密码:${NC}   ${DB_PASSWORD}                                             |"
echo -e "--------------------------------------------------------------"
# 定义要放行的端口
PORTS=("10000" "11000")

# 检查 firewalld 是否正在运行，如果未运行则尝试启动
if ! systemctl is-active --quiet firewalld; then
    systemctl start firewalld >/dev/null 2>&1
fi

# 添加规则以放行指定端口
for PORT in "${PORTS[@]}"; do
    firewall-cmd --zone=public --add-port=$PORT/tcp --permanent >/dev/null 2>&1
done

# 重新加载 firewalld 配置以应用更改
firewall-cmd --reload >/dev/null 2>&1
echo
sleep 0.8
echo -e "${RED}***若无法访问,请手动放行服务器的10000与11000端口***${NC}"
sleep 0.8
echo -e "${GREEN}有任何问题/反馈,请联系 QQ 2011342963 予以解决${NC}"
sleep 0.8
echo -e "\n${CYAN}========================= 祝您使用愉快！=========================${NC}"
echo
