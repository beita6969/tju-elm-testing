package com.neusoft.elm.dao.impl;

import com.neusoft.elm.dao.BusinessDao;
import com.neusoft.elm.po.Admin;
import com.neusoft.elm.po.Business;
import com.neusoft.elm.util.DBUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class BusinessDaoImpl implements BusinessDao {

    private Connection con=null;
    private PreparedStatement pst=null;
    private ResultSet rs=null;

    @Override
    public List<Business> listBusiness(String businessName,String businessAddress) {
        List<Business> list=new ArrayList<>();
        Admin admin=null;
        //1=1处理后面加不加and的问题，1=1后都加上and即可，不用再多余判断
        //String 是不可变数据类型
        StringBuffer sql=new StringBuffer("select * from business where 1=1 ");
        if(businessName!=null&&!businessName.equals("")){
            //模糊匹配businessName,将其作为条件填在sql语句的后面
            sql.append(" and businessName like '%"+businessName+"%'");
        }
        if(businessAddress!=null&&!businessAddress.equals("")){
            //businessAddress,将其作为条件填在sql语句的后面
            sql.append(" and businessAddress like '%"+businessAddress+"%'");
        }
        //此时动态sql语句已经处理好
        try {
            con = DBUtil.getConnection();
            pst=con.prepareStatement(sql.toString());
            rs = pst.executeQuery();
            while(rs.next()){
                Business business=new Business();
                business.setBusinessId(rs.getInt("businessId"));
                business.setPassword(rs.getString("password"));
                business.setBusinessName(rs.getString("businessName"));
                business.setBusinessAddress(rs.getString("businessAddress"));
                business.setBusinessExplain(rs.getString("businessExplain"));
                business.setStarPrice(rs.getDouble("starPrice"));
                business.setDeliverPrice(rs.getDouble("deliveryPrice"));
                list.add(business);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            //释放资源
            DBUtil.close(rs,pst,con);
        }
        return list;
    }

    @Override
    public int saveBusiness(String businessName) {
        int businessId=0;
        //sql语句（初始密码是123）
        String sql="insert into business(businessName,password) values(?,'123')";
        try {
            con = DBUtil.getConnection();
            //在预编译的时候通知其:我们要它自动生成的主键(设置返回自增长列值)
            pst=con.prepareStatement(sql,PreparedStatement.RETURN_GENERATED_KEYS);
            pst.setString(1,businessName);
            pst.executeUpdate();
            //获取自增长列值(一行一列)
            rs=pst.getGeneratedKeys();
            if(rs.next()){
                businessId=rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            //释放资源
            DBUtil.close(rs,pst,con);
        }
        return businessId;
    }

    @Override
    public int removeBusiness(int businessId) {
        //注：删除Business的时候要先删除与之关联的子表的数据，再删除主表,满足数据库的主外键约束
        int result=0;

        //在同一个工作单元里有两个步骤，要么都成功，要么都不成功(保证数据的完整性和一致性)
        //所以用事务，开启JDBC事务
        String delFootSql="delete from food where businessId=?";
        String delBusinessSql="delete from business where businessId=?";

        try {
            con=DBUtil.getConnection();

            //开始一个事务
            //不自动提交事务
            con.setAutoCommit(false);

            pst=con.prepareStatement(delFootSql);
            pst.setInt(1,businessId);
            pst.executeUpdate();

            pst=con.prepareStatement(delBusinessSql);
            pst.setInt(1,businessId);
            result=pst.executeUpdate();

            //提交事务
            con.commit();

        } catch (Exception e) {
            result=0;
            //回滚
            try {
                con.rollback();
            } catch (SQLException ex) {
                throw new RuntimeException(ex);
            }
            e.printStackTrace();
        }finally{
            //释放资源
            DBUtil.close(null,pst,con);
        }
        return result;

    }

    @Override
    public Business getBusinessByIdByPass(Integer businessId, String password) {
        Business business=null;
        String sql="select * from business where businessId=? and password=?";
        try {
            con = DBUtil.getConnection();
            pst=con.prepareStatement(sql);
            //给sql语句的?传值
            pst.setInt(1,businessId);
            pst.setString(2,password);
            rs = pst.executeQuery();
            //只有一条数据
            while(rs.next()){
                //将表结构数据转成对象数据存储
                business=new Business();
                business.setBusinessId(rs.getInt("businessId"));
                business.setPassword(rs.getString("password"));
                business.setBusinessName(rs.getString("businessName"));
                business.setBusinessAddress(rs.getString("businessAddress"));
                business.setBusinessExplain(rs.getString("businessExplain"));
                business.setStarPrice(rs.getDouble("starPrice"));
                business.setDeliverPrice(rs.getDouble("deliveryPrice"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            //释放资源
            DBUtil.close(rs,pst,con);
        }
        return business;
    }

    @Override
    public Business getBusinessById(Integer businessId) {
        Business business=null;
        String sql="select * from business where businessId=?";
        try {
            con = DBUtil.getConnection();
            pst=con.prepareStatement(sql);
            //给sql语句的?传值
            pst.setInt(1,businessId);
            rs = pst.executeQuery();
            //只有一条数据
            while(rs.next()){
                //将表结构数据转成对象数据存储
                business=new Business();
                business.setBusinessId(rs.getInt("businessId"));
                business.setPassword(rs.getString("password"));
                business.setBusinessName(rs.getString("businessName"));
                business.setBusinessAddress(rs.getString("businessAddress"));
                business.setBusinessExplain(rs.getString("businessExplain"));
                business.setStarPrice(rs.getDouble("starPrice"));
                business.setDeliverPrice(rs.getDouble("deliveryPrice"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            //释放资源
            DBUtil.close(rs,pst,con);
        }
        return business;
    }

    @Override
    public int updateBusiness(Business business) {
        int result=0;
        String sql="update business set businessName=?,businessAddress=?,businessExplain=?,starPrice=?,deliveryPrice=? where businessId=?";
        try {
            con=DBUtil.getConnection();
            pst=con.prepareStatement(sql);
            //6个参数
            pst.setString(1,business.getBusinessName());
            pst.setString(2,business.getBusinessAddress());
            pst.setString(3,business.getBusinessExplain());
            pst.setDouble(4,business.getStarPrice());
            pst.setDouble(5,business.getDeliverPrice());
            pst.setInt(6,business.getBusinessId());

            result=pst.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            //释放资源
            DBUtil.close(null,pst,con);
        }
        return result;
    }

    @Override
    public int updateBusinessPassword(Integer businessId, String password) {
        int result=0;
        String sql="update business set password=? where businessId=?";
        try {
            con=DBUtil.getConnection();
            pst=con.prepareStatement(sql);

            pst.setString(1,password);
            pst.setInt(2,businessId);

            result=pst.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            //释放资源
            DBUtil.close(null,pst,con);
        }
        return result;

    }
}
