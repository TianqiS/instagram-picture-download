const fs = require('fs')
const request = require('request')
const path = require('path')
const puppeteer = require('puppeteer')
const config = require('./config')
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

module.exports = async (url) => {
    const browers = await puppeteer.launch({args: ['--no-sandbox']})
    const page = await browers.newPage()

    await page.goto(url)
    let imgUrl = await page.$eval('.FFVAD', (imgEle) => {
        return imgEle.src
    }).catch(error => {
        throw error
    })
    const imgName = /[^\/]+\.(png|jpe?g|gif|svg)/.exec(imgUrl)[0]
    const savePath = path.resolve(rootDir, './file/', imgName)
    mkdirSync('file')
    return new Promise((resolve, reject) => {
        request(imgUrl).pipe(fs.createWriteStream(savePath))
        request(imgUrl).on('end', () => {
            resolve('success')
        })
    })
}