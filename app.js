// app.js

App({

  onLaunch() {

      //本地存储中获取 userInfo
      const cachedUserInfo = wx.getStorageSync('userInfo');
      if (cachedUserInfo) {
        this.globalData.userInfo = cachedUserInfo;
      }
  },
  globalData: {
    userInfo: null,
    hasLocation: false, // 是否获取地址信息
    is_show_rate: 0, // 评分显隐    
    longitude :"116.39747",
    latitude :"39.908823",
    // background:[],
    background: [
      { id: '7' },
      // 写死景点id
    ],
    cartCount:0,
    user_address_id:null,
    cart_id:[]
  }, 
  getToListForm(id){
    console.log('getToListForm---',id)
    const token = wx.getStorageSync('token')
    if(token){
      wx.navigateTo({
        url: '/pages/listForm/listForm?id='+encodeURIComponent(id),
      }) 
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      }) 
    }
  },
})
