package com.neusoft.elmboot.config;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@ConfigurationProperties(prefix = "elm.wenxincontroller")
@Data
public class WenXinProperties {
    private  String apiKey;
    private  String secretKey;
    private  String tokenUrl;
    private String chatUrl;
    
    public String getApiKey() {
		return "LzHLae3ch9isirMsCDnfO4gV";
	}
	public void setApiKey(String apiKey) {
		this.apiKey = apiKey;
	}
	public String getSecretKey() {
		return "qEaqABpUPU4bQX2tuXK6efOeATaxA0jP";
	}
	public void setSecretKey(String secretKey) {
		this.secretKey = secretKey;
	}
	public String getChatUrl() {
		return "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-tiny-8k";
	}
	public void setTokenUrl(String tokenUrl) {
		this.tokenUrl = tokenUrl;
	}
	public String getTokenUrl() {
		return "https://aip.baidubce.com/oauth/2.0/token";
	}
	public void setChatUrl(String chatUrl) {
		this.chatUrl = chatUrl;
	}
	
}
