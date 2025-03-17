package com.neusoft.elmboot.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.elmboot.po.Business;
import com.neusoft.elmboot.po.Remark;
import com.neusoft.elmboot.service.BusinessService;
import com.neusoft.elmboot.service.RemarkService;

@RestController
@RequestMapping("/CommentController")
public class RemarkController {
    @Autowired
    private RemarkService remarkService;
    
    //需要businessId
    @RequestMapping("/listRemarksByBussinessId")
    public List<Remark> listRemarksByBussinessId(@RequestBody Remark remark){
        return remarkService.listRemarksByBusinessId(remark.getBusinessId());
    }
    
    //需要userId,businessId,userName,remark
    @RequestMapping("/saveRemarks")
    public int saveRemarks(@RequestBody Remark remark) {
		return remarkService.saveRemarks(remark);
	}
    
    @RequestMapping("/removeOneRemark")
    public int removeOneRemark(@RequestBody Remark remark){
    	return remarkService.removeOneRemark(remark);
    }
    
    @RequestMapping("/removeAllRemarksByUserId")
    public List<Remark> removeAllRemarksByUserId(String userId){
    	return remarkService.removeAllRemarksByUserId(userId);
    }
    
    @RequestMapping("/getRemarkCountByBusinessId")
    public int getRemarkCountByBusinessId(@RequestBody Remark remark) {
        if (remark == null || remark.getBusinessId() == null) {
            return 0;
        }
        return remarkService.getRemarkCountByBusinessId(remark.getBusinessId());
    }
    
    @RequestMapping("/getCommentsByUserId")
    public List<Map<String, Object>> getCommentsByUserId(@RequestBody Map<String, String> param){
        return remarkService.getCommentsByUserId(param.get("userId"));
    }
}
