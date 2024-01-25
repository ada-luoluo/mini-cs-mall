var apiUrl = 'https://netego.chinaskynet.net/api/'

//封装网络请求
function request(url, method, data, header = {}) {
  return new Promise((resolve, reject) => {
    // 如果未传递 header 参数，则默认使用包含 Token 的请求头信息
    if (Object.keys(header).length === 0) {
      const token = wx.getStorageSync('token') || '';
      header = { 'Authorization': 'Bearer ' + token };
    }
    wx.request({
      url: apiUrl + url,
      method: method || "POST",
      data: data || {},
      header: {
        "content-type": "application/x-www-form-urlencoded;",
        ...header // 将 header 参数合并到请求头中
      },
      success: res => {
        if(res.data.code === 401){
          wx.showToast({
            title: '登錄過期，請重新登錄',
            icon: 'none',
            success(){
              wx.clearStorage()
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          })
        }else{
          resolve(res.data);
        }
      },
      fail: err => {
        reject(err);
      }
    });
  });
}

var Token = wx.getStorageSync('token') || ''
// 图片上传
function uploadImg(image,params) { 
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: apiUrl + 'upload_image',
      filePath: image,
      name: 'image',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        'Authorization': 'Bearer ' + Token
      },
      formData: params,
      success: res => {
        resolve(JSON.parse(res.data));
      },
      fail: err => {
        reject(err);
      }
    });
  })  
}

module.exports = {
  request,
  uploadImg
};

