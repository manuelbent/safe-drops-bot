#!/bin/bash

# Extract the primary IP address
SRC_IP=$(ip route get 1 | grep -Po '(?<=src )(\S+)')

# Extract the primary network interface
DEV=$(ip -4 route ls | grep default | grep -Po '(?<=dev )(\S+)')

# Extract the default gateway
GATEWAY=$(ip -4 route ls | grep default | grep -Po '(?<=via )(\S+)')

# Apply the routing rules
sudo ip rule add from $SRC_IP table 128
sudo ip route add table 128 to ${SRC_IP}/32 dev $DEV
sudo ip route add table 128 default via $GATEWAY
