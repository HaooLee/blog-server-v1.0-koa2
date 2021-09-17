const devMode = process.env.NODE_ENV === 'development'
const config = {
  PORT: 6060, // 启动端口
  ADMIN_GITHUB_LOGIN_NAME: 'HaooLee', // 博主的 github 登录的账户名 user
  GITHUB: {
    client_id: '87a4f88b943adaafd44a',
    client_secret: '9494809fc485d93084452fbf8b21ba2a829bfb82',
    access_token_url: 'https://github.com/login/oauth/access_token',
    fetch_user_url: 'https://api.github.com/user', // 用于 oauth2
    fetch_user: 'https://api.github.com/user' // fetch user url https://api.github.com/users/gershonv
  },
  EMAIL_NOTICE: {
    // 邮件通知服务
    // detail: https://nodemailer.com/
    enable: true, // 开关
    transporterConfig: {
      host: 'smtp.qq.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: '907615065@qq.com', // generated ethereal user
        pass: 'f2bbfe7cf1bcb8253a65c06701fbbbbf8c910be44ecc1a430497d4879db0d71d' // generated ethereal password 授权码 而非 密码
      }
    },
  },
  TOKEN: {
    secret: 'root', // secret is very important!
    expiresIn: '720h' // token 有效期
  },
  DATABASE: {
    database: 'test',
    user: 'root',
    password: 'test112233',
    options: {
      host: 'localhost', // 连接的 host 地址
      dialect: 'mysql', // 连接到 mysql
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: false, // 默认不加时间戳
        freezeTableName: true // 表名默认不加 s
      },
      timezone: '+08:00'
    }
  }
}

// 部署的环境变量设置
if (!devMode) {
  console.log('env production....')

  // ==== 配置数据库
  config.DATABASE = {
    database: 'blog',
    user: 'haoolee',
    password: '',
    options: {
      host: 'haooleeblog.mysql.rds.aliyuncs.com', // 连接的 host 地址
      // host: 'rm-2zew5ww3bs5v00imzmo.mysql.rds.aliyuncs.com', // 连接的 host 外网地址 关闭中
      dialect: 'mysql', // 连接到 mysql
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: false, // 默认不加时间戳
        freezeTableName: true // 表名默认不加 s
      },
      timezone: '+08:00'
    }
  }

  // 配置 github 授权
  config.GITHUB.client_id = ''
  config.GITHUB.client_secret = ''

  // ==== 配置 token 密钥
  config.TOKEN = {
    secret: 'root', // secret is very important!
    expiresIn: '720h' // token 有效期
  }

  // ==== 配置邮箱

  // // config.EMAIL_NOTICE.enable = true
  // config.EMAIL_NOTICE.transporterConfig.auth = {
  //   user: '907615065@qq.com', // generated ethereal user
  //   pass: 'f2bbfe7cf1bcb8253a65c06701fbbbbf8c910be44ecc1a430497d4879db0d71d' // generated ethereal password 授权码 而非 密码
  // }
  // config.EMAIL_NOTICE.WEB_HOST = 'https://panyunyi.cn'
}

module.exports = config
