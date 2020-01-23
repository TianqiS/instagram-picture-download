const insDownload = require('../utils/insDownload')
const xmlTool = require('../utils/xmlTool')

module.exports = async (xmlContent, accessToken) => {
    const MsgType = xmlContent.MsgType[0]
    const Content = xmlContent.Content[0]
    let returnBody = ''
    switch (MsgType) {
        case 'text':
            let patt = new RegExp('.*www.instagram.com.*')
            if(patt.test(Content)) {
                let mediaInfo = await insDownload.downloadPic(Content, accessToken)
                let mediaId = JSON.parse(mediaInfo)['media_id']
                returnBody = xmlTool.jsonToXml({ xml: {
                        ToUserName: xmlContent.FromUserName,
                        FromUserName: xmlContent.ToUserName,
                        CreateTime: Date.now(),
                        MsgType: 'image',
                        Image: {
                            MediaId: mediaId
                        }
                    }})
                break
            }
            returnBody = xmlTool.jsonToXml({ xml: {
                    ToUserName: xmlContent.FromUserName,
                    FromUserName: xmlContent.ToUserName,
                    CreateTime: Date.now(),
                    MsgType: 'text',
                    Content: '我已经收到你的消息了哦，我(buhui)会积极回复你的消息的'
                }})
            break
        default:
            returnBody = 'success'
    }
    return returnBody
}