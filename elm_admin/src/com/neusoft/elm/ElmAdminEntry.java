package com.neusoft.elm;

import com.neusoft.elm.po.Admin;
import com.neusoft.elm.view.AdminView;
import com.neusoft.elm.view.BusinessView;
import com.neusoft.elm.view.impl.AdminViewImpl;
import com.neusoft.elm.view.impl.BusinessViewImpl;

import java.util.Scanner;

public class ElmAdminEntry {

    public void work(){
        Scanner input = new Scanner(System.in);

        //系统的标题
        System.out.println("---------------------------------------------------------------------");
        System.out.println("|\t\t\t\t\t\t饿 了 么 后 台 管 理 系 统\t\t\t\t\t\t|");
        System.out.println("---------------------------------------------------------------------");

        AdminView adminView=new AdminViewImpl();
        BusinessView businessView=new BusinessViewImpl();

        Admin admin = adminView.login();


        //登录
        if(admin!=null){
            //主菜单
            int menu = 0;
            //用户没有按退出键
            while(menu != 5){
                System.out.println("=========" +
                        " 1.所有商家列表" +
                        " 2.搜索商家" +
                        " 3.新建商家" +
                        " 4.删除商家" +
                        " 5.退出系统=========");
                System.out.println("请输入你的选择：");
                menu=input.nextInt();
                switch(menu){
                    case 1:
                        businessView.listBusinessAll();
                        break;
                    case 2:
                        businessView.listBusiness();
                        break;
                    case 3:
                        businessView.saveBusiness();
                        break;
                    case 4:
                        System.out.println("删除商家");
                        break;
                    case 5:
                        businessView.removeBusiness();
                        break;
                    default:
                        System.out.println("没有这个选项！\n");
                        break;
                }
            }
        }else{
            System.out.println("管理员名称或密码输入错误！\n");
        }
    }

    //入口方法
    public static void main(String[] args) {
        new ElmAdminEntry().work();
    }

}
