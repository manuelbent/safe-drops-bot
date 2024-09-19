import { promisify } from 'node:util'
import { exec } from 'node:child_process'

import logger from '../utils/logger'


(async () => {
    const openVPNConfigs = [
        // '/etc/openvpn/ovpn_tcp/it187.nordvpn.com.tcp.ovpn',
        '/etc/openvpn/ovpn_tcp/it146.nordvpn.com.tcp.ovpn'
    ]

    // make exec promise based
    const _exec = promisify(exec)

    for (const config of openVPNConfigs) {
        logger.info(`Enabling VPN connection: ${config}`)
        await _exec(`sudo openvpn --config ${config}`)
    }
})()
