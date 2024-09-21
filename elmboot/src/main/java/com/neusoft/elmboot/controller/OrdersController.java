package com.neusoft.elmboot.controller;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.elmboot.po.OrderDetailet;
import com.neusoft.elmboot.po.Orders;
import com.neusoft.elmboot.service.OrdersService;
import com.neusoft.elmboot.util.CommonUtil;
@RestController
@RequestMapping("/OrdersController")
public class OrdersController {
 @Autowired
 private OrdersService ordersService;

 @RequestMapping(value = "/createOrders", method = RequestMethod.POST)
 public int createOrders(@RequestBody Orders orders) throws Exception{
  return ordersService.createOrders(orders);
 }

 @RequestMapping("/getOrdersById")
 public Orders getOrdersById(@RequestBody Orders orders) throws Exception{
  return ordersService.getOrdersById(orders.getOrderId());
 }

 @RequestMapping("/listOrdersByUserId")
 public List<Orders> listOrdersByUserId(@RequestBody Orders orders) throws Exception{
  return ordersService.listOrdersByUserId(orders.getUserId());
 }

 @RequestMapping("/payOk")
 public int payOk(@RequestBody Orders orders) throws Exception{
  return ordersService.payOk(orders);
 }
 
 @RequestMapping("/listOrderDetailetByOrderId")
 public List<OrderDetailet> listOrderDetailetByOrderId(@RequestBody Orders orders){
	 return ordersService.listOrderDetailetByOrderId(orders);
 }
 
 @RequestMapping("/listOdIdByOrderId")
 public List<Integer> listOdIdByOrderId(@RequestBody Orders orders){
	 return ordersService.listOdIdByOrderId(orders);
 }

}