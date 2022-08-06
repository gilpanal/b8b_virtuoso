import { Telegraf, Telegram } from 'telegraf'

import BotHelpers from './bot_helpers.js'
import ENV_VARS from './config/env_vars.js'

const bot = new Telegraf(ENV_VARS.TELEGRAM_TOKEN)
const telegram = new Telegram(ENV_VARS.TELEGRAM_TOKEN)
const bothelper = new BotHelpers(telegram)

bot.on(['audio', 'voice'], async (ctx) => {
  console.log('ctx.message', ctx.message)
  const response = await bothelper.audioHandler(ctx.message)  
  if (response && response.ok) {
    ctx.reply(response.result)
  }
})

bot.on(['photo', 'document'], async (ctx) => {
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