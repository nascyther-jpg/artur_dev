// Every sound is synthesized with the Web Audio API: no audio files to download.
// The AudioContext is only created from a user gesture (Entrar / Som button).

import type { SoundName } from "@/data/interactions"

export type EffectName = SoundName | "ding" | "door"

type AudioContextConstructor = typeof AudioContext

class AudioEngine {
  private context: AudioContext | null = null
  private master: GainNode | null = null
  private ambient: { source: AudioBufferSourceNode; gain: GainNode } | null = null
  private hum: { oscillator: OscillatorNode; gain: GainNode } | null = null
  private enabled = false

  /** Must be called from a user gesture handler the first time. */
  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (enabled) {
      const context = this.ensureContext()
      if (!context) return
      void context.resume().catch(() => undefined)
      this.startAmbient()
    } else {
      this.stopAmbient()
      this.stopHum()
    }
  }

  play(name: EffectName) {
    const context = this.enabled ? this.context : null
    if (!context || !this.master || context.state !== "running") return
    const now = context.currentTime
    switch (name) {
      case "blip":
        this.tone(880, now, 0.07, 0.035, "sine")
        break
      case "toggle":
        this.noiseBurst(now, 0.025, 0.08, 2400)
        break
      case "ding":
        this.bell(659.25, now, 0.06)
        this.bell(523.25, now + 0.32, 0.05)
        break
      case "door":
        this.noiseBurst(now, 0.8, 0.02, 700)
        break
      case "melody":
        ;[523.25, 659.25, 783.99, 659.25, 587.33].forEach((frequency, index) =>
          this.tone(frequency, now + index * 0.22, 0.4, 0.035, "triangle"),
        )
        break
      case "strum":
        this.strum(now)
        break
      case "rumble":
        this.tone(55, now, 0.35, 0.08, "square", 180)
        break
    }
  }

  startHum() {
    const context = this.enabled ? this.context : null
    if (!context || !this.master || this.hum) return
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = "sawtooth"
    oscillator.frequency.value = 48
    const filter = context.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.value = 140
    gain.gain.setValueAtTime(0, context.currentTime)
    gain.gain.linearRampToValueAtTime(0.025, context.currentTime + 0.6)
    oscillator.connect(filter).connect(gain).connect(this.master)
    oscillator.start()
    this.hum = { oscillator, gain }
  }

  stopHum() {
    if (!this.hum || !this.context) return
    const { oscillator, gain } = this.hum
    const now = this.context.currentTime
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(gain.gain.value, now)
    gain.gain.linearRampToValueAtTime(0, now + 0.5)
    oscillator.stop(now + 0.55)
    this.hum = null
  }

  private ensureContext(): AudioContext | null {
    if (this.context) return this.context
    const Constructor: AudioContextConstructor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext
    if (!Constructor) return null
    try {
      this.context = new Constructor()
      this.master = this.context.createGain()
      this.master.gain.value = 0.9
      this.master.connect(this.context.destination)
      return this.context
    } catch {
      return null
    }
  }

  /** Very quiet filtered brown noise: ventilation / distant city. */
  private startAmbient() {
    const context = this.context
    if (!context || !this.master || this.ambient) return
    const seconds = 4
    const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    }
    const source = context.createBufferSource()
    source.buffer = buffer
    source.loop = true
    const filter = context.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.value = 320
    const gain = context.createGain()
    gain.gain.setValueAtTime(0, context.currentTime)
    gain.gain.linearRampToValueAtTime(0.035, context.currentTime + 2.5)
    source.connect(filter).connect(gain).connect(this.master)
    source.start()
    this.ambient = { source, gain }
  }

  private stopAmbient() {
    if (!this.ambient || !this.context) return
    const { source, gain } = this.ambient
    const now = this.context.currentTime
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(gain.gain.value, now)
    gain.gain.linearRampToValueAtTime(0, now + 0.4)
    source.stop(now + 0.45)
    this.ambient = null
  }

  private tone(
    frequency: number,
    start: number,
    duration: number,
    volume: number,
    type: OscillatorType,
    lowpass = 2400,
  ) {
    const context = this.context
    if (!context || !this.master) return
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const filter = context.createBiquadFilter()
    oscillator.type = type
    oscillator.frequency.value = frequency
    filter.type = "lowpass"
    filter.frequency.value = lowpass
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(volume, start + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(filter).connect(gain).connect(this.master)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.05)
  }

  private bell(frequency: number, start: number, volume: number) {
    this.tone(frequency, start, 1.4, volume, "sine")
    this.tone(frequency * 2.01, start, 0.7, volume * 0.35, "sine")
  }

  private noiseBurst(start: number, duration: number, volume: number, frequency: number) {
    const context = this.context
    if (!context || !this.master) return
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const source = context.createBufferSource()
    source.buffer = buffer
    const filter = context.createBiquadFilter()
    filter.type = "bandpass"
    filter.frequency.value = frequency
    const gain = context.createGain()
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(volume, start + Math.min(0.2, duration / 3))
    gain.gain.linearRampToValueAtTime(0, start + duration)
    source.connect(filter).connect(gain).connect(this.master)
    source.start(start)
  }

  /** Karplus–Strong plucked strings, one per note of an open E major-ish chord. */
  private strum(start: number) {
    const context = this.context
    if (!context || !this.master) return
    const notes = [82.41, 123.47, 164.81, 207.65, 246.94, 329.63]
    const length = Math.floor(context.sampleRate * 2.2)
    const buffer = context.createBuffer(1, length, context.sampleRate)
    const out = buffer.getChannelData(0)
    notes.forEach((frequency, stringIndex) => {
      const offset = Math.floor(context.sampleRate * 0.028 * stringIndex)
      const period = Math.round(context.sampleRate / frequency)
      const ring = new Float32Array(period)
      for (let i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1
      let index = 0
      for (let i = offset; i < length; i++) {
        const next = (index + 1) % period
        const sample = ring[index]
        ring[index] = 0.996 * 0.5 * (sample + ring[next])
        out[i] += sample * 0.12
        index = next
      }
    })
    const source = context.createBufferSource()
    source.buffer = buffer
    const gain = context.createGain()
    gain.gain.value = 0.5
    source.connect(gain).connect(this.master)
    source.start(start)
  }
}

export const audioEngine = new AudioEngine()
