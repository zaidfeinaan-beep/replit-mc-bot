# Wispbyte setup

This folder is the small deployment bundle for the Minecraft bot. Upload only
`index.js` and `package.json` to a Wispbyte Node.js server.

## First-time setup

1. Choose a **Node.js 22** runtime in Wispbyte's Startup settings.
2. Upload these two files to the server's root folder.
3. Set the Startup command to:

   ```sh
   npm ls --omit=dev --depth=0 >/dev/null 2>&1 || npm install --omit=dev || exit 1; npm start
   ```

   This checks the locally installed production dependencies. It installs them
   only when missing or invalid, then starts the bot. The initial install may
   take longer; normal restarts skip it.
4. If you connected the server to GitHub in Wispbyte, disable **Auto-update on
   startup** in its GitHub settings to stop pulling repository changes on every
   start. This does not affect the local dependency check above.

The bot uses offline authentication and the defaults for this project:
`og-svp-smp.aternos.me:46823`, username `BroisAwake`. Override them in
Wispbyte's environment-variable settings with `MC_HOST`, `MC_PORT`, and
`MC_USERNAME` if needed. No Microsoft password or token is required.

The bot limits each login attempt to 15 seconds and retries 5 seconds later.
This keeps retries fast when the address is reachable, but cannot make an
offline or still-starting Minecraft server accept a connection within one
minute. Start the Aternos server first and use its current Java Edition address.

In game, any player can send `$sleep` or `$unsleep`. The `$chat` command remains
restricted to `xyZgamerBSL`.
