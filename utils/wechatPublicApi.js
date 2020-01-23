const rp = require('request-promise')
const request = require('request')
const config = require('./config')
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

exports.uploadFile = async (fileName, accessToken, fileStream) => {
    const ext = path.extname(fileName)
    const types = {
        '.png': 'image',
        '.gif': 'image',
        '.jpg': 'image',
        '.jpeg': 'image',
        '.mp4': 'video'
    }
    const mimes = {
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.mp4': 'video/mp4'
    };
    const mime = mimes[ext]
    const type = types[ext]
    const url = `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${accessToken}&type=${type}`


    if(!mime) throw new Error('类型错误')

    const formData = {
        media: {
            value: fileStream,
            options: {
                filename: 'file' + ext,
                contentType: mime
            }
        }
    }
    return new Promise((resolve, reject) => {
        request.post({ url, formData }, (err, res, body) => {
            if(err) {
                reject(err)
            }
            resolve(body)
        })
    })
}