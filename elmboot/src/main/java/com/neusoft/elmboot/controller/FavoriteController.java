package com.neusoft.elmboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.elmboot.po.Favorite;
import com.neusoft.elmboot.service.FavoriteService;


@RestController
@RequestMapping("/FavoriteController")
public class FavoriteController {
	
	@Autowired
	private FavoriteService favoriteService;
	
	@RequestMapping("/saveFavoriteBusinessId")
	public int saveFavoriteBusinessId(Favorite favorite) {
		return favoriteService.saveFavoriteBusinessId(favorite);
	}
	
	@RequestMapping("/listFavoriteByUserId")
	public List<Integer> listFavoriteByUserId(String userId) {
		return favoriteService.listFavoriteByUserId(userId);
	}
}
