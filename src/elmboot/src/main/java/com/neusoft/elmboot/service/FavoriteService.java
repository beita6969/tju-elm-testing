package com.neusoft.elmboot.service;

import java.util.List;


import com.neusoft.elmboot.po.Favorite;

public interface FavoriteService {
	public int saveFavoriteBusinessId(Favorite favorite);
	public List<Integer> listFavoriteByUserId(Favorite favorite);
	public int removeFavoriteBusinessId(Favorite favorite);
}
