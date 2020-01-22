const fs = require('fs')
const request = require('request')
const axios = require('axios')
const path = require('path')
const puppeteer = require('puppeteer')
const config = require('./config')
const wechatPublicApi = require('./wechatPublicApi')
const rootDir = config.rootDir

function mkdirSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
    return false
}

module.exports = async (url, accessToken) => {
    const browers = await puppeteer.launch({args: ['--no-sandbox']})
    const page = await browers.newPage()

    await page.goto(url)
    let imgUrl = await page.$eval('.FFVAD', (imgEle) => {
        return imgEle.src
    }).catch(error => {
        throw error
    })
    await browers.close();
    const imgName = /[^\/]+\.(png|jpe?g|gif|svg)/.exec(imgUrl)[0]
    const { data: imgStream } = await axios.get(imgUrl, {
        responseType: 'stream'
    })

    return await wechatPublicApi.uploadImg(imgName, accessToken, imgStream)

}
