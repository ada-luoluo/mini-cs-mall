const app = getApp();
import {request} from '../../utils/request.js'

Page({
  data: {
    categories: [],
    products:[],
    activeCategoryId: null,
    category_id: null,
    type: '',
    pid: null,
    keywords:'',
    page:1,
    loading:false,
    id: null,
    cart_count:0
  },
   onShow(){
      //显示购物数量
      const cart_count = app.globalData.cartCount;
      this.setData({
        cart_count
      })      
   },
  onLoad: function (options) {
    const currentId = app.globalData.background[0].id;
    const id = currentId;
    var type = options.type || '';
    const keywords = options.keywords;
    this.setData({
      type: type,
      keywords: keywords,
      id:id
    });
    this.getList(this.getParams());
    this.getCategory(this.getParams());

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: (parseInt(type)===1?'#FFA858':'#3383FF')
    })
  },

  //params
  getParams: function (category_id) {
    const type = this.data.type;
    const keywords = this.data.keywords;
    const page = this.data.page;

    const params = {
      id:this.data.id,
      page: page,
    };

    if (type) {
      params.type = type;
    }
    if (category_id) {
      params.category_id = category_id;
    }
    if (keywords) {
      params.keywords = keywords;
    }
    return params;
  },

  //获取分类
  getCategory(params) {
    request("product/list", "POST", params).then(res => {
      const data = res.data;
      this.setData({
        categories: data.categories, 
      });
    }).catch(err => {
      console.error(err);
    });
  },
  // 获取产品
  getList(params) {
    this.setData({
      loading: true
    });
    wx.showLoading({
      title: "數據加載中...",
      mask: true
    });

    const token = wx.getStorageSync('token');
    const header = token ? { 'Authorization': 'Bearer ' + token } : {};
    request("product/list", "POST", params, header).then(res => {   
        if(res.code === 200){
              const data = res.data;
              const newProducts = data.products;
              const oldProducts = this.data.products;
              let products = [];
              if (params.page > 1) { // 如果是下滑加载，则将新数据和旧数据拼接起来
                products = oldProducts.concat(newProducts);
              } else { // 否则就直接替换旧数据
                products = newProducts;
              }
              
              this.setData({
                products: products,
                loading: false,
                page: params.page,
                cart_count:res.data.cart_count
              });
              wx.hideLoading();
            }else{
              wx.showToast({
                title: res.msg,
                icon: 'none',         
              })
            }
        }).catch(err => {
          console.error(err);
          this.setData({
            loading: false
          });
        });
      },

 // 点击全部分类
toggleAllCate: function () {
  this.setData({
    showAllCate: !this.data.showAllCate
  });
},

// 点击一级分类
onCategoryTap: function (event) {
  const id = event.currentTarget.dataset.id;
  const categories = this.data.categories;
  for (let category of categories) {
    if (category.id === id) {
      if (!category.open) {
        // 清除其他一级分类的二级分类的选中状态
        for (let c of categories) {
          if (c.id !== id) {
            for (let subcategory of c.sub_categories) {
              subcategory.active = false;
            }
          }
        }

        // 更新当前点击的一级分类的状态，并更新 activeCategoryId 和 page
        for (let c of categories) {
          c.open = (c.id === id);
        }
        this.setData({
          categories: categories,
          activeCategoryId: id,
          page: 1
        });
        this.getList(this.getParams(id));
      }
      break;
    }
  }
},

// 点击二级分类
toggleActive: function (event) {
  let id = event.currentTarget.dataset.id;
  let categories = this.data.categories;

  // 清除其他一级分类的二级分类的选中状态
  for (let category of categories) {
    for (let subcategory of category.sub_categories) {
      subcategory.active = (subcategory.id === id);
    }
  }

  this.setData({
    category_id: id,
    categories: categories,
    page: 1
  });

  this.getList(this.getParams(id));

  //
  const area = event.currentTarget.dataset.area;
  if (area === 'otherarea') {
    this.setData({
      showAllCate: !this.data.showAllCate
    });
  }



},

// 开启下拉刷新
onPullDownRefresh() {
  this.setData({
    products: [],
    category_id: '', // 将一级分类的选择重置为空
    activeCategoryId: '', // 将当前选中的分类的 id 重置为空
    page: 1 // 将 page 的值重置为 1
  });

  // 清空一级分类的 open 状态和二级分类的 active 状态
  const categories = this.data.categories;
  for (let category of categories) {
    category.open = false;
    for (let subcategory of category.sub_categories) {
      subcategory.active = false;
    }
  }

  this.setData({
    categories: categories
  });

  this.getList(this.getParams());
  wx.stopPullDownRefresh(); // 停止当前页面的下拉刷新
},

// 上滑触底
onReachBottom() {
  let page = this.data.page;
  page++; // 将 page 的值加 1

  const category_id = this.data.category_id || this.data.activeCategoryId;
  const params = category_id ? this.getParams(category_id) : this.getParams();

  if (!category_id && page === 2) {
    // 如果没有选择分类且是第一次上滑触底，则不执行加载数据的操作
    return;
  }

  this.setData({
    page: page
  });

  this.getList(params);
},


})
