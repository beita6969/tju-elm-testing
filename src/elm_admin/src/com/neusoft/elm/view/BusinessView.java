package com.neusoft.elm.view;

import com.neusoft.elm.po.Business;

public interface BusinessView {
    public void listBusinessAll();
    //模糊匹配查询
    public void listBusiness();

    public void saveBusiness();

    public void removeBusiness();

    public Business login();

    public void showBusiness(Integer businessId);

    //更新商家信息的View层
    public void editBusiness(Integer businessId);

    //更新密码的View层
    public void updateBusinessByPassword(Integer businessId);
}
