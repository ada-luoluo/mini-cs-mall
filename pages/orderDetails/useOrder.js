var app = getApp(); 
import {request} from '../../utils/request.js'
import init from "../../utils/init.js"
let _init = new init();
Page({
  data: {
    showCancelModal: false,
    id: null,
    initData:{},
  },
  onLoad(options) {
    const scene = decodeURIComponent(options.scene)
    // console.log(scene.split("=")[1])
    this.setData({
      id: scene.split("=")[1]
    })    
  },
  onShow(){
    console.log("onShow")
    this.getInit()
  },
  getInit(){
    let that = this
    console.log(that.data.id)
    request("order/details", "POST", {"order_id": that.data.id}).then(res => {
      if(res.code === 200){
        that.setData({
          initData: res.data,
          orderState: res.data.order_status
        })      
      }else{  
        console.log("order/details",res.msg)       
        _init.showToast("none",res.msg)
      }      
    })
  },
  // 提交
  submitBtn(){
    this.setData({
      showCancelModal: true
    })  
  },
  // 核销
  useOrder(){
    let that = this
    wx.showLoading()
    request("order/redeem", "POST", {"order_id": that.data.id}).then(res => {
      wx.hideLoading()
      if(res.code === 200){
          wx.navigateTo({
            url: '/pages/result/result?type=3'
          })
      }else{         
        _init.showToast("none",res.msg)
      }
    })
  },
  // 预览
  previewImage(e){
    let imageFile = this.data.initData.passenger.images   
    wx.previewImage({
      current: e.currentTarget.id,
      urls: imageFile
    })
  }

})