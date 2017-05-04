//index.js
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    todayExpend: "0",
    monthExpend: "0",
    yearExpend: "0",
    todayRecord: [],

  },
  //点击跳到记账
  recodeExpend: function () {
    wx.navigateTo({
      url: '../../pages/record-expend/record-expend?billID=""',
    })
  },

lookHistoryBill:function(){
   wx.navigateTo({
      url: '../../pages/history-bill/history-bill',
    })
},

  //今日账单item点击
  onTodayBillItemClick: function (e) {
    let billNo = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../../pages/record-expend/record-expend?billID=' + this.data.billNo ,
    })

  },
  //今日账单item长按
  ononTodayBillLongItemClick: function (e) {
let index = e.currentTarget.dataset.index;
  },

  //获取首页信息
  getTodayBill: function () {
    let url = app.globalData.address + "/getTodayBill";
    let data = {
      UserNo: app.openID,
    }
    util.HttpGet(url, data, function (res) {


    })
  },



  onLoad: function () {

  },
  onReady: function () {
    this.getTodayBill();
  },
  onShow: function () {




  },

  onShareAppMessage: function () {
    return {
      title: '账单',
      path: 'pages/index/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },

})
