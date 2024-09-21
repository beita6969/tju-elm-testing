package com.neusoft.elmboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.elmboot.po.Chats;
import com.neusoft.elmboot.service.ChatsService;

@RestController
@RequestMapping("/ChatsController")
public class ChatsController {
	@Autowired 
	private ChatsService chatsService;
	
	@RequestMapping("/getChatsByUserId")
	public List<Chats> getChatsByUserId(@RequestBody Chats chats){
		return chatsService.getChatsByUserId(chats.getCurrentUserId());
	}
	
	@RequestMapping("/saveChats")
	public int saveChats(@RequestBody Chats chats) {
		return chatsService.saveChats(chats);
	}
	
	@RequestMapping("/removeChatsAllByCurrentUserId")
	public int removeChatsAllByCurrentUserId(@RequestBody Chats chats) {
		return chatsService.removeChatsAllByCurrentUserId(chats);
	}
	
	@RequestMapping("/removeChatsByTwoUserIdByMessage")
	public int removeChatsByTwoUserIdByMessage(@RequestBody Chats chats) {
		return chatsService.removeChatsByTwoUserIdByMessage(chats);
	}
	
	@RequestMapping("/recallChatsByTwoUserIdByMessage")
	public int recallChatsByTwoUserIdByMessage(@RequestBody Chats chats) {
		return chatsService.recallChatsByTwoUserIdByMessage(chats);
	}
}
