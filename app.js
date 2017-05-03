//app.js
var util = require('/utils/util.js')
App({
 getUserInfo:function(){
    var that = this
      //调用登录接口
      wx.login({
        success: function (LoginRes) {
          //获取openID
          var loginUrl = "https://api.weixin.qq.com/sns/jscode2session?";
          var dataInfo = {
            appid: "wx12e0d9958c5b3bb6",
            secret: "30356ac2c536e99bbfe1ad2cd2a40963",
            js_code: LoginRes.code,
            grant_type: "authorization_code",
          }
          util.HttpGet(loginUrl, dataInfo, function (response) {
                wx.setStorageSync('openid', response.openid);
                let URL = that.globalData.address + "/login";
                let loginData = {
                  UserNo:response.openid,
                  UserImg:that.globalData.userInfo.avatarUrl,
                  UserName:that.globalData.userInfo.nickName,
                };
              util.HttpGet(URL, loginData, function (res) {
                if(res.Code == 1){

                }
              });

          });
        
        }
      })
    
  },


  onLaunch: function () {
    let that = this;
      //获取基础信息
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
               that.getUserInfo();
            }
          })
  
  },
 
  globalData:{
    userInfo:null,
    address:"http://127.0.0.1:8012"
  }
})