import logger from '../utils/logger'

import { exec, sleep } from '../utils/commands'
import { INTERVAL } from '../utils/constants'

import snkrsService from '../services/SNKRSService'
import ocrSpaceService from '../services/OCRSpaceService'

// check for the health of the bot every minute
export default () => {
    setInterval(async () => {
        try {
            logger.info('Checking bot health...')
            await snkrsService.test()
            await ocrSpaceService.test()
            logger.info('Bot looks healthy.')
        } catch (error) {
            logger.error(error, 'Bot health check failed')
            logger.info('Attempting to restart VPN...')
            await exec('pm2 restart ovpn')
            await sleep(10)
            logger.info('VPN restarted.')
        }
    }, INTERVAL * 5)
}
