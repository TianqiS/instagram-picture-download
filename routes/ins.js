const router = require('koa-router')()
const puppeteer = require('puppeteer')

router.prefix('/ins')

router.get('/downloadPic', async (ctx, next) => {
    const url = ctx.query.url
    const browers = await puppeteer.launch()
    const page = await browers.newPage()

    await page.goto(url)
    let imgElement = await page.$eval('.FFVAD', (imgEle) => {
        return imgEle.src
    })
    ctx.redirect(imgElement)
})

module.exports = router