const rp = require('request-promise')
const config = require('./config')
const fs = require('fs')
const path = require('path')

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
    let accessToken = await exports.getAccessToken(config.appId, config.secret)
    global.accessToken = JSON.parse(accessToken)['access_token']
    console.log(global.accessToken)
    setInterval(async () => {
        global.accessToken = await exports.getAccessToken(config.appId, config.secret).then(result => {
            global.accessToken = JSON.parse(result)['access_token']
        }).catch(err => {
            throw err
        })
    }, 1000 * 60 * 60 * 2 - 5 * 1000 * 60)
}

exports.uploadImg = async (filePath, accessToken) => {
    const mimes = {
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg'
    };
    const ext = path.extname(filePath);
    const mime = mimes[ext];
    if(!mime) throw new Error('类型错误')

    const option = {
        method: 'post',
        uri: `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${accessToken}&type=image`,
        formData: {
            media: {
                value: fs.createReadStream(filePath),
                options: {
                    filename: 'img.' + ext,
                    contentType: mime
                }
            }
        }
    }

    return rp(option)
}