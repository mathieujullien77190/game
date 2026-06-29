const { getDefaultConfig } = require("expo/metro-config")
const path = require("path")

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, "../..")

const config = getDefaultConfig(projectRoot)

// Watch monorepo packages
config.watchFolders = [monorepoRoot]

// Resolve packages from monorepo root too
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
]

config.resolver.extraNodeModules = {
  "maps-data": path.resolve(monorepoRoot, "packages/maps"),
}

// Allow require.context() to bundle the whole maps/ dir dynamically
config.transformer.unstable_allowRequireContext = true

module.exports = config
