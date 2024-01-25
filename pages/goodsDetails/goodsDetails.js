const app = getApp();
import {request} from '../../utils/request.js'
import {api} from '../../utils/api.js'

import init from "../../utils/init.js"
let _init = new init();

Page({
  data: {
     id: null,
     banners:[],
     cover:'',
     name:'',
     price:'',
     defaultPrice:'',
     unit:'',
     description:'',
     format:2,
     current: 0,
     showPopup: false,
     product_skus:[],
     attributes:[],
     cart_count:'',
     selectedSkuIndex: -1,
     quantity: 1,
     selectedSku:null,
     product_sku_id: -1, //初始值
     productType:null//商品类型
  
  },

  onShow(){
    const cart_count = app.globalData.cartCount;
    this.setData({
      cart_count
    })
  },
 
  onLoad(options) {  
    const product_id = options.id
    console.log('product_id on onload',product_id)
    const currentId = app.globalData.background[0].id;
    const id = currentId;
  
    this.setData({
      id:id,
      product_id:product_id,
      selectedSkuIndex: 0, // 默认选择第一个 SKU
      selectedSku: this.data.product_skus[0] || null,
      product_sku_id: this.data.product_skus[0] ? this.data.product_skus[0].product_sku_id : 0, // 如果存在 SKU，则使用第一个 SKU 的 ID，否则使用产品本身的 ID
    });

    this.getDetails(product_id, id)
  },

  //获取产品详情
  getDetails(product_id, id) {
    const token = wx.getStorageSync('token');
    const header = token ? { 'Authorization': 'Bearer ' + token } : {};
    request("product/details", "POST", { product_id, id }, header).then(res => {
      if(res.code ===200){
        const data = res.data.product;
        this.setData({
          cover:data.cover,
          banners:data.images,  
          name:data.name,
          price:data.price,
          defaultPrice:data.price,
          unit:data.unit,
          description:data.description, 
          productType:data.type,
          format:data.format,
          product_skus:data.product_skus,
          attributes:res.data.attributes,
          cart_count:res.data.cart_count,
        });    
        console.log("购物车数量",res.data.cart_count)
        app.globalData.cartCount = res.data.cart_count;
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',         
        })
      }
    }).catch(err => {
      console.error(err);
    });
  },

  //获取当前banner数
  swiperChange: function(e) {
    this.setData({
      current: e.detail.current
    });  
  },
  //点击选择sku
  onSkuClick: function(e) {
    var groupId = e.currentTarget.dataset.groupId;
    var attributeValueId = e.currentTarget.dataset.attributeValueId;
    //根据选择的属性组 ID 和属性值 ID 更新 selectedSkuIndex 变量
    var selectedSkuIndex = Object.assign({}, this.data.selectedSkuIndex);
    selectedSkuIndex[groupId] = attributeValueId;
    this.setData({selectedSkuIndex: selectedSkuIndex});
     // 当前选择的属性值，从所有 SKU 中筛选出符合条件的 SKU
    var skuList = this.data.product_skus.filter(function(sku) {
      return sku.product_sku_attribute_related.every(function(attribute) {
        return selectedSkuIndex[attribute.product_attribute_group_id] === attribute.product_attribute_value_id;
      });
    });

    //选择第一个作为当前选择的 SKU
      var selectedSku = skuList.length > 0 ? skuList[0] : null;

    //根据selectedSku 更新 skuData 变量
    var skuData = this.data.product_skus.map(function(sku) {
      return {
        skuId: sku.product_sku_id,
        selected: selectedSku !== null && sku.product_sku_id === selectedSku.product_sku_id
      };
    });
  
    console.log('selectedSku in onSkuClick:', selectedSku);

     //更新状态
    this.setData({
      selectedSku: selectedSku,
      skuData: skuData
    });

    //1.根据attributes的长度和选择的长度，判断sku是否全部选择完毕
    var attributesLength = this.data.attributes.length;
    var selectedSkuIndexKeys = Object.keys(selectedSkuIndex);
    var selectedAttributesCount = selectedSkuIndexKeys.length;
    console.log("this.data.attributes,",attributesLength)
    console.log("selectedAttributesCount,",selectedAttributesCount)
    //2.数值相等，拿库存数
    if (selectedAttributesCount === attributesLength) {  
      var stock = selectedSku ? selectedSku.stock : 0;
      console.log('库存数：' + stock);
        this.setData({
          stock
        })
    }
  },



   //按钮底部按钮
  showPopup: function(event) {
    // 获取点击的按钮类型
    var type = event.currentTarget.dataset.type;

    // 判断用户是否已经登录
    const token = wx.getStorageSync('token');
    console.log('token----------',token)
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }

   // 设置弹窗标题和按钮文本
    if (type === 'addCart') {
      this.setData({
        popupTitle: '加入購物車',
        popupBtnText: '加入購物車',
        type: 'addCart'
      });
    } else if (type === 'buy') {
      this.setData({
        popupTitle: '立即購買',
        popupBtnText: '立即購買',
        type: 'buy'
      });
    }
  
    // 显示弹窗
    this.setData({
      showPopup: true
    });
  },
  
  hidePopup() {
    this.setData({
      showPopup: false
    })
  },
 //数量-
  onQuantityMinus() {
    let quantity = this.data.quantity
    if (quantity > 1) {
      quantity--
      this.setData({
        quantity: quantity
      })
    }
  },
  //数量+
  onQuantityPlus() {
    let quantity = this.data.quantity
    quantity++
    this.setData({
      quantity: quantity
    })
  },
  //输入数量
  onQuantityInput(e) {
    let quantity = parseInt(e.detail.value)
    if (quantity < 1) {
      quantity = 1
    }
    this.setData({
      quantity: quantity
    })
  },

  //提交
  onConfirm: function(event) {
    //按钮类型
    const btnType = event.currentTarget.dataset.type;
 
    const selectedSku = this.data.selectedSku;
    const product_sku_id = selectedSku ? selectedSku.product_sku_id : 0;
    console.log('product_sku_id in onConfirm:', product_sku_id);

    const { id, product_id } = this.data;
    const number = this.data.quantity;

    const data = {
      product_id: product_id,
      id: id,
      type: 1,
      number: number
    };

    if (product_sku_id !== 0) {
      data.product_sku_id = product_sku_id; 
    }
    console.log('提交的data------',data)

     // 根据按钮类型调用对应的接口
    if (btnType === 'addCart') {
       // 加入购物车api
        api.cartUpdate(data).then(res => {
          console.log(res)
         if(res.code === 200){
          wx.showToast({
            title: '加購成功',
            icon: 'success',         
          })
          //获取购物车数量
          this.setData({
            cart_count:res.data.cart_count, 
          })

          app.globalData.cartCount = res.data.cart_count;
          console.log(app.globalData.cartCount,app.globalData.cartCount)

         }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',         
          })
         }   
        }).catch(err => {
          console.error(err);
        });

      console.log('加入购物车');
    } else if (btnType === 'buy') {
      // 调用立即购买的接口----立即购买就是创建订单

      data.type = 2,
      data.pick_up_type = 1,
      data.product_id = this.data.product_id,
      data.order_type =this.data.productType
  
      api.createOrder(data).then(res => {
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

      console.log('立即购买');
    }

    // 隐藏弹窗
    this.setData({
      showPopup: false
    });

  },
 // 关闭弹窗
  onClose() { 
     this.hidePopup()
  },
  onPageScroll(e){
    _init.navigatorScroll(e.scrollTop,this)
  }
 
})