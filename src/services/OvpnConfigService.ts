import { exec, sleep } from '../utils/commands'
import logger from '../utils/logger'

import vpnConfigurationRepository from '../repositories/OvpnConfigRepository'

import OvpnConfig from '../models/OvpnConfig'

/**
 * Service for managing OpenVPN configurations and connections.
 */
class OvpnConfigService {
    private vpnProcess: any|null = null

    /**
     * Store a new VPN configuration in the database.
     * @param configPath
     * @return {Promise<OvpnConfig>}
     */
    async create(configPath: string): Promise<OvpnConfig> {
        return vpnConfigurationRepository.create({
            configPath,
            connectedAt: new Date(),
        })
    }

    /**
     * Retrieve a list of available OpenVPN configuration files from the specified directory.
     * @return {Promise<string[]>}
     */
    async getOvpnConfig(): Promise<string[]> {
        const { stdout: list } = await exec('ls /etc/openvpn/ovpn_tcp')
        return list.split('\n').filter(c => c.length > 0)
    }

    /**
     * Establish a VPN connection using a randomly selected OpenVPN configuration file.
     * @return {Promise<string>}
     */
    async connect(): Promise<string> {
        const configs = await this.getOvpnConfig()
        const config = `/etc/openvpn/ovpn_tcp/${configs[Math.floor(Math.random() * configs.length)]}`

        logger.info(`Enabling VPN connection with config file ${config}...`)

        this.vpnProcess = await exec(`sudo openvpn --config ${config} --auth-user-pass /etc/openvpn/vpn-auth.txt`)

        this.vpnProcess.stdout.on('data', (data: any) => {
            logger.info(`VPN stdout: ${data}`)
        })

        this.vpnProcess.stderr.on('data', (data: any) => {
            logger.error(`VPN stderr: ${data}`)
        })

        this.vpnProcess.on('close', (code: any) => {
            logger.info(`VPN process exited with code ${code}`)
            this.vpnProcess = null
        })

        await sleep(15)

        return config
    }

    /**
     * Terminate the active VPN connection.
     * @return {Promise<void>}
     */
    async disconnect(): Promise<void> {
        if (this.vpnProcess) {
            logger.info('Disabling VPN connection...')
            this.vpnProcess.kill()
            this.vpnProcess = null
            await sleep(5)
        } else {
            logger.info('No active VPN connection to disable.')
        }
    }

    /**
     * Restart the VPN connection by disconnecting and then reconnecting.
     * @return {Promise<void>}
     */
    async restart(): Promise<void> {
        logger.info('Restarting VPN connection...')
        await this.disconnect()
        const config = await this.connect()
        await this.create(config)
    }
}

export default new OvpnConfigService()
