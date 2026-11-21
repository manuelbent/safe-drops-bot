# safe-drops-bot
Turn the SNKRS shock drops into safe ones. Get notified.

### Remote hosting
The bot is meant to be hosted on a remote server, behind a VPN.
If running the openvpn client will crash and/or block the shell, make sure to run the following commands:

```bash
$ sudo ip rule add from $(ip route get 1 | grep -Po '(?<=src )(\S+)') table 128
$ sudo ip route add table 128 to $(ip route get 1 | grep -Po '(?<=src )(\S+)')/32 dev $(ip -4 route ls | grep default | grep -Po '(?<=dev )(\S+)')
$ sudo ip route add table 128 default via $(ip -4 route ls | grep default | grep -Po '(?<=via )(\S+)')
```

These commands handle the inbound and outbound traffic correctly.  
Summarized:
```
1. All traffic originating from the server’s main IP is not affected by the VPN.
2. Packets sent to the server itself correctly go through the main network interface.
3. Traffic destined for the internet goes through the main gateway instead of automatically passing through the VPN.
```

### Development
To develop this application, you need to setup a Telegram Bot.

The project uses Node.js 26. Its dependency overrides replace an unused legacy
`request` peer with the Cypress fork and use patched `qs` and `uuid` versions.
Keep these overrides until the upstream Telegram and Sequelize dependencies
no longer need them; run `npm test` when changing them.

#### Setup a Telegram Bot
* Open Telegram and search for `BotFather` (official by Telegram)
* Start a conversation with it with the Start button
* Create a new bot with the command `/newbot`
* Type a name, e.g., "<Yourname>'s Dev Bot"
* Type a username, e.g., "<Yourname>sDevBot"
* Retrieve the token from the conversation

#### Configure the development environment
Once you've done that, obtain the secret token and set it up in a file named `.env` in the root of the repo, with the following content:
```
TELEGRAM_BOT_TOKEN=<your-token>
```

Once the configuration is finished, you can launch the application, you can build the container in a safe way:
```bash
$ docker compose build --no-cache
```
and then launch it:
```bash
$ docker compose up
```
