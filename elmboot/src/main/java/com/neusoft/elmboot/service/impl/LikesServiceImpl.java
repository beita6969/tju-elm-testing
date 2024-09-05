package com.neusoft.elmboot.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neusoft.elmboot.mapper.LikesMapper;
import com.neusoft.elmboot.service.LikesService;

@Service
public class LikesServiceImpl implements LikesService {
	
	 @Autowired
	 private LikesMapper likesMapper;
	
	 @Override
	 public int getLikesBybusinessId(Integer businessId) {
		 return likesMapper.getLikesBybusinessId(businessId);
	 }
	 
	 @Override
	 public int saveLikes(String userId,Integer businessId) {
		 return likesMapper.saveLikes(userId, businessId);
	 }
	 
	 @Override
	 public int removeLikes(String userId,Integer businessId) {
		 return likesMapper.removeLikes(userId, businessId);
	 }
	 
	 @Override
	 public int getLikesByUserIdByBusinessId(String userId,Integer businessId) {
		 return likesMapper.getLikesByUserIdByBusinessId(userId, businessId);
	 }
}