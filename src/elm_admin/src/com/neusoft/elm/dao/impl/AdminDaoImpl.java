package com.neusoft.elm.dao.impl;

//实现类

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.neusoft.elm.dao.AdminDao;
import com.neusoft.elm.po.Admin;
import com.neusoft.elm.util.DBUtil;

public class AdminDaoImpl implements AdminDao {

    private Connection con=null;
    private PreparedStatement pst=null;
    private ResultSet rs=null;

    @Override
    public Admin getAdminByNameByPass(String adminName, String password) {
        Admin admin=null;
        String sql="select * from admin where adminName=? and password=?";
        try {
            con = DBUtil.getConnection();
            pst=con.prepareStatement(sql);
            pst.setString(1,adminName);
            pst.setString(2,password);
            rs = pst.executeQuery();

            //其实只能查到一个admin
            while(rs.next()){
                //将表结构数据转换成java的对象数据的过程
                admin=new Admin();
                admin.setAdminId(rs.getInt("adminId"));
                admin.setAdminName(rs.getString("adminName"));
                admin.setPassword(rs.getString("password"));

            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            //释放资源
            DBUtil.close(rs,pst,con);
        }
        return admin;
    }
}
