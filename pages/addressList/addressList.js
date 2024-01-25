  const app = getApp();
  import {api} from '../../utils/api.js'
  Page({
    data: {
      addressList: [],
      x: 0, 
      start_x: 0,
      operations_visible: false, 
      minHeight:0,
      navBarHeight: 0,
    },

    onLoad(options) {
      this.getMinHeight()
      // 判断是否存在 refresh 标识
      if (options.refresh) {
        // 重新加载列表数据
        this.loadListData();
      } else {
        // 获取地址列表
        api.getAddressList().then(res => {
          if(res.code === 200){
            this.setData({
              addressList: res.data,
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
      }
  
      // 获取当前页面栈
      const pages = getCurrentPages();   
      if (pages.length >= 2) {
      const prevPage = pages[pages.length - 2];
      const prevPagePath = prevPage.route;
      // 判断前一个页面是否是 confirmOrder 页面
        if (prevPagePath === "/pages/confirmOrder/confirmOrder") { 
          this.changeAddress();   
        }
      }

    },
    //点击选择后的地址
    changeAddress(e) {
      const id = e.currentTarget.dataset.id;
      app.globalData.user_address_id = id;
      const addressData = this.getAddressById(id);
    
      app.globalData.user_address_id = id;

        // 将地址数据存储到本地缓存中
      wx.setStorageSync('selectedAddress', addressData);

      // 返回上一页
      wx.navigateBack({
        delta: 1
      });

    
    },

      //根据ID从地址列表中获取地址数据
      getAddressById(id) {
        const addressList = this.data.addressList;
        const addressData = addressList.find(address => address.id === id);
        return addressData;
      },

    // 加载地址列表数据
    loadListData() {
      api.getAddressList().then(res => {
        if(res.code === 200){
          this.setData({
            addressList: res.data,
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
    
    //删除
    onDeleteAddress: function (e) {
      const id = e.currentTarget.dataset.id;
      api.deteleAddress(id).then(data => {
        const newAddressList = this.data.addressList.filter(item => item.id !== id);
        this.setData({
          addressList: newAddressList,
        }); 
        wx.showToast({
          title: '刪除成功',
          icon: 'success'
        });
      }).catch(err => {
        console.error(err);
        wx.showToast({
          title: '刪除失敗',
          icon: 'none'
        });
      });
    },


  //获取屏幕最小高度
  getMinHeight(){
    var WidMinHeight= wx.getSystemInfoSync().windowHeight - 110 //减去其他固定位置所占的高度
    const systemInfo = wx.getSystemInfoSync()       
    this.setData({
      minHeight:WidMinHeight,
      navBarHeight: systemInfo.statusBarHeight + 44,     
    })  
  },
  //侧滑
  methods: {
    handleTouchStart: function (event) {
      this.setData({
        start_x: event.touches[0].clientX // 触摸开始时的横坐标
      })
    },
  
    handleTouchEnd: function (event) {
      const operations_visible = this.data.operations_visible;
      const current_x = event.changedTouches[0].clientX; // 触摸结束时的横坐标
      const { start_x } = this.data;
      const direction = current_x - start_x; // 判断滑动的方向

      if (direction < 0) {
        !operations_visible && this.showOperations();
      } else {
        operations_visible && this.hideOperations();
      }
    },
    toggle: function () {
      let operations_visible = this.data.operations_visible;

      if (operations_visible) {
        this.hideOperations();
      } else {
        this.showOperations();
      }
    },

    hideOperations: function () {
      this.setData({
        x: 0,
        operations_visible: false
      });
    },
    emptyFunc: function () {
      return false;
    }
  },


  });


