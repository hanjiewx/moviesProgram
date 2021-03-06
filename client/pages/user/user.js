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
    columnTitle: ['我的发布', '我的收藏'],
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    releaseList: '',
    favoriteList: '',
    id: '',
    ontap: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      locationAuthType: app.data.locationAuthType,
      ontap: 'release'
    })
    app.checkSession({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo
        })
        this.getReleaseList(this.data.userInfo.openId)
      }
    })

  },

  onTapLogin: function() {
    app.login({
      success: ({
        userInfo
      }) => {
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

  getReleaseList(user) {
    qcloud.request({
      url: config.service.releaseList,
      success: result => {
        console.log('123', result)
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
      fail: error => {
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
      fail: error => {
        console.error(error)
      }
    })
  },

  //获取我的发布
  ontapMyRelease(e) {
    let user = this.data.userInfo.openId
    this.getReleaseList(user)
    console.log(this.data.userInfo)
    this.setData({
      ontap: e.currentTarget.id
    })
  },


  //获取我的收藏
  ontapMyFavorite(e) {
    this.getFavoriteList()
    this.setData({
      ontap: e.currentTarget.id
    })
    console.log(this.data.ontap)
  },


  // onTapPlay(){
  //   if (e==release){
  //   innerAudioContext.src = this.data.releaseList.record}
  //   if (e ==favorite){
  //     innerAudioContext.src = this.data.releaseList.record
  //   } 
  //   innerAudioContext.play()

  // },
})