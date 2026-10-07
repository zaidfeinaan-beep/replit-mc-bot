const mineflayer = require('../')
const config = require('../bot.config.json')

if (typeof config.host !== 'string' || !config.host.trim() ||
    !Number.isInteger(config.port) || config.port < 1 || config.port > 65535 ||
    typeof config.username !== 'string' || !/^[A-Za-z0-9_]{3,16}$/.test(config.username) ||
    config.auth !== 'offline') {
  console.error('Invalid bot.config.json. Set a host, port (1–65535), offline username (3–16 letters, digits or underscores), and auth: "offline".')
  process.exit(1)
}

console.log(`Connecting ${config.username} to ${config.host}:${config.port} (${config.auth})...`)

const bot = mineflayer.createBot({
  ...config,
  hideErrors: true
})
let stopping = false

bot.on('login', () => {
  console.log(`Logged in as ${bot.username}. Minecraft version: ${bot.version}`)
})

bot.once('spawn', () => {
  console.log('Bot spawned and is connected. Press Stop to disconnect.')
})

bot.on('messagestr', message => console.log(`[chat] ${message}`))

bot.on('kicked', reason => {
  console.error('Kicked:', typeof reason === 'string' ? reason : JSON.stringify(reason))
  process.exitCode = 1
})

bot.on('error', error => {
  console.error(`Connection error: ${error.message}`)
  process.exitCode = 1
})

bot.on('end', reason => {
  console.log(`Disconnected: ${reason || 'connection closed'}`)
  if (!stopping) {
    console.log('Check that the server is online and allows this bot, then press Run to reconnect.')
    process.exitCode = 1
  }
})

function stop () {
  if (stopping) return
  stopping = true
  console.log('Stopping bot...')
  bot.quit()
  setTimeout(() => process.exit(0), 2000).unref()
}

process.on('SIGINT', stop)
process.on('SIGTERM', stop)
