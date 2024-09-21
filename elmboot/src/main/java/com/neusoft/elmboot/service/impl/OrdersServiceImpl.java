package com.neusoft.elmboot.service.impl;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.neusoft.elmboot.mapper.CartMapper;
import com.neusoft.elmboot.mapper.FoodMapper;
import com.neusoft.elmboot.mapper.OrderDetailetMapper;
import com.neusoft.elmboot.mapper.OrdersMapper;
import com.neusoft.elmboot.po.Cart;
import com.neusoft.elmboot.po.OrderDetailet;
import com.neusoft.elmboot.po.Orders;
import com.neusoft.elmboot.service.OrdersService;
import com.neusoft.elmboot.util.CommonUtil;

@Service
public class OrdersServiceImpl implements OrdersService {

 @Autowired
 private CartMapper cartMapper;
 @Autowired
 private OrdersMapper ordersMapper;
 @Autowired
 private OrderDetailetMapper orderDetailetMapper;
 @Autowired
 private FoodMapper foodMapper;
 
 @Override
 @Transactional
 public int createOrders(Orders orders) {
  //1、查询当前用户购物车中当前商家的所有食品
  Cart cart = new Cart();
  cart.setUserId(orders.getUserId());
  cart.setBusinessId(orders.getBusinessId());
  
  List<Cart> cartList = cartMapper.listCart(cart);
  //2、创建订单（返回生成的订单编号）

  orders.setOrderDate(CommonUtil.getCurrentDate1());
  ordersMapper.saveOrders(orders);
  int orderId = orders.getOrderId();

  //3、批量添加订单明细
  List<OrderDetailet> list = new ArrayList<>();
  for (Cart c : cartList) {
	  
   OrderDetailet od = new OrderDetailet();

   od.setFood(foodMapper.getFoodById(c.getFoodId()));
   od.setPriceAtThatTime((foodMapper.getFoodById(c.getFoodId())).getFoodPrice());
   //c有foodId
   od.setFoodName((foodMapper.getFoodById(c.getFoodId())).getFoodName());
   od.setOrderId(orderId);
   od.setFoodId(c.getFoodId());
   od.setQuantity(c.getQuantity());

   list.add(od);
  }
  
  //判空是非常重要的一个步骤！！！
  if(list  != null && list.size() >0) {
  orderDetailetMapper.saveOrderDetailetBatch(list);
  }

  //4、从购物车表中删除相关食品信息
  if(cart !=null)
  cartMapper.removeCart(cart);

  return orderId;
 }

 @Override
 public Orders getOrdersById(Integer orderId) {
  return ordersMapper.getOrdersById(orderId);
 }
//-----------------------------------上面应该是没有问题了------------------------------------------------
 @Override
 public List<Orders> listOrdersByUserId(String userId) {
	 List<Orders> orderList = ordersMapper.listOrdersByUserId(userId);

	 return orderList;
 }

	@Override
	public int payOk(Orders orders) {
		return ordersMapper.payOk(orders);
	}
	
	
	
	public List<OrderDetailet> listOrderDetailetByOrderId(Orders orders){
		 return orderDetailetMapper.listorderDetailetByOrderId(orders);
	 }
	
	
	
	public List<Integer> listOdIdByOrderId(Orders orders){
		 return ordersMapper.listOdIdByOrderId(orders);
	 }

}