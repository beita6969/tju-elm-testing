package com.neusoft.elmboot.po;

import java.math.BigDecimal;

public class Business {
 private Integer businessId;
 private String businessName;
 private String businessAddress;
 private String businessExplain;
 private String businessImg;
 private Integer orderTypeId;
 private BigDecimal starPrice; //起送费
 private BigDecimal deliveryPrice; //配送费
 private String remarks;
public Integer getBusinessId() {
	return businessId;
}
public void setBusinessId(Integer businessId) {
	this.businessId = businessId;
}
public String getBusinessName() {
	return businessName;
}
public void setBusinessName(String businessName) {
	this.businessName = businessName;
}
public String getBusinessAddress() {
	return businessAddress;
}
public void setBusinessAddress(String businessAddress) {
	this.businessAddress = businessAddress;
}
public String getBusinessExplain() {
	return businessExplain;
}
public void setBusinessExplain(String businessExplain) {
	this.businessExplain = businessExplain;
}
public String getBusinessImg() {
	return businessImg;
}
public void setBusinessImg(String businessImg) {
	this.businessImg = businessImg;
}
public Integer getOrderTypeId() {
	return orderTypeId;
}
public void setOrderTypeId(Integer orderTypeId) {
	this.orderTypeId = orderTypeId;
}
public BigDecimal getStarPrice() {
	return starPrice;
}
public void setStarPrice(BigDecimal starPrice) {
	this.starPrice = starPrice;
}
public BigDecimal getDeliveryPrice() {
	return deliveryPrice;
}
public void setDeliveryPrice(BigDecimal deliveryPrice) {
	this.deliveryPrice = deliveryPrice;
}
public String getRemarks() {
	return remarks;
}
public void setRemarks(String remarks) {
	this.remarks = remarks;
}
 
 //get、set ... ...
 
}