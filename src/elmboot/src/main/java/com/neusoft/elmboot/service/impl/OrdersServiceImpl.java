package com.neusoft.elmboot.service.impl;

import java.util.*;
import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.neusoft.elmboot.mapper.CartMapper;
import com.neusoft.elmboot.mapper.FoodMapper;
import com.neusoft.elmboot.mapper.OrderDetailetMapper;
import com.neusoft.elmboot.mapper.OrdersMapper;
import com.neusoft.elmboot.po.Cart;
import com.neusoft.elmboot.po.Food;
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
 @Transactional(rollbackFor = Exception.class)
 public int createOrders(Orders orders) {
  try {
    //1、查询当前用户购物车中当前商家的所有食品
    Cart cart = new Cart();
    cart.setUserId(orders.getUserId());
    cart.setBusinessId(orders.getBusinessId());
    
    List<Cart> cartList = cartMapper.listCart(cart);
    if (cartList == null || cartList.isEmpty()) {
        throw new RuntimeException("购物车为空，无法创建订单");
    }

    //2、创建订单
    orders.setOrderDate(CommonUtil.getCurrentDate1());
    // 确保orderTotal是BigDecimal类型
    if (orders.getOrderTotal() == null) {
        orders.setOrderTotal(BigDecimal.ZERO);
    }
    // 设置初始订单状态为0（未支付）
    orders.setOrderState(0);
    
    int result = ordersMapper.saveOrders(orders);
    if (result <= 0) {
        throw new RuntimeException("创建订单失败");
    }
    int orderId = orders.getOrderId();

    //3、批量添加订单明细
    List<OrderDetailet> list = new ArrayList<>();
    for (Cart c : cartList) {
        OrderDetailet od = new OrderDetailet();
        od.setOrderId(orderId);
        od.setFoodId(c.getFoodId());
        od.setQuantity(c.getQuantity());
        
        // 获取食品信息
        Food food = foodMapper.getFoodById(c.getFoodId());
        if (food == null) {
            throw new RuntimeException("食品信息不存在，foodId: " + c.getFoodId());
        }
        
        od.setFood(food);
        od.setPriceAtThatTime(food.getFoodPrice());
        od.setFoodName(food.getFoodName());
        list.add(od);
    }
    
    if (!list.isEmpty()) {
        int detailResult = orderDetailetMapper.saveOrderDetailetBatch(list);
        if (detailResult <= 0) {
            throw new RuntimeException("保存订单明细失败");
        }
    }

    //4、从购物车表中删除相关食品信息
    int removeResult = cartMapper.removeCart(cart);
    if (removeResult <= 0) {
        throw new RuntimeException("清空购物车失败");
    }

    return orderId;
  } catch (Exception e) {
    throw new RuntimeException("创建订单失败: " + e.getMessage(), e);
  }
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