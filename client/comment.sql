-- 表的结构 `movieComment`
--

CREATE TABLE `movieComment` (
  `user` varchar(255) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `avatar` varchar(255) NOT NULL,
  `content` varchar(511) CHARACTER SET utf8 DEFAULT NULL,
  `record` varchar(511) CHARACTER SET utf8 DEFAULT NULL,
  `images` varchar(1023) DEFAULT NULL,
  `movie_id` int(11) NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `favoriteComment` (
  `user` varchar(255) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `avatar` varchar(255) NOT NULL,
  `content` varchar(511) CHARACTER SET utf8 DEFAULT NULL,
  `record` varchar(511) CHARACTER SET utf8 DEFAULT NULL,
  `images` varchar(1023) DEFAULT NULL,
  `movie_id` int(11) NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


SET @IMAGE_BASE_URL = "https://product-1258339089.cos.ap-shanghai.myqcloud.com/"; -- FOR EXAMPLE: https://*****.ap-shanghai.myqcloud.com/


