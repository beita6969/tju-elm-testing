package com.neusoft.elmboot.service;

import java.util.List;

import com.neusoft.elmboot.po.Business;
import com.neusoft.elmboot.po.Remark;

public interface RemarkService {
	
	 public List<Remark> listRemarksByBusinessId(Integer businessId);
	 public int saveRemarks(Remark remark);
	 public int removeOneRemark(Remark remark);
	 
	 
	 
	 public List<Remark> removeAllRemarksByUserId(String userId);
	 
}
