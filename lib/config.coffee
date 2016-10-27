path = require 'path'
_ = require 'underscore-plus'

require('dotenv').config
  path: path.join(__dirname, '..', '.env')
  silent: true

module.exports = _.defaults
  host: process.env['IDE_WS_HOST']
  port: process.env['IDE_WS_PORT']
  path: process.env['IDE_WS_PATH']
,
  host: '159.203.101.28'
  port: 8080
  path: 'v2/terminal'

