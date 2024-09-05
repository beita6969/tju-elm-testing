package com.neusoft.elmboot.service;

public interface LikesService {
	 public int getLikesBybusinessId(Integer businessId);
	 public int saveLikes(String userId,Integer businessId);
	 public int removeLikes(String userId,Integer businessId);
	 public int getLikesByUserIdByBusinessId(String userId,Integer businessId);
}
