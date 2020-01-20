const environment = process.env.environment
const crypro = require('crypto')

const config = {
    wechatToken: environment === 'build'? process.env.wechatToken : 'test',
}

module.exports = config
