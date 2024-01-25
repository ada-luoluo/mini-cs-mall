const app = getApp();
import {request} from '../../utils/request.js'
Page({ 
  data: {
    inputValue: '',
    showClearIcon: false,
    showAutocomplete: false,
    autocompleteList: [],
    type:'',
    id:'',
    keywords:''
  },

  onLoad(options) {
    var type = options.type || '';
    const currentId = app.globalData.background[0].id;
    const id = currentId;
    this.setData({
      id:id,
      type: type,
    });

  },

  //输入
  onInput: function (e) {
    const keyword = e.detail.value.trim();
    console.log("输入框中的值：", keyword);
    const { id, type } = this.data; // 从 data 中获取 id 和 type
    if (keyword) {
      const params = {
        id,
        page: 1,
        keyword
      };
      if (type) {
        params.type = type;
      }
      request("product/list", "POST", params).then(res => {
        const products = res.data.products.filter(product => {
          return product.name.includes(keyword);
        });
        this.setData({
          showClearIcon: true,
          showAutocomplete: true,
          autocompleteList: products,
          keywords:keyword
        });
      }).catch(err => {
        console.error(err);
      });
    } else {
      this.setData({
        showClearIcon: false,
        showAutocomplete: false,
        autocompleteList: []
      });
    }
  },
  searchData: function (keywords) {
    const { id, type } = this.data; // 从 data 中获取 id 和 type
    request("product/list", "POST", { id, type, page: 1 }).then(res => {
      const products = res.data.products.filter(product => {
        return product.name.includes(keywords);
      });
      this.setData({
        products: products,
      });
    }).catch(err => {
      console.error(err);
    });
  },
  //
  onAutocompleteTap: function(e) {
    const keyword = e.currentTarget.dataset.name;
    this.setData({
      inputValue: keyword,
      showClearIcon: true,
      showAutocomplete: false,
      autocompleteList: [],
    });
     console.log("inputValue的值：", inputValue);
  },
  // 清空输入框
  clearInput(){
    this.setData({
      inputValue: '',
      showClearIcon: false,
      showAutocomplete: false,
      autocompleteList: [],
    })
  },

  //使用手机键盘搜索
  onConfirm: function (event) {
    const keywords = event.detail.value;
    // 执行搜索操作，跳转到搜索结果页面
    wx.navigateTo({
      url: '/pages/souvenir/souvenir?type=' + this.data.type + '&keywords=' + keywords
    });
  },

})