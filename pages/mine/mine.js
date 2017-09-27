//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
      avatarUrl:null,
      nickName:"",
  
  },

  onLoad: function () {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,

    });
  },
  onShow:function(){
   
  }
})