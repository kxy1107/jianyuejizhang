//app.js
var util = require('/utils/util.js')
App({
  getUserInfo: function () {
    var that = this
    //调用登录接口
    wx.login({
      success: function (Res) {
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo;
            that.getOpenID(Res.code,res);
          }
        })
      }
    })

  },

  //获取openID
  getOpenID: function (code,res) {
    var that = this;
    var loginUrl = "https://api.weixin.qq.com/sns/jscode2session";
    var dataInfo = {
      appid: "wx12e0d9958c5b3bb6",
      secret: "30356ac2c536e99bbfe1ad2cd2a40963",
      js_code:code,
      grant_type: "authorization_code",
    }
    util.HttpGet(loginUrl, dataInfo, function (response) {
       wx.setStorageSync('openID', response.openid);
      ////调用自己的登陆接口
      let URL = that.globalData.address + "/login";
      let loginData = {
        UserNo: response.openid,
        UserImg: that.globalData.userInfo.avatarUrl,
        UserName: that.globalData.userInfo.nickName,
      };
      util.HttpGet(URL, loginData, function (res) {
        if (res.Code == 1) {

        }
      });

    });

  },


  onLaunch: function () {
  this.getUserInfo();
  },
  onReady: function () {
    // 页面渲染完成
    
  },

  globalData: {
    userInfo: null,
    address: "http://127.0.0.1:8012",
    openID:"",
  }
})