const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('node:path')

const optimizeLocales = require('./hooks/optimizeLocales')

module.exports = {
  packagerConfig: {
    name: 'Himnario ASD',
    executableName: 'himnario_asd',
    icon: path.join('www', 'assets', 'icons', 'hasd.ico'), //'www/assets/icons/hasd.ico', change to hasd.png for Linux
    ignore: ['dist', 'hooks', 'linux', '.gitignore', 'forge.config.js'],
    asar: {
      unpackDir: path.join('www', 'assets'), //'www/assets',
    },
    electronLanguages: ['es-419'],
  },
  rebuildConfig: { force: true },
  makers: [
    {
      name: '@electron-forge/maker-zip',
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  hooks: {
    postPackage: optimizeLocales,
  },
  outDir: 'dist'
};