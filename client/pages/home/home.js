const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const _ = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    userHead: '',
    comment: '',
    record: '',
    commentList: '',
    movieImage: '',
    id: '',
    title: '',
    avatar: '',
    username: ''
  },
  onPullDownRefresh() {
    this.getMovieList(() => {
      wx.stopPullDownRefresh()
    })
  },

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  },

  /*随机获取某部电影信息*/
  getRandomMovie() {
    let movielist = this.data.movieList;
    let length = movielist.length;
    let random = this.getRandomIntInclusive(0, length)
    this.setData({
      id: random + 1,
      movieImage: movielist[random].image,
      title: movielist[random].title
    })
    this.getCommentList(random + 1)
  },
  /*随机获取该电影的某条评论*/
  getRandomComment() {
    let commentlist = this.data.commentList;
    let commentlength = commentlist.length;
    let random1 = this.getRandomIntInclusive(0, commentlength)
    console.log('random', random1)
    this.setData({
      avatar: commentlist[random1].avatar,
      username: commentlist[random1].username,
      commentlist1: commentlist[random1],
    })
  },

  getMovieList(callback) {
    wx.showLoading({
      title: '电影数据加载中...',
    })

    qcloud.request({
      url: config.service.movieList,
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          this.setData({
            movieList: data.data
          })
          this.getRandomMovie()
        } else {
          wx.showToast({
            icon: 'none',
            title: '电影数据加载错误',
          })
        }
      },

      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '电影数据加载错误',
        })
      },
      complete: () => {
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
            commentList: commentList,
          })
          console.log('commentlist', this.data.commentlist)
          if (this.data.commentList.length > 0) {
            this.getRandomComment()
          }
        }
      },
      fail: error => {
        console.error(error)
      },
    })
  },

  addComment() {
    let id = this.data.id
    console.log('id', id)
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
  onLoad: function(options) {
    this.getMovieList()
    console.log(this.data.userName, this.data.userHead)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onTapCommentDetail() {
    wx.navigateTo({
      url: '../commentDetail/commentDetail?id=' + this.data.id + '&commentlist1=' + JSON.stringify(this.data.commentlist1),
    })
  }
})