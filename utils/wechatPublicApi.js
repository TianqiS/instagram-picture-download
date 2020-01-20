const rp = require('request-promise')
const config = require('./config')

exports.getAccessToken = async (appId, secret) => {
    const options = {
        method: 'get',
        uri: 'https://api.weixin.qq.com/cgi-bin/token',
        qs: {
            grant_type: 'client_credential',
            appid: appId,
            secret
        }
    }
    return rp(options)
}

exports.getAndRefreshToken = async () => {
    global.accessToken = await exports.getAccessToken(config.appId, config.secret)
    setInterval(async () => {
        global.accessToken = await exports.getAccessToken(config.appId, config.secret).then(result => {
            return result
        }).catch(err => {
            throw err
        })
    }, 1000 * 60 * 60 * 2 - 5 * 1000 * 60)
}