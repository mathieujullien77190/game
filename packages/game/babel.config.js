module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            engine: "../../packages/engine/src",
            components: "./src/components",
            screens: "./src/screens",
            hooks: "./src/hooks",
            translations: "./src/translations",
            store: "./src/store",
            progressStore: "./src/progressStore",
            langStore: "./src/langStore",
            devStore: "./src/devStore",
            theme: "./src/theme",
            maps: "./src/maps",
          },
        },
      ],
    ],
  }
}
