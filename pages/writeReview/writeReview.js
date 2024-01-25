
var app = getApp(); 
import {request} from '../../utils/request.js'
import init from "../../utils/init.js"
let _init = new init();
import {api} from '../../utils/api.js'
Page({
  data: {
    rating: 4,
    comment: '',
    uploadedImages: [],
    cover:'',
    name:'',
    flight_at:'',
    flight_period:'',
    amount:''
  },
  //星评
  onStarTap(e) {
    const score = e.currentTarget.dataset.score;
    this.setData({
      rating: score
    });
  },
  //评论
  onTextareaInput(e) {
    const value = e.detail.value;
    this.setData({
      comment: value
    });
  },
  //图片
  onMyEvent(e){
    this.setData({
      imageFile: e.detail
    })
  },
  onLoad(options){
      const order_id = options.order_id;      
      this.setData({
        order_id,      
      })   
      this.orderDetail(order_id)
  },

  //订单详情
 orderDetail(order_id){
    let cover,
        name,
        flight_at,
        flight_period,
        amount,
        content,
        imageList,
        rate

    api.orderDeatil(order_id).then(res => { 
      if(res.code === 200){
        cover = res.data.tourist_spot.cover;
        name = res.data.tourist_spot.name;
        flight_at = res.data.flight_at;
        flight_period = res.data.flight_period;
        amount = res.data.amount;
        content = res.data.comment.content;
        imageList = res.data.comment.images;
        rate = res.data.comment.rate;

        this.setData({
          cover,
          name,
          flight_at,
          flight_period,
          amount,
          content,
          imageList,
          rate
        }) 
      }else{
       wx.showToast({
         title: res.msg,
         icon: 'none',
       });
      }
   }).catch(err => {
     console.error(err);
   });
  },
  onSubmit(){
    let that = this
    let imageFile = that.data.imageFile

    if(that.data.comment.trim() === ''){
      wx.showToast({
        icon: "none",
        title: '請填寫評論內容',
      })
       return false
    }


    wx.showLoading({
      title: "提交中",
      mask: true
    });

    let params = {
      order_id: this.data.order_id,
      type:2,
      rate: that.data.rating,
      content: that.data.comment,
    }

    for (let key in imageFile) {
      if (imageFile.hasOwnProperty(key)) {
        if (imageFile[key].url2) {
          params[`image[${key}]`] = imageFile[key].url2;
        }
      }
    }

    request("order/create/comment", "POST", params).then(res => {
      wx.hideLoading();
      if(res.code === 200){    
        wx.showToast({
          title: "評價已提交",
          icon: 'success',
        }); 
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/orders/orders',
          });
        }, 1500);
        
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
        });
      }
    })
  }


})