package com.neusoft.elmboot.po;

import java.math.BigDecimal;

public class OrderDetailet_Food {
	  private Integer odId;
	  private Integer orderId;
	  private Integer foodId;
	  private Integer quantity;
	  private BigDecimal priceAtThatTime;
	 
	  private String foodName;
	  private String foodExplain;
	  private String foodImg;
	  private Integer businessId;
	  private String remarks;
	 
	 //多对一：所属食品
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
	public BigDecimal getPriceAtThatTime() {
		return priceAtThatTime;
	}
	public void setPriceAtThatTime(BigDecimal priceAtThatTime) {
		this.priceAtThatTime = priceAtThatTime;
	}
	public Food getFood() {
		return food;
	}
	public void setFood(Food food) {
		this.food = food;
	}
	public String getFoodName() {
		return foodName;
	}
	public void setFoodName(String foodName) {
		this.foodName = foodName;
	}
	public String getFoodExplain() {
		return foodExplain;
	}
	public void setFoodExplain(String foodExplain) {
		this.foodExplain = foodExplain;
	}
	public String getFoodImg() {
		return foodImg;
	}
	public void setFoodImg(String foodImg) {
		this.foodImg = foodImg;
	}
	public Integer getBusinessId() {
		return businessId;
	}
	public void setBusinessId(Integer businessId) {
		this.businessId = businessId;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
}
