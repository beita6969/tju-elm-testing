package com.neusoft.elmboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.elmboot.po.Orders;
import com.neusoft.elmboot.service.OrdersService;

@RestController
@RequestMapping("/OrdersController")
public class OrdersController {

	@Autowired
	private OrdersService ordersService;
	
	@RequestMapping("/createOrders")
	public int createOrders(Orders orders) throws Exception{
		return ordersService.createOrders(orders);
	}
	
	@RequestMapping("/getOrdersById")
	public Orders getOrdersById(Orders orders) throws Exception{
		return ordersService.getOrdersById(orders.getOrderId());
	}
	
	@RequestMapping("/listOrdersByUserId")
	public List<Orders> listOrdersByUserId(Orders orders) throws Exception{
		return ordersService.listOrdersByUserId(orders.getUserId());
	}
}
