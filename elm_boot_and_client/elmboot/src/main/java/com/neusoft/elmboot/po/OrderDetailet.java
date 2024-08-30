package com.neusoft.elmboot.po;

public class OrderDetailet {

	private Integer odId;
	private Integer orderId;
	private Integer foodId;
	private Integer quantity;
	
	private Food food;
	
	public Integer getOdId() {
		return odId;
	}
	public void setOdId(Integer odId) {
		this.odId = odId;
	}
	public Integer getOrderId() {
		return orderId;
	}
	public void setOrderId(Integer orderId) {
		this.orderId = orderId;
	}
	public Integer getFoodId() {
		return foodId;
	}
	public void setFoodId(Integer foodId) {
		this.foodId = foodId;
	}
	public Integer getQuantity() {
		return quantity;
	}
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
	public Food getFood() {
		return food;
	}
	public void setFood(Food food) {
		this.food = food;
	}
}
