const DB = require('../utils/db')

module.exports = {

  /**
   * 添加评论
   */
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let movieId = +ctx.request.body.movie_id
    let content = ctx.request.body.content || null
    let record = ctx.request.body.record || null

    if (!isNaN(movieId)) {
      await DB.query('INSERT INTO movieComment(user, username, avatar, content,record,  movie_id) VALUES (?, ?, ?, ?, ?,?)', [user, username, avatar, content, record,movieId])
    }

    ctx.state.data = { 'query': `INSERT INTO movieComment(user, username, avatar, content,  movie_id) VALUES (${user}, ${username},${avatar} , ${content},${record}, ${movieId})`,
    'user':user,
    'username':username,
    'avatar':avatar,
    'body':ctx.request.body}
  },
  
  /**
   * 获取评论列表
   */
  list: async ctx => {
    let movieId = +ctx.request.query.movie_id
    if (!isNaN(movieId)) {
      ctx.state.data = await DB.query('select * from movieComment where movieComment.movie_id =?', [movieId])
    } else {
      ctx.state.data =[]
    }

  },

  /**
  * 获取某电影下我的评论列表
  */
  myReleaseList: async ctx => {
    let movieId = +ctx.request.query.movie_id
    let user = ctx.state.$wxInfo.userinfo.openId
    ctx.state.data = await DB.query('select * from movieComment where movieComment.user=? AND movieComment.movie_id =?', [user, movieId])
  },
  
}