package com.neusoft.elm.po;

//持久化数据库的表1
//表1

public class Admin {
    //属性
    private Integer adminId;
    private String adminName;
    private String password;

    //get set 方法

    public Integer getAdminId() {
        return adminId;
    }

    public void setAdminId(Integer adminId) {
        this.adminId = adminId;
    }

    public String getAdminName() {
        return adminName;
    }

    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
