const app = getApp();
import {request} from '../../utils/request.js'

Page({
  data: {
     banners:[],
     souvenirs:[],
     science:[],
     title:"",
     navBarHeight: 0,
     menuRight: 0,
     menuTop: 0,
     menuHeight: 0,
     cart_count:0
  },

  onShow() {
    //tabbar
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }

  //显示id和name
    const currentId = app.globalData.background[0].id;
    const title = app.globalData.background[0].name;
    this.setData({
      title: title,
      currentId
    });

    this.getIndexInfo(currentId);
    
    //显示购物数量
    const cart_count = app.globalData.cartCount;
    this.setData({
      cart_count
    })
  },
   //获取首页内容
   getIndexInfo(currentId) {
    const token = wx.getStorageSync('token');
    const header = token ? { 'Authorization': 'Bearer ' + token } : {};
    request("shop_home", "POST", { id:currentId }, header).then(res => {
      if(res.code === 200){
        const data = res.data;
        this.setData({
          banners:data.banners,
          souvenirs:data.souvenirs,   
          science:data.science,
          cart_count:res.data.cart_count
        });
        app.globalData.cartCount = res.data.cart_count;
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',         
        })
      }   
      
    }).catch(err => {
      console.error(err);
    });
  },
 //获取navbar高度
  onLoad(options) {
    const that = this;
    wx.getSystemInfo({
        success: function(res) {
        const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
        that.setData({
          navBarHeight: res.statusBarHeight + (res.platform == 'android' ? 48 : 44),
          menuRight: res.screenWidth - menuButtonInfo.right,
          menuTop: menuButtonInfo.top + (res.platform == 'android' ? 8 : 0),
          menuHeight: menuButtonInfo.height
        });
        console.log(that.data);
      },
      fail: function() {
        console.log('获取系统信息失败');
      }
    });
  },

  //下拉刷新
  onPullDownRefresh() {
    this.setData({
      banners:[],
      souvenirs:[],   
      science:[],
    });
    this.getIndexInfo(this.data.currentId) 
    wx.stopPullDownRefresh();
  },

})