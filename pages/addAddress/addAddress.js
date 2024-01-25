const app = getApp();
import {api} from '../../utils/api.js'

Page({
  data: {
    receiver_name: '',
    phone: '',
    address: '',
    is_default: 0,
    provinces: [], // 省份列表
    cities: [], // 城市列表
    districts: [], // 区县列表
    currentProvince: '', // 当前选中的省份
    currentCity: '', // 当前选中的城市
    currentDistrict: '', // 当前选中的区县
    provinceIndex: 0, // 省份选择器的选中项
    cityIndex: 0, // 城市选择器的选中项
    districtIndex: 0, // 区县选择器的选中项
    showPicker:false,
    province_id: '',
    city_id: '',
    county_id: '',
    fromConfirmOrder: false
  },

  onLoad(options) {

    // 获取省份列表
    api.getProvinces().then(data => {
      this.setData({
        provinces: data,
        currentProvince: data[0].name,
        province_id: data[0].id,
      });
      // 获取默认省份对应的城市列表
      this.getCities(data[0].id);
    
    }).catch(err => {
      console.error(err);
    });

    if (options.fromConfirmOrder === 'true') {
      this.setData({
        fromConfirmOrder: true
      });
    }
    console.log("-------fromConfirmOrder---------",this.data.fromConfirmOrder)

  },
    // 获取城市列表
    getCities(pid) {
      api.getCities({pid}).then(data => {
        this.setData({
          cities: data,
          currentCity: data[0].name,
          city_id: data[0].id,
        });
        // 获取默认城市对应的区县列表
        this.getDistricts(data[0].id);
      }).catch(err => {
        console.error(err);
      });
    },

  // 获取区县列表
  getDistricts(pid) {
    api.getDistricts({pid}).then(data => {
      this.setData({
        districts: data,
        currentDistrict: data[0].name,
        county_id: data[0].id,
      }, () => {
        console.log('省份ID：', this.data.province_id);
        console.log('城市ID：', this.data.city_id);
        console.log('区县ID：', this.data.county_id);
      });
    }).catch(err => {
      console.error(err);
    });
  },

// 省份选择器
bindProvinceChange(e) {
  const index = e.detail.value;
  const province = this.data.provinces[index];
  this.setData({
    provinceIndex: index,
    currentProvince: province.name,
    province_id: province.id, // 赋值省份ID
    // 清空市和区
    cities: [], 
    currentCity: '', 
    city_id: '',
    districts: [],
    currentDistrict: '', 
    county_id: '' 
  });
  // 获取选中省份的城市列表
  this.getCities(province.id);
},

// 城市选择器
bindCityChange(e) {
  const index = e.detail.value;
  const city = this.data.cities[index];
  this.setData({
    cityIndex: index,
    currentCity: city.name,
    city_id: city.id, // 赋值城市ID
    //清空区
    districts: [],
    currentDistrict: '', 
    county_id: '' 
  });
  // 获取选中城市的区县列表
  this.getDistricts(city.id);
},

// 区县选择器
bindDistrictChange(e) {
  const index = e.detail.value;
  const district = this.data.districts[index];
  this.setData({
    districtIndex: index,
    currentDistrict: district.name,
    county_id: district.id // 赋值区县ID
  });
},
  //输入item
  onInputName: function (e) {   
    console.log('receiver_name:', e.detail.value);
    this.setData({
      receiver_name: e.detail.value
    });
  },
  
  onInputPhone: function (e) {
    const phone = e.detail.value;
    this.setData({
      phone: phone
    });
  },

  onBlurPhone: function (e) {
    const phone = e.detail.value;
    if (!/^\d{8,11}$/.test(phone)) {
      wx.showToast({
        title: '請輸入正確的手機號',
        icon: 'none'
      });
    }
  },
  
  bindTextAreaBlur: function(e) { 
    console.log('address:', e.detail.value);
    this.setData({
      address: e.detail.value
    });
  },

  onToggleDefault: function (e) {
    const is_default = e.detail.value ? 1 : 0; 
    this.setData({
      is_default: is_default || 0 // 添加默认值 0
    }, function() {
      console.log('is_default:', this.data.is_default); // 打印is_default的值
    });
  },

  //保存地址
  onSaveAddress() {
    const address = {
      receiver_name: this.data.receiver_name,
      phone: this.data.phone,
      province_id: this.data.province_id,
      city_id: this.data.city_id,
      county_id: this.data.county_id,
      address: this.data.address,
      is_default: this.data.is_default || 0 
    };
  
    if (!address.receiver_name || !address.phone || !address.address) {
      return;
    }

    api.createAddress(address).then(res => {
  
       if(res.code === 200){
            //从确认订单页进入新增地址
          if(this.data.fromConfirmOrder) {
          
            app.globalData.user_address_id = res.data.id;
        
            wx.showToast({
              title: '保存成功',
              success: function() {
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1,     
                  });
                }, 1500); 
              }
            });
        const addressData = res.data; 
        wx.setStorageSync('selectedAddress', addressData);
      
        } else {
          wx.showToast({
            title: '保存成功',
            success: function() {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1,
                  success: function () {
                    const page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad({
                      refresh: true
                    });
                  }
                });
              }, 1500); 
            }
          }); 
        }    
       }
    }).catch(err => {
      console.error(err);
      wx.hideLoading();
      wx.showToast({
        title: '保存地址失敗',
        icon: 'none'
      });
    });
  },

});

 

