import { promisify } from 'node:util'
import { exec } from 'node:child_process'

import logger from '../utils/logger'

(async () => {
    // make exec promise based
    const _exec = promisify(exec)

    // list all the OpenVPN config files
    const { stdout: list } = await _exec('ls /etc/openvpn/ovpn_tcp | grep it')
    // get an array of string out of the stdout
    const configs = list.split('\n')
    // randomly select a VPN config file
    const config = `/etc/openvpn/ovpn_tcp/${configs[Math.floor(Math.random() * configs.length)]}`

    // add the auth-user-pass line to the config file only if not already present
    const { stdout: occurrence } = await _exec(`grep 'auth-user-pass' ${config}`)
    if (occurrence === '') {
        logger.info(`Adding auth-user-pass line to ${config}...`)
        await _exec(`sudo echo 'auth-user-pass /etc/openvpn/vpn-auth.txt' >> ${config}`)
    }

    logger.info(`Enabling VPN connection...`)
    await _exec(`sudo openvpn --config ${config}`)
})()
