const app = getApp()
import {api} from '../../utils/api.js'
Page({
    data: {
      name:"",
      avatar:"",
      genderList: ['未知', '男', '女'],
      genderIndex: '',
      gender:'',
      birthday:'',
      date: ''
      },
      
      onLoad(options) {
        const cachedUserInfo = wx.getStorageSync('userInfo');
    
        var avatar = options.avatar || (cachedUserInfo ? cachedUserInfo.avatar : ''),
          // name = options.name || (cachedUserInfo ? cachedUserInfo.name : ''),
          // gender = options.gender || (cachedUserInfo ? cachedUserInfo.gender : ''),
          // birthday = options.birthday || (cachedUserInfo ? cachedUserInfo.birthday : '2000-01-01');
          name = cachedUserInfo.name,
          gender = cachedUserInfo.gender,
          birthday = cachedUserInfo.birthday || '2000-01-01'
    
        this.setData({
          avatar: avatar,
          name: name,
          genderIndex: gender,
          birthday: birthday,
          date: this.formatDate(new Date(birthday))
        });
      },

    //修改密码
      onNameInput(event) {
        this.setData({
          name: event.detail.value
        })
      },

    //修改性别
    genderChange: function(e) {
      this.setData({
        genderIndex: e.detail.value
      })
    },
    //修改日期
    bindDateChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        date: e.detail.value
      })
    },
    // 格式化日期
    formatDate(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    },

  //修改个人信息
  save() {
    const name = this.data.name;
    const gender = this.data.genderIndex;
    const birthday = this.data.date;
    const data = {};
    if (name) {
      data.name = name;
    }
    if (gender) {
      data.gender = gender;
    }
    if (birthday) {
      data.birthday = birthday;
    }
   //编辑个人资料
   api.updateProfile(data).then(res => {
     
    if(res.code ===200){

      wx.showToast({
        title: '修改成功',
        icon: 'success',
        success: function () {
        
  // 更新全局变量
  app.globalData.userInfo.name = name;
  app.globalData.userInfo.gender = gender;
  app.globalData.userInfo.birthday = birthday;

  // 更新本地缓存
  const cachedUserInfo = wx.getStorageSync('userInfo');
  if (cachedUserInfo) {
    cachedUserInfo.name = name;
    cachedUserInfo.gender = gender;
    cachedUserInfo.birthday = birthday;
    wx.setStorageSync('userInfo', cachedUserInfo);
  }

        }

      }) 

      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
      }).catch(err => {
        console.error(err);
      });
  },
  
  //更新头像
  chooseImage: function () {
    var that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          title: "上傳中",
          mask: true
        });

        const tempFiles = res.tempFiles;
        const token = wx.getStorageSync('token');
        if (tempFiles.length > 0) {
          const filePath = tempFiles[0].tempFilePath;
            wx.uploadFile({
            url: 'https://netego.chinaskynet.net/api/profile/update_profile',
            filePath: filePath,
            name: 'image',
            header: {
              'Authorization': 'Bearer ' + token
            },
            success: function (res) {
              const data = JSON.parse(res.data);
           
              that.setData({
                avatar: data.data.avatar_url
              });


             // 更新全局变量和本地缓存
             app.globalData.userInfo.avatar = data.data.avatar_url;

             const cachedUserInfo = wx.getStorageSync('userInfo');
             if (cachedUserInfo) {
               cachedUserInfo.avatar = data.data.avatar_url;
               wx.setStorageSync('userInfo', cachedUserInfo);
             }
    
              wx.hideLoading()

              console.log("touxiang",app.globalData.userInfo.avatar)
  
            },
            fail: function (err) {
              console.error(err);
            }
          });
        }
      },
    
      fail(err) {
        console.log(err)
      }
    });
  },
 })

