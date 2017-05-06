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
      url: '../../pages/record-expend/record-expend?billID=',
    })
  },

  //点击查看历史账单
  lookHistoryBill: function () {
    wx.navigateTo({
      url: '../../pages/history-bill/history-bill',
    })
  },

  //今日账单item点击
  onTodayBillItemClick: function (e) {
    let billNo = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/record-expend/record-expend?billID=' + billNo,
    })

  },
  //今日账单item长按
  ononTodayBillLongItemClick: function (e) {
    let that = this;
    let billNo = e.currentTarget.dataset.id;
    wx.showModal({
  title: '提示',
  content: '确认删除本条账单记录！！！',
  success: function(res) {
    if (res.confirm) {
     that.delRecordBill(billNo);
    } 
  }
})

  },

  //获取首页信息
  getTodayBill: function () {
    let that = this;
    let openID = wx.getStorageSync('openID');
    let url = app.globalData.address + "/getTodayBill";
    let data = {
      UserNo: openID,
    }
    util.HttpGet(url, data, function (res) {
      if (res.Code == 1) {
        that.setData({
          todayExpend: res.TodayCost,
          monthExpend: res.MonthCost,
          yearExpend: res.YearCost,
          todayRecord: res.TodayRecordList,
        });

      }


    })
  },

  delRecordBill:function(BillNo){
    let that = this;
    let openID = wx.getStorageSync('openID');
    let url = app.globalData.address + "/delRecordBill";
    let data = {
      UserNo: openID,
      BillNo:BillNo
    }
    util.HttpGet(url, data, function (res) {
      if (res.Code == 1) {
        that.getTodayBill();
      }
    })
  },


  onLoad: function () {

  },
  onReady: function () {
  },
  onShow: function () {
    let that = this;
    let openID = wx.getStorageSync('openID');
    if (openID != "") {
      that.getTodayBill();
    } else {
      //调用登录接口
      wx.login({
        success: function (Res) {
          wx.getUserInfo({
            success: function (resGetUserInfo) {
              that.globalData.userInfo = resGetUserInfo.userInfo;
              var loginUrl = "https://api.weixin.qq.com/sns/jscode2session";
              var dataInfo = {
                appid: "wx12e0d9958c5b3bb6",
                secret: "30356ac2c536e99bbfe1ad2cd2a40963",
                js_code: Res.code,
                grant_type: "authorization_code",
              }
              util.HttpGet(loginUrl, dataInfo, function (response) {
                wx.setStorageSync('openID', response.openid);
                ////调用自己的登陆接口
                let URL = address + "/login";
                let loginData = {
                  UserNo: response.openid,
                  UserImg: resGetUserInfo.userInfo.avatarUrl,
                  UserName: resGetUserInfo.userInfo.nickName,
                };
                util.HttpGet(URL, loginData, function (res) {
                  if (res.Code == 1) {
                    that.getTodayBill();
                  }
                });

              });

            }
          })
        }
      })
    }

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
