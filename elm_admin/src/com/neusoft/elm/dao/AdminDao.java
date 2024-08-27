package com.neusoft.elm.dao;

import com.neusoft.elm.po.Admin;

public interface AdminDao {

    public Admin getAdminByNameByPass(String adminName,String password);
}
