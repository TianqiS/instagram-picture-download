const router = require('koa-router')()
const config =require('../utils/config')
const encrypt = require('../utils/encode').encrypt

router.get('/', async (ctx, next) => {
    const signature = ctx.query.signature
    const timestamp = ctx.query.timestamp
    const nonce = ctx.query.nonce
    const wechatToken = config.wechatToken

    const tmpArr = [wechatToken, timestamp, nonce].sort()
    let tmpStr = tmpArr.join("") //connect the item of the Array
    tmpStr = encrypt('sha1', tmpStr)

    if(tmpStr === signature) {
        return ctx.body = signature
    }

    return ctx.body = false
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
