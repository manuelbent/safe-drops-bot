import logger from '../utils/logger'

import { exec, sleep } from '../utils/commands'
import { INTERVAL } from '../utils/constants'

import snkrsService from '../services/SNKRSService'
import ocrSpaceService from '../services/OCRSpaceService'

/**
 * @description Start the health check monitoring system
 * Checks the health of SNKRS API and OCR Space service every 5 intervals
 * Restarts VPN if health check fails
 */
export default async (): Promise<void> => {
    logger.info('Starting health check monitoring system...')

    // Schedule periodic health checks
    setInterval(async () => {
        try {
            await snkrsService.test()
            await ocrSpaceService.test()
            logger.debug('Health check passed - all services operational')
        } catch (error) {
            logger.error(error, 'Health check failed - attempting recovery')
            logger.info('Attempting to restart VPN...')
            try {
                await exec('pm2 restart ovpn')
                await sleep(10)
                logger.info('VPN restarted successfully')
            } catch (vpnError) {
                logger.error(vpnError, 'Failed to restart VPN')
            }
        }
    }, INTERVAL * 5)

    logger.info('Health check monitoring system started')
}
