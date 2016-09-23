{View} = require 'atom-space-pen-views'
ipc = require 'ipc'
{EventEmitter} = require 'events'

localStorage = require '../local-storage'

module.exports =
class StatusView extends View
  @content: ->
    @div class: 'learn-synced-fs-status', =>
      @div class: 'learn-status-icon inline-block icon-terminal', id: 'learn-status-icon', ' Learn'
      @div class: 'learn-popout-terminal-icon inline-block icon-link-external', id: 'learn-popout-terminal-icon'

  constructor: (state, @options) ->
    super
    @activatePopoutIcon()

  on: ->
    @emitter || (@emitter = new EventEmitter)
    @emitter.on.apply(@emitter, arguments)

  activatePopoutIcon: ->
    if @options.isTerminalWindow
      @hidePopoutIcon()

    @popoutIcon().addEventListener 'click', =>
      @popoutTerminal()

  popoutTerminal: ->
    localStorage.set('popoutTerminal', true)
    localStorage.set('disableTreeView', true)
    ipc.send('command', 'application:new-window')
    @emitter.emit 'terminal:popout'
    @hidePopoutIcon()

  onTerminalPopIn: ->
    @showPopoutIcon()

  # ui elements

  statusIcon: ->
    @element.getElementsByClassName('learn-status-icon')[0]

  popoutIcon: ->
    @element.getElementsByClassName('learn-popout-terminal-icon')[0]

  showPopoutIcon: ->
    @popoutIcon().classList.remove('inactive')
    @popoutIcon().classList.add('active')

  hidePopoutIcon: ->
    @popoutIcon().classList.remove('active')
    @popoutIcon().classList.add('inactive')
