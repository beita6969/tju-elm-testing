package com.neusoft.elmboot.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neusoft.elmboot.mapper.FavoriteMapper;
import com.neusoft.elmboot.po.Favorite;
import com.neusoft.elmboot.service.FavoriteService;

@Service
public class FavoriteServiceImpl implements FavoriteService{
	
	@Autowired
	private FavoriteMapper favoriteMapper;
	
	@Override
	public int saveFavoriteBusinessId(Favorite favorite) {
		return favoriteMapper.saveFavoriteBusinessId(favorite);
	}

	@Override
	public List<Integer> listFavoriteByUserId(Favorite favorite) {
		return favoriteMapper.listFavoriteByUserId(favorite);
	}

	@Override
	public int removeFavoriteBusinessId(Favorite favorite) {
		return favoriteMapper.removeFavoriteBusinessId(favorite);
	}
}
