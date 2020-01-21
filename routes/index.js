const router = require('koa-router')()
const config =require('../utils/config')
const insDownload = require('../utils/insDownload')
const wechatPublicApi = require('../utils/wechatPublicApi')
const encrypt = require('../utils/encode').encrypt

router.get('/', async (ctx, next) => {
    const signature = ctx.query.signature
    const timestamp = ctx.query.timestamp
    const nonce = ctx.query.nonce
    const echostr = ctx.query.echostr
    const wechatToken = config.wechatToken

    const tmpArr = [wechatToken, timestamp, nonce].sort()
    let tmpStr = tmpArr.join("") //connect the item of the Array
    tmpStr = encrypt('sha1', tmpStr)

    if(tmpStr === signature) {
        return ctx.body = echostr
    }

    return ctx.body = false
})

router.post('/', async (ctx, next) => {
    let returnBody = ''
    const xmlContent = ctx.request.body.xml
    const MsgType = xmlContent.MsgType[0]
    const Content = xmlContent.Content[0]
    const accessToken = global.accessToken
    switch (MsgType) {
        case 'text':
            let patt = new RegExp('.*www.instagram.com.*')
            if(patt.test(Content)) {
                let filePath = await insDownload(Content)
                returnBody = await wechatPublicApi.uploadImg(filePath, accessToken)
                console.log(returnBody)
                break
            }
        default:
            returnBody = 'success'
    }
    return ctx.body = returnBody
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
