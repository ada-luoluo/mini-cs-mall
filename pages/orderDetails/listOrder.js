var app = getApp(); 
import {request} from '../../utils/request.js'
import init from "../../utils/init.js"
let _init = new init();

Page({
  data: {
    orderState: 10,
    showCancelModal: false,
    id: null,
    initData:{},
    imageFile: []
  },
  onLoad(options) {
    this.setData({
      id: options.id
    })
  },
  onShow(){
    this.getInit()  
  },
  getInit(){
    let that = this
    wx.showLoading()
    request("order/details", "POST", {"order_id": that.data.id}).then(res => {
      wx.hideLoading()
      if(res.code === 200){
        that.setData({
          initData: res.data,
          orderState: res.data.order_status
        })      
      }else{         
        _init.showToast("none",res.msg)
      }      
    })
  },
  // 弹窗操作
  onCancelOrder () {    
    let that = this
    if(that.data.modalType === 1){
      // 取消订单
      wx.showLoading({
        title: "取消中",
        mask: true
      });
      request("order/cancel", "POST", {"order_id":that.data.id}).then(res => {
        wx.hideLoading();
        if(res.code === 200){ 
          _init.showToast("success","订单已取消")
          that.setData({
            orderState: 0
          })
        }else{
          _init.showToast("none",res.msg)
        }
      })
    }else{
      // 重新预约
      const id = this.data.initData.tourist_spot.id
      wx.navigateTo({
        url: '/pages/listForm/listForm?id='+ id
      })     
    }    
  },
  cancelBtn() {
    let that = this
    that.setData({
      showCancelModal: true,
      titleModal: "取消订单",
      subtitleModal: "是否确认取消订单？",
      confirmTextModal: "确定",
      classBtnModal:"",
      modalType: 1
    })
  },
  // 购买
  buyBtn(e){
    let that = this
    // 重新预约
    // that.setData({
    //   showCancelModal: true,
    //   titleModal: "预约时间提示",
    //   subtitleModal: "该订单的预约时间已约满，请重新预约",
    //   confirmTextModal: "重新预约",
    //   classBtnModal:"classBtn-confirm",
    //   modalType: 2
    // })    
    wx.showLoading()
    request("order/pay", "POST", {"order_id":that.data.id}).then(res => {
      wx.hideLoading();
      if(res.code === 200){ 
        let pay_info = res.data.pay_info
        wx.requestPayment({
          timeStamp: pay_info.timeStamp,
          nonceStr: pay_info.nonceStr,
          package: pay_info.package,
          signType: pay_info.signType,
          paySign: pay_info.paySign,
          success (res2) {
            _init.showToast('success', '支付成功');
            if(that.data.initData.is_signed){
              wx.redirectTo({
                url: '/pages/listUpImg/listUpImg?id='+encodeURIComponent(that.data.id)
              })
            }else{
              wx.redirectTo({
                url: '/pages/result/result?type=0&id='+encodeURIComponent(that.data.id)
              })
            }
          },
          fail (err) {
            _init.showToast('none', '支付失败');
            wx.redirectTo({
              url: '/pages/result/result?type=1&id='+encodeURIComponent(that.data.id)
            }) 
          }
        })
      }else{
        _init.showToast("none",res.msg)
      }
    })

  },
  deleteBtn(){
    let that = this
    wx.showLoading({
      title: "订单删除中",
      mask: true
    });
    request("order/delete", "POST", {"order_id":that.data.id}).then(res => {
      wx.hideLoading();
      if(res.code === 200){ 
        wx.showToast({
          title: '订单删除成功',
          icon: 'success',
          success(){
            wx.navigateBack({
              delta: 1
            })
          }
        })       
      }else{
        _init.showToast("none",res.msg)
      }
    })

  },
  // 详情
  openSpot(){
    const id = this.data.initData.tourist_spot.id
    wx.navigateTo({
      url: '/pages/listText/listText?id='+ id
    })
  },
  // 上传图片
  onMyEvent(e){
    console.log(e.detail)
    this.setData({
      imageFile: e.detail
    })
  },
  // 上传
  submitBtn(){
    let that = this
    let imageFile = that.data.imageFile
    if(imageFile.length < 1){      
      _init.showToast("none","请上传图片")
      return false
    }

    wx.showLoading({
      title: "提交中",
      mask: true
    });
    let params = {
      order_id: that.data.id,
    }
    for(let key in imageFile){
      params['image['+key+']'] = imageFile[key].url2
    }
    request("order/upload/certificate", "POST", params).then(res => {
      wx.hideLoading();
      if(res.code === 200){    
        wx.redirectTo({
          url: '/pages/result/result?type=4&id='+encodeURIComponent(that.data.id),
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
  },
  onPageScroll(e){
    _init.navigatorScroll(e.scrollTop,this)
  }

})