export type Exercise = {
  kind: 'body' | 'pinky'
  name: string
  seconds: number
  steps: string[]
}

declare module 'claude-code' {
  interface PluginState {
    flex: {
      current: Exercise | null
      prompts: number
      bodyIndex: number
      pinkyIndex: number
      isPaused: boolean
      frame: number
    }
  }
}
