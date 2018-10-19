//index.js
//获取应用实例
const util = require('../../utils/util.js');
const upng = require('../../utils/upng.js');

Page({
  data: {
    tempFilePaths: '',
    content: [],
    imageWidth:'',
    imageHeight:'',
    width:'',
    height:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  takePhoto: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      success: function (res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths[0];
        wx.getImageInfo({
          src: tempFilePaths,
          success:function(res){
            console.log(res)
            var imageWidth=res.width;
            var imageHeight=res.height;
            if(imageWidth>500){
              var ratio1 = imageWidth / 500;
              imageWidth=500;
              imageHeight=imageHeight/ratio1
            }
            if(imageHeight>500){
              var ratio2=imageHeight/500;
              imageHeight=imageHeight/ratio2;
            }
            that.setData({
              'tempFilePaths': tempFilePaths,
              'image': tempFilePaths,
              'imageWidth': imageWidth+'px',
              'imageHeight': imageHeight+'px',
              'width':imageWidth,
              'height':imageHeight
            })
            console.log(imageWidth + imageHeight)
            //判断机型
            var model = "";
            wx.getSystemInfo({
              success: function (res) {
                model = res.model;
              },
            })
            console.log(model)
            if (model.indexOf("iPhone") < 0) {
              //上传图片
            } else {
              //压缩上传
              that.drawCanvas(tempFilePaths,imageWidth,imageHeight)
              // 缩放图片
            }
          }
        })
        
        
      }
    })
  },
  drawCanvas(tempFilePaths,imageWidth,imageHeight) {
    var that=this;
    const ctx = wx.createCanvasContext('attendCanvasId');
    ctx.drawImage(tempFilePaths, 0, 0, imageWidth, imageHeight);
    //ctx.draw();
    
    ctx.draw(false, () => {
      that.prodImageOpt();
      /*wx.canvasGetImageData({
        canvasId: 'myCanvas',
        x: 0,
        y: 0,
        width: imgWidth,
        height: imgHeight,
        success: res => {

        },
        fail(res) {
          console.log(res)
          wx.hideLoading();
        },
      })*/
    })
  },
  // 生成图片
  prodImageOpt: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'attendCanvasId',
      success: function success(res) {
        console.log(res)
        // 上传图片
        var tempFilePath=res.tempFilePath;
        wx.getFileSystemManager().readFile({
          filePath: tempFilePath,
          encoding: 'base64',
          success: res => {
            var base64_image = 'data:image/jpeg;base64,' + res.data
            console.log(base64_image)
          }
        })    
        wx.setStorage({
          'key':'image',
          'data':tempFilePath
        })
        /*wx.navigateTo({
          url: '../result/result',
        })*/
        
      },
      complete: function complete(e) {
      }
    });
  }
})
