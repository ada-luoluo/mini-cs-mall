const app = getApp();
import {api} from '../../utils/api.js'
Page({
  data: {
    titTabId: 1,
    products:[],
    skuList:[],
    defaultAddress:{},
    pickupInfo:{},
    totalPrice: 0  
  },
  // tab切换
  changeTab(e){
    this.setData({
      titTabId: Number(e.currentTarget.id)
    })
  },

  onLoad(options) {
    const currentId = app.globalData.background[0].id;
    const id = currentId;
    var cartIds = [];
    for (var key in options) {
      if (key.startsWith('cart_id[')) {
        cartIds.push(options[key]);
      }
    }
    var totalPrice = options.totalPrice;
    console.log('接收到的cart_ids:', cartIds);
    console.log('接收到的totalPrice:', totalPrice);
    this.setData({
      id,
      cart_id: cartIds,
      totalPrice
    });

    app.globalData.cart_id = cartIds; // 将cartIds保存到全局变量中
            // 仅在首次加载页面时获取订单详情
        if (cartIds.length > 0) {
          this.getOrderinfo(id, this.data.cart_id);
        }
        
  },

  //获取订单详情
  getOrderinfo(id, cart_id){
    let params = {
      id: this.data.id,
      type: 1,
    };
    //已数组形式传cart_id
    cart_id.forEach((cartId, index) => {
      params['cart_id[' + index + ']'] = cartId;
    });

    api.checkoutInfo(params).then(res => {
      if(res.code === 200){
        const productList = res.data.products;
      
        //地址id
        const user_address_id = res.data.user_address.id;
        app.globalData.user_address_id = user_address_id

        this.setData({
          defaultAddress: res.data.user_address,
          products:productList,
          pickupInfo:res.data.tourist_spot
        })

        console.log("defaultAddress--------",res.data.user_address)

      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
        });
      }

    })
    .catch(error => {
      console.error('更新购物车失败:', error);
    });

  },

  //生成订单
  OnPay() {
    const params = {
      id: this.data.id,
      type: 1,
      pick_up_type:this.data.titTabId,
      order_type:1 //纪念品订单
    };

    //判断pick_up_type不为1是传user_address_id
    if (this.data.titTabId !== 1) {
      params.user_address_id = app.globalData.user_address_id;
    }

    //已数组形式传cart_id
    this.data.cart_id.forEach((cartId, index) => {
      params['cart_id[' + index + ']'] = cartId;
    });

    api.createOrder(params).then(res => {
      if(res.code ===200){

        wx.showLoading({
          title: '支付中',
          mask:true
        })

       //支付------获取支付所需的参数
        const payInfo = res.data.pay_info; 
        wx.requestPayment({
          timeStamp: payInfo.pay_info.timeStamp,
          nonceStr: payInfo.pay_info.nonceStr,
          package: payInfo.pay_info.package,
          signType: payInfo.pay_info.signType,
          paySign: payInfo.pay_info.paySign,
          
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
              title: '支付失敗',
              icon: 'error',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/orders/orders' 
                  });
                }, 2000);
              }
            });  
          }
        });



      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
        });
      }

    })
  },

  onShow() {
    // 从本地缓存中读取地址数据
    const addressData = wx.getStorageSync('selectedAddress');
    const user_address_id = app.globalData.user_address_id;
    console.log("addressData----------", addressData);
    console.log("修改后的address id----------", user_address_id);
    if (addressData) {
      this.setData({
        defaultAddress: addressData,
        user_address_id: user_address_id
      });
    }  
  },
})