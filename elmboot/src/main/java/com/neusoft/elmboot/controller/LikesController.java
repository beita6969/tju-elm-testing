package com.neusoft.elmboot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.elmboot.service.LikesService;

@RestController
@RequestMapping("/LikesController")
public class LikesController {
	
	 @Autowired
	 private LikesService likesService;
	
	 @RequestMapping("/getLikesBybusinessId")
	 public int getLikesBybusinessId(Integer businessId) {
		 return likesService.getLikesBybusinessId(businessId);
	 }
	 
	 @RequestMapping("/saveLikes")
	 public int saveLikes(String userId,Integer businessId) {
		 return likesService.saveLikes(userId, businessId);
	 }
	 
	 @RequestMapping("/removeLikes")
	 public int removeLikes(String userId,Integer businessId) {
		 return likesService.removeLikes(userId, businessId);
	 }
	 
	 @RequestMapping("/getLikesByUserIdByBusinessId")
	 public int getLikesByUserIdByBusinessId(String userId,Integer businessId) {
		 return likesService.getLikesByUserIdByBusinessId(userId, businessId);
	 }
}
