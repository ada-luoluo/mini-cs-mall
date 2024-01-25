var app = getApp()
class Init{
   // 验证手机号码是否有效
   isPhoneAvailable(phone) {
    var myreg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])\d{8}$/;
    if (!myreg.test(phone)) {
      return false;
    } else {
      return true;
    }
  }
  //身份证
  isCardAvailable(card) {
    var myreg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    if (!myreg.test(card)) {
      return false;
    } else {
      return true;
    }
  }
  //小程序弹框提示
  showToast(icon, msg, duration = 2000) {
    wx.showToast({
      title: msg,
      duration: duration,
      icon: icon
    })
  }
  // navBar
  navigatorScroll(scrollTop,that){
    if(scrollTop > 20){
      that.setData({
        scrollStyle: "topScroll"
      })
    }else{
      that.setData({
        scrollStyle: ""
      })
    }
  }
  // 位置授权
  // getLocation = () => {
  //   app.globalData.hasLocation = true
  //   return new Promise((resolve, reject) => {
  //     wx.getSetting({
  //       success: (res) => {      
  //         let authSetting = res.authSetting
  //         if (authSetting['scope.userLocation']) {
  //           // 已授权
  //           getLocations().then(res => {
  //             resolve(res)
  //           })         
  //         }else{
  //           // 去授权
  //           wx.authorize({
  //             scope: 'scope.userLocation',
  //             success: () => {
  //               // 允许                 
  //               getLocations().then(res => {
  //                 resolve(res)
  //               })
  //             },fail: () => {  
  //               // 拒绝
  //               wx.showModal({
  //                 title: '是否授权当前位置',
  //                 content: '需要获取您的地理位置，以提供更好的服务',
  //                 success: function (tip) {
  //                   if (tip.confirm) {
  //                     // 开启
  //                     wx.openSetting({
  //                       success: function (data) {
  //                         if (data.authSetting["scope.userLocation"] === true) {                          
  //                           getLocations().then(res => {
  //                             resolve(res)
  //                           })
  //                         } else {
  //                           wx.showToast({
  //                             title: '授权失败！',
  //                             icon: 'error'
  //                           })
  //                           resolve(false)                            
  //                         }
  //                       },
  //                       error: (err) => {                            
  //                         reject(err) 
  //                       }
  //                     })                    
  //                   }else{                       
  //                     resolve(false)
  //                   }
  //                 },
  //                 error: (err) => { 
  //                   reject(err) 
  //                 }
  //               }) 
  //             }
  //           })
  //         }
  //       },
  //       error: (err) => {  
  //         reject(err) 
  //       }
  //     })      
  //   })
  // }
}
  // 经纬度
// const getLocations = () => {
//   return new Promise((resolve, reject) => {
//     wx.getLocation({
//       type: 'gcj02',
//       success(res) { 
//         console.log(res)
//         app.globalData.latitude = res.latitude
//         app.globalData.longitude = res.longitude
//         resolve(res)
//       },
//       fail(err) {
//         // 暂用于测试
//         var res = { "latitude": 22.53646484375, "longitude": 114.12385579427084}
//         app.globalData.latitude = res.latitude
//         app.globalData.longitude = res.longitude   
//         resolve(err)  
//       }
//     })
//   })    
// }
export default Init;
