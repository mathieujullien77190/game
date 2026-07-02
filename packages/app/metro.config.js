// Metro monorepo : voit tout le workspace + résout les packages @drift/* consommés
// en source TS (via leurs "exports"). Transpile le TS des packages via babel.
const { getDefaultConfig } = require("expo/metro-config")
const path = require("path")

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, "../..")

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
]
// Nécessaire pour résoudre les subpaths "exports" des packages @drift/* (./src/*.ts).
config.resolver.unstable_enablePackageExports = true
config.resolver.unstable_conditionNames = ["react-native", "import", "require", "default"]

module.exports = config
