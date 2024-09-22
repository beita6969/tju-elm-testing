# tju_course_design_report_template

#### 项目介绍
天津大学软件学院专业课程设计2结课报告模板

#### 环境配置

推荐使用 VS Code + Latex Workshop（VsCode插件） + Texlive进行撰写。

#### 使用说明

tjumain.tex                     主模板文件

body/                           在此文件夹下编写论文各章节内容

body文件夹下的文件需要在tjumain.tex的相应位置添加引用
```
	\include{body/intros}
	\include{body/figures}
	\include{body/tables}
	\include{body/equations}
	\include{body/others}
	\include{body/conclusion}
```

figure/*                        文中所使用的图片

setup/info.tex                  封面和页眉的基本信息

#### 如何参与贡献

1. Fork 本项目
2. 新建分支
3. 提交代码
4. 创建 Pull Request