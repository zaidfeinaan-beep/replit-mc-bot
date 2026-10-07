# Running the imported Mineflayer project

This remains the original CommonJS Mineflayer library, with a small console bot
entry point added in `examples/replit-bot.js`. Use Node.js 22 or newer.

## Run

- Press **Run** to start the **Minecraft bot** workflow, or run `npm start`.
- The bot reads `bot.config.json`, connects using an offline username, and logs
  login, spawn, chat, kick, error, and disconnect events to the Console.
- Press **Stop** to disconnect. After an unexpected disconnect, check the server
  and press **Run** again. No automatic reconnect or anti-AFK behavior is enabled.
- This is a console bot, not a web app; no web preview or HTTP port is needed.

## Configuration

Edit `bot.config.json` to change the host, port, or offline username.
The configured server must be running and reachable, permit offline players,
and allow the bot to join. Minecraft version is detected automatically.
If a whitelist is enabled, add the bot username through the server's normal
administration tools. Only use the bot where you have permission.

Do not store passwords or authentication tokens in the config. Microsoft login
is not configured by this offline-only runner.

## Checks

- `node --check examples/replit-bot.js`
- `npx --no-install standard examples/replit-bot.js`
- A successful live connection prints both `Logged in as ...` and
  `Bot spawned and is connected`.

The repository's full `npm test` suite includes Minecraft-server integration
tests; it is separate from checking this bot's connection.
