import { promisify } from 'node:util'
import { exec } from 'node:child_process'

setInterval(async () => {
    // make exec promise based
    const _exec = promisify(exec)

    // restart the ovpn process to connect to a different VPN server
    await _exec('sudo pm2 restart ovpn')
}, 30000)
