import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import chatRepository from '../repositories/ChatRepository'
import ovpnConfigRepository from '../repositories/OvpnConfigRepository'

export default (bot: TelegramBot) => async ({ chat: { id } }: Message) => {
    // if it's not the admin chat, return
    if (id !== Number(process.env.ADMIN_CHAT)) {
        return
    }

    try {
        const chats = await chatRepository.findAll()
        if (chats.length) {
            let message = 'chats\n\n'
            chats.forEach((chat, i) => {
                message += `- index: ${i}\n`
                message += `  chat_id: ${chat.id}\n`
                message += `  market: ${chat.market!.emoji} ${chat.market!.label}\n`
                message += `  subscribed_at: ${chat.subscribedAt.toLocaleString()}\n\n`
            })
            await bot.sendMessage(id, message)
        }

        const ovpnConfigs = await ovpnConfigRepository.findAll()
        if (ovpnConfigs.length) {
            let message = 'ovpn_configs\n\n'
            ovpnConfigs.forEach(config => {
                message += `- id: ${config.id}\n`
                message += `  config_path: ${config.configPath}\n`
                message += `  connected_at: ${config.connectedAt.toLocaleString()}\n\n`
            })
            await bot.sendMessage(id, message)
        }
    } catch (error) {
        logger.error(error, `Something went wrong with chat ${id} dump request.`)
        await bot.sendMessage(id, 'An error occurred while dumping the database tables.')
    }
}

