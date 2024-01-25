// pages/startPage/startPage.js
var app = getApp(); 
import {request} from '../../utils/request.js'
import init from "../../utils/init.js"
let _init = new init();

Page({
  data: {
    imageSrc: "",
    setTime: 10,
    timeService: null,
    isTime: false

  },  
  onLoad(options) {
    wx.showLoading()
    this.splash_banner()
  },
  splash_banner(){
    let that = this
    request("splash_banner", "get", {}).then(res => {
      if(res.code === 200){
        wx.hideLoading()
        if(res.data.is_show_splash === 1){
          that.setData({
            imageSrc: res.data.splash_image,
            isTime: true
          })
          that.starTime()
        }else{
          that.switchTab()
        }           
      }else{         
        _init.showToast("none",res.msg)
      }
    })
  },
  starTime(){
    let that = this
    that.data.timeService = setInterval(function (){
      let time = that.data.setTime-1
      that.setData({
        setTime: time
      })
      if (time === 1){
        console.log(time)         
        that.switchTab()
      }
    },1000)
  },
  switchTab(){
    clearInterval(this.data.timeService)  
    wx.switchTab({
      url: "/pages/mall/mall"
    })   
  }

})