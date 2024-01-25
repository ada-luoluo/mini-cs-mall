import {request} from './request.js'

export const api = {
  // 获取省份列表
  getProvinces(params) {
    return request("user_address/area", "POST", { level: 1, pid: 0 }, getAuthHeader()).then(res => {
      return res.data
    })
  },
  // 获取城市列表
  getCities(params) {
    return request("user_address/area", "POST", { level: 2, pid: params.pid }, getAuthHeader()).then(res => {
      return res.data
    })
  },
  // 获取区县列表
  getDistricts(params) {
    return request("user_address/area", "POST", { level: 3, pid: params.pid }, getAuthHeader()).then(res => {
      return res.data
    })
  },
  // 创建地址
  createAddress(params) {
    return request("user_address/create", "POST", params, getAuthHeader()).then(res => {
      return res
    })
  },
  //获取地址列表
  getAddressList(){
    return request("user_address/list", "POST", getAuthHeader()).then(res => {
      return res
    })
  },
  //编辑地址
  updateAddress(params){
    return request("user_address/update", "POST", params, getAuthHeader()).then(res => {
      return res
    })
  },
  //删除地址
  deteleAddress(id){
    return request("user_address/delete", "POST", { id }, getAuthHeader()).then(res => {
      return res.data
    })
  },
  //编辑个人资料
  updateProfile(params){
    return request("profile/update_profile", "POST", params, getAuthHeader()).then(res => {
      return res
    })
  },
  //退出登录
  logout(){
    return request("logout", "POST", getAuthHeader()).then(res => {
      return res
    })
  },
  //订单列表
  getOrders(order_status, page) {
      return request("order/list", "POST", { order_status, page }, getAuthHeader()).then(res => {
        return res
      })
   },
  //更新购物车
  cartUpdate(params){
    return request("cart/update", "POST", params, getAuthHeader()).then(res => {
      return res
    })
  },
  //购物车列表
  cartList(id){
    return request("carts", "POST", { id }, getAuthHeader()).then(res => {
      return res
    })
  },
  //更新购物车
  updateCart(params){
    return request("cart/update", "POST", params, getAuthHeader()).then(res => {
      return res
    })
  },
  //确认订单
  checkoutInfo(params){
    return request("checkout", "POST", params, getAuthHeader()).then(res => {
      return res
    })
  },
 //生成订单
  createOrder(params){
    return request("order/create/souvenir", "POST", params, getAuthHeader()).then(res => {
      return res
    })
  },
  //取消订单
  cancelOrder(order_id){
    return request("order/cancel", "POST", { order_id }, getAuthHeader()).then(res => {
      return res
    })
  },
  //订单详情
  orderDeatil(order_id){
    return request("order/details", "POST", { order_id }, getAuthHeader()).then(res => {
      return res
    })
  },
  //删除订单
  deteleOrder(order_id){
    return request("order/delete", "POST", { order_id }, getAuthHeader()).then(res => {
      return res
    })
  },
  //申请退款
  refund(order_id, reason_id ){
    return request("order/refund", "POST", { order_id, reason_id }, getAuthHeader()).then(res => {
      return res
    })
  },
  //订单列表--立即支付
  pay(order_id){
    return request("order/pay", "POST", { order_id }, getAuthHeader()).then(res => {
      return res
    })
  },
  

}

// 获取Authorization头
function getAuthHeader() {
  const token = wx.getStorageSync('token');
  return {'Authorization': 'Bearer ' + token}
}