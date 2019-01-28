const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const _ = require('../../utils/util')
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: '',
    id: '',
    userInfo: '',
    comment: '',
    userhead: '',
    username: "",
    record: "",
    favoriteList: '',
    isFavorited: false

  },
  onPullDownRefresh() {
    this.getMovieDetail(this.data.id, () => {
      wx.stopPullDownRefresh()
    })
    this.getCommentList(this.data.id, () => {
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

  postComment() {
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
          wx.navigateTo({
            url: '../commentList/commentList?id=' + this.data.id,
          })
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
          method: 'PUT',
          data: {
            record,
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
                title: '发表评论失败'
              })
            }
            wx.navigateTo({
              url: '../commentList/commentList?id=' + this.data.id,
            })
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

  },

  addComment() {
    if (this.data.commentList.length == 0) {
      this.postComment()
      return
    }
    for (let i = 0; i < this.data.commentList.length; i++) {
      if (this.data.commentList[i].user == this.data.userInfo.openId) {
        console.log('j>0')
        return
      } else {
        this.postComment()
      }
    }
  },
  getFavoriteList() {
    qcloud.request({
      url: config.service.favoriteList,
      success: result => {

        let data = result.data
        if (!data.code) {
          this.setData({
            favoriteList: data.data.map(item => {
              let itemDate = new Date(item.create_time)
              item.createTime = _.formatTime(itemDate)
              return item
            })
          })
        }

        console.log(this.data.favoriteList)
      },
      fail: error => {
        console.error(error)
      }
    })
  },
  postFavorite() {
    wx.showLoading({
      title: '正在收藏评论'
    })

    qcloud.request({
      url: config.service.addFavorite,
      login: true,
      method: 'POST',
      data: {
        content: this.data.comment,
        record: this.data.record,
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
      },
    })
  },

  addFavorite() {
    if (this.data.isFavorited) {
      return
    }
    if (this.data.favoriteList.length == 0) {
      this.postFavorite()
      return
    }
    for (let i = 0; i < this.data.favoriteList.length; i++) {
      if (this.data.favoriteList[i].user == this.data.userInfo.openId && this.data.id == this.data.favoriteList[i].movie_id) {
        console.log('j>0')
        return
      } else {
        this.postFavorite()
      }
    }
    this.setData({
      isFavorited: true
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
  getmycomment(id) {
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
          let commentList = this.data.commentList
          for (let i = 0; i < commentList.length; i++) {
            if (commentList[i].user == this.data.userInfo.openId) {
              console.log('j>0')
              this.setData({
                comment: commentList[i].content,
                userhead: commentList[i].avatar,
                username: commentList[i].username,
                record: commentList[i].record
              })
            }
          }
        }

      },
      fail: error => {
        console.error(error)
      },

    })
  },
  onTapPlay() {
    console.log(this.data.record)
    innerAudioContext.obeyMuteSwitch = false
    innerAudioContext.src = this.data.record
    innerAudioContext.play()
    innerAudioContext.onError(e => {
      console.log(e)
    })


  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.userName) {
      this.setData({
        id: options.id,
        userhead: options.userHead,
        username: options.userName,
        comment: options.comment,
        record: options.record
      })
      this.getMovieDetail(this.data.id, '')
    }
    else if (options.commentlist1) {
      this.setData({
        id: options.id,
        commentlist1: JSON.parse(options.commentlist1),
        userhead: JSON.parse(options.commentlist1).avatar,
        username: JSON.parse(options.commentlist1).username,
        comment: JSON.parse(options.commentlist1).content,
        record: JSON.parse(options.commentlist1).record
      })
      this.getMovieDetail(this.data.id, '')
    }
    else{
      this.setData({ id: options.id,})
      this.getMovieDetail(options.id, '')
      this.getmycomment(options.id) 
     
      console.log('movie',this.data.movie)
    }
    this.getCommentList(this.data.id, '')
    this.getFavoriteList()

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