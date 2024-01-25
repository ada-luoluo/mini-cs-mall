Component({
  properties: {
    images:{
      type: String,
      value: '/images/status03.png'
    },
    tipText: {
      type: String,
      value: ''
    },
    btnText: {
      type: String,
      value: ''
    }   
  },
  methods: {
    changeBtn(e){
      const myEventDetail = {}
      this.triggerEvent("tapBtn", myEventDetail)
    }
  }
})