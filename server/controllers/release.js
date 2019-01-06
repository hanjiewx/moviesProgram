const DB = require('../utils/db')

module.exports = {
/**
   * 获取发布列表
   */
releaseList: async ctx => {
  //ctx.state.data = await DB.query('SELECT * FROM movieComment')
// let user = ctx.state.$wxInfo.userinfo.openId
  ctx.state.data = await DB.query('SELECT * FROM movieComment')
},
 
}
// where movieComment.user = ? ', [user]