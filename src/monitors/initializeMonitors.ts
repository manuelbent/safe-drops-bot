import Monitor from './Monitor'
import TelegramService from '../services/TelegramService'
import marketService from '../services/MarketService'
import logger from '../utils/logger'

/**
 * @function initializeMonitors
 * @description Initialize monitors for all markets in the database
 * @param telegramService
 */
export async function initializeMonitors(telegramService: TelegramService): Promise<void> {
    try {
        const markets = await marketService.findAll()

        if (markets.length === 0) {
            logger.warn('No markets found in database. Monitors will not be started.')
            return
        }

        for (const market of markets) {
            const monitor = new Monitor(market, telegramService)
            await monitor.test()
            monitor.start()
        }

        logger.info(`Successfully initialized ${markets.length} monitor(s)`)
    } catch (error) {
        logger.error(error, 'Failed to initialize monitors')
        throw error
    }
}
