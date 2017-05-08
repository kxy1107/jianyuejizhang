var wxCharts = require('../../utils/wxcharts.js')
var util = require('../../utils/util.js')
var app = getApp();
var lineChart = null;
Page({
  data: {
    // MonthDate: [],
    // Money: []
  },
  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec'
    });
  },

  // updateData: function () {

  //     var series = [{
  //         name: '成交量1',
  //         data: simulationData.data,
  //         format: function (val, name) {
  //             return val.toFixed(2) + '万';
  //         }
  //     }];
  //     lineChart.updateData({
  //         categories: simulationData.categories,
  //         series: series
  //     });
  // },
  //请求服务获取图表数据
  getChartsData: function () {
    let that = this;
    let openID = wx.getStorageSync('openID');
    let url = app.globalData.address + "/getChartsData";
    let data = {
      UserNo: openID,
    }
    util.HttpGet(url, data, function (res) {
      if (res.Code == 1) {
        let date = [];
        let money = [];
        for (let key of res.ChartsData) {
          date.push(key.Date);
          money.push(key.SpendMoney);
        }
        // that.setData({
        //   MonthDate: date,
        //   Money:money
        // });
        that.initCharts(date,money);
      }


    })
  },


  initCharts: function (date,money) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: date,
      animation: true,
      background: '#f5f5f5',
      series: [{
        name: '每月总支出',
        data: money,
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '花费金额 (元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      
    });

  },

  onLoad: function (e) {
   this.getChartsData();
  }
});