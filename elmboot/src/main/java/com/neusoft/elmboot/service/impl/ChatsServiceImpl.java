package com.neusoft.elmboot.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neusoft.elmboot.mapper.ChatsMapper;
import com.neusoft.elmboot.po.Chats;
import com.neusoft.elmboot.service.ChatsService;

@Service
public class ChatsServiceImpl implements ChatsService{
	
	@Autowired
	private ChatsMapper chatsMapper;
	
	@Override
	public List<Chats> getChatsByUserId(String userId){
		return chatsMapper.getChatsByUserId(userId);
	}
	@Override
	public int saveChats(Chats chats) {
		return chatsMapper.saveChats(chats);
	}
}
