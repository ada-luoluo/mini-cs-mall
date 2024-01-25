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
    county_id: ''
  },
  onLoad(options) {
    const {address_id, receiver_name, phone, province_id, city_id, county_id, province_name, city_name, county_name, address, is_default} = options;
    // // 将 is_default 转换为布尔类型
    const isDefault = Boolean(parseInt(is_default));
    
    this.setData({
      address_id: address_id,
      receiver_name: receiver_name,
      phone: phone,
      address: address,
      is_default: isDefault,
      province_id:province_id,
      city_id:city_id,
      county_id:county_id,
      currentProvince: province_name,
      currentCity: city_name,
      currentDistrict: county_name,
    });

    //获取省份列表
    this.getProvinces({ pid: 0 });
  },
  
   // 省份选择器的事件处理函数
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

  // 获取省份列表
  getProvinces({ pid }) {
    api.getProvinces({ pid }).then((data) => {
      this.setData({
        provinces: data,
      });

      // 设置当前选中的省份
      const { province_id } = this.data;
      const currentProvince = data.find(province => province.id === province_id);
      if (currentProvince) {
        this.setData({
          currentProvince: currentProvince.name,
        });

        // 获取选中省份的城市列表
        this.getCities(currentProvince.id);
      }
    }).catch((err) => {
      console.error(err);
    });
  },

  // 获取城市列表
  getCities(pid) {
    api.getCities({ pid }).then((data) => {
     
      this.setData({
        cities: data,
        currentCity: data[0].name,
        city_id: data[0].id,
      });

      // 设置当前选中的城市
      const { city_id } = this.data;
      const currentCity = data.find(city => city.id === city_id);
      if (currentCity) {
        this.setData({
          currentCity: currentCity.name,
        });

        // 获取选中城市的区县列表
        this.getDistricts(currentCity.id);
      }
    }).catch((err) => {
      console.error(err);
    });
  },

  // 获取区县列表
  getDistricts(pid) {
    api.getDistricts({ pid }).then((data) => {
      this.setData({
        districts: data,
        currentDistrict: data[0].name,
        county_id: data[0].id,
      });
    }).catch((err) => {
      console.error(err);
    });
  },

  // 城市选择器的事件处理函数
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

  // 区县选择器的事件处理函数
  bindDistrictChange(e) {
    const index = e.detail.value;
    const district = this.data.districts[index];
    this.setData({
      districtIndex: index,
      currentDistrict: district.name,
      county_id: district.id, // 赋值区县ID
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
      is_default: is_default
    }, function() {
      console.log('is_default:', this.data.is_default); // 打印is_default的值
    });
  },

  //编辑
   onSaveAddress: function() {
    const is_default = this.data.is_default ? 1 : 0; // 将布尔值转换为整数0或1
    const address = {
      address_id: this.data.address_id, 
      receiver_name: this.data.receiver_name,
      phone: this.data.phone,
      province_id: this.data.province_id,
      city_id: this.data.city_id,
      county_id: this.data.county_id,
      address: this.data.address,
      is_default: is_default
    };
   
    api.updateAddress(address).then(res => { 
     if(res.code === 200){
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

});

 

