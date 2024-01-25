var app = getApp()
import {api} from '../../utils/api.js'
import init from "../../utils/init.js"
let _init = new init();
Page({
  data: {
    order_status: 1,
    imageUrl: app.globalData.domainName,
    no:'',
    products:[],
    user_address:{},
    created_at:'',
    pickup_method:'',
    amount:''
  },
  onLoad(options) {
    const order_id = options.order_id
    const order_status = options.order_status
    this.setData({
      order_id,
      order_status
    })
    this.orderDetail(order_id)
  }, 
  //订单详情
  orderDetail(order_id){
    let no,
        products,
        user_address,
        created_at,
        pickup_method,
        amount,
        order_status,
        qr_code

    api.orderDeatil(order_id).then(res => { 
      if(res.code === 200){
        no = res.data.no;
        products = res.data.products;
        user_address = res.data.user_address;
        created_at = res.data.created_at;
        pickup_method = res.data.pickup_method;
        amount = res.data.amount;
        order_status = res.data.order_status;
        qr_code = res.data.qr_code;
        this.setData({
          no,
          products,
          user_address,
          created_at,
          pickup_method,
          amount,
          order_status,
          qr_code
        })
        console.log('user_address---------',res.data.user_address)
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

  //取消订单
  onCancelOrder() {
    const order_id = this.data.order_id
  
    api.cancelOrder(order_id).then(res => {
      if(res.code === 200){
        wx.showToast({
          title: "订单已取消",
          icon: 'success',
        });
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          });
        }, 2000);    
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

  onCancelModalClose: function () {
    this.setData({
      showCancelModal: false
    });
  },

  showCancelModal: function(event) {
   const order_id = event.currentTarget.dataset.orderid;
    this.setData({
      showCancelModal: true,
      currentOrderId: order_id
    });
  },
  //删除订单
  deteleOrder(){
    const order_id = this.data.order_id
    api.deteleOrder(order_id).then(res => {
      if(res.code === 200){

        wx.showToast({
          title: "订单已删除",
          icon: 'success',
        }); 
       
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/orders/orders' 
          });
        }, 1500);
       
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

  // 购买
  buyBtn(){
    const order_id = this.data.order_id
      api.pay(order_id).then(res => {
      if(res.code === 200){ 
        wx.showLoading({
          title: '支付中',
          mask:true
        })
       //支付------获取支付所需的参数
       const payInfo = res.data.pay_info; 
       wx.requestPayment({
         timeStamp: payInfo.timeStamp,
         nonceStr: payInfo.nonceStr,
         package: payInfo.package,
         signType: payInfo.signType,
         paySign: payInfo.paySign,
         
         success(res) {
          wx.hideLoading();
           wx.showToast({
             title: '支付成功',
             icon: 'success',
             duration: 2000,
             success: function () {
               setTimeout(function () {
                 wx.redirectTo({
                   url: '/pages/orders/orders' 
                 });
               }, 2000);
             }

           });         
         },
         fail(res) {
           wx.hideLoading();
           wx.showToast({
             title: '支付失败',
             icon: 'error',
             duration: 2000,
           });  
         }
        });   
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

  onPageScroll(e){
    _init.navigatorScroll(e.scrollTop,this)
  }

})