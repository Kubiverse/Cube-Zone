/* eslint-disable no-undef */
;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global = global || self), (global.Stackmat = factory()))
})(this, function () {
  'use strict'

  var PacketStatus
  ;(function (PacketStatus) {
    PacketStatus['IDLE'] = 'I'
    PacketStatus['STARTING'] = 'A'
    PacketStatus['RUNNING'] = ' '
    PacketStatus['STOPPED'] = 'S'
    PacketStatus['LEFT_HAND'] = 'L'
    PacketStatus['RIGHT_HAND'] = 'R'
    PacketStatus['BOTH_HANDS'] = 'C'
    PacketStatus['INVALID'] = 'X'
  })(PacketStatus || (PacketStatus = {}))
  function isPacketStatusCharCode(charCode) {
    return 'IA SLRC'.indexOf(String.fromCharCode(charCode)) !== -1
  }
  function isNumberCharCode(charCode) {
    return '0123456789'.indexOf(String.fromCharCode(charCode)) !== -1
  }
  function isChecksumValid(checksum, digitCharCodes) {
    return (
      checksum ===
      digitCharCodes
        .map((char) => Number(String.fromCharCode(char)))
        .reduce((previousValue, currentValue) => previousValue + currentValue) +
        64
    )
  }
  class PacketAbstract {
    constructor(isValid, status, stringDigits, timeInMilliseconds) {
      this.isValid = isValid
      this.status = status || PacketStatus.INVALID
      this.stringDigits = stringDigits || []
      this.timeInMilliseconds = timeInMilliseconds || 0
    }
    get timeAsString() {
      return (
        this.stringDigits.slice(0, 1) +
        ':' +
        this.stringDigits.slice(1, 3).join('') +
        '.' +
        this.stringDigits.slice(3).join('')
      )
    }
    get isLeftHandDown() {
      return (
        this.status === PacketStatus.LEFT_HAND ||
        this.status === PacketStatus.BOTH_HANDS ||
        this.status === PacketStatus.STARTING
      )
    }
    get isRightHandDown() {
      return (
        this.status === PacketStatus.RIGHT_HAND ||
        this.status === PacketStatus.BOTH_HANDS ||
        this.status === PacketStatus.STARTING
      )
    }
    get areBothHandsDown() {
      return (
        this.status === PacketStatus.BOTH_HANDS ||
        this.status === PacketStatus.STARTING
      )
    }
  }

  class PacketGen3 extends PacketAbstract {
    static isValid(rawData) {
      return (
        rawData.length === 9 &&
        isPacketStatusCharCode(rawData[0]) &&
        isNumberCharCode(rawData[1]) &&
        isNumberCharCode(rawData[2]) &&
        isNumberCharCode(rawData[3]) &&
        isNumberCharCode(rawData[4]) &&
        isNumberCharCode(rawData[5]) &&
        isChecksumValid(rawData[6], rawData.slice(1, 6)) &&
        rawData[7] === 10 &&
        rawData[8] === 13
      )
    }
    constructor(rawData) {
      if (PacketGen3.isValid(rawData)) {
        const status = String.fromCharCode(rawData[0])
        const stringDigits = rawData
          .slice(1, 6)
          .map((char) => String.fromCharCode(char))
        const minutes = Number(stringDigits[0])
        const seconds = Number(stringDigits.slice(1, 3).join(''))
        const thousandths = Number(stringDigits.slice(3).join('') + '0')
        const timeInMilliseconds =
          minutes * 60000 + seconds * 1000 + thousandths
        super(true, status, stringDigits, timeInMilliseconds)
      } else {
        super(false)
      }
    }
  }

  class PacketGen4 extends PacketAbstract {
    static isValid(rawData) {
      return (
        rawData.length === 10 &&
        isPacketStatusCharCode(rawData[0]) &&
        isNumberCharCode(rawData[1]) &&
        isNumberCharCode(rawData[2]) &&
        isNumberCharCode(rawData[3]) &&
        isNumberCharCode(rawData[4]) &&
        isNumberCharCode(rawData[5]) &&
        isNumberCharCode(rawData[6]) &&
        isChecksumValid(rawData[7], rawData.slice(1, 7)) &&
        rawData[8] === 10 &&
        rawData[9] === 13
      )
    }
    constructor(rawData) {
      if (PacketGen4.isValid(rawData)) {
        const status = String.fromCharCode(rawData[0])
        const stringDigits = rawData
          .slice(1, 7)
          .map((char) => String.fromCharCode(char))
        const minutes = Number(stringDigits[0])
        const seconds = Number(stringDigits.slice(1, 3).join(''))
        const thousandths = Number(stringDigits.slice(3).join(''))
        const timeInMilliseconds =
          minutes * 60000 + seconds * 1000 + thousandths
        super(true, status, stringDigits, timeInMilliseconds)
      } else {
        super(false)
      }
    }
  }

  class SignalDecoder {
    constructor(sampleRate, callback) {
      this.ticksPerBit = sampleRate / 1200
      this.callback = callback
    }
    decode(data) {
      // Not using data.map() here because Float32Array.map always returns a Float32Array
      let bits = []
      for (const signal of data) {
        bits.push(signal <= 0 ? 1 : 0)
      }
      const startIndex = this.findBeginningOfSignal(bits)
      const runLengthEncoded = runLengthEncode(bits.slice(startIndex))
      bits = this.getBitsFromRunLengthEncodedSignal(runLengthEncoded)
      const packet = getPacket(bits.slice(1))
      if (packet.isValid) {
        this.callback(packet)
      }
    }
    findBeginningOfSignal(data) {
      let oneCount = 0
      let waitingForZero = false
      for (let i = 0; i < data.length; i++) {
        if (data[i] === 1) {
          oneCount++
          if (oneCount > 9 * this.ticksPerBit) {
            // there's no byte in a package which contains 8 bits of 1
            // that translates to 9 * ticksPerBit
            waitingForZero = true
          }
        } else {
          oneCount = 0
          if (waitingForZero) {
            return i
          }
        }
      }
      return undefined
    }
    getBitsFromRunLengthEncodedSignal(array) {
      const x = array.map((e) =>
        Array(Math.round(e.length / this.ticksPerBit)).fill(e.bit),
      )
      return [].concat(...x)
    }
  }
  function runLengthEncode(data) {
    let lastBit = -1
    const result = []
    for (const bit of data) {
      if (lastBit !== bit) {
        result.push({ bit, length: 1 })
        lastBit = bit
      } else {
        result[result.length - 1].length++
      }
    }
    return result
  }
  function getPacket(data) {
    const tmp = []
    for (let i = 0; i <= 9; i++) {
      tmp.push(decodeBits(data, i * 10))
    }
    let packet = new PacketGen4(tmp)
    if (packet.isValid) {
      return packet
    } else {
      packet = new PacketGen3(tmp.slice(0, -1))
      return packet
    }
  }
  function decodeBits(data, offset) {
    let result = 0
    for (let i = 0; i < 8; i++) {
      // tslint:disable-next-line:no-bitwise
      result += data[offset + i] << i
    }
    return result
  }

  class AudioProcessor {
    constructor(callback) {
      this.callback = callback
    }
    start() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
            },
          })
          .then((stream) => {
            this.stream = stream
            this.context = new AudioContext()
            this.source = this.context.createMediaStreamSource(this.stream)
            this.scriptNode = this.context.createScriptProcessor(2048 * 4, 1, 1)
            const signalDecoder = new SignalDecoder(
              this.context.sampleRate,
              this.callback,
            )
            this.scriptNode.onaudioprocess = (event) => {
              signalDecoder.decode(event.inputBuffer.getChannelData(0))
            }
            this.source.connect(this.scriptNode)
            this.scriptNode.connect(this.source.context.destination)
          })
          .catch((error) => {
            console.error(error)
          })
      }
    }
    stop() {
      if (this.context && this.source && this.scriptNode) {
        this.source.disconnect(this.scriptNode)
        this.scriptNode.disconnect(this.context.destination)
        this.scriptNode = undefined
        this.source = undefined
        this.context.close().finally(() => {
          this.context = undefined
        })
      }
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop())
        this.stream = undefined
      }
    }
  }

  const stringEventType = (arr) => arr
  const types = stringEventType([
    'packetReceived',
    'timerConnected',
    'timerDisconnected',
    'started',
    'stopped',
    'reset',
    'ready',
    'unready',
    'starting',
    'leftHandDown',
    'leftHandUp',
    'rightHandDown',
    'rightHandUp',
  ])
  const isEvent = (x) => types.includes(x)

  class TimerEventManager {
    constructor() {
      this.lastPacketRunning = false
      this.lastPacketReset = false
      this.handlers = new Map()
      this.connected = false
      this.lastPacketReceived = 0
      this.connectionTimout = 1000
      this.connectionTimer = setInterval(
        () => {
          if (
            this.connected &&
            this.lastPacketReceived + this.connectionTimout < Date.now()
          ) {
            this.connected = false
            this.fire('timerDisconnected')
          } else if (
            !this.connected &&
            this.lastPacketReceived + this.connectionTimout > Date.now()
          ) {
            this.connected = true
            this.fire('timerConnected')
          }
        },
        100,
        this,
      )
    }
    on(event, callback) {
      if (isEvent(event)) {
        const handlers = this.handlers.get(event) || []
        handlers.push(callback)
        this.handlers.set(event, handlers)
      }
    }
    off(event) {
      if (event && isEvent(event) && this.handlers.has(event)) {
        this.handlers.delete(event)
      } else if (!event) {
        this.handlers.clear()
      }
    }
    receivePacket(packet) {
      this.lastPacketReceived = Date.now()
      this.fire('packetReceived', packet)
      if (this.lastPacket) {
        if (this.lastPacket.isLeftHandDown && !packet.isLeftHandDown) {
          this.fire('leftHandUp', packet)
        } else if (!this.lastPacket.isLeftHandDown && packet.isLeftHandDown) {
          this.fire('leftHandDown', packet)
        }
        if (this.lastPacket.isRightHandDown && !packet.isRightHandDown) {
          this.fire('rightHandUp', packet)
        } else if (!this.lastPacket.isRightHandDown && packet.isRightHandDown) {
          this.fire('rightHandDown', packet)
        }
        if (
          !this.lastPacket.areBothHandsDown &&
          packet.status === PacketStatus.BOTH_HANDS &&
          this.lastPacket.timeInMilliseconds === 0
        ) {
          this.fire('ready', packet)
        }
        if (
          this.lastPacket.status === PacketStatus.BOTH_HANDS &&
          !packet.areBothHandsDown &&
          packet.status !== PacketStatus.RUNNING &&
          packet.timeInMilliseconds === 0
        ) {
          this.fire('unready', packet)
        }
        if (
          this.lastPacket.status === PacketStatus.BOTH_HANDS &&
          packet.status === PacketStatus.STARTING
        ) {
          this.fire('starting', packet)
        }
        if (
          !this.lastPacketRunning &&
          (packet.status === PacketStatus.RUNNING ||
            (this.lastPacket.timeInMilliseconds === 0 &&
              packet.timeInMilliseconds > 0))
        ) {
          this.lastPacketRunning = true
          this.lastPacketReset = false
          this.fire('started', packet)
        }
        if (
          this.lastPacketRunning &&
          (packet.status === PacketStatus.STOPPED ||
            packet.status === PacketStatus.BOTH_HANDS ||
            (this.lastPacket.timeInMilliseconds === packet.timeInMilliseconds &&
              packet.timeInMilliseconds > 0))
        ) {
          this.lastPacketRunning = false
          this.lastPacketReset = false
          if (!this.lastPacket.isLeftHandDown && !packet.isLeftHandDown) {
            this.fire('leftHandDown', packet)
          }
          if (!this.lastPacket.isRightHandDown && !packet.isRightHandDown) {
            this.fire('rightHandDown', packet)
          }
          this.fire('stopped', packet)
          if (!this.lastPacket.isLeftHandDown && !packet.isLeftHandDown) {
            this.fire('leftHandUp', packet)
          }
          if (!this.lastPacket.isRightHandDown && !packet.isRightHandDown) {
            this.fire('rightHandUp', packet)
          }
        }
        if (
          !this.lastPacketReset &&
          this.lastPacket.status === PacketStatus.IDLE
        ) {
          this.lastPacketRunning = false
          this.lastPacketReset = true
          this.fire('reset', packet)
        }
      }
      this.lastPacket = packet
    }
    fire(event, packet) {
      for (const handler of this.handlers.get(event) || []) {
        handler(packet) // TODO: rewrite to not require a packet for every call or create separate event listener type for dis/connect? just send lastPacket?
      }
    }
  }

  class Stackmat {
    constructor() {
      this.eventManager = new TimerEventManager()
    }
    on(event, callback) {
      if (isEvent(event)) {
        this.eventManager.on(event, callback)
        return true
      } else {
        return false
      }
    }
    off(event) {
      if (event && !isEvent(event)) {
        return false
      } else {
        this.eventManager.off(event)
        return true
      }
    }
    start() {
      if (this.audioProcessor) {
        this.stop()
      }
      this.audioProcessor = new AudioProcessor((packet) =>
        this.eventManager.receivePacket(packet),
      )
      this.audioProcessor.start() // TODO: handle errors that occur with browser audio API
    }
    stop() {
      if (this.audioProcessor) {
        this.audioProcessor.stop()
        this.audioProcessor = undefined
      }
    }
  }

  return Stackmat
})
