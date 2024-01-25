import {api} from '../../utils/api.js'

Page({
  data: {
    tabs:[
      {
        id: 0,
        value:"全部",
        isActive: true
      },

      {
        id: 1,
        value:"待付款",
        isActive: false
      },
      {
        id: 2,
        value:"待完成",
        isActive: false
      },
      {
        id:3,
        value:"已完成",
        isActive: false
      },
      {
        id: 4,
        value:"退款",
        isActive: false
      }
    ],
    ordersList:[],
    skuList:[],
    showPay: false,
    showCancelModal: false, 
    loading:false,
    page:1,
   
  },
  onShow(options) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const { order_status } = currentPage.options;
   
    this.setData({   
      order_status
    })
    
 // 4 激活选中页面标题 当 order_status=0
    this.changeTitleByIndex(order_status);
    this.getOrderList(order_status, this.data.page);
  },

  //获取列表
  getOrderList(order_status, page){
    this.setData({
      loading: true
    });
    api.getOrders(order_status, page).then(res => {
       if(res.code === 200){

              const newProducts = res.data;
              const oldProducts = this.data.ordersList; 
              let ordersList = [];

              if (page > 1) { // 如果是下滑加载，则将新数据和旧数据拼接起来
                ordersList = oldProducts.concat(newProducts);
              } else { // 否则就直接替换旧数据
                ordersList = newProducts;
              }
              
          this.setData({
            ordersList: ordersList, 
            loading: false    
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
     // 根据订单状态来激活选中 标题数组
    changeTitleByIndex(order_status) {
      let { tabs } = this.data;
      tabs.forEach((v, i) => v.value === this.getOrderStatus(order_status) ? v.isActive = true : v.isActive = false);
      this.setData({
        tabs
      })
    },
    // 根据订单状态获取对应的选项卡标题
    getOrderStatus(order_status) {
      let orderStatusMap = {
        0: "全部",
        1: "待付款",
        2: "待完成",
        3: "已完成",
        4: "退款"
      };
      return orderStatusMap[order_status];
  
    },
  
    handleTabsItemChange(e) {
      const { index } = e.detail;
      this.changeTitleByIndex(index);
      const order_status = index;  // 获取对应的 order_status 值
      const page = 1;
      this.setData({
        order_status,
        page
      });
      this.getOrderList(order_status, page);
    },

 //返回按钮
  onBackTap: function() {
    wx.navigateBack({
      delta: 1
    });
  },
  //支付弹窗
  showPayModal: function () {
    this.setData({
      showPay: true
    });
  },
  closePayModal: function () {
    this.setData({
      showPay: false
    });
  },

  //取消订单
  onCancelOrder: function () {
    const order_id = this.data.currentOrderId; 
    api.cancelOrder(order_id).then(res => {
      if(res.code === 200){
        const updatedOrdersList = this.data.ordersList.filter(order => order.order_id !== order_id);
        this.setData({
          ordersList: updatedOrdersList
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
  deteleOrder(event){
    const order_id = event.currentTarget.dataset.orderid;
    api.deteleOrder(order_id).then(res => {
      if(res.code === 200){
        wx.showToast({
          title: "訂單已刪除",
          icon: 'success',
        });
        const updatedOrdersList = this.data.ordersList.filter(order => order.order_id !== order_id);
        this.setData({
          ordersList: updatedOrdersList
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

   //立即支付
   payNow(event){
    const order_id = event.currentTarget.dataset.orderid;
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
             title: '支付失敗',
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

  //下拉刷新
  onPullDownRefresh() {
    const { order_status } = this.data;
    const page = 1;
    this.getOrderList(order_status, page);
    wx.stopPullDownRefresh();
  },


    //上滑触底---下一页
    onReachBottom() {
      const { order_status, page } = this.data;
      const nextPage = page + 1;
      this.setData({
        page: nextPage
      });
      this.getOrderList(order_status, nextPage);
    },
})