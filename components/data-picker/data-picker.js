var app = getApp()
Component({
  properties: { 
    selectDatas: {
      type: String,
      value: ""
    }   
  },
  data: {
    //可选日期[数组]
    years: [],
    months: [],
    days: [],    
    thisYear: new Date().getFullYear(),
    thisMon: new Date().getMonth(),
    values: []
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.getInit()
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  methods: {
    getInit(){
      var that = this
      // 初始化数据
      const years = [],
            months = [],
            days = []
      for (let i = that.data.thisYear; i <= (that.data.thisYear+1); i++) {
          years.push(i)
      }
      for (let i = 0; i <= 11; i++) {
          months.push(i+1)
      }
      for (let i = 1; i <= 31; i++) {
          days.push(i)
      }
      that.setData({
        years: years,
        months: months,
        days: days
      })         
    }, 
    bindChange(e){
      wx.showToast({
        icon: 'loading',
        duration: 300,
        mask: true 
      })  

      var that = this
      const val = e.detail.value      
      // console.log(val)
      // 月份
      let selectYear =  this.data.years[val[0]]   
      let selectMonth = (val[1]+1)
      let selectDay = (val[2]+1)
      // 日期      
      var totalDay = this.mGetDate(selectYear, selectMonth);
      var changeDate = []
      for (let i = 1; i <= totalDay; i++) {
          changeDate.push(i)
      }

      this.setData({                   
          days: changeDate,
          values: val,
          selectDatas: selectYear+'-'+ selectMonth + '-' +selectDay      
      })
      console.log(that.data.selectDatas)
    },
    // 更新每月日期
    mGetDate(year, month) {
      var d = new Date(year, month, 0);
      return d.getDate();
    },
    // bindpickStart(e){      
      
    // }
  },

  
})