const mineflayer = require('mineflayer')
const { GoalNear } = require('mineflayer-pathfinder').goals
const { pathfinder } = require('mineflayer-pathfinder')

const BOT_CONFIG = {
  host: process.env.MC_HOST || 'og-svp-smp.aternos.me',
  port: Number(process.env.MC_PORT || 46823),
  username: process.env.MC_USERNAME || 'BroisAwake',
  auth: 'offline',
  version: false,
  closeTimeout: 10000,
  noPongTimeout: 1500
}
const LOGIN_TIMEOUT_MS = 15000
const RECONNECT_DELAY_MS = 5000

if (!BOT_CONFIG.host || !Number.isInteger(BOT_CONFIG.port) ||
    BOT_CONFIG.port < 1 || BOT_CONFIG.port > 65535 ||
    !/^[A-Za-z0-9_]{3,16}$/.test(BOT_CONFIG.username)) {
  console.error('Invalid MC_HOST, MC_PORT, or MC_USERNAME environment setting.')
  process.exit(1)
}

function startBot () {
  console.log(
    `Connecting ${BOT_CONFIG.username} to ${BOT_CONFIG.host}:${BOT_CONFIG.port}...`
  )
  const bot = mineflayer.createBot(BOT_CONFIG)
  let antiAfkInterval
  let reconnectScheduled = false

  bot.loadPlugin(pathfinder)

  const loginTimeout = setTimeout(() => {
    console.error('[BOT] Login took too long; reconnecting.')
    bot.quit('Login timed out')
  }, LOGIN_TIMEOUT_MS)

  bot.on('login', () => {
    clearTimeout(loginTimeout)
    console.log(
      `[BOT] ${bot.username} logged in. Minecraft version: ${bot.version}`
    )
  })

  bot.once('spawn', () => {
    console.log('[BOT] Spawned. Any player can send $sleep or $unsleep in chat.')
    const originalPosition = bot.entity ? bot.entity.position.clone() : null

    antiAfkInterval = setInterval(() => {
      if (!bot.entity || bot.isSleeping) return

      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 500)
      bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI, true)

      if (!bot.pathfinder || !originalPosition) return

      const target = originalPosition.offset(
        (Math.random() - 0.5) * 6,
        0,
        (Math.random() - 0.5) * 6
      )
      bot.pathfinder.setGoal(new GoalNear(target.x, target.y, target.z, 1))

      setTimeout(() => {
        if (bot.pathfinder && originalPosition && !bot.isSleeping) {
          bot.pathfinder.setGoal(
            new GoalNear(
              originalPosition.x,
              originalPosition.y,
              originalPosition.z,
              1
            )
          )
        }
      }, 6000)
    }, 30000)
  })

  bot.on('chat', async (username, message) => {
    if (username === bot.username) return
    console.log(`[CHAT] <${username}> ${message}`)
    const command = message.trim().toLowerCase()

    if (command === '$sleep') {
      try {
        const bed = bot.findBlock({
          matching: block => bot.isABed(block),
          maxDistance: 6
        })
        if (!bed) {
          bot.chat('No bed nearby for me to sleep on!')
          return
        }
        await bot.sleep(bed)
        bot.chat('Good night!')
      } catch (error) {
        console.error('Failed to sleep:', error)
        bot.chat('I could not go to sleep right now.')
      }
      return
    }

    if (command === '$unsleep') {
      if (!bot.isSleeping) {
        bot.chat('I am not in bed right now.')
        return
      }
      try {
        await bot.wake()
        bot.chat('Good morning!')
      } catch (error) {
        console.error('Failed to wake up:', error)
        bot.chat('I could not get out of bed right now.')
      }
      return
    }

    if (username === 'xyZgamerBSL' && message.startsWith('$chat ')) {
      const text = message.slice(6).trim()
      if (text) bot.chat(text)
    }
  })

  bot.on('kicked', reason => {
    console.error('[BOT KICKED]', reason)
  })

  bot.on('end', reason => {
    clearTimeout(loginTimeout)
    clearInterval(antiAfkInterval)
    console.log(`[BOT DISCONNECTED] ${reason || 'connection closed'}`)
    if (!reconnectScheduled) {
      reconnectScheduled = true
      console.log(`[BOT] Retrying in ${RECONNECT_DELAY_MS / 1000} seconds...`)
      setTimeout(startBot, RECONNECT_DELAY_MS)
    }
  })

  bot.on('error', error => {
    console.error('[BOT ERROR]', error.message)
  })
}

startBot()
