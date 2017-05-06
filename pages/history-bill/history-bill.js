// pages/history-bill/history-bill.js
var util = require('../../utils/util.js')
Page({
  data: {
    startDate: "",
    endDate: "",
    today: "",
    totalMoney: 0,
    historyBillList: [
    ],
    scrollHeight: "100%",
  },
  //更改开始日期
  startDateChange: function (e) {
    this.setData({
      startDate: e.detail.value
    });
    this.getHistoryBillList();
  },

  //更改结束日期
  endDateChange: function (e) {
    this.setData({
      endDate: e.detail.value
    });
    this.getHistoryBillList();
  },

  //点击列表查看消费详情
  onItemClick: function (e) {
    let billNo = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/record-expend/record-expend?billID=' + billNo,
    })
  },

  //请求服务获取历史账单
  getHistoryBillList: function () {
    let that = this;
    let openID = wx.getStorageSync('openID');
    let url = getApp().globalData.address + "/getHistoryBillList";
    let data = {
      UserNo: openID,
      StartDate: that.data.startDate,
      EndDate: that.data.endDate,
      PageSize: 20,
      PageIndex: 0,
    }
    util.HttpGet(url, data, function (res) {
      if (res.Code == 1) {
        that.setData({
          totalMoney: res.TotalMoney,
          historyBillList: res.HistoryBillList,
        });
      }
    })
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
 this.setData({
        startDate: util.formatTime(new Date(), "yyyy-MM-dd"),
        endDate: util.formatTime(new Date(), "yyyy-MM-dd"),
        today: util.formatTime(new Date(), "yyyy-MM-dd"),
      });
  },
  onReady: function () {

    // 页面渲染完成

  },
  onShow: function () {
  
    // 页面显示
    this.getHistoryBillList();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})