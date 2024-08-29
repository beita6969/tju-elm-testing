###  **tju_elm_project**   
 **软件工程综合实践-饿了么外卖平台** 


 

### 项目一. elm_admin 
 
elm_admin 是饿了么 **JDBC** 版项目，采用了 **JDBC+Mysql** 开发，是纯后端的字符界面操作数据库的命令行应用程序。

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

 **3.整体要求**  

 **1. 项目技术架构** 

 JDK8 

 JDBC 

 MySql 

 **2. 开发工具** 

 STS（SpringToolSuite4）

 mysql-5.5.62-winx64 

 navicat 

 **3. 涉及的技术点** 

 封装 JDBC 

 封装 DAO

 领域模型中的实体类

 增删改查操

 多条件模糊查询

 JDBC 事务管理

 表的主外键关系

 

### 项目二.
 

饿了么前端版项目是采用 **HTML、CSS、JavaScript** 开发的前端静态网页项目。

 **1. 简介** 

 **1.1 项目前端技术架构：** 
1) HTML 
2) CSS 
3) JavaScript

 **1.2 开发工具** 
1) hbuilder 
2) chrome 浏览器

 **2.安装部署指南** 
1) 安装 hbuilder、chrome
2) 将工程导入到 hbuilder 中
3) 在 chrome 浏览器中运行 index.html 文件
4) 在 chrome 浏览器中使用 Toggle device toolbar 模拟手机浏览

 **3.整体要求** 

 **1. 项目技术架构** 

 HTML5 

 CSS3 

 JavaScript（ES6 以上）

 **2. 开发工具** 

 Hbuilder 

 Chrome 浏览器

 **3. 涉及的技术点** 

 HTML5 标签的使用

 CSS3 样式的使用

 JS 对 DOM 的基本操作

 DIV+CSS 布局基础

 移动端布局基础

 viewport 设置

 弹性布局

 边框盒子模型

 vw 与 vh 的使用

 图片按比例自适应

 CSS3 小图标的使用

 第三方字体库的使用


### 项目三.
 

饿了么 **Servlet** 版本

 **1.项目概述** 

 **1.1.项目演示** 

1. 运行 “饿了么项目” ，演示应用程序效果，演示 “点餐业务线” 整体流程。
2. 本项目参照 “饿了么官网网页版”制作。饿了么网页版：http://h5.ele.me/
3. 本项目专注于完成点餐业务线功能， ”饿了么官网“中的其它功能暂不涉及 。

 **1.2.项目目标** 
1. 本项目为课程级贯穿项目中的第三个项目（JDBC项目、前端项目、javaWeb项目）。
2. 本项目完成后，学员将能够使用VUE+Servlet+A JAX技术开发前后端分离的Web应用程序。

 **1.3.项目中所涉及到相关知识点** 

A JAX的使用
Servlet的使用
Session的使用
简单MVC封装
Service层事务管理
dao层批量操作
多对一与一对多的映射
服务器端json数据转换
VueCli的使用
多条件模糊查询的使用
Svn、Git版本控制工具的使用

 **1.4.数据库设计** 

 **本项目完成后，学员将能够使用VUE+Servlet+AJAX技术开发前后端分离的Web应用程序。** 

 **1.5 整体要求**  

 **1. 项目技术架构** 

 Jdk8 

 Servlet 

 Tomcat5.5 

 MySql 

 Vue 

 **2. 开发工具** 

 Hbuilder 

 STS（SpringToolSuite4）

 mysql-5.5.62-winx64 

 Tomcat8.5 

 **3. 涉及的技术点** 

 AJAX 的使用

 Servlet 的使用

 Session 的使用

 简单 MVC 封装

 Service 层事务管理

 dao 层批量操作

 多对一与一对多的映射

 服务器端 json 数据转换

 VueCli 的使用

 多条件模糊查询的使用
