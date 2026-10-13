# Wispbyte setup

This folder is the small deployment bundle for the Minecraft bot. Upload only
`index.js` and `package.json` to a Wispbyte Node.js server.

## First-time setup

1. Choose a **Node.js 22** runtime in Wispbyte's Startup settings.
2. Upload these two files to the server's root folder.
3. In **Startup → Additional Node.js Packages**, add `mineflayer` and
   `mineflayer-pathfinder` if that installer is available for your server.
   Otherwise, temporarily set the Startup command to
   `npm install --omit=dev && npm start` for the first launch.
4. Set the Startup command to `npm start` and start the server. If you used the
   temporary install command, change it to `npm start` after the first launch
   completes so later restarts do not reinstall packages.

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
