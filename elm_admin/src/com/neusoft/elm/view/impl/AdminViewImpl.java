package com.neusoft.elm.view.impl;

import com.neusoft.elm.dao.AdminDao;
import com.neusoft.elm.dao.impl.AdminDaoImpl;
import com.neusoft.elm.po.Admin;
import com.neusoft.elm.view.AdminView;

import java.util.Scanner;

public class AdminViewImpl implements AdminView {

    //视图层需要画界面，我们用输出语句操作
    //获取用户在控制台输入的数据
    //拿这些数据在数据库中操作数据
    //根据数据层返回的结果显示在界面上

    private Scanner input=new Scanner(System.in);

    @Override
    public Admin login() {

        System.out.println("请输入管理员名称：");
        String adminName=input.next();
        System.out.println("请输入密码：");
        String password=input.next();

        AdminDao dao=new AdminDaoImpl();
        Admin admin=dao.getAdminByNameByPass(adminName,password);
        return admin;
    }
}
