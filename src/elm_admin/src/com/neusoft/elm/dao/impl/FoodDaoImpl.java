package com.neusoft.elm.dao.impl;

import com.neusoft.elm.dao.FoodDao;
import com.neusoft.elm.po.Admin;
import com.neusoft.elm.po.Food;
import com.neusoft.elm.util.DBUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class FoodDaoImpl implements FoodDao {


    private Connection con=null;
    private PreparedStatement pst=null;
    private ResultSet rs=null;

    @Override
    public List<Food> listFoodByBusinessId(Integer businessId) {
        List<Food> list=new ArrayList<>();
        String sql="select * from food where businessId=?";
        try {
            con = DBUtil.getConnection();
            pst=con.prepareStatement(sql);
            pst.setInt(1,businessId);
            rs = pst.executeQuery();
            while(rs.next()){
                Food food =new Food();
                food.setFoodId(rs.getInt("foodId"));
                food.setFoodName(rs.getString("foodName"));
                food.setFoodExplain(rs.getString("foodExplain"));
                food.setFoodPrice(rs.getDouble("foodPrice"));
                food.setBusinessId(rs.getInt("businessId"));

                list.add(food);
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
    public int saveFood(Food food) {
        int result=0;
        String sql="insert into food values(null,?,?,?,?)";
        try {
            con = DBUtil.getConnection();
            pst=con.prepareStatement(sql);

            pst.setString(1,food.getFoodName());
            pst.setString(2,food.getFoodExplain());
            pst.setDouble(3,food.getFoodPrice());
            pst.setInt(4,food.getBusinessId());
            result= pst.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            //释放资源
            DBUtil.close(null,pst,con);
        }
        return result;
    }

    @Override
    public Food getFoodById(Integer foodId) {
        Food food=null;
        List<Food> list=new ArrayList<>();
        String sql="select * from food where foodId=?";
        try {
            con = DBUtil.getConnection();
            pst=con.prepareStatement(sql);
            pst.setInt(1,foodId);
            rs = pst.executeQuery();
            while(rs.next()){
                food =new Food();
                food.setFoodId(rs.getInt("foodId"));
                food.setFoodName(rs.getString("foodName"));
                food.setFoodExplain(rs.getString("foodExplain"));
                food.setFoodPrice(rs.getDouble("foodPrice"));
                food.setBusinessId(rs.getInt("businessId"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            //释放资源
            DBUtil.close(rs,pst,con);
        }
        return food;
    }

    @Override
    public int updateFood(Food food) {
        int result=0;
        String sql="update food set foodName=?,foodExplain=?,foodPrice=? where foodId=?";

        try {
            con = DBUtil.getConnection();
            pst=con.prepareStatement(sql);

            pst.setString(1,food.getFoodName());
            pst.setString(2,food.getFoodExplain());
            pst.setDouble(3,food.getFoodPrice());
            pst.setInt(4,food.getFoodId());
            result= pst.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            //释放资源
            DBUtil.close(null,pst,con);
        }
        return result;
    }

    @Override
    public int removeFood(Integer foodId) {
        int result=0;
        String sql="delete from food where foodId=?";

        try {
            con = DBUtil.getConnection();
            pst=con.prepareStatement(sql);

            pst.setInt(1,foodId);

            result= pst.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            //释放资源
            DBUtil.close(null,pst,con);
        }
        return result;
    }

}
