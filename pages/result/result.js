// pages/result/result.js
const util = require('../../utils/util.js');
const upng = require('../../utils/upng.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    imagePath:'',
    contentMax:'',
    isShow:'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    
    var tempFilePaths ;
    wx.getStorage({
      //获取数据的key
      key: 'image',
      success: function (res) {
        console.log(res)
        tempFilePaths=res.data
        console.log(tempFilePaths)
        that.setData({
          'imagePath': tempFilePaths,
        })
        wx.showLoading({
          title: '识别中',
        })
        wx.getFileSystemManager().readFile({
          filePath: tempFilePaths,
          encoding: 'base64',
          success: res => {
            var base64_image = 'data:image/jpeg;base64,' + res.data
            console.log(base64_image)
            wx.request({
              url: "http://118.24.11.12:8080/index.php/index/ImageIdentification/dishDetect",  //此处并非真实接口地址
              method: 'POST',
              data: {
                "image": base64_image
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: res => {
                console.log(res);
                if (res.data.code == 1001) {
                  var contentArray = [];
                  var contentMaxnum = ''
                  for (let i = 0; i < res.data.data.result_num; i++) {
                    if (i > 0) {
                      contentArray.push(res.data.data.result[i])
                    } else {
                      contentMaxnum = res.data.data.result[0].name;
                    }
                  }
                  that.setData({
                    content: contentArray,
                    contentMax: contentMaxnum,
                    isShow: 'block'
                  })
                  wx.hideLoading();
                } else {
                  wx.hideLoading();
                  wx.showModal({
                    content: res.data.msg,
                    showCancel: false
                  })
                }
              }
            })
          }, fail(res) {
            console.log(res)
            wx.hideLoading();
            wx.showModal({
              content: '网络请求失败',
              showCancel: false
            })
          }
        })  
      },
      /**
       * 失败会调用
       */
      fail: function (res) {
        console.log(res)
      }
    }) 
      
      
   
    
    
    
    /*wx.showLoading({
      title: '识别中',
    })*/
    /*const ctx = wx.createCanvasContext('myCanvas');
    wx.getImageInfo({
      src: tempFilePaths,
      success: function (res) {
        console.log(res)
        var imgWidth = res.width;
        var imgHeight = res.height;
        that.setData({
          'imgWidth': '500' + 'px',
          'imgHeight': '500' + 'px'
        })
        ctx.drawImage(tempFilePaths, 0, 0,100, 100);
        ctx.draw(false, () => {
          wx.canvasGetImageData({
            canvasId: 'myCanvas',
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight,
            success: res => {
              let pngData = upng.encode([res.data.buffer], res.width, res.height)
              let base64_img = wx.arrayBufferToBase64(pngData)
              var base64_image = 'data:image/jpeg;base64,' + base64_img;
              wx.request({
                url: "http://118.24.11.12:8080/index.php/index/ImageIdentification/dishDetect",  //此处并非真实接口地址
                method: 'POST',
                data: {
                  "image": base64_image
                },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                success: res => {
                  console.log(res);
                  if (res.data.code == 1001) {
                    var contentArray = [];
                    var contentMaxnum = ''
                    for (let i = 0; i < res.data.data.result_num; i++) {
                      if (i > 0) {
                        contentArray.push(res.data.data.result[i])
                      } else {
                        contentMaxnum = res.data.data.result[0].name;
                      }
                    }
                    console.log(contentArray)
                    that.setData({
                      content: contentArray,
                      contentMax: contentMaxnum,
                      isShow: 'block'
                    })
                    

                  } else {
                    
                  }
                  wx.hideLoading();
                }
              })

              
              
            },
            fail(res) {
              console.log(res)
              wx.hideLoading();
            },
          })
        })


      }
    })*/
    /*wx.getFileSystemManager().readFile({
      filePath: tempFilePaths,
      encoding: 'base64',
      success: res => {
        var base64_image = 'data:image/jpeg;base64,'+res.data
        wx.request({
          url: "http://118.24.11.12:8080/index.php/index/ImageIdentification/dishDetect",  //此处并非真实接口地址
          method: 'POST',
          data: {
            "image": base64_image
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: res => {
            console.log(res);
            if (res.data.code == 1001) {
              var contentArray = [];
              var contentMaxnum = ''
              for (let i = 0; i < res.data.data.result_num; i++) {
                if (i > 0) {
                  contentArray.push(res.data.data.result[i])
                } else {
                  contentMaxnum = res.data.data.result[0].name;
                }
              }
              that.setData({
                content: contentArray,
                contentMax: contentMaxnum,
                isShow: 'block'
              })
              wx.hideLoading();
            } else {
              wx.hideLoading();
              wx.showModal({
                content: res.data.msg,
                showCancel: false
              })
            }
          }
        })
      },fail(res){
        console.log(res)
        wx.hideLoading();
        wx.showModal({
          content: '网络请求失败',
          showCancel: false
        })
      }
    })*/
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

  }
})