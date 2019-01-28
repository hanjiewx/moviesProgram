 const DB = require('../utils/db')
 /**
  * 获取某电影下我的评论列表
  */
 module.exports = {
   myReleaseList: async ctx => {
     let movieId = +ctx.request.query.movie_id
     let user = ctx.state.$wxInfo.userinfo.openId
     ctx.state.data = await DB.query('select * from movieComment where movieComment.user=? AND movieComment.movie_id =?', [user, movieId])
   }
 }