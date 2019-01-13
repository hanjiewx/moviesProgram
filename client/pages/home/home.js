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
  getMovie(){
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
            userName: commentList[0].username,
            userHead: commentList[0].avatar,
            comment: commentList[0].content,
            record: commentList[0].record,
          })
        }
        console.log(this.data.commentList)
      },
      fail: error => {
        console.error(error)
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
    url: '../commentDetail/commentDetail?id=' + this.data.id + '&comment=' + this.data.comment + '&record=' + this.data.record +'&userName='+this.data.userName+'&userHead='+this.data.userHead,
  })
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