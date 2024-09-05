package com.neusoft.elmboot.mapper;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;


import com.neusoft.elmboot.po.Orders;
import org.apache.ibatis.annotations.Update;


@Mapper
public interface OrdersMapper {




 public Orders getOrdersById(Integer ordersId);

 @Insert("insert into orders (userId,businessId,orderDate,orderTotal,daId,orderState,open) values(#{userId},#{businessId},#{orderDate},#{orderTotal},#{daId},0,#{open})")
 @Options(useGeneratedKeys=true,keyProperty="orderId",keyColumn="orderId")
 public int saveOrders(Orders orders);


 public List<Orders> listOrdersByUserId(String userId);


 @Update("update orders set orderState=1 where orderId=#{orderId}")
 public int updateOrderState(Integer orderId);

 @Update("update orders set orderState=1,useCredit = #{useCredit} where orderId=#{orderId}")
 public int updateOrderStateAndCredit(Integer orderId,Integer useCredit);

}
