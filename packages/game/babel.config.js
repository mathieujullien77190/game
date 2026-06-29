module.exports = function (api) {
  const platform = api.caller((c) => c && c.platform)
  api.cache.using(() => platform)
  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: platform === "web" }]],
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
