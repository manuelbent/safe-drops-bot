const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')

const token = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(token, { polling: true })

const chats = {}

bot.onText(/\/start/, async ({ chat: { id, first_name } }) => {
    if (!chats[id]) {
        await bot.sendMessage(id, `Hi, ${ first_name }!`)
        await bot.sendMessage(id, 'If you are here, it means you want to know when a SHOCK DROP is happening!')
        await bot.sendMessage(id, 'I will do my best to notify you, so you can open the SNKRS app and try to cop some heat! 🔥')
        await bot.sendMessage(id, 'To subscribe, type /subscribe')
        await bot.sendMessage(id, 'To unsubscribe, type /unsubscribe')
    }
})

bot.onText(/\/subscribe/, async ({ chat }) => {
    if (!chats[chat.id]) {
        chats[chat.id] = chat
        await bot.sendMessage(chat.id, 'Alright! I will notify you when a SHOCK DROP is happening!')
    }
})

bot.onText(/\/unsubscribe/, async ({ chat: { id } }) => {
    if (chats[id]) {
        delete chats[id]
        await bot.sendMessage(id, 'Unsubscribed. 😔')
    }
})

setInterval(async () => {
    const { data } = await axios.get('https://www.nike.com/it/launch') // hardcoded for italian site
    if (data.toLowerCase().includes('shock')) {
        for (const id in chats) {
            try {
                await bot.sendMessage(id, 'It smells like a SHOCK DROP! 🚨 Open the SNKRS app now!')
            } catch ({ message }) {
                console.log({ id, message })
            }
        }
    }
}, 60000 * 5)
