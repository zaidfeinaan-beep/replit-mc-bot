# Wispbyte setup

This folder contains the small deployment bundle for the Minecraft bot. If
Wispbyte has cloned the full repository, use the root Startup command below.
If you upload only the files in this folder to the server root, use `npm start`.

## First-time setup

1. Choose a **Node.js 22** runtime in Wispbyte's Startup settings.
2. Make sure `wispbyte/index.js`, `wispbyte/package.json`,
   `wispbyte/prepare-runtime.js`, and `wispbyte/prune-minecraft-data.js` are
   present. You can clone the whole repository or upload these four files to
   the server's root folder.
3. Set the Startup command to `npm run start:wispbyte` if the full repository
   is uploaded. For only the four bundle files at the server root, set it to
   `npm start`.

The start script checks the local dependency tree and compact-data marker.
It installs production dependencies and trims unused game data only when
setup is missing or incomplete. Regular restarts do not reinstall or contact
the repository or package registry.

If you prefer a direct command instead of the package script, use:

   ```sh
   cd wispbyte && npm start
   ```

4. If you connected the server to GitHub in Wispbyte, disable **Auto-update on
   startup** in its GitHub settings to stop pulling repository changes on every
   start. This does not affect local dependency setup.

The bot uses offline authentication and the defaults for this project:
`og-svp-smp.aternos.me:46823`, username `BroisAwake`. Override them in
Wispbyte's environment-variable settings with `MC_HOST`, `MC_PORT`, and
`MC_USERNAME` if needed. No Microsoft password or token is required.

The bot is pinned to Java Edition 26.1, the version reported by the configured
server, and limits each login attempt to 15 seconds before retrying 5 seconds
later. The install script removes unused Bedrock and older Java data, cutting
the `minecraft-data` package from about 433 MB to about 25 MB. This deployment
will need its data refreshed if the server changes to another Minecraft version.
An offline or still-starting Aternos server cannot be made to accept a
connection within one minute.

In game, any player can send `$sleep` or `$unsleep`. The `$chat` command remains
restricted to `xyZgamerBSL`.

## If Wispbyte reports `Cannot find module 'setprototypeof'`

That package is a transitive Express dependency in the full repository; the
two-file Wispbyte bot bundle does not use Express. Confirm Wispbyte is running
this folder's `package.json` and `index.js`, not the full repository's root
`index.js` or `server.js`. The startup command above also reinstalls production
dependencies if the installed dependency tree is incomplete.
