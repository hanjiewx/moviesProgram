 const DB = require('../utils/db')

 /**
  * 获取我发布的评论列表
  */
 module.exports = {
   releaseList: async ctx => {
     let user = ctx.state.$wxInfo.userinfo.openId

     ctx.state.data = await DB.query('select * from movieComment where movieComment.user =? ', [user])

   }
 }