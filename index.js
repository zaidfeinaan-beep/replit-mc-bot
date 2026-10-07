require('./server.js');

// ... your existing Mineflayer bot code goes below ...
if (typeof process !== 'undefined' && !process.browser && process.platform !== 'browser' && parseInt(process.versions.node.split('.')[0]) < 18) {
  console.error('Your node version is currently', process.versions.node)
  console.error('Please update it to a version >= 22.x.x from https://nodejs.org/')
  process.exit(1)
}

module.exports = require('./lib/loader.js')
require('./server.js');
const mineflayer = require('mineflayer');

// Configuration - adjust these if your server details change
const BOT_CONFIG = {
  host: 'og-svp-smp.aternos.me', // Replace with your Aternos IP if changed
  port: 46823,                   // Replace with your Aternos Port
  username: 'BroisUp',
  version: '1.20.1'               // Match your server version
};

function startBot() {
  console.log('Connecting Mineflayer bot...');

  const bot = mineflayer.createBot(BOT_CONFIG);

  bot.on('login', () => {
    console.log(`[BOT] ${bot.username} has logged into the server successfully.`);
  });

  bot.on('spawn', () => {
    console.log('[BOT] Bot spawned in the world.');
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`[CHAT] <${username}> ${message}`);
  });

  bot.on('kicked', (reason) => {
    console.log(`[BOT KICKED] Reason: ${reason}`);
  });

  bot.on('end', (reason) => {
    console.log(`[BOT DISCONNECTED] Reason: ${reason}. Reconnecting in 15 seconds...`);
    setTimeout(startBot, 15000);
  });

  bot.on('error', (err) => {
    console.error('[BOT ERROR]', err);
  });
}

startBot();