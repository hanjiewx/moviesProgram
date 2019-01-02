const DB = require('../utils/db.js')

module.exports = {
  /**
   * 拉取电影列表
   * 
   */

  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movies;")
  },

  detail: async ctx => {
    let movieId = + ctx.params.id
    if (!isNaN(movieId)) {
      ctx.state.data = (await DB.query('select * from movies where movies.id = ?', [movieId]))[0]
    } else {
      ctx.state.data = {}
    }
  }
}