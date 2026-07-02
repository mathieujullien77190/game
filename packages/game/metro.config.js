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

// Force a SINGLE copy of these packages. The monorepo hoists react-native to
// both packages/game/node_modules AND the root node_modules, so game code and
// root-level deps (react-native-svg, the engine workspace) each pulled their
// own copy → two React Native renderers → "ExceptionsManager should be set up
// after React DevTools" + "property is not writable". Redirecting every request
// for these specifiers to the game copy collapses them to one instance.
const SINGLETONS = ["react", "react-native", "react-native-svg", "@react-native-async-storage/async-storage"]
const singletonRoot = path.resolve(projectRoot, "node_modules")

const defaultResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  for (const name of SINGLETONS) {
    if (moduleName === name || moduleName.startsWith(name + "/")) {
      return context.resolveRequest(
        { ...context, originModulePath: path.join(singletonRoot, "_.js") },
        moduleName,
        platform,
      )
    }
  }
  return (defaultResolveRequest ?? context.resolveRequest)(context, moduleName, platform)
}

// Allow require.context() to bundle the whole maps/ dir dynamically
config.transformer.unstable_allowRequireContext = true

module.exports = config
