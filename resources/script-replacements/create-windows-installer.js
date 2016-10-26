'use strict'

const downloadFileFromGithub = require('./download-file-from-github')
const electronInstaller = require('electron-winstaller')
const fs = require('fs-extra')
const glob = require('glob')
const os = require('os')
const path = require('path')

const CONFIG = require('../config')

module.exports = function (packagedAppPath, codeSign) {
  const options = {
    appDirectory: packagedAppPath,
    authors: 'GitHub Inc.',

    // TODO: use learn-ide rather than mastermind
    iconUrl: 'https://raw.githubusercontent.com/learn-co/mastermind/master/resources/app-icons/atom.ico',
    loadingGif: path.join(CONFIG.repositoryRootPath, 'resources', 'win', 'loading.gif'),
    outputDirectory: CONFIG.buildOutputPath,
    remoteReleases: `https://atom.io/api/updates?version=${CONFIG.appMetadata.version}`,
    setupIcon: path.join(CONFIG.repositoryRootPath, 'resources', 'app-icons', CONFIG.channel, 'atom.ico'),
    setupExe: 'LearnIDE'
  }

  const certPath = process.env.FLATIRON_P12KEY_PATH
  const password = process.env.FLATIRON_P12KEY_PASSWORD
  if (codeSign && certPath && password) {
    options.certificateFile = certPath
    options.certificatePassword = password
  } else {
    console.log('Skipping code-signing. Specify the --code-sign option and provide FLATIRON_P12KEY_PATH and FLATIRON_P12KEY_PASSWORD environment variables to perform code-signing'.gray)
  }

  const cleanUp = function () {
    for (let nupkgPath of glob.sync(`${CONFIG.buildOutputPath}/*.nupkg`)) {
      if (!nupkgPath.includes(CONFIG.appMetadata.version)) {
        console.log(`Deleting downloaded nupkg for previous version at ${nupkgPath} to prevent it from being stored as an artifact`)
        fs.removeSync(nupkgPath)
      }
    }
  }
  console.log(`Creating Windows Installer for ${packagedAppPath}`)
  return electronInstaller.createWindowsInstaller(options).then(cleanUp, function (error) {
    console.log(`Windows installer creation failed:\n${error}`)
    cleanUp()
  })
}
