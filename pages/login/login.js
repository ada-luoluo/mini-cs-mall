import { request } from '../../utils/request.js'
const app = getApp()
Page({
  handleLogin: function () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台
        request("login", 'POST', { code: res.code }).then(res => {
          if(res.code === 200){
              // 将用户信息存储到全局变量或本地缓存中
              app.globalData.userInfo = res.data.user
              wx.setStorageSync('token', res.data.token)
              wx.setStorageSync('userInfo',res.data.user)
              console.log('这是登录的Token:', res.data.token); 
              console.log('登录后保存到缓存的-------:', res.data.user); 
              // 判断用户是否是第一次进入小程序
              if (getCurrentPages().length === 1) {  
                wx.switchTab({
                  url: '/pages/index/index'
                })
              } else {  
                wx.navigateBack({
                  delta: 1
                })
              }
          }else{
            wx.showToast({
              title: res.msg,
              icon: 'none',         
            })
          }
          
        }).catch(err => {
          console.error(err);
        });
      }
    })
  
  },

})