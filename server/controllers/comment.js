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
      await DB.query('INSERT INTO movieComment(user, username, avatar, content, record, movie_id) VALUES (?, ?, ?, ?, ?)', [user, username, avatar, content, record,movieId])
    }

    ctx.state.data = { 'query': `INSERT INTO movieComment(user, username, avatar, content, record, movie_id) VALUES (${user}, ${username},${avatar} , ${content},${record}, ${movieId})`,
    'user':user,
    'username':username,
    'avatar':avatar,
    'body':ctx.request.body}
  },
  /**
   * 添加收藏
   */
  favorite: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let movieId = +ctx.request.body.movie_id
    let content = ctx.request.body.content || null

    if (!isNaN(movieId)) {
      await DB.query('INSERT INTO favoriteComment(user, username, avatar, content,  movie_id) VALUES (?, ?, ?, ?, ?)', [user, username, avatar, content, movieId])
    }

    ctx.state.data = {}
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
   * 获取发布列表
   */
  releaseList: async ctx => {
    let user = ctx.request.query.user

    if (user) {
      ctx.state.data = await DB.query('select * from movieComment where movieComment.user= ?', [user])
    } else {
      ctx.state.data =[]
    }
    ctx.state.data = {'query':`select * from movieComment where movieComment.user =${user}`}
  },
  /**
   * 获取收藏列表
   */
  favoriteList: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM favoriteComment")
  },
}