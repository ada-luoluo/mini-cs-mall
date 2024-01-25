
var app = getApp()
import {api} from '../../utils/api.js'
Page({
  data: {
    rate:'',
    comment: '',
    imageList: [],
  },
  
  onLoad(options){
    const order_id = options.order_id
     this.setData({
      order_id,
     })
     this.orderDetail(order_id)
  },

  //订单详情--获取评论

  orderDetail(order_id){
    let cover,
        name,
        flight_at,
        flight_period,
        amount,
        content,
        imageList,
        rate,
        created_at

    api.orderDeatil(order_id).then(res => { 
      if(res.code === 200){
        cover = res.data.tourist_spot.cover;
        name = res.data.tourist_spot.name;
        flight_at = res.data.flight_at;
        flight_period = res.data.flight_period;
        amount = res.data.amount;
        content = res.data.comment.content;
        imageList = res.data.comment.images;
        rate = Math.round(res.data.comment.rate);
        created_at = res.data.comment.created_at;
        this.setData({
          cover,
          name,
          flight_at,
          flight_period,
          amount,
          content,
          imageList,
          rate,
          created_at
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



  //查看大图
  previewImage: function (event) {
    const current = event.currentTarget.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  }

  
 
})