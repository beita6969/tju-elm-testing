package com.neusoft.elm.util;

import java.sql.*;

//数据库工具类

public class DBUtil {
//    这个数据库工具类需要干两件事情
//    1.获取一个connection数据库连接
//    2.关闭对数据库操作后的资源

    //常量 数据库连接字符串                 协议       本机服务器   端口   数据库名         字符集
    private static final String URL="jdbc:mysql://localhost:3306/elm_admin?characterEncoding=utf-8";
    //常量 驱动架包的路径
    private static final String DRIVER="com.mysql.cj.jdbc.Driver";//相对路径

    //常量 数据库的用户名和密码
    private static final String USERNAME="root";//相对路径
    private static final String PASSWORD="123456";//相对路径

    //获取connection
    //静态变量，使用方便，用的时候直接类名.方法名，不用创建对象了
    public static Connection getConnection(){
        Connection con=null;
        try {
            //加载驱动路径,就能加载mysql驱动了
            Class.forName(DRIVER);
            con=DriverManager.getConnection(URL,USERNAME,PASSWORD);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return con;
    }


    //关闭所有资源   通用的，声明成静态
    public static void close(ResultSet rs, PreparedStatement pst,Connection con) {
        //判断空指针
        if(rs!=null){
            try {
                rs.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        //释放资源
        rs=null;

        //判断空指针
        if(pst!=null){
            try {
                pst.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        //释放资源
        pst=null;

        //判断空指针
        if(con!=null){
            try {
                con.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        //释放资源
        con=null;

    }

}
