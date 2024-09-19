import { promisify } from 'node:util'
import { exec } from 'node:child_process'

import logger from '../utils/logger'

(async () => {
    // make exec promise based
    const _exec = promisify(exec)

    // list all the OpenVPN config files
    const { stdout } = await _exec('ls /etc/openvpn/ovpn_tcp/')
    // get an array of string out of the stdout
    const openVPNConfigs = stdout.split('\n').filter((c) => c.endsWith('.ovpn'))

    // randomly select a VPN config file
    const config = `/etc/openvpn/ovpn_tcp/${openVPNConfigs[Math.floor(Math.random() * openVPNConfigs.length)]}`

    // add the auth-user-pass line to the config file only if not already present
    logger.info(`running grep 'auth-user-pass' ${config}...`)
    const result = await _exec(`grep 'auth-user-pass' ${config}`)
    logger.info(result)
    // if (!occurrence) {
    //     logger.info(`Adding auth-user-pass line to ${config}...`)
    //     await _exec(`echo 'auth-user-pass /etc/openvpn/vpn-auth.txt' >> ${config}`)
    // }
    //
    // logger.info(`Enabling VPN connection: ${config}...`)
    // await _exec(`sudo openvpn --config ${config}`)
})()
