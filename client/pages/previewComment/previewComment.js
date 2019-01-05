// pages/previewComment/previewComment.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    commentValue: '',
    recordValue: '',
    duration: '',
    title: '',
    image: '',
    id: '',
    record: ''
  },

  onTapLogin: function() {
    app.login({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
      },
      error: () => {
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })
  },

  onTapPlay() {
    innerAudioContext.src = this.data.recordValue + '=' + this.data.duration + '.mp3'
    // innerAudioContext.src = app.globalData.tempFilePath
    innerAudioContext.play()
    this.setData({
      record: innerAudioContext.src
    })
    console.log('record', this.data.record)
  },

  addComment(event) {
    wx.showLoading({
      title: '正在发表评论'
    })
    if (this.data.commentValue) {
      qcloud.request({
        url: config.service.addComment,
        login: true,
        method: 'PUT',
        data: {
          content: this.data.commentValue,
          movie_id: this.data.id
        },
        success: result => {
          wx.hideLoading()

          let data = result.data
          if (!data.code) {
            wx.showToast({
              title: '发表评论成功'
            })

          } else {
            wx.showToast({
              icon: 'none',
              title: '发表评论失败123'
            })
          }
        },
        fail: (e) => {
          wx.hideLoading()

          wx.showToast({
            icon: 'none',
            title: '发表评论失败456'
          })
          console.error(e)
        }
      })
    }
    if (this.data.recordValue) {
      this.uploadRecord(record => {
        qcloud.request({
          url: config.service.addComment,
          login: true,
          method: 'POST',
          data: {
            record,
            content,
            movie_id: this.data.id
          },
          success: result => {
            wx.hideLoading()

            let data = result.data

            if (!data.code) {
              wx.showToast({
                title: '发表评论成功'
              })

              setTimeout(() => {
                wx.navigateBack()
              }, 1500)
            } else {
              wx.showToast({
                icon: 'none',
                title: '发表评论失败'
              })
            }
          },
          fail: () => {
            wx.hideLoading()

            wx.showToast({
              icon: 'none',
              title: '发表评论失败'
            })
          }
        })
      })
    }
    wx.navigateTo({
      url: '../commentList/commentList?id='+this.data.id,
    })
  },

  uploadRecord(cb) {
    let recordValue = this.data.record
    console.log("recordValue: ", recordValue)
    let record = []
    if (recordValue) {
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: recordValue,
        name: 'file',
        // header: {
        //   'content-type': 'multipart/form-data'
        // },
        success: res => {
          let data = JSON.parse(res.data)
          console.log(res)
          // if (!data.code) {
          // record.push(data.data.record)
          //   cb && cb(record)
          // }

        },
        fail: (e) => {
          console.error(e)
        }
      })
    } else {
      cb && cb(record)
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.commentValue) {
      this.setData({
        commentValue: options.commentValue,
        title: options.title,
        image: options.image,
        id: options.id
      })
    }
    if (options.recordValue) {
      this.setData({
        recordValue: options.recordValue,
        duration: options.duration,
        title: options.title,
        image: options.image,
        id: options.id
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      locationAuthType: app.data.locationAuthType
    })
    app.checkSession({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})