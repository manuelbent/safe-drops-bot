import { promisify } from 'node:util'
import { exec } from 'node:child_process'

import logger from '../utils/logger'


(async () => {
    const commands = [
        // 'sudo ip rule add from $(ip route get 1 | grep -Po \'(?<=src )(\\S+)\') table 128',
        // 'sudo ip route add table 128 to $(ip route get 1 | grep -Po \'(?<=src )(\\S+)\')/32 dev $(ip -4 route ls | grep default | grep -Po \'(?<=dev )(\\S+)\')',
        // 'sudo ip route add table 128 default via $(ip -4 route ls | grep default | grep -Po \'(?<=via )(\\S+)\')',
        // 'sudo openvpn --config /etc/openvpn/ovpn_tcp/it187.nordvpn.com.tcp.ovpn'
        'sudo openvpn --config /etc/openvpn/ovpn_tcp/it146.nordvpn.com.tcp.ovpn'
    ]

    // make exec promise based
    const _exec = promisify(exec)

    for (const command of commands) {
        try {
            logger.info(`Executing command: ${command}`)
            await _exec(command)
        } catch (error) {
            logger.error(`Could not execute command: ${command} (error): ${error}`)
        }
    }
})()
