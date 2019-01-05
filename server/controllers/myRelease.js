const DB = require('../utils/db')

module.exports = {
  /**
     * 获取发布列表
     */
  myReleaseList: async ctx => {
    //let user = ctx.state.$wxInfo.userinfo.openId
    // let movieId = + ctx.params.id
    ctx.state.data = await DB.query('SELECT * FROM movieComment')
  },
  // where movieComment.user = ?', [user] AND movieComment.movie_id = ?

}