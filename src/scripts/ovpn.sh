#!/bin/zsh

enable_vpn() {
  # list all italian OpenVPN config files
  configs=($(ls /etc/openvpn/ovpn_tcp | grep it))

  # select a random config file
  config=${configs[$RANDOM % ${#configs[@]}]}

  # start OpenVPN
  sudo openvpn --config /etc/openvpn/ovpn_tcp/"$config" --auth-user-pass /etc/openvpn/vpn-auth.txt
}

enable_vpn
