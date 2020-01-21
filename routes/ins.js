const router = require('koa-router')()
const insDownload = require('../utils/insDownload')
router.prefix('/ins')

router.get('/downloadPic', async (ctx, next) => {
    const url = ctx.query.url
    // const browers = await puppeteer.launch()
    // const page = await browers.newPage()
    //
    // await page.goto(url)
    // let imgElement = await page.$eval('.FFVAD', (imgEle) => {
    //     return imgEle.src
    // }).catch(error => {
    //     console.log(error)
    // })
    let imgElement = await insDownload(url)
    ctx.body = imgElement
})

module.exports = router