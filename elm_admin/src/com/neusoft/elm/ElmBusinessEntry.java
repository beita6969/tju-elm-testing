package com.neusoft.elm;

import com.neusoft.elm.po.Business;
import com.neusoft.elm.view.BusinessView;
import com.neusoft.elm.view.FoodView;
import com.neusoft.elm.view.impl.BusinessViewImpl;
import com.neusoft.elm.view.impl.FoodViewImpl;

import java.util.Scanner;

public class ElmBusinessEntry {

    private Scanner input=new Scanner(System.in);

    public void work(){
        //系统的标题
        System.out.println("-----------------------------------------------------------------------------");
        System.out.println("|\t\t\t\t\t\t\t饿 了 么 后 台 管 理 系 统\t\t\t\t\t\t\t|");
        System.out.println("-----------------------------------------------------------------------------");

        //调用商家的View层
        BusinessView businessView=new BusinessViewImpl();

        //调用商家的View层里面的登录方法
        Business business=businessView.login();

        //商家登录
        if(business!=null){
            //商家的输入
            int menu=0;
            while(menu!=5){
                //输出一级菜单
                System.out.println("\n====一级菜单 (商家管理)" +
                        " 1.查看商家信息" +
                        " 2.修改商家信息" +
                        " 3.更新密码" +
                        " 4.所属商品管理" +
                        " 5.退出系统====");
                System.out.println("请输入你的选择：");
                menu=input.nextInt();
                switch(menu){
                    case 1:
                        //重新根据businessId查询了商家的信息，保证信息的即时性，防止信息变化
                        businessView.showBusiness(business.getBusinessId());
                        break;
                    case 2:
                        businessView.editBusiness(business.getBusinessId());
                        break;
                    case 3:
                        businessView.updateBusinessByPassword(business.getBusinessId());
                        break;
                    case 4:
                        System.out.println("所属商品管理");
                        //二级菜单写在私有方法中，在这里调用，结构更清晰
                        foodManager(business.getBusinessId());
                        break;
                    case 5:
                        System.out.println("------------------------欢迎下次光临饿了么后台管理系统------------------------");
                        break;
                    default:
                        System.out.println("没有这个选项！\n");
                        break;
                }
            }
        }else {
            System.out.println("商家编号或密码输入错误！");
        }
    }

    private void foodManager(int businessId){

        FoodView foodView=new FoodViewImpl();

        int menu=0;
        while(menu!=5){
            //输出二级菜单
            System.out.println("\n====二级菜单 (食品管理)" +
                    " 1.查看食品列表" +
                    " 2.新增食品" +
                    " 3.修改食品" +
                    " 4.删除食品" +
                    " 5.返回一级菜单====");
            System.out.println("请输入你的选择：");
            menu=input.nextInt();
            switch(menu){
                case 1:
                    foodView.showFoodList(businessId);
                    break;
                case 2:
                    foodView.saveFood(businessId);
                    break;
                case 3:
                    foodView.updateFood(businessId);
                    break;
                case 4:
                    foodView.removeFood(businessId);
                    break;
                case 5:
                    break;
                default:
                    System.out.println("没有这个选项！\n");
                    break;
            }
        }
    }

    public static void main(String[] args) {
        new ElmBusinessEntry().work();
    }

}
