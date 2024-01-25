const app = getApp()

import {api} from '../../utils/api.js'
Page({
  data: {
    showCancelModal: false, 
    name:"",
    avatar:"/images/my08.png",
    no:'',
    gender:null,
    birthday:""
  },

  onShow() {
    //tabbar
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }


        // 判断用户是否已经登录
    const token = wx.getStorageSync('token');
    console.log('onshow token----------', token)
    if (token) {
      let userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
      console.log('onshow userInfo----------', userInfo)

      // 尝试从本地存储中获取会员编号
      const cachedNo = wx.getStorageSync('no');
      if (cachedNo) {
        userInfo.no = cachedNo;
      }

      this.setData({
        name: userInfo.name,
        avatar: userInfo.avatar,
        no: userInfo.no,
        gender: userInfo.gender,
        birthday: userInfo.birthday
      });
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }
  },

  // 退出登录
  onCancelOrder: function () {
      api.logout().then(res => {
      // 清除所有缓存 （token，userInfo）
      wx.clearStorage()
      //  wx.removeStorageSync('token')      
      app.globalData.userInfo = null;
      wx.switchTab({
        url: '/pages/index/index'
      })
    }).catch(err => {
      console.error(err);
    });
  },

  // 弹窗
  onCancelModalClose: function () {
    this.setData({
      showCancelModal: false
    });
  },
  showCancelModal: function () {
    this.setData({
      showCancelModal: true
    });
  },

 //下拉刷新的个人信息
  onPullDownRefresh() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        name:userInfo.name,
        avatar: userInfo.avatar,
        no: userInfo.no,
        gender: userInfo.gender,
        birthday: userInfo.birthday
      });
    }
    console.log('下拉刷新的个人信息', userInfo, 1);
    wx.stopPullDownRefresh();
 },
})