# safe-drops-bot
Turn the SNKRS shock drops into safe ones. Get notified.

### Remote hosting
The bot is meant to be hosted on a remote server, behind a VPN.
If running the openvpn client will crash and/or block the shell, make sure to run the following commands:

```bash
$ sudo ip rule add from $(ip route get 1 | grep -Po \'(?<=src )(\\S+)\') table 128
$ sudo ip route add table 128 to $(ip route get 1 | grep -Po \'(?<=src )(\\S+)\')/32 dev $(ip -4 route ls | grep default | grep -Po \'(?<=dev )(\\S+)\')
$ sudo ip route add table 128 default via $(ip -4 route ls | grep default | grep -Po \'(?<=via )(\\S+)\')
```
