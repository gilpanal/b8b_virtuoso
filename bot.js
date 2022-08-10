import { Telegraf, Telegram } from 'telegraf'

import { Client } from 'virtuoso-sparql-client'
import VirtuosoHelper from './virtuoso_helper.js'

import BotHelpers from './bot_helpers.js'
import ENV_VARS from './config/env_vars.js'

export const owl = 'http://beatbytebot.web.app/ontology/'

const bot = new Telegraf(ENV_VARS.TELEGRAM_TOKEN)
const telegram = new Telegram(ENV_VARS.TELEGRAM_TOKEN)
const bothelper = new BotHelpers(telegram)


const SaveClient = new Client('http://127.0.0.1:8890/sparql')
SaveClient.setOptions(
  'application/json',
  { 'b8b': owl },
  'http://beatbytebot.web.app/resource/'
)
const virtuoHelper = new VirtuosoHelper(SaveClient)

bot.on(['audio', 'voice', 'document'], async (ctx) => {
  console.log('ctx.message', ctx.message)
  const response = await bothelper.audioHandler(ctx.message)
  if (response && response.ok) {
    ctx.reply(response.result)
  }
  let CHAT_ID = ctx.message.chat.id.toString().replace('-', '%2')
  if(response.result){
    const dbStored = await virtuoHelper.store(CHAT_ID,ctx.message, response.result)
    ctx.reply(dbStored)
  } else {
    console.log(response)
    ctx.reply('Error on B8B-Synapse: ' + response.error.error)
  }
})

bot.on(['photo'], async (ctx) => {
  console.log('ctx.message', ctx.message)
  const response = await bothelper.photoHandler(ctx.message)  
  if (response && response.ok) {
    ctx.reply(response.result)
  }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))