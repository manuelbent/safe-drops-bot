const { exec } = require('node:child_process')

const commands = [
    'sudo ip rule add from $(ip route get 1 | grep -Po \'(?<=src )(\\S+)\') table 128',
    'sudo ip route add table 128 to $(ip route get 1 | grep -Po \'(?<=src )(\\S+)\')/32 dev $(ip -4 route ls | grep default | grep -Po \'(?<=dev )(\\S+)\')',
    'sudo ip route add table 128 default via $(ip -4 route ls | grep default | grep -Po \'(?<=via )(\\S+)\')',
    // 'sudo openvpn --config /etc/openvpn/ovpn_tcp/it187.nordvpn.com.tcp.ovpn'
    'sudo openvpn --config /etc/openvpn/ovpn_tcp/it146.nordvpn.com.tcp.ovpn'

]

for (const command of commands) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Could not execute command: ${command} (error):`, error)
            return
        }
        if (stderr) {
            console.error(`Could not execute command: ${command} (stderr):`, stderr)
        }
        console.log(command)
        console.log(stdout)
    })
}
