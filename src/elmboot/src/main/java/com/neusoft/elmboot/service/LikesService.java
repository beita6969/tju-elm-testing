package com.neusoft.elmboot.service;

import java.util.List;
import java.util.Map;

import com.neusoft.elmboot.po.Likes;

public interface LikesService {
	 public int getLikesBybusinessId(Likes likes);
	 public int saveLikes(Likes likes);
	 public int removeLikes(Likes likes);
	 public int getLikesByUserIdByBusinessId(Likes likes);
	 public List<Map<String, Object>> getLikesByUserId(String userId);
}
