package com.neusoft.elmboot.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neusoft.elmboot.mapper.HistoryMapper;
import com.neusoft.elmboot.po.History;
import com.neusoft.elmboot.service.HistoryService;

@Service
public class HistoryServiceImpl implements HistoryService{
	
	@Autowired
	private HistoryMapper historyMapper;
	
	@Override
	public String getHistoryByUserId(History history) {
		String str="";
		
		if(historyMapper.findHistoryByUserId(history)==0) {
			str+="无搜索历史";
		}
		
		else {
			str+=historyMapper.getHistoryByUserId(history);
		}
		
		return str;	
	}

	@Override
	public int saveHistory(History history) {
		//select这个用户之前有没有搜索记录
		//if有搜索记录，则update搜索记录
		//else没有搜索记录，则insert搜索记录
		if(historyMapper.judgeExist(history)==0) {
			historyMapper.saveHistory(history);
		}
		else {
			historyMapper.updateHistory(history);
		}
		
		return 1;
	}
}
