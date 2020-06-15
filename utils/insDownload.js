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

exports.initChrome = async () => {
    global.browser = await puppeteer.launch({args: [
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote'
        ]})
}

exports.downloadPic = async (url, accessToken) => {
    const browser = global.browser
    const page = await browser.newPage()

    await page.goto(url)
    await page.waitFor(2000)
    let flag = await page.$('input[name="username"]')
    if(!!flag) {
        await page.type('input[name="username"]', config.insUserName, {delay: 100})
        await page.type('input[name="password"]', config.insPassword, {delay: 100})

        await page.click('button[type="submit"]')

        await page.waitFor(3000);
        await page.screenshot({path: './show.png'})
        let  navigationPromise = page.waitForNavigation()
        await page.click('.L3NKy')
        await navigationPromise
        await page.waitFor(2000)
    }
    let fileUrl = await page.$eval('.FFVAD,.tWeCl', (ele) => {
        return ele.src
    }).catch(error => {
        throw error
    })
    await page.close();
    const fileName = /[^\/]+\.(png|jpe?g|gif|svg|mp4)/.exec(fileUrl)[0]
    const { data: imgStream } = await axios.get(fileUrl, {
        responseType: 'stream'
    })

    return await wechatPublicApi.uploadFile(fileName, accessToken, imgStream)

}
