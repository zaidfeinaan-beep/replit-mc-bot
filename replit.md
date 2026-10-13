# Running the imported Mineflayer project

This project runs the Mineflayer bot in `index.js` using Node.js 22 or newer.

## Run

- Press **Run** to start the **Minecraft bot** workflow, or run `npm start`.
- The bot connects to the host and port in `index.js` using offline authentication.
  Its current username is `BroisAwake`.
- The bot reconnects after unexpected disconnects. It also has anti-AFK movement
  and responds to the `$sleep`, `$unsleep`, and restricted `$chat` commands.
- Server-version detection and login attempts are time-limited; login is capped
  at 15 seconds and reconnects start after 5 seconds.
- The bot starts `server.js`, an Express health page on port 3000, as well.
- Press **Stop** to disconnect.

## Configuration

Edit the `BOT_CONFIG` object in `index.js` to change the host, port, username,
or authentication mode. The configured Minecraft Java server must be running,
reachable, and allow the bot to join. If a whitelist is enabled, add the bot
username through the server's normal administration tools. Only use the bot
where you have permission.

Do not store passwords or authentication tokens in the source code.

## Checks

- `node --check index.js`
- A successful connection prints `[BOT] Bot spawned in the world.`
- If the log says `Connection closed before the server sent a status response`,
  make sure the Aternos server is started and the host and port match its
  current Java Edition server address. The bot retries after 15 seconds.

The repository's full `npm test` suite includes Minecraft-server integration
tests; it is separate from checking this bot's connection.
