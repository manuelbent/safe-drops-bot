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
        const ovpnConfigs = await ovpnConfigRepository.findAll()

        let chatsMessage = 'chats\n\n'
        chats.forEach(chat => {
            chatsMessage += `- id: ${chat.id}\n`
            chatsMessage += `  market: ${chat.market!.emoji} ${chat.market!.label}\n`
            chatsMessage += `  subscribed_at: ${chat.subscribedAt.toISOString()}\n\n`
        })

        let ovpnMessage = 'ovpn_configs\n\n'
        ovpnConfigs.forEach(config => {
            ovpnMessage += `- id: ${config.id}\n`
            ovpnMessage += `  config_path: ${config.configPath}\n`
            ovpnMessage += `  connected_at: ${config.connectedAt.toISOString()}\n\n`
        })

        // Send messages
        await bot.sendMessage(id, chatsMessage)
        await bot.sendMessage(id, ovpnMessage)
    } catch (error) {
        logger.error(error, `Something went wrong with chat ${id} dump request.`)
        await bot.sendMessage(id, 'An error occurred while dumping the database tables.')
    }
}

