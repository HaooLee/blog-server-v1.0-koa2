const Router = require('koa-router')
const router = new Router({ prefix: '/user' })
const { findUser, getList, updateUser,userInfo, delete: del } = require('../controllers/user')

router
  .get('/find/:username', findUser)
  .get('/info',userInfo)
  .get('/list', getList) // 获取列表
  .put('/:userId', updateUser) // 更新用户信息
  .delete('/:userId', del) // 删除用户

module.exports = router
