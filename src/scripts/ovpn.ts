import { promisify } from 'node:util'
import { exec } from 'node:child_process'

import logger from '../utils/logger'


(async () => {
    // dynamically pass credentials to files?
    const openVPNConfigs = [
        '/etc/openvpn/ovpn_tcp/it187.nordvpn.com.tcp.ovpn',
        '/etc/openvpn/ovpn_tcp/it156.nordvpn.com.tcp.ovpn',
        '/etc/openvpn/ovpn_tcp/it146.nordvpn.com.tcp.ovpn',
        '/etc/openvpn/ovpn_tcp/it194.nordvpn.com.tcp.ovpn',
        '/etc/openvpn/ovpn_tcp/de1096.nordvpn.com.tcp.ovpn',
        '/etc/openvpn/ovpn_tcp/de1030.nordvpn.com.tcp.ovpn'
    ]

    // make exec promise based
    const _exec = promisify(exec)

    // randomly select a VPN config file and enable the connection
    const config = openVPNConfigs[Math.floor(Math.random() * openVPNConfigs.length)]
    logger.info(`Enabling VPN connection: ${config}...`)
    await _exec(`sudo openvpn --config ${config}`)
    logger.info('VPN connection enabled')
})()
