// pages/editComment/editComment.js
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

const options = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac',
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

  previewComment() {
    if (this.data.commentValue || this.data.recordValue) {
      wx.navigateTo({
        url: "../previewComment/previewComment?commentValue=" + this.data.commentValue + '&recordValue=' + this.data.recordValue + "&duration=" + this.data.duration + "&title=" + this.data.title + "&image=" + this.data.image + "&id=" + this.data.id
      })
    }
  },

  onTapLogin: function () {
    app.login({
      success: ({ userInfo }) => {
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
          console.log({ 'scope': res.authSetting['scope.record'] })
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
  onLoad: function (options) {
    if (options.commentValue) {
      this.setData({
        commentValue: options.commentValue,
        title: options.title,
        image: options.image,
        id: options.id,
        tapIndex: options.tapIndex
      })
    }
    else {
      this.setData({
        title: options.title,
        image: options.image,
        id: options.id,
        tapIndex: options.tapIndex
      })
    }
    console.log(options.tapIndex)
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
    this.setData({
      locationAuthType: app.data.locationAuthType
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })

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