package com.neusoft.elmboot.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

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
		Chats chats2 = new Chats();
		chats.setCurrentUserId(chats.getSenderUserId());
		chats2.setCurrentUserId(chats.getReceiverUserId());
		chats2.setSenderUserId(chats.getSenderUserId());
		chats2.setReceiverUserId(chats.getReceiverUserId());
		chats2.setMessage(chats.getMessage());
		chatsMapper.saveChats(chats);
		chatsMapper.saveChats(chats2);
		return 2;
	}
	
	@Override
	public int removeChatsAllByCurrentUserId(Chats chats) {
		return chatsMapper.removeChatsAllByCurrentUserId(chats);
	}
	
	@Override
	public int removeChatsByTwoUserIdByMessage(Chats chats) {
		return chatsMapper.removeChatsByTwoUserIdByMessage(chats);
	}
	
	@Override
	public int recallChatsByTwoUserIdByMessage(Chats chats) {
		chats.setSenderUserId(chats.getCurrentUserId());
		int count1=chatsMapper.recallChatsByTwoUserIdByMessage(chats);
		chats.setCurrentUserId(chats.getReceiverUserId());
		int count2=chatsMapper.recallChatsByTwoUserIdByMessage(chats);
		return count1+count2;
	}
}
