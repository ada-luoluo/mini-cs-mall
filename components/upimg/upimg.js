var app = getApp(); 
import {request,uploadImg} from '../../utils/request.js'
import init from "../../utils/init.js"
let _init = new init();

Component({
  properties: {
    type: {
      type: String,
      value: '1'
    }    
  },
  data: {
    imageFile:[],
    isUploadImg: false
  },
  attached: function() {
    
  },
  methods:{    
    // 上传图片
    uploadImage(){
      var that = this
      wx.chooseMedia({
        count: 3 - that.data.imageFile.length,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success(res) {
          wx.showLoading({
            title: "上傳中",
            mask: true
          });

          let tempFiles = res.tempFiles
          for (let key in tempFiles) { 
            uploadImg(res.tempFiles[key].tempFilePath, {'type': that.data.type}).then(res => { 
              wx.hideLoading();
              if(res.code === 200){   
                let image = {
                  url1: res.data.url,
                  url2: res.data.filename
                }    
                that.setData({
                  imageFile:that.data.imageFile.concat(image)
                })

                // 超出隐藏
                if(that.data.imageFile.length >= 3){
                  that.setData({
                    isUploadImg: true
                  })    
                }
                // 子传父
                that.triggerEvent('myevent',that.data.imageFile)

              }else{
                _init.showToast("none",res.msg)
              }
            })

          }
    
        },fail(err){
          console.log(err)
        }
      })
    },
    // 预览
    previewImage: function (e) {
      let imageFile = this.data.imageFile,
          imageFile2 = []
      for(let key in imageFile){
        imageFile2.push(imageFile[key].url1)
      }
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: imageFile2 // 需要预览的图片http链接列表
      })
    },
    // 删除图片
    deleteImg(e){
      var that = this;
      let index = e.currentTarget.dataset.index,
          imageArray = that.data.imageFile

      wx.showLoading({
        title: "删除中",
        mask: true
      });
      let params = {
        type: that.data.type,
        image: imageArray[index].url2
      } 
      request("delete_image", "POST", params).then(res => {
        wx.hideLoading();
        if(res.code === 200){           
          imageArray.splice(index, 1)
          that.setData({
            imageFile: imageArray
          })

          if(imageArray.length < 3){
            that.setData({
              isUploadImg: false
            })    
          }
          // 子传父
          that.triggerEvent('myevent',that.data.imageFile)
        }else{
          _init.showToast("none",res.msg)
        }
      })
    },
  }

})