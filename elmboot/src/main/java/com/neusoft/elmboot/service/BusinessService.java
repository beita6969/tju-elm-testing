package com.neusoft.elmboot.service;

import java.util.List;

import com.neusoft.elmboot.po.Business;

public interface BusinessService {

	public List<Business> listBusinessByOrderTypeId(Integer orderTypeId);
	public Business getBusinessById(Integer businessId);
}
