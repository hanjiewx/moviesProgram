/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://j0mqfw3h.qcloud.la';

var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    // 测试的信道服务地址
    tunnelUrl: `${host}/weapp/tunnel`,

    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`,

    // 拉取用户信息
    user: `${host}/weapp/user`,

    // 拉取电影列表
    movieList: `${host}/weapp/movies`,
    // 拉取电影详情
    movieDetail: `${host}/weapp/movies/`,
    // 添加评论
    addComment: `${host}/weapp/comment`,
    // 添加收藏
    addFavorite: `${host}/weapp/comment`,
    // 拉取影评列表
    commentList: `${host}/weapp/comment`,
    // 拉取收藏列表
    favoriteList: `${host}/weapp/favorite`,
    // 拉取发布列表
    releaseList: `${host}/weapp/release`,
    //拉取某电影我的发布列表
    myReleaseList: `${host}/weapp/myRelease`,
  }
};

module.exports = config;
