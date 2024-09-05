package com.neusoft.elmboot.po;

public class Remark {

	private String remark;
	private String userId;
	private String userName;
	private Integer businessId;
	private String remarkDate;
	private Integer remarkId;
	
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Integer getBusinessId() {
		return businessId;
	}
	public void setBusinessId(Integer businessId) {
		this.businessId = businessId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getRemarkDate() {
		return remarkDate;
	}
	public void setRemarkDate(String remarkDate) {
		this.remarkDate = remarkDate;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public Integer getRemarkId() {
		return remarkId;
	}
	public void setRemarkId(Integer remarkId) {
		this.remarkId = remarkId;
	}
	
	
}
