const fs = require('node:fs')
const path = require('node:path')

const MINECRAFT_VERSION = '26.1'
const MINECRAFT_DATA_VERSION = '3.117.0'
const packageRoot = path.dirname(require.resolve('minecraft-data'))
const packageInfo = JSON.parse(
  fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'),
)

if (packageInfo.version !== MINECRAFT_DATA_VERSION) {
  throw new Error(
    `Expected minecraft-data ${MINECRAFT_DATA_VERSION}; found ${packageInfo.version}.`,
  )
}

const dataRoot = path.join(packageRoot, 'minecraft-data', 'data')
const allVersionData = require(path.join(packageRoot, 'data.js'))
const targetData = allVersionData.pc[MINECRAFT_VERSION]

if (!targetData) {
  throw new Error(`minecraft-data ${packageInfo.version} has no Java ${MINECRAFT_VERSION} data.`)
}

const pcDirectoriesToKeep = new Set(['common', MINECRAFT_VERSION])
for (const descriptor of Object.values(Object.getOwnPropertyDescriptors(targetData))) {
  const source = descriptor.get ? descriptor.get.toString() : String(descriptor.value || '')
  for (const match of source.matchAll(/minecraft-data\/data\/pc\/([^/]+)\//g)) {
    pcDirectoriesToKeep.add(match[1])
  }
}

for (const directory of pcDirectoriesToKeep) {
  if (!fs.existsSync(path.join(dataRoot, 'pc', directory))) {
    throw new Error(`Required Java data directory is missing: ${directory}`)
  }
}

function removeUnusedVersions (edition, keep) {
  const editionRoot = path.join(dataRoot, edition)
  for (const entry of fs.readdirSync(editionRoot, { withFileTypes: true })) {
    if (entry.isDirectory() && !keep.has(entry.name)) {
      fs.rmSync(path.join(editionRoot, entry.name), {
        recursive: true,
        force: true,
      })
    }
  }
}

removeUnusedVersions('pc', pcDirectoriesToKeep)
removeUnusedVersions('bedrock', new Set(['common']))

// Fail the install rather than leave an incomplete runtime if retained data
// paths no longer work with the pinned minecraft-data release.
const loadedData = require('minecraft-data')(MINECRAFT_VERSION)
for (const key of ['blocks', 'items', 'entities', 'recipes', 'protocol', 'version']) {
  if (!loadedData[key]) throw new Error(`Missing Java ${MINECRAFT_VERSION} data: ${key}`)
}
for (const descriptor of Object.values(Object.getOwnPropertyDescriptors(targetData))) {
  if (typeof descriptor.value === 'string') {
    const match = descriptor.value.match(/__dirname \+ ['"](.+?)['"]/)
    if (match && !fs.existsSync(path.join(packageRoot, match[1]))) {
      throw new Error(`Required Minecraft data file is missing: ${match[1]}`)
    }
  }
}

const marker = path.join(
  packageRoot,
  `.wispbyte-pruned-${MINECRAFT_VERSION}-${MINECRAFT_DATA_VERSION}`,
)
fs.writeFileSync(marker, 'ok\n')

console.log(
  `Kept Java ${MINECRAFT_VERSION} data required by Mineflayer; removed other game versions.`,
)
