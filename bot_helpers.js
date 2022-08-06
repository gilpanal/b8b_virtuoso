import ENV_VARS from './config/env_vars.js'
import fetch from 'node-fetch'

const BOT_TOKEN = ENV_VARS.TELEGRAM_TOKEN
const API_TEL = 'https://api.telegram.org/'
const GET_TEL_FILE = 'file/bot'

const ENDPOINT = 'http://localhost:3000'
const API_IMAGE = '/image/classify?url='
const API_AUDIO = '/audio/classify?url='

class Bot_Helper {

    constructor(telegram, fetch) {

        this.telegram = telegram
    }

    audioHandler = async (message) => {

        let result = {
            ok: false,
            result: null,
            error: null
        }

        const audioContent = message.audio || message.voice
        const telegram_info = await this.fetchFileInfo(audioContent.file_id, {})
        
        if (telegram_info.ok) {
            const audio_url = API_TEL + GET_TEL_FILE + BOT_TOKEN + '/' + telegram_info.result.file_path
            const data = await fetch(`${ENDPOINT + API_AUDIO + audio_url}`)
            const dataJson = await data.json()
            if (!dataJson.error) {
                result.ok = true
                result.result = dataJson
            }
        } else {
            console.log(telegram_info)
        }
        return result
    }
    photoHandler = async (message) => {

        let result = {
            ok: false,
            result: null,
            error: null
        }

        let imageContent = message.photo
        const pos = imageContent && imageContent.length - 1
        let imageId = imageContent && imageContent[pos].file_id
        if (!imageId && message.document && message.document.thumb) {
            imageId = message.document.file_id
        }
        if (imageId) {

            const telegram_info = await this.fetchFileInfo(imageId, {})

            if (telegram_info.ok) {
                const photo_url = API_TEL + GET_TEL_FILE + BOT_TOKEN + '/' + telegram_info.result.file_path
                const data = await fetch(`${ENDPOINT + API_IMAGE + photo_url}`)
                const dataJson = await data.json()
                if (!dataJson.error) {
                    result.ok = true
                    result.result = dataJson
                }
            }
        }
        return result
    }
    fetchFileInfo = (file_id, message) => {
        const response = {
            ok: false,
            result: null,
            error: null
        }
        return new Promise(resolve => {
            this.telegram.getFile(file_id).then((fileInfo) => {                
                response.ok = true
                message.file_path = fileInfo.file_path
                response.result = message

            }).catch((err) => {
                response.error = err
            }).finally(() => {
                resolve(response)
            })
        })
    }

}

export default Bot_Helper