const DB = require('../utils/db.js')

module.exports = {
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
   * 获取收藏列表
   */
  favoriteList: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM favoriteComment")

  },
}