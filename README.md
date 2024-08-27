### tju_elm_project  
 **软件工程综合实践-饿了么外卖平台** 


 **项目一. elm_admin**  
elm_admin 是饿了么JDBC版项目，采用了JDBC+Mysql开发，是纯后端的字符界面操作数据库的命令行应用程序。

 **1. 简介** 

 **1.1 项目技术架构** 
1) JDK 1.8 
2) JDBC 
3) MySQL 数据库

 **1.2 开发工具** 
1) STS（spring-tool-suite）
2) mysql-5.5.62-winx64 
3) Navicat Premium 8 

 **2.安装部署指南** 
1) 安装 jdk、STS、MySql
2) 在 mysql 数据库中创建数据库 elm_admin，使用数据库脚本
elm_admin.sql 创建数据库和初始数据。
3) 在 STS 中导入 javaSE 项目。
4) 打开 com/neusoft/elm/util/DBUtil 修改数据库密码
5) 本项目有两个入口：管理员入口、商家入口。

i. 运行 ElmAdminEntry 中的 main 函数为管理员入口。
ii. 运行 ElmBusinessEntry 中的 main 函数为商家入口。

