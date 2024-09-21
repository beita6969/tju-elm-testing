package com.neusoft.elmboot.controller;


import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.elmboot.po.Business;
import com.neusoft.elmboot.po.History;
import com.neusoft.elmboot.service.BusinessService;
import com.neusoft.elmboot.service.HistoryService;


@RestController
@RequestMapping("/SearchController")
public class SearchController {
	
	@Autowired
	private BusinessService businessService;
	@Autowired
	private HistoryService historyService;
	
	 @RequestMapping("/listBusiness")
	 public List<Business> listBusiness(@RequestBody History history) throws Exception {
	   String userId = history.getUserId();
	   String searchContent = history.getSearchContent();
	   StringBuffer str=new StringBuffer();
	   List<Business> businessList = new ArrayList<>();
	   for(char ch:searchContent.toCharArray()) {
		   str.append(ch);
		   String nowContent = str.toString();
		   businessList.addAll(businessService.listBusinessByBusinessName(nowContent));
	   }
	   
	   //去重：
	   Set<Business> set = new HashSet<>();
       for (Business i : businessList) {
           set.add(i);
       }
       businessList.clear();
       businessList.addAll(set);
	   
	   Collections.reverse(businessList);
	   
	   
	   //将本次的搜索语句存到historysearch数据库表中，注：本次的搜索语句是searchContent
	   historyService.saveHistory(history);
	   
	   return businessList;
	 }
	 
	 @RequestMapping("/getHistoryByUserId")
	 public String getHistoryByUserId(@RequestBody History history) throws Exception {
	   return historyService.getHistoryByUserId(history);
	   
	 }
}
