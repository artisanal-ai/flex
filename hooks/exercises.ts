import type { Exercise } from '../types'

export const BODY: Exercise[] = [
  { kind: 'body', name: 'Neck roll', seconds: 30, steps: ['Drop your chin to your chest.', 'Roll your head slowly clockwise 5x,', 'then 5x the other way.'] },
  { kind: 'body', name: 'Shoulder shrugs', seconds: 20, steps: ['Lift both shoulders to your ears,', 'hold 2s, then drop them.', 'Repeat 10x.'] },
  { kind: 'body', name: 'Wrist flex', seconds: 30, steps: ['Arm straight out, palm up.', 'Gently pull the fingers back, 15s.', 'Switch hands.'] },
  { kind: 'body', name: 'Chest opener', seconds: 30, steps: ['Clasp your hands behind your back.', 'Straighten your arms, lift your chest.', 'Breathe deeply for 30s.'] },
  { kind: 'body', name: 'Seated twist', seconds: 30, steps: ['Sit tall, right hand on the left knee.', 'Twist left and hold 15s.', 'Switch sides.'] },
  { kind: 'body', name: 'Overhead reach', seconds: 20, steps: ['Interlace your fingers, palms up.', 'Push to the ceiling and grow tall.', 'Lean left, then right.'] },
  { kind: 'body', name: 'Eye break', seconds: 20, steps: ['Look at something 6m (20ft) away', 'for 20 seconds.', 'Blink slowly a few times.'] },
  { kind: 'body', name: 'Stand up', seconds: 60, steps: ['Stand up and walk around.', 'Roll your shoulders back.', 'Grab some water.'] },
  { kind: 'body', name: 'Upper back stretch', seconds: 20, steps: ['Arms out front, hands clasped.', 'Round your back, push hands away.', 'Hold 20s.'] },
  { kind: 'body', name: 'Ankle circles', seconds: 20, steps: ['Lift one foot off the floor.', 'Circle the ankle 10x each way.', 'Switch feet.'] },
]

export const PINKY: Exercise[] = [
  { kind: 'pinky', name: 'Pinky circles', seconds: 15, steps: ['Make a loose fist, pinky out.', 'Circle the pinky slowly 10x,', 'then 10x the other way.'] },
  { kind: 'pinky', name: 'Finger stretch', seconds: 15, steps: ['Spread all fingers as wide as you can.', 'Hold 5s, then make a soft fist.', 'Repeat 5x.'] },
]
