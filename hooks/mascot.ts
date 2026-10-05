import type { Exercise } from '../types'

// Claude's mascot acting out each exercise. Each exercise draws its poses once,
// as they appear on screen, and plays them in `order`; repeating an index holds
// the pose. A loop's last pose leads straight back into its first.

type Animation = { poses: string[][]; order: number[] }

// Every line is padded to one width so the text beside it never jumps, and
// every pose to at least the mascot's height, a row above its head for hands.
const WIDTH = 18
const HEIGHT = 4

// A pose drawn as it shows. Short poses stand on the same floor as the tallest
// of their exercise: the missing lines are added above.
function art(drawing: string): string[] {
  return drawing.replace(/^\n/, '').replace(/\n$/, '').split('\n')
}

const FRAMES: Record<string, Animation> = {
  // Chin down, then the head rolls round: down, right, up, left.
  'Neck roll': {
    poses: [
      art(`
   ▐▀███▀▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
      art(`
    ▐▀███▀▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
      art(`
    ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
      art(`
   ▐▄███▄▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
      art(`
  ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
      art(`
  ▐▀███▀▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
    ],
    order: [0, 1, 2, 3, 4, 5],
  },
  // Shoulders up to the ears, a squeeze, then down.
  'Shoulder shrugs': {
    poses: [
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
      art(`
  ▗▐▛███▜▌▖
   ▜█████▛
    ▘▘ ▝▝
`),
      art(`
  ▗▐█████▌▖
   ▜█████▛
    ▘▘ ▝▝
`),
    ],
    order: [0, 1, 2, 2, 0, 0],
  },
  // Arm out, fingers bend up and back, the other hand presses them toward the body.
  'Wrist flex': {
    poses: [
      art(`
   ▐▛███▜▌
  ▝▜█████▛▀▀▀▘
    ▘▘ ▝▝
`),
      art(`
   ▐▛███▜▌   ▖
  ▝▜█████▛▀▀▀
    ▘▘ ▝▝
`),
      art(`
   ▐▛███▜▌  ▗
  ▝▜█████▛▀▀▀
    ▘▘ ▝▝
`),
      art(`
   ▐▛███▜▌  ▗▌
   ▜█████▛▀▀▀▌
    ▘▘ ▝▝
`),
    ],
    order: [0, 1, 2, 3, 3, 3, 2, 1],
  },
  // Arms back and down, chin up, the chest swelling with each breath.
  'Chest opener': {
    poses: [
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
      art(`
   ▐▛███▜▌
  ▖▜█████▛▗
    ▘▘ ▝▝
`),
      art(`
   ▐▄███▄▌
  ▖▟█████▙▗
    ▘▘ ▝▝
`),
      art(`
   ▐▄███▄▌
  ▖▜█████▛▗
    ▘▘ ▝▝
`),
    ],
    order: [0, 1, 2, 2, 3, 2, 2, 1],
  },
  // Hips and legs stay put; the arms swing round and the eyes follow.
  'Seated twist': {
    poses: [
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
      art(`
   ▐▛█▜██▌
 ▝▀▜█████▌
    ▘▘ ▝▝
`),
      art(`
   ▐▛▜███▌
▝▀▀▜█████▌
    ▘▘ ▝▝
`),
      art(`
   ▐██▛█▜▌
   ▐█████▛▀▘
    ▘▘ ▝▝
`),
      art(`
   ▐███▛▜▌
   ▐█████▛▀▀▘
    ▘▘ ▝▝
`),
    ],
    order: [0, 1, 2, 2, 1, 0, 3, 4, 4, 3],
  },
  // Arms out and up, fingers woven above the head, tall, then a lean each way.
  'Overhead reach': {
    poses: [
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
      art(`
   ▐▛███▜▌
▀▀▀▜█████▛▀▀▀
    ▘▘ ▝▝
`),
      art(`
  ▗▀▀▀▞▀▀▀▖
  ▐▐▛███▜▌▌
   ▜█████▛
    ▘▘ ▝▝
`),
      art(`
  ▗▀▀▀▞▀▀▀▖
  ▐▐▄███▄▌▌
   ▜█████▛
    ▘▘ ▝▝
`),
      art(`
▗▀▀▀▞▀▀▀▖
 ▐▐▛███▜▌▌
   ▜█████▛
    ▘▘ ▝▝
`),
      art(`
    ▗▀▀▀▞▀▀▀▖
   ▐▐▛███▜▌▌
   ▜█████▛
    ▘▘ ▝▝
`),
    ],
    order: [0, 1, 2, 3, 3, 4, 3, 5, 3, 1],
  },
  // A slow blink: eyelids down, shut, and open again.
  'Eye break': {
    poses: [
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
      art(`
   ▐▀███▀▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
      art(`
   ▐█████▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
    ],
    order: [0, 0, 0, 1, 2, 2, 2, 1],
  },
  // A walk across and back, legs striding on every other step.
  'Stand up': {
    poses: [
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
      art(`
    ▐▛███▜▌
   ▝▜█████▛▘
    ▝▘  ▘▝
`),
      art(`
     ▐▛███▜▌
    ▝▜█████▛▘
      ▘▘ ▝▝
`),
      art(`
      ▐▛███▜▌
     ▝▜█████▛▘
      ▝▘  ▘▝
`),
      art(`
       ▐▛███▜▌
      ▝▜█████▛▘
        ▘▘ ▝▝
`),
      art(`
        ▐▛███▜▌
       ▝▜█████▛▘
        ▝▘  ▘▝
`),
      art(`
         ▐▛███▜▌
        ▝▜█████▛▘
          ▘▘ ▝▝
`),
    ],
    order: [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1],
  },
  // Turned side on (facing right): arms out front with the hands clasped, then
  // the back rounds behind, the head drops and the hands push further away.
  'Upper back stretch': {
    poses: [
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
      art(`
    ▐███▜▌
    ▐████▌
     ▘ ▝▘
`),
      art(`
    ▐███▜▌
    ▐████▛▀▚
     ▘ ▝▘
`),
      art(`
     ▐██▀█▌
   ▗▟████▛▀▀▚
     ▘ ▝▘
`),
    ],
    order: [0, 1, 2, 3, 3, 3, 2, 1],
  },
  // One foot off the floor, its toes drawing a circle: out, down, in, up.
  'Ankle circles': {
    poses: [
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘ ▝▀
`),
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘  ▝▖
`),
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘ ▗▖
`),
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘ ▀▘
`),
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▀▘ ▝▝
`),
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
   ▗▘  ▝▝
`),
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▗▖ ▝▝
`),
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▘▀ ▝▝
`),
    ],
    order: [0, 1, 2, 3, 4, 5, 6, 7],
  },

  // The finger exercises: the mascot acts them out with its own arms.
  // The right arm goes round, up, out, down and back in, the eyes following.
  'Pinky circles': {
    poses: [
      art(`
   ▐██▛█▜▌▖
  ▝▜█████▛
    ▘▘ ▝▝
`),
      art(`
   ▐██▛█▜▌
  ▝▜█████▛▀▘
    ▘▘ ▝▝
`),
      art(`
   ▐██▛█▜▌
  ▝▜█████▛▖
    ▘▘ ▝▝
`),
      art(`
   ▐██▛█▜▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
    ],
    order: [0, 1, 2, 3],
  },
  // Both arms stretch out wide, held with the eyes shut, then tucked in.
  'Finger stretch': {
    poses: [
      art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
      art(`
   ▐▛███▜▌
 ▝▀▜█████▛▀▘
    ▘▘ ▝▝
`),
      art(`
   ▐█████▌
 ▝▀▜█████▛▀▘
    ▘▘ ▝▝
`),
      art(`
   ▐▛███▜▌
   ▜█████▛
    ▘▘ ▝▝
`),
    ],
    order: [0, 1, 2, 2, 1, 0, 3, 3],
  },
}

// Standing and blinking, for an exercise without a drawing of its own.
const FALLBACK: Animation = {
  poses: [
    art(`
   ▐▛███▜▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
    art(`
   ▐█████▌
  ▝▜█████▛▘
    ▘▘ ▝▝
`),
  ],
  order: [0, 1],
}

export function framesFor(exercise: Exercise): string[][] {
  const { poses, order } = FRAMES[exercise.name] ?? FALLBACK
  const height = Math.max(HEIGHT, ...poses.map(pose => pose.length))
  return order.map(i => {
    const pose = poses[i] ?? []
    return [...Array<string>(height - pose.length).fill(''), ...pose].map(line => line.padEnd(WIDTH))
  })
}
