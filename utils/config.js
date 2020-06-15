const environment = process.env.environment
const crypro = require('crypto')

const config = {
    wechatToken: environment === 'build'? process.env.wechatToken : 'test',
    appId: process.env.appId,
    secret: process.env.secret,
    rootDir: process.cwd(),
    insUserName: process.env.insUserName,
    insPassword: process.env.insPassword
}

module.exports = config
