package com.neusoft.elmboot.service;

import com.neusoft.elmboot.po.History;

public interface HistoryService {
	public String getHistoryByUserId(History history);
	public int saveHistory(History history);
}
