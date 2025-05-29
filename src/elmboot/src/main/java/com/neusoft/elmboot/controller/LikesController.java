package com.neusoft.elmboot.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.elmboot.po.Likes;
import com.neusoft.elmboot.service.LikesService;

@RestController
@RequestMapping("/LikesController")
public class LikesController {
	
	 @Autowired
	 private LikesService likesService;
	
	 @RequestMapping("/getLikesBybusinessId")
	 public int getLikesBybusinessId(@RequestBody Likes likes) {
		 return likesService.getLikesBybusinessId(likes);
	 }
	 
	 @RequestMapping("/saveLikes")
	 public int saveLikes(@RequestBody Likes likes) {
		 return likesService.saveLikes(likes);
	 }
	 
	 @RequestMapping("/removeLikes")
	 public int removeLikes(@RequestBody Likes likes) {
		 return likesService.removeLikes(likes);
	 }
	 
	 @RequestMapping("/getLikesByUserIdByBusinessId")
	 public int getLikesByUserIdByBusinessId(@RequestBody Likes likes) {
		 return likesService.getLikesByUserIdByBusinessId(likes);
	 }
	 
	 @RequestMapping("/getLikesByUserId")
	 public List<Map<String, Object>> getLikesByUserId(@RequestBody Map<String, String> param) {
		 return likesService.getLikesByUserId(param.get("userId"));
	 }
}
