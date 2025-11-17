import { exec, sleep } from '../utils/commands'
import logger from '../utils/logger'

class VPNService {
    private vpnProcess: any|null = null

    async getOvpnConfig(): Promise<string[]> {
        const { stdout: list } = await exec('ls /etc/openvpn/ovpn_tcp')
        return list.split('\n').filter(c => c.length > 0)
    }

    async connect(): Promise<void> {
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
    }

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

    async restart(): Promise<void> {
        logger.info('Restarting VPN connection...')
        await this.disconnect()
        await this.connect()
    }
}

export default new VPNService()
