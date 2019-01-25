const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const _ = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    userHead:'',
    comment:'',
    record:'',
    commentList: '',
    movieImage:'',
    id:'',
    title:'',
  },
  onPullDownRefresh() {
    this.getMovie(() => { wx.stopPullDownRefresh() })
  },

  getMovie(callback){
    wx.showLoading({
      title: '电影数据加载中...',
    })

    qcloud.request({
      url: config.service.movieList,
      success: result => {
        console.log(result)
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          this.setData({
            movieImage: data.data[0].image,
            id:data.data[0].id,
            title: data.data[0].title
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '电影数据加载错误',
          })
        }
      this.getCommentList(data.data[0].id)
      },

      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '电影数据加载错误',
        })
      },
      complete:()=>{
        callback && callback()
      }
    })
    
  },

  getCommentList(id) {
    qcloud.request({
      url: config.service.commentList,
      data: {
        movie_id: id
      },
      success: result => {
        let data = result.data
        let commentList = data.data.map(item => {
          let itemDate = new Date(item.create_time)
          item.createTime = _.formatTime(itemDate)
          return item
        })
        if (!data.code) {
          this.setData({
            commentList:commentList,
          })
        }
        console.log(this.data.commentList)
      },
      fail: error => {
        console.error(error)
      },
    })
  },

  addComment() {
    let id = this.data.id
    let title = this.data.title
    let image = this.data.movieImage

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

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getMovie()
    console.log(this.data.userName, this.data.userHead)
  },
    /**
       * 生命周期函数--监听页面初次渲染完成
          */
  onTapCommentDetail(){
  wx.navigateTo({
    url: '../commentDetail/commentDetail?id=' + this.data.id + '&commentList=' + this.data.commentList,
  })
  }
})