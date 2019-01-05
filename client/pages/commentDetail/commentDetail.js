const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: '',
    id: '',
    userName:'',
    userHead:'',
    comment:''
  },

  getMovieDetail(id) {
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
            movie: data.data
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
      }
    })
  },

  addComment() {
    let id = this.data.id
    let title = this.data.movie.title
    let image = this.data.movie.image

    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success(res) {
        if (res.tapIndex == 0 || 1) {
          wx.navigateTo({
            url: '../editComment/editComment?id=' + id + '&title=' + title + '&image=' + image + '&tapIndex=' + res.tapIndex,
          })
        }

      },
      fail(res) {
        console.log(res.errMsg)
      }
    })

  },
  addFavorite(){
      wx.showLoading({
        title: '正在收藏评论'
      })

      qcloud.request({
        url: config.service.addFavorite,
        login: true,
        method: 'POST',
        data: {
          content: this.data.comment,
          movie_id: this.data.id
        },
        success: result => {
          wx.hideLoading()

          let data = result.data
          if (!data.code) {
            wx.showToast({
              title: '发表收藏成功'
            })

          } else {
            wx.showToast({
              icon: 'none',
              title: '发表收藏失败'
            })
          }
        },
        fail: () => {
          wx.hideLoading()

          wx.showToast({
            icon: 'none',
            title: '发表收藏失败'
          })
        }
      })
    },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      userName:options.userName,
      userHead:options.userHead,
      comment:options.comment
    })
    this.getMovieDetail(this.data.id)
    console.log(options.userName)
  },
  /**
   * 生命周期函数--监听页面加载
   */


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