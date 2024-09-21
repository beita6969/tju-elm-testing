package com.neusoft.elmboot.service.impl;

import com.neusoft.elmboot.mapper.BusinessMapper;
import com.neusoft.elmboot.po.Business;
import com.neusoft.elmboot.service.BusinessService;
import jakarta.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class BusinessServiceImpl implements BusinessService {

	@Autowired
	private BusinessMapper businessMapper;

	@Override
	public List<Business> listBusinessByOrderTypeId(Integer orderTypeId) {
		return businessMapper.listBusinessByOrderTypeId(orderTypeId);
	}

	@Override
	public Business getBusinessById(Integer businessId) {
		return businessMapper.getBusinessById(businessId);
	}
	
	@Override
	public Business getBusinessByIdByPass(Business business) {
    	return businessMapper.getBusinessByIdByPass(business);
    }

	@Override
	public List<Business> listBusinessByBusinessName(String businessName) {
		return businessMapper.listBusinessByBusinessName(businessName);
	}
	
	@Override
	public int saveBusiness(Business business){
    	return businessMapper.saveBusiness(business);
    }

	@Override
	public int updateBusiness(Business business) {
		return businessMapper.updateBusiness(business);
	}

	@Override
	public int checkBusiness(Business business) {
		return businessMapper.checkBusiness(business);
	}
	
	@Override
	public int getBusinessIdByPhoneNumber(Business business){
    	return businessMapper.getBusinessIdByPhoneNumber(business);
    }

}