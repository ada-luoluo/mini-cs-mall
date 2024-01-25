Page({
  /**
   * 页面的初始数据
   */
  data: {
    selected: '0',
    index:'0',
    color: "#141414", // 颜色
    selectedColor: "#3383FF", // 被选中颜色
    "list": [{
      "pagePath": "/pages/mall/mall",
      "iconPath": "/images/nav3.png",
      "selectedIconPath": "/images/nav33.png",
      "text": "商城"
    },{
      "pagePath": "/pages/user/user",
      "iconPath": "/images/nav4.png",
      "selectedIconPath": "/images/nav44.png",
      "text": "我的"
    }]
  },
  switchTab(e) {
    var url = e.currentTarget.dataset.path
    this.setData({
      selected: e.currentTarget.dataset.index
    })
    if (url) {
      wx.switchTab({
        url
      })
    } 
  }

})