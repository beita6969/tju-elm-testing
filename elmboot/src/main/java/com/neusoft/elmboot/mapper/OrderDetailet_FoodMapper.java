package com.neusoft.elmboot.mapper;

import org.apache.ibatis.annotations.Insert;

import com.neusoft.elmboot.po.OrderDetailet_Food;

public interface OrderDetailet_FoodMapper {
	@Insert("insert into orderdetailet_food values("
			+ "#{odId},"
			+ "#{orderId},"
			+ "#{foodId},"
			+ "#{quantity},"
			+ "#{priceAtThatTime},"
			+ "#{foodExplain},"
			+ "#{foodName},"
			+ "#{foodImg},"
			+ "#{businessId},"
			+ "#{remarks})")
	public int saveOrderDetailet_Food(OrderDetailet_Food orderDetailet_Food);
}
