Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: '取消訂單'
    },
    subtitle: {
      type: String,
      value: '是否確認取消訂單？'
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    confirmText: {
      type: String,
      value: '確定'
    },
    // 按钮样式，可设定个数
    classBtn: {
      type: String,
      value: ''
    }
  },
  methods: {
    closeCancelModal: function () {
      this.setData({
        show: false
      })
      this.triggerEvent('close');      
    },
    confirm: function () {
      this.triggerEvent('cancel');
      this.setData({
        show: false
      })
    }
  }
})