import { promisify } from 'node:util'
import { exec } from 'node:child_process'

import logger from '../utils/logger'

(async () => {
    // make exec promise based
    const _exec = promisify(exec)
    // list all the italian OpenVPN config files
    const { stdout: list } = await _exec('ls /etc/openvpn/ovpn_tcp | grep it')
    // get an array of string out of the stdout
    const configs = list.split('\n')
    // randomly select a VPN config file
    const config = `/etc/openvpn/ovpn_tcp/${configs[Math.floor(Math.random() * configs.length)]}`
    // enable the VPN connection
    logger.info(`Enabling VPN connection with config file ${config}...`)
    await _exec(`sudo openvpn --config ${config} --auth-user-pass /etc/openvpn/vpn-auth.txt`)
})()
