package com.neusoft.elmboot.service;

import java.util.List;

import com.neusoft.elmboot.po.Chats;

public interface ChatsService {
	
	 public List<Chats> getChatsByUserId(String userId);
	 public int saveChats(Chats chats);
}
