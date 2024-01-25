// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    let result = ['付款成功','支付失败','扫描失败','使用成功','上传图片'],
        type = Number(options.type)
    wx.setNavigationBarTitle({
      title: result[type]
    })
    this.setData({
      type: type,
      id: options.id || 0
    })
  },
  // 查看订单详情
  resultBtn1(){
    wx.redirectTo({
      url: '/pages/orderDetails/listOrder?id='+this.data.id,
    })
  },
  resultBtn2(){
    wx.redirectTo({
      url: '/pages/orderDetails/listOrder?id='+this.data.id,
    })
  },
  // 扫一扫
  resultBtn3(){
    wx.scanCode({
        success: function(res) {
            console.log('扫码获取的参数',res)
        }
    })
  },
  // 退出小程序
  resultBtn4(){
    wx.exitMiniProgram({
      success: function(res) {
        console.log("退出小程序")
      }
    })
  },
  // 图片上传成功
  resultBtn5(){
    wx.redirectTo({
      url: '/pages/orderDetails/listOrder?id='+this.data.id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})