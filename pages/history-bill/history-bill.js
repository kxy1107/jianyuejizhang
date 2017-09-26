// pages/history-bill/history-bill.js
var util = require('../../utils/util.js')
var touchStartTime = 0;
var touchEndTime = 0;
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




  onTouchStart: function (e) {
    touchStartTime = e.timeStamp;
  },

  onTouchEnd: function (e) {
    touchEndTime = e.timeStamp;
  },

  //今日账单item点击
  onHisterBillItemClick: function (e) {
    let that = this;
    let billNo = e.currentTarget.dataset.id;
    if (touchEndTime - touchStartTime > 500) {
      wx.showModal({
        title: '提示',
        content: '确认删除本条账单记录！！！',
        success: function (res) {
          if (res.confirm) {
            that.delRecordBill(billNo);
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../../pages/record-expend/record-expend?billID=' + billNo,
      })
    }
  },

  delRecordBill: function (BillNo) {
    let that = this;
    let openID = wx.getStorageSync('openID');
    let url = app.globalData.address + "/delRecordBill";
    let data = {
      UserNo: openID,
      BillNo: BillNo
    }
    util.HttpGet(url, data, function (res) {
      if (res.Code == 1) {
        that.getTodayBill();
      }
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

    var startDate = util.addDay(-7);

    this.setData({
      startDate: util.formatTime(startDate, "yyyy-MM-dd"),
      endDate: util.formatTime(new Date(), "yyyy-MM-dd"),
      today: util.formatTime(new Date(), "yyyy-MM-dd"),
    });
    this.getHistoryBillList();
  },
  onReady: function () {
   
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
   
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})