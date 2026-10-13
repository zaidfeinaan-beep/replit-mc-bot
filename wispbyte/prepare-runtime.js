const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const MINECRAFT_VERSION = '26.1'
const MINECRAFT_DATA_VERSION = '3.117.0'

function runtimeIsReady () {
  try {
    const packageRoot = path.dirname(require.resolve('minecraft-data'))
    const packageInfo = JSON.parse(
      fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'),
    )
    const marker = path.join(
      packageRoot,
      `.wispbyte-pruned-${MINECRAFT_VERSION}-${MINECRAFT_DATA_VERSION}`,
    )
    if (packageInfo.version !== MINECRAFT_DATA_VERSION ||
        !fs.existsSync(marker)) return false

    return spawnSync('npm', ['ls', '--omit=dev', '--all'], {
      stdio: 'ignore',
    }).status === 0
  } catch {
    return false
  }
}

if (runtimeIsReady()) {
  console.log('Dependencies are installed; skipping install and update checks.')
} else {
  console.log('Installing production dependencies and preparing compact Java data...')
  const result = spawnSync('npm', ['install', '--omit=dev'], { stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status || 1)
  if (!runtimeIsReady()) {
    throw new Error('Dependency setup did not complete; check the Wispbyte console.')
  }
}
