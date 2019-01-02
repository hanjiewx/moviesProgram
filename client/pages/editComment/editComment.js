// pages/editComment/editComment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  userInfo: null,
  locationAuthType: app.data.locationAuthType,
  commentValue:'',
  title:'',
  image:'',
  id:''
  },

  previewComment(){
    if (this.data.commentValue){
    wx.navigateTo({
      url: "../previewComment/previewComment?commentValue=" + this.data.commentValue + "&title=" + this.data.title + "&image=" + this.data.image + "&id=" + this.data.id
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
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  if (this.data.commentValue){
    this.setData({
      commentValue: options.commentValue,
      title: options.title,
      image: options.image,
      id: options.id
    })
  }
 else{
    this.setData({
      title: options.title,
      image: options.image,
      id: options.id
    })
  }
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