// pages/editComment/editComment.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

const options = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tapIndex: '',
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    commentValue: '',
    recordValue: '',
    title: '',
    image: '',
    id: '',
    scope: '',
    duration: ''
  },
  onPullDownRefresh() {
    this.getMovieDetail(this.data.id, () => {
      wx.stopPullDownRefresh()
    })
  },

  getMovieDetail(id, callback) {
    wx.showLoading({
      title: '电影数据加载中...',
    })

    qcloud.request({
      url: config.service.movieDetail + id,
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          this.setData({
            movie: data.data,
            title: data.data.title,
            image: data.data.image,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '电影数据加载错误123',
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      },

      fail: (e) => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '电影数据加载错误456',
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      },
      complete: () => {
        callback && callback()
      }
    })
  },


  previewComment() {
    if (this.data.commentValue || this.data.recordValue) {
      wx.navigateTo({
        url: "../previewComment/previewComment?commentValue=" + this.data.commentValue + '&recordValue=' + this.data.recordValue + "&duration=" + this.data.duration + "&title=" + this.data.title + "&image=" + this.data.image + "&id=" + this.data.id
      })
    }
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

  onInput(event) {
    this.setData({
      commentValue: event.detail.value.trim()
    })
  },

  startRecode() {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.record']) {
          console.log({
            'scope': res.authSetting['scope.record']
          })
        } else {
          wx.authorize({
            scope: 'scope.record',
            success() {
              console.log(scope.record)
            }
          })
        }
      },
      fail(error) {
        console.log(error)
      }
    })

    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
  },
  endRecode() {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.data.recordValue = res.tempFilePath
      // app.globalData.tempFilePath = res.tempFilePath
      // console.log('globalData:', app.globalData)
      this.data.duration = res.duration
      this.setData({
        // duration:res.duration
      });
      console.log('停止录音', res)
    })
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
        id: options.id,
        tapIndex: options.tapIndex
      })
    } else {
      this.setData({
        title: options.title,
        image: options.image,
        id: options.id,
        tapIndex: options.tapIndex
      })
    }
    console.log('id', options.id)
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

})