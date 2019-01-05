// pages/user/user.js
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
    columnTitle:['我的发布','我的收藏'],
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    releaseList: '',
    favoriteList:'',
    id: ''
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onTapLogin: function () {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType,
        })
      },
      error: () => {
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })
  },

  getReleaseList() {
    qcloud.request({
      url: config.service.releaseList,
      success: result => {
        console.log('123',result)
        let data = result.data
        if (!data.code) {
          this.setData({
            releaseList: data.data.map(item => {
              let itemDate = new Date(item.create_time)
              item.createTime = _.formatTime(itemDate)
              return item
            })
          })
        }
      },
      fail:error=>{
        console.error(error)
      }
    })
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
      fail:error=>{
        console.error(error)
      }
    })
  },

//获取我的发布
  ontapMyRelease(){
    this.getReleaseList()
    console.log(this.data.releaseList)
  },


//获取我的收藏
  ontapMyFavorite() {
    this.getFavoriteList()
  },


  // onTapPlay(){
  //   if (e==release){
  //   innerAudioContext.src = this.data.releaseList.record}
  //   if (e ==favorite){
  //     innerAudioContext.src = this.data.releaseList.record
  //   } 
  //   innerAudioContext.play()
  
  // },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 同步授权状态
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