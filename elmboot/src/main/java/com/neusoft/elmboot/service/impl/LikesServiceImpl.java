package com.neusoft.elmboot.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neusoft.elmboot.mapper.LikesMapper;
import com.neusoft.elmboot.po.Likes;
import com.neusoft.elmboot.service.LikesService;

@Service
public class LikesServiceImpl implements LikesService {
	
	 @Autowired
	 private LikesMapper likesMapper;
	
	 @Override
	 public int getLikesBybusinessId(Likes likes) {
		 return likesMapper.getLikesBybusinessId(likes);
	 }
	 
	 @Override
	 public int saveLikes(Likes likes) {
		 return likesMapper.saveLikes(likes);
	 }
	 
	 @Override
	 public int removeLikes(Likes likes) {
		 return likesMapper.removeLikes(likes);
	 }
	 
	 @Override
	 public int getLikesByUserIdByBusinessId(Likes likes) {
		 return likesMapper.getLikesByUserIdByBusinessId(likes);
	 }
}