#!/bin/zsh

while true; do
  pm2 restart ovpn
  sleep 30
done
