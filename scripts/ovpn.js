const { exec } = require('child_process')

exec('sudo openvpn --config /etc/openvpn/ovpn_tcp/it187.nordvpn.com.tcp.ovpn', (error, stdout, stderr) => {
    if (error) {
        console.error('Could not start OpenVPN (error):', error)
        return
    }
    if (stderr) {
        console.error('Could not start OpenVPN (stderr):', stderr)
    }
    console.log(stdout)
})
