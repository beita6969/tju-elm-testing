package com.neusoft.elm.view.impl;

import com.neusoft.elm.dao.BusinessDao;
import com.neusoft.elm.dao.impl.BusinessDaoImpl;
import com.neusoft.elm.po.Business;
import com.neusoft.elm.view.BusinessView;

import java.util.List;
import java.util.Scanner;

public class BusinessViewImpl implements BusinessView {

    private Scanner input=new Scanner(System.in);

    @Override
    public void listBusinessAll() {
        BusinessDao dao=new BusinessDaoImpl();
        //两个筛选条件都是null，则做全查询
        List<Business> list=dao.listBusiness(null,null);
        //输出表头
        System.out.println("商家编号\t\t商家名称\t\t\t\t\t商家地址\t\t\t\t\t\t商家介绍\t\t起送费\t\t配送费");
        //遍历集合
        for(Business b:list){
            System.out.println(b.getBusinessId()+"\t\t"+
                                b.getBusinessName()+"\t\t"+
                                b.getBusinessAddress()+"\t\t"+
                                b.getBusinessExplain()+"\t\t"+
                                b.getStarPrice()+"\t\t"+
                                b.getDeliverPrice());
        }

    }

    @Override
    public void listBusiness() {
        //询问用户模糊匹配的条件
        String inputStr="";
        String businessName="";
        String businessAddress="";

        System.out.println("是否需要输入商家的名称关键词(y/n):");
        inputStr=input.next();
        if(inputStr.equals("y")){
            System.out.println("请输入商家名称关键词:");
            businessName=input.next();
        }

        System.out.println("是否需要输入商家的地址关键词(y/n):");
        inputStr=input.next();
        if(inputStr.equals("y")){
            System.out.println("请输入商家地址关键词:");
            businessAddress=input.next();
        }
        BusinessDao dao=new BusinessDaoImpl();
        //查询到的结果
        List<Business>list =dao.listBusiness(businessName,businessAddress);
        System.out.println("商家编号\t\t商家名称\t\t\t\t\t商家地址\t\t\t\t\t\t商家介绍\t\t起送费\t\t配送费");
        //遍历集合
        for(Business b:list){
            System.out.println(b.getBusinessId()+"\t\t"+
                    b.getBusinessName()+"\t\t"+
                    b.getBusinessAddress()+"\t\t"+
                    b.getBusinessExplain()+"\t\t"+
                    b.getStarPrice()+"\t\t"+
                    b.getDeliverPrice());
        }
    }

    @Override
    public void saveBusiness() {
        //接收商家名称
        System.out.println("请输入商家名称：");
        String businessName=input.next();
        BusinessDao dao = new BusinessDaoImpl();
        int businessId=dao.saveBusiness(businessName);
        if(businessId>0){
            System.out.println("新建商家成功！商家编号为："+businessId);
        }else{
            System.out.println("新建商家失败！");
        }
    }

    @Override
    public void removeBusiness() {
        System.out.println("请输入商家编号：");
        int businessId=input.nextInt();

        BusinessDao dao = new BusinessDaoImpl();
        //用户确认删除
        System.out.println("确认要删除吗(y/n)");
        if(input.next().equals("y")){
            //确认删除了
            int result=dao.removeBusiness(businessId);
            if(result==1){
                //删除成功
                System.out.println("删除商家成功！");
            }else {
                System.out.println("删除商家失败！");
            }
        }
    }

    @Override
    public Business login() {

        System.out.println("请输入商家编号：");
        int businessId=input.nextInt();
        System.out.println("请输入密码：");
        String password=input.next();

        //调用Dao层
        BusinessDao dao = new BusinessDaoImpl();

        return dao.getBusinessByIdByPass(businessId,password);
    }

    @Override
    public void showBusiness(Integer businessId) {
        BusinessDao dao = new BusinessDaoImpl();
        Business business=dao.getBusinessById(businessId);
        //Business已经重写了toString方法
        System.out.println(business);
    }

    @Override
    public void editBusiness(Integer businessId) {
        BusinessDao dao = new BusinessDaoImpl();
        Business business=dao.getBusinessById(businessId);
        //先输入商家信息原数据查询出来显示，然后用户才能更新
        System.out.println(business);
        //一个一个属性问用户用不用更新
        String inputStr="";
        System.out.println("是否修改商家的名称（y/n）");
        inputStr=input.next();
        if(inputStr.equals("y")){
            System.out.println("请输入新的商家名称：");
            business.setBusinessName(input.next());
        }

        System.out.println("是否修改商家地址（y/n）");
        inputStr=input.next();
        if(inputStr.equals("y")){
            System.out.println("请输入新的商家地址：");
            business.setBusinessAddress(input.next());
        }

        System.out.println("是否修改商家介绍（y/n）");
        inputStr=input.next();
        if(inputStr.equals("y")){
            System.out.println("请输入新的商家介绍：");
            business.setBusinessExplain(input.next());
        }

        System.out.println("是否修改起送费（y/n）");
        inputStr=input.next();
        if(inputStr.equals("y")){
            System.out.println("请输入新的起送费：");
            business.setStarPrice(input.nextDouble());
        }

        System.out.println("是否修改配送费（y/n）");
        inputStr=input.next();
        if(inputStr.equals("y")){
            System.out.println("请输入新的配送费：");
            business.setDeliverPrice(input.nextDouble());
        }

        int result = dao.updateBusiness(business);
        if(result>0){
            System.out.println("\n修改商家信息成功！\n");
        }else{
            System.out.println("修改失败！");
        }
    }

    @Override
    public void updateBusinessByPassword(Integer businessId) {
        //查出当前商家的信息
        BusinessDao dao = new BusinessDaoImpl();
        Business business=dao.getBusinessById(businessId);

        System.out.println("\n请输入旧密码：");
        String oldPass=input.next();
        System.out.println("\n请输入新密码：");
        String password=input.next();
        System.out.println("\n请再次输入新密码：");
        String beginPassword=input.next();

        //验证
        if(!business.getPassword().equals(oldPass)){
            System.out.println("\n旧密码输入错误！");
        }else if(!password.equals(beginPassword)){
            System.out.println("\n两次输入的新密码不一致！");
        }else {
            //通过
            int result=dao.updateBusinessPassword(businessId,password);
            if(result>0){
                System.out.println("\n修改密码成功！");
            }else{
                System.out.println("\n修改密码失败！");
            }
        }


    }
}
