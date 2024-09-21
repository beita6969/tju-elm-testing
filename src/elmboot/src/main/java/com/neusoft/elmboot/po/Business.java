package com.neusoft.elmboot.po;

import java.math.BigDecimal;
import java.util.Objects;

public class Business {
 private Integer businessId;
 private String businessName;
 private String phoneNumber;
 private String password;
 private String businessAddress;
 private String businessExplain;
 private String businessImg;
 private Integer orderTypeId;
 private BigDecimal starPrice; //起送费
 private BigDecimal deliveryPrice; //配送费
 private String remarks;
 
 
 public String getPhoneNumber() {
	return phoneNumber;
}
public void setPhoneNumber(String phoneNumber) {
	this.phoneNumber = phoneNumber;
}
public String getPassword() {
	return password;
}
public void setPassword(String password) {
	this.password = password;
}
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

@Override
public int hashCode() {
	return Objects.hash(businessAddress, businessExplain, businessId, businessImg, businessName, deliveryPrice,
			orderTypeId, password, remarks, starPrice);
}

@Override
public boolean equals(Object obj) {
	if (this == obj)
		return true;
	if (obj == null)
		return false;
	if (getClass() != obj.getClass())
		return false;
	Business other = (Business) obj;
	//只要主键businessId相同就认为是相同的business商家
	return Objects.equals(businessId, other.businessId);
	
}
 

 
}