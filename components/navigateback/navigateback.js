// components/navigateback/navigateback.js
Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    classHeight:{
      type: Boolean,
      value: true
    },
    classStyle:{
      type: Boolean,
      value: true
    },
    scrollStyle:{
      type: String,
      value: ""
    }
  },
  data: {
    navBarHeight: 0,
    menuRight: 0,
    menuTop: 0,
    menuHeight: 0,
  },
  attached: function() {
    const that = this;
    const systemInfo = wx.getSystemInfoSync(),
          menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    that.setData({
      navBarHeight: systemInfo.statusBarHeight + 44,
      menuRight: systemInfo.screenWidth - menuButtonInfo.right,
      menuTop: menuButtonInfo.top,
      menuHeight: menuButtonInfo.height
    })
    // console.log(this.data)
  },
  methods:{    
    navBack(e){
      // console.log(getCurrentPages().length)
      if(getCurrentPages().length === 1){
        wx.switchTab({
          url: '/pages/index/index',
        })
      }else{
        wx.navigateBack({
          delta: 1
        })
      }
    }
  }

})