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
    userhead:'',
    username:"",
    record:"",
    favoriteList: '',

  },
onPullDownRefresh(){
  this.getMovieDetail(this.data.id,() => { wx.stopPullDownRefresh() })
  this.getCommentList(this.data.id, () => { wx.stopPullDownRefresh() })
},
  getMovieDetail(id,callback) {
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

  addComment() {
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

      else {
        console.log('j=0')
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
addFavorite() {
  for (let i = 0; i < this.data.favoriteList.length; i++) {
    if (this.data.favoriteList[i].user == this.data.userInfo.openId) {
        console.log('j>0')
        wx.navigateTo({
          url: '../myfavorite/myfavorite?id=' + this.data.id
        })
      }
      else {
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
  }
}
  },

  getCommentList(id,callback) {
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
getmycomment(id){
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
  onTapPlay(){
    console.log(this.data.record)
    innerAudioContext.obeyMuteSwitch=false
    innerAudioContext.src = this.data.record
    innerAudioContext.play()
    innerAudioContext.onError(e=>{
      console.log(e)
    })

    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.userName) {
      this.setData({
        id: options.id,
        userhead: options.userHead,
        username: options.userName,
        comment: options.comment,
        record: options.record
      })}
      
 else{
      this.setData({
        id: options.id})
     this.getmycomment(options.id)
     
 }
    this.getMovieDetail(this.data.id,'')
    this.getCommentList(this.data.id,'')
    
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