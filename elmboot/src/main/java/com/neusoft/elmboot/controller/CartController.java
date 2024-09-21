package com.neusoft.elmboot.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.neusoft.elmboot.po.Cart;
import com.neusoft.elmboot.service.CartService;
@RestController
@RequestMapping("/CartController")
public class CartController {
 @Autowired
 private CartService cartService;
 
 @RequestMapping("/listCart")
 public List<Cart> listCart(@RequestBody Cart cart) throws Exception{
 return cartService.listCart(cart);
 }
 
 @RequestMapping("/saveCart")
 public int saveCart(@RequestBody Cart cart) throws Exception{
 return cartService.saveCart(cart);
 }
 
 @RequestMapping("/updateCart")
 public int updateCart(@RequestBody Cart cart) throws Exception{
 return cartService.updateCart(cart);
 }
 
 @RequestMapping("/removeCart")
 public int removeCart(@RequestBody Cart cart) throws Exception{
	 return cartService.removeCart(cart);
	 }
	}