
var app = getApp()
import {api} from '../../utils/api.js'
Page({

  data: {
    showCancelModal: false, 
    reasons: [],
    reasonsIndex: 0,
    isModal: false,
    animationModal: false,
    selectedReason: '', 
    cover: '', 
    name: '', 
    flight_at: '', 
    flight_period: '', 
    amount: '', 
    refund_reasons: '',
    selectedReasonIndex: '',
    selectedReasonText: '請選擇',
  },
  onLoad(options){
    const order_id = options.order_id;
    this.setData({
      order_id,
    })
    this.orderDetail(order_id)
  },

  orderDetail(order_id){
    let cover,
        name,
        flight_at,
        flight_period,
        amount,
        refund_reasons

    api.orderDeatil(order_id).then(res => { 
      if(res.code === 200){
        cover = res.data.tourist_spot.cover;
        name = res.data.tourist_spot.name;
        flight_at = res.data.flight_at;
        flight_period = res.data.flight_period;
        amount = res.data.amount;
        refund_reasons = res.data.refund_reasons;
        this.setData({
          cover,
          name,
          flight_at,
          flight_period,
          amount,
          reasons:refund_reasons
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




  //点击确定--执行退款
  onRefundConfirm() {
     const order_id = this.data.order_id,
          reason_id = this.data.reason_id
     
    api.refund(order_id, reason_id).then(res => { 
      if(res.code === 200){
        wx.showToast({
          title: '已提交申請',
          icon: 'success'
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
   }).catch(err => {
     console.error(err);
   });
 
  },

    //选择理由
    onSelectReason(event) {
      const selectedReasonIndex = event.currentTarget.dataset.index;
      const selectedReasonText = this.data.reasons[selectedReasonIndex].content;
      this.setData({
        selectedReasonIndex,
        selectedReasonText,
      });
      console.log(selectedReasonIndex);
    },
    //确定
    onConfirm() {
      const selectedReason = this.data.reasons[this.data.selectedReasonIndex];
      const selectedReasonId = selectedReason.id;
      this.setData({
        selectedReason,
        isModal: false,
        reason_id:selectedReasonId
      });
      console.log("selectedReasonId=====",selectedReasonId);
    },


    onCancelModalClose: function () {
      this.setData({
        showCancelModal: false
      });
    },
  
    showCancelModal() {
      const selectedReasonIndex = this.data.selectedReasonIndex;
      if (selectedReasonIndex === '' || selectedReasonIndex === null) {
        wx.showToast({
          title: '請選擇理由',
          icon: 'none'
        })
        return;
      }else{
        this.setData({
          showCancelModal: true
        });
      }  
    },
  
      // 打开弹框
      showModal(e){
         this.setData({
          isModal: true,
          animationModal: true
        })
      },
      // 关闭弹框
      coloseModal(){
        let that =this
        this.setData({
          animationModal:false
        })
        setTimeout(() => {
          that.setData({
            isModal: false
          })
        }, 470);
      },

})