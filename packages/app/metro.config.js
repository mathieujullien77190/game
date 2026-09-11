// Metro monorepo : voit tout le workspace + résout les packages @tic-tac-tic/* consommés
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
// Nécessaire pour résoudre les subpaths "exports" des packages @tic-tac-tic/* (./src/*.ts).
config.resolver.unstable_enablePackageExports = true
// PAS de "import" : forcerait @babel/runtime vers ses helpers ESM (namespace = Object)
// → `_interopRequireDefault is not a function (it is Object)` → crash runtime au boot.
// Les exports @tic-tac-tic/* sont des cibles string sans condition → résolvent quand même.
config.resolver.unstable_conditionNames = ["react-native", "require", "default"]

module.exports = config
