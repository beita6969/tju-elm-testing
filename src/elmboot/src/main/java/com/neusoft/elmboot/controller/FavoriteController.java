package com.neusoft.elmboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
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
	public int saveFavoriteBusinessId(@RequestBody Favorite favorite) {
		return favoriteService.saveFavoriteBusinessId(favorite);
	}
	
	@RequestMapping("/listFavoriteByUserId")
	public List<Integer> listFavoriteByUserId(@RequestBody Favorite favorite) {
		return favoriteService.listFavoriteByUserId(favorite);
	}
	
	@RequestMapping("/removeFavoriteBusinessId")
	public int removeFavoriteBusinessId(@RequestBody Favorite favorite) {
		return favoriteService.removeFavoriteBusinessId(favorite);
	}
	
	@RequestMapping("/getFavoriteCountByBusinessId")
	public int getFavoriteCountByBusinessId(@RequestBody Favorite favorite) {
		return favoriteService.getFavoriteCountByBusinessId(favorite);
	}
}
