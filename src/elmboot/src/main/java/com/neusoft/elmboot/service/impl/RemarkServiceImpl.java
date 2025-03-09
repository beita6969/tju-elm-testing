package com.neusoft.elmboot.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neusoft.elmboot.mapper.RemarkMapper;
import com.neusoft.elmboot.po.Remark;
import com.neusoft.elmboot.service.RemarkService;
import com.neusoft.elmboot.util.CommonUtil;

@Service
public class RemarkServiceImpl implements RemarkService{

	 @Autowired
	 private RemarkMapper remarkMapper;
	
	@Override
	public List<Remark> listRemarksByBusinessId(Integer businessId) {
		
		return remarkMapper.listRemarksByBusinessId(businessId);
	}

	@Override
	public int saveRemarks(Remark remark) {
		remark.setRemarkDate(CommonUtil.getCurrentDate());
		//返回值是评论编号
		return remarkMapper.saveRemarks(remark);
	}
	
	@Override
	public int removeOneRemark(Remark remark) {
		return remarkMapper.removeOneRemark(remark);
	}
	
	
	@Override
	public List<Remark> removeAllRemarksByUserId(String userId) {
		return remarkMapper.removeAllRemarksByUserId(userId);
	}
	
	@Override
	public int getRemarkCountByBusinessId(Integer businessId) {
		return remarkMapper.getRemarkCountByBusinessId(businessId);
	}
}
