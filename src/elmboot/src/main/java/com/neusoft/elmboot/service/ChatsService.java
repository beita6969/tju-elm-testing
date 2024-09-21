package com.neusoft.elmboot.service;

import java.util.List;


import com.neusoft.elmboot.po.Chats;

public interface ChatsService {
	
	 public List<Chats> getChatsByUserId(String currentUserId);
	 public int saveChats(Chats chats);
	 public int removeChatsAllByCurrentUserId(Chats chats);
	 public int removeChatsByTwoUserIdByMessage(Chats chats);
	 public int recallChatsByTwoUserIdByMessage(Chats chats);
}
