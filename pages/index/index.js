//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
   todayExpend:"100",
    monthExpend:"1100",
   
  },
  //事件处理函数
  recodeExpend: function() {
   wx.navigateTo({
     url: '../../pages/record-expend/record-expend',
   })
  },
  onLoad: function () {
  }
})
