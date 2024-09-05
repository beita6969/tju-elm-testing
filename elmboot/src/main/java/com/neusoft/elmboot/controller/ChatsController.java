package com.neusoft.elmboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
	public List<Chats> getChatsByUserId(String userId){
		return chatsService.getChatsByUserId(userId);
	}
	
	@RequestMapping("/saveChats")
	public int saveChats(Chats chats) {
		return chatsService.saveChats(chats);
	}
}
