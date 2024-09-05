package com.neusoft.elmboot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.elmboot.service.impl.WenxinService;

@RestController
@RequestMapping("/api/wenxin")
public class WenxinController {

    @Autowired
    private WenxinService wenxinService;

    @PostMapping("/query")
    public ResponseEntity<String> queryWenxin(@RequestBody String question) {
        String response = wenxinService.queryWenxin(question);
        return ResponseEntity.ok(response);
    }
}

