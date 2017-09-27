//app.js
var util = require('/utils/util.js')
App({
  getUserInfo: function (userInfoRes) {
    var that = this
    //调用登录接口
    wx.login({
      success: function (Res) {
        wx.getUserInfo({
          success: function (res) {
            wx.setStorageSync("userInfo", res.userInfo);
            let code = Res.code;
            let iv = res.iv;
            let encryptedData = res.encryptedData;
            let url = that.globalData.address + '/login';
            let data = {
              Code: code,
              Iv: iv,
              EncryptedData: encryptedData,
            }
            util.HttpGet(url, data, function (res) {
              if (res.Code == 1) {
                wx.setStorageSync("openID", res.OpenID);
                return typeof userInfoRes == "function" && userInfoRes(res.OpenID);
              }
            });


          }

        })
      }
    })

  },



  onLaunch: function () {
  
  },
  onReady: function () {
    // 页面渲染完成

  },

  globalData: {
     //address: "http://127.0.0.1:8012",
    address: "https://jianyuejizhang.cn",

  }
})