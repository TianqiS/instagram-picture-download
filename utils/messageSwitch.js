const insDownload = require('../utils/insDownload')
const xmlTool = require('../utils/xmlTool')

module.exports = async (xmlContent, accessToken) => {
    const MsgType = xmlContent.MsgType[0]
    const Content = xmlContent.Content[0]
    let returnXml = {}
    let returnBody = ''
    switch (MsgType) {
        case 'text':
            let patt = new RegExp('.*www.instagram.com.*')
            if(patt.test(Content)) {
                const wechatReturnInfo = await insDownload.downloadPic(Content, accessToken)
                const mediaId = JSON.parse(wechatReturnInfo.mediaInfo)['media_id']
                const mediaType = wechatReturnInfo.mediaType
                returnXml = {
                    ToUserName: xmlContent.FromUserName,
                    FromUserName: xmlContent.ToUserName,
                    CreateTime: Date.now(),
                    MsgType: mediaType
                }
                switch (mediaType) {
                    case 'image':
                        returnXml.Image = {
                            MediaId: mediaId
                        }
                        break
                    case 'video':
                        returnXml.Video = {
                            MediaId: mediaId
                        }
                }
                returnBody = xmlTool.jsonToXml({ xml: returnXml})
                break
            }
            returnXml = {
                ToUserName: xmlContent.FromUserName,
                FromUserName: xmlContent.ToUserName,
                CreateTime: Date.now(),
                MsgType: 'text',
                Content: '我已经收到你的消息了哦，我(buhui)会积极回复你的消息的'
            }
            returnBody = xmlTool.jsonToXml({ xml: returnXml})
            break
        case 'event':
            returnXml = {
                ToUserName: xmlContent.FromUserName,
                FromUserName: xmlContent.ToUserName,
                CreateTime: Date.now(),
                MsgType: 'text',
                Content: '欢迎光临:)'
            }
        default:
            returnBody = 'success'
    }
    return returnBody
}