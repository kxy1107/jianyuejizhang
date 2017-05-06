// pages/record-expend/record-expend.js
var util = require('../../utils/util.js')

Page({

  data: {
    consumpPatternsList: [],
    billNo: "",
    date: "",//日期
    selectName: "饮食",//选择的消费方式
    selectImg: "../../img/food_p.png",
    isShowCaculator: true,//是否显示计算器（隐藏为空）
    spendMoney: "0.00",
    remarksText: "",
    caculatorEnd: true,//计算完毕，重新开始
    todayDate: "",


  },
  //选择消费去处
  onConsumptionItemClick: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.consumpPatternsList;

    for (var key of list) {
      key.IsSelect = false;
    }
    list[index].IsSelect = true;
    this.setData({
      consumpPatternsList: list,
      selectName: list[index].Name,
      selectImg: list[index].IconSel,
    });
  },
  //选择时间
  onDateChange: function (e) {
    this.setData({
      date: e.detail.value,
    });
  },
  //显示计算器
  showCaculator: function () {
    this.setData({
      isShowCaculator: true,
    });
  },
  //隐藏计算器
  hiddenCaculator: function () {
    this.setData({
      isShowCaculator: false,
    });

  },

  //备注输入框
  onInputRemarks: function (e) {
    var text = e.detail.value;
    this.setData({
      remarksText: text,
    });
    if (this.data.isShowCaculator) {
      hiddenCaculator();
    }
  },

  //完成记录
  confirmData: function () {


    //未计算结果
    if (!this.data.caculatorEnd) {
      this.caculatorResult();
    }
    if (parseFloat(this.data.spendMoney) == 0) {
      wx.showToast({
        title: '请输入花费金额',
        duration: 2000
      });
      return;
    }
    this.addRecordBill();

  },


  //获取消费方式
  getSpendWayList: function () {
    let that = this;
    let openID = wx.getStorageSync('openID');
    let data = {
      UserNo: openID,
    };
    let url = getApp().globalData.address + "/getSpendWayList";
    util.HttpGet(url, data, function (res) {
      if (res.Code == 1) {
        that.setData({
          consumpPatternsList: res.SpendWayList
        });
        that.getBillDetailInfo();
      }
    })
  },

  //获取消费详情
  getBillDetailInfo: function () {
    let that = this;
    if(that.data.billNo == ""){
      return;
    }

    let openID = wx.getStorageSync('openID');
    let data = {
      UserNo: openID,
      BillNo: that.data.billNo,
    };
    let url = getApp().globalData.address + "/getBillDetailInfo";
    util.HttpGet(url, data, function (res) {
      if (res.Code == 1) {
        let list = that.data.consumpPatternsList;
        for (var key of list) {
          if (key.Name == res.BillInfo[0]["Purpose"]) {
            key.IsSelect = true;
          } else {
            key.IsSelect = false;
          }
        }


        that.setData({
          consumpPatternsList: list,
          date: res.BillInfo[0]["BillDate"],
          spendMoney: res.BillInfo[0]["SpendMoney"],
          remarksText: res.BillInfo[0]["Remark"],
          selectName: res.BillInfo[0]["Purpose"],
          selectImg: res.BillInfo[0]["PurposeIcon"],
        });
      }
    })
  },


  //保存账单到服务
  addRecordBill: function () {
    let openID = wx.getStorageSync('openID');
    let data = {
      UserNo: openID,
      BillNo: this.data.billNo,
      Date: this.data.date,
      SpendMoney: this.data.spendMoney,
      Remarks: this.data.remarksText,
      SpendWay: this.data.selectName,
      SpendWayImg: this.data.selectImg,
    };
    let url = getApp().globalData.address + "/addRecordBill";
    util.HttpGet(url, data, function (res) {
      if (res.Code == 1) {
        wx.showToast({
          title: '记账成功',
          icon: 'success',
          duration: 500,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 500)
          }
        });

      } else {
        wx.showToast({
          title: '记账失败',
          icon: 'success',
          duration: 500,
        });
      }
    });

  },


  ////////计算器相关
  touchNum: function (e) {

    var text = e.currentTarget.dataset.num;
    var num = "";
    if (text == "+") {
      this.setData({
        caculatorEnd: false,
      });
    }
    if (parseFloat(this.data.spendMoney) != 0) {
      num = this.data.spendMoney;
      if (this.data.caculatorEnd) {
        num = "";
      }
    }
    num = num + text;
    this.setData({
      spendMoney: num == 0 ? "0.00" : num,
      caculatorEnd: false,
    });
  },
  //删除一个字符
  touchClear: function () {

    if (parseFloat(this.data.spendMoney) != 0) {
      var text = this.data.spendMoney;
      text = text.substring(0, text.length - 1);

      this.setData({
        spendMoney: text == 0 ? "0.00" : text,
      });
    }
  },

  //计算结果
  touchResult: function () {
    this.caculatorResult();

  },


  caculatorResult: function () {
    if (parseFloat(this.data.spendMoney) != 0) {
      var result = this.data.spendMoney;
      var strResult = result.split("+");
      var sum = 0;
      strResult.forEach(function (num) {
        sum += parseFloat(num == "" ? 0 : num)
      });
      this.setData({
        spendMoney: sum == 0 ? "0.00" : sum,
        caculatorEnd: true,
      });
    }
  },


  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      billNo: options.billID
    });
  },
  onReady: function () {
     this.setData({
      date: util.formatTime(new Date(), "yyyy-MM-dd"),
      todayDate: util.formatTime(new Date(), "yyyy-MM-dd"),
    });
    this.getSpendWayList();
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
  },
})