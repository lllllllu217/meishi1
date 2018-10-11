//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tempFilePaths:'',
    buttonName:'选取图片'
  },
  //事件处理函数
  takePhoto:function() {
    var that=this;

    const ctx = wx.createCanvasContext('myCanvas');
    // console.log(ctx);
    const platform = wx.getSystemInfoSync().platform;
    const imgWidth = 300, imgHeight = 300;
    var base64Img = "";

    wx.chooseImage({
      success: function(res) {
        /*console.log(res);
        var tempFilePaths=res.tempFilePaths;
        that.setData({
          tempFilePaths:tempFilePaths
        })*/
        //生成的图片临时路径画成canvas
        ctx.drawImage(res.tempFilePaths[0], 0, 0, imgWidth, imgHeight);
        ctx.draw(false, () => {
          wx.canvasGetImageData({
            canvasId: 'myCanvas',
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight,
            success: res => {
              // console.log(res);
              // png编码
              let pngData = upng.encode([res.data.buffer], res.width, res.height)
              // base64编码
              let base64_img = wx.arrayBufferToBase64(pngData)
              var base64_image = 'data:image/jpeg;base64,' + base64_img;
              console.log(base64_image);
              wx.request({
                url: "https://mp.cn/index.php/SmallProgram/Index/base64_upload",  //此处并非真实接口地址
                method: 'POST',
                data: {
                  "img_base64": base64_image
                },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                success: res => {
                  console.log(res);
                  if (res.data.code == 1) {
                    wx.showModal({
                      title: '',
                      content: '上传成功',
                      showCancel: false,
                    })
                  } else {
                    wx.showModal({
                      title: '',
                      content: '上传失败，请重新上传',
                      showCancel: false,
                    })
                  }

                }
              })
            },
            fail(res) {
              console.log(res)
            },
          })
        })
        that.setData({
          'buttonName':'再上传试试'
        })
      },
    })
  },
  sendPhoto:function(){
    var that=this;
    var tempFilePaths=that.data.tempFilePaths;
    console.log(tempFilePaths)
  },
  onLoad: function () {
    
    
  }
})
