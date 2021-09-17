const Router = require('koa-router')
const router = new Router({prefix: '/monitor'})
const {sysMonitor} = require('../controllers/monitor')

router
  .get('/', sysMonitor) 
module.exports = router
