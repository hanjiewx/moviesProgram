// pages/movieDetail/movieDetail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const _ = require('../../utils/util')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: '',
    id: '',
    commentList: '',
    userInfo: null,
    locationAuthType: app.data.locationAuthType,

  },

  onPullDownRefresh() {
    let id = this.data.id
    this.getMovieDetail(id, () => {
      wx.stopPullDownRefresh()
    })
    this.getCommentList(id, () => {
      wx.stopPullDownRefresh()
    })
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
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  getCommentList(id, callback) {
    qcloud.request({
      url: config.service.commentList,
      data: {
        movie_id: id
      },
      success: result => {
        let data = result.data
        if (!data.code) {
          this.setData({
            commentList: data.data.map(item => {
              let itemDate = new Date(item.create_time)
              item.createTime = _.formatTime(itemDate)
              return item
            })
          })
        }
        console.log(this.data.commentList)
      },
      fail: error => {
        console.error(error)
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  checkComment() {
    wx.navigateTo({
      url: '../commentList/commentList?id=' + this.data.id,
    })
  },
  addComment() {
    if (this.data.commentList != '') {
      for (let i = 0; i < this.data.commentList.length; i++) {
        if (this.data.commentList[i].user == this.data.userInfo.openId) {
          console.log('j>0')
          wx.navigateTo({
            url: '../commentDetail/commentDetail?id=' + this.data.id
          })
        } else {
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
        }
      }
    } else {
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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      onTap: false,
      cancle: false
    })
    console.log(this.data.id)
    this.getMovieDetail(this.data.id)
    this.getCommentList(this.data.id)
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


})