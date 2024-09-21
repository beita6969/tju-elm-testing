package com.neusoft.elm.dao;

import com.neusoft.elm.po.Business;

import java.util.List;

public interface BusinessDao {
    //参数方便之后做模糊查询
    public List<Business> listBusiness(String businessName,String businessAddress);
    //返回值是新建商家的编号（主键）
    public int saveBusiness(String businessName);
    //按主键删除商家
    public int removeBusiness(int businessId);
    //获取商家
    public Business getBusinessByIdByPass(Integer businessId,String password);
    //查看商家信息
    public Business getBusinessById(Integer businessId);
    //修改商家信息(增，删，改 的返回值都是int)
    public int updateBusiness(Business business);
    //修改商家密码
    public int updateBusinessPassword(Integer businessId,String password);

}
