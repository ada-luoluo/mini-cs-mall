const app = getApp();
import {api} from '../../utils/api.js'
import init from "../../utils/init.js"
let _init = new init();
Page({
  data: {
    productList:[],
    skuList:[],
    // 全选
    allSelecChecked: false,
    totalPrice: 0,
    selectedCartIds: []
  },
  onLoad(options){
    const currentId = app.globalData.background[0].id;
    const id = currentId;
    this.setData({
      id 
    });   
    this.getCarts(id)
  },

  //购物车列表
  getCarts(id){
    api.cartList(id).then(res => {
      if(res.code === 200){
        const productList = res.data;
        wx.setNavigationBarColor({
          frontColor: (productList.length === 0?'#000000':'#ffffff'),
          backgroundColor: (productList.length === 0?'#ffffff':'#3383FF')
        })

      // 更新数据
        this.setData({
          productList: productList,    
        });
      
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

// 更新购物车
updateNum(e) {
  var that = this;
  let index = e.currentTarget.dataset.index,
    num = Number(e.currentTarget.dataset.num),
    numType = Number(e.currentTarget.dataset.type);
  let newList = that.data.productList;
  let productId = newList[index].product_id;

  let requestData = {
    product_id: productId,
    number: numType === 1 ? num + 1 : num - 1, // 更新操作时 number 加 1，删除操作时 number 减 1
    id: this.data.id,
    type: 2// 更新购物车固定传2
  };

  //没有product_sku_id不传
  if (newList[index].product_sku_id) {
      requestData.product_sku_id = newList[index].product_sku_id;
  }

  console.log("newList[index].sku_id",newList[index].product_sku_id)

  console.log('requestData---------', requestData);

  // 调用接口更新或删除购物车商品
  api.updateCart(requestData)
    .then(res => {
      if (res.code === 200) {
        if (requestData.number === 0) {
          // 删除商品
          newList.splice(index, 1);
          wx.showToast({
            title: '商品已删除',
            icon: 'none'
          });     
        } else {
          // 更新商品数量
          newList[index].num = requestData.number;
        }
        that.setData({
          productList: newList
        });
        that.getCount();

        // 更新app.globalData.cartCount
        app.globalData.cartCount = res.data.cart_count;
     
      } else {
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

  // 单选
  selecChecked(e){
    var that = this
    var index = e.currentTarget.dataset.index,
        select = e.currentTarget.dataset.select
    var newList = that.data.productList
    newList[index].select = !select
    /*全选按钮判断*/
    let x = 0,
        y = 0;
    for (let key in newList) {        
      newList[key].select ? x++ : y++
    }
    let allSelecChecked = null
    if(x === newList.length){
      allSelecChecked = true
    }else if(y === newList.length){
      allSelecChecked = false
    }


    // 更新选中的cart_id
    let selectedCartIds = newList.filter(item => item.select).map(item => item.cart_id);
    that.setData({
      selectedCartIds: selectedCartIds
    });

    console.log('选中的cart_id:', selectedCartIds); // 打印cart_id

    /**/ 
    that.setData({
      productList: newList,
      allSelecChecked: allSelecChecked
    })
    that.getCount()
  },
  //全选
  allSelect(e) {
    var that = this    
    let allSelect = that.data.allSelecChecked,
        newList = that.data.productList
    if(allSelect){
      for (let key in newList) {        
        newList[key].select = false
      }
    }else{
      for (let key in newList) {
        newList[key].select = true
      }
    }

    // 更新选中的cart_id
    let selectedCartIds = newList.filter(item => item.select).map(item => item.cart_id);
    that.setData({
      selectedCartIds: selectedCartIds
    });

    console.log('全选选中的cart_id----:', selectedCartIds); // 打印cart_id

    that.setData({
      productList: newList,
      allSelecChecked: !allSelect
    })   
    that.getCount()
  },

  // 计算价格
  getCount(e){
    var that = this
    let newList = that.data.productList,
        totalPrice = 0;
    for (let key in newList) {
      if(newList[key].select){
        totalPrice += parseInt(newList[key].num) * parseFloat(newList[key].price)
      }
    }
    that.setData({
      totalPrice: totalPrice.toFixed(2)
    })
  },
  cartBtn(){
    wx.switchTab({
      url: '/pages/mall/mall',
    })    
  },
  // 立即购买
  submitCart(){
    var that = this
    if(that.data.totalPrice <= 0){
      _init.showToast("none","请选择结算商品")
      return false
    }
    
    var cartIdParams = that.data.selectedCartIds.map((cartId, index) => 'cart_id[' + index + ']=' + cartId).join('&');
    
    console.log('--------cartIdParams----',cartIdParams)

    // 将选中的cart_id以数组形式和totalPrice一起传递给下一个页面
    wx.navigateTo({
      url: '/pages/confirmOrder/confirmOrder?' + cartIdParams + '&totalPrice=' + that.data.totalPrice,
    });

  },
  // 下拉加载
  onReachBottom(){
    console.log("下拉加载")
  },
})