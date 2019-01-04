const CONF = {
    port: '5757',
    rootPathname: '',

  // 微信小程序 App ID
  appId: 'wx041b4cd30ca8e607',

  // 微信小程序 App Secret
  appSecret: 'fc99252a026be93161e5b299fb1c34a7',
  qcloudAppId: '1258339089',
  qcloudSecretId: 'AKIDZzZ9eMUFfzFQVRLBjZdbrdSOI75x3cjI ',
  qcloudSecretKey: 'hw5zyzv7OYmZmVOmBYz2OqfJsERhMvS8',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: false,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: 'wx041b4cd30ca8e607',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
      region: 'ap-shanghai',
        // Bucket 名称
      fileBucket: 'product-1258339089',
        // 文件夹
      uploadFolder: 'audios',
      //上传文件类型
      mimetypes: ['audio/aac', 'audio/x-aac', 'audio/mpeg', 'audio/mp3', 'audio/m4a','image/jpg', 'image/jepg', 'image/png']
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
