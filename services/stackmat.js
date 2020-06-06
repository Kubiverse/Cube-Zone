/*
 Copied and modified from stackmat package located at github.com/mstiles92/stackmat
*/

var PacketStatus = {
  RUNNING: 1,
  STARTING: 2,
  BOTH_HANDS: 3,
  IDLE: 4,
  LEFT: 6,
  STOPPED: 7,
  RIGHT: 8,
  ERROR: -1,
}

class AudioProcessor {
  constructor(callback) {
    this.callback = callback
  }
  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { optional: [{ echoCancellation: false }] },
    })

    // Get the Audio Context
    this.audioContext = new AudioContext({
      echoCancellation: false,
      noiseSuppression: false,
    })

    // Create relevant Audio Nodes
    this.microphone = this.audioContext.createMediaStreamSource(this.stream)

    // Connecting the StackmatSignalProcessor
    await this.audioContext.audioWorklet.addModule('stackmatSignalProcessor.js')

    // Create an Audio Node for the Stackmat Signal Processor
    this.stackmatSignal = new AudioWorkletNode(
      this.audioContext,
      'StackmatSignalProcessor',
    )

    this.microphone.connect(this.stackmatSignal)
    this.stackmatSignal.connect(this.audioContext.destination)

    this.stackmatSignal.port.onmessage = this.callback
  }
  stop() {
    if (this.stackmatSignal && this.microphone && this.audioContext) {
      this.microphone.disconnect()
      this.stackmatSignal.disconnect()

      this.audioContext.close().finally(() => {
        this.audioContext = undefined
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
    //skip error packets
    if (packet.state.id === PacketStatus.ERROR) {
      return
    }

    this.lastPacketReceived = Date.now()
    this.fire('packetReceived', packet)

    if (this.lastPacket) {
      if (this.lastPacket.time === 0 && packet.time > 0) {
        this.fire('started', packet)
      } else if (
        this.lastPacket.time > 0 &&
        this.lastPacket.time === packet.time
      ) {
        this.fire('stopped', packet)
      } else if (this.lastPacket.time > 0 && packet.time === 0) {
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
    this.audioProcessor = new AudioProcessor((packet) => {
      this.eventManager.receivePacket(packet.data)
    })
    this.audioProcessor.start() // TODO: handle errors that occur with browser audio API
  }
  stop() {
    if (this.audioProcessor) {
      this.audioProcessor.stop()
      this.audioProcessor = undefined
    }
  }
}

export default Stackmat
