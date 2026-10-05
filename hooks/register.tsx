import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, Timer } from 'claude-code'

import type { Exercise } from '../types'
import { BODY, PINKY } from './exercises'
import { framesFor } from './mascot'

// Hot pink: nothing else in Claude Code uses it, so a break never reads as
// Claude's own output; dark enough for white text, bright on light and dark.
const ACCENT = '#DB2777'
const FRAME_MS = 300

const current = atom({ plugin: 'flex', key: 'current' } as const, null)
const prompts = atom({ plugin: 'flex', key: 'prompts' } as const, 0)
const bodyIndex = atom({ plugin: 'flex', key: 'bodyIndex' } as const, 0)
const pinkyIndex = atom({ plugin: 'flex', key: 'pinkyIndex' } as const, 0)
const isPaused = atom({ plugin: 'flex', key: 'isPaused' } as const, false)
const frame = atom({ plugin: 'flex', key: 'frame' } as const, 0)

// The timer that moves the mascot, running only while an exercise shows.
let animation: Timer | null = null

async function show($: EngineInterface, exercise: Exercise | null) {
  await update($, current, () => exercise)
  animation?.cancel()
  animation = null
  if (exercise !== null) {
    await update($, frame, () => 0)
    animation = $.clock.every(FRAME_MS, () => void update($, frame, n => n + 1))
  }
}

async function showNextBody($: EngineInterface) {
  if (await read($, isPaused)) {
    return
  }
  const index = await read($, bodyIndex)
  await update($, bodyIndex, i => i + 1)
  await show($, BODY[index % BODY.length] ?? null)
  $.ui.toast('Time to flex!')
}

async function showNextPinky($: EngineInterface) {
  const index = await read($, pinkyIndex)
  await update($, pinkyIndex, i => i + 1)
  await show($, PINKY[index % PINKY.length] ?? null)
}

export const register: Register = (on, options) => {
  // Set in /config; the manifest's userConfig holds the defaults (10, 5, 10).
  // Never below 1, so a timer never spins.
  const breakMinutes = Math.max(1, Number(options.breakMinutes))
  const snoozeMinutes = Math.max(1, Number(options.snoozeMinutes))
  const pinkyEvery = Math.max(1, Math.round(Number(options.pinkyEveryPrompts)))

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'flex',
      description: 'Stretch breaks: /flex [pinky|off|on|status]',
    })
    $.clock.every(breakMinutes * 60_000, () => void showNextBody($))
    // A reload drops the old timers: keep a showing mascot moving.
    await show($, await read($, current))

    return next(e)
  })

  on('command.run', { command: 'flex' }, async ($, e) => {
    const arg = e.args.trim()

    if (arg === 'off') {
      await update($, isPaused, () => true)
      await show($, null)
      return { text: 'Breaks off. /flex on to turn them back on.' }
    }
    if (arg === 'on') {
      await update($, isPaused, () => false)
      return { text: `Breaks on. A stretch every ${breakMinutes} min, pinky time every ${pinkyEvery} prompts.` }
    }
    if (arg === 'pinky') {
      await showNextPinky($)
      return { text: 'Pinky flex coming up 🤙' }
    }
    if (arg === 'status') {
      const count = await read($, prompts)
      const paused = await read($, isPaused)
      const left = pinkyEvery - (count % pinkyEvery)
      return { text: `Reminders ${paused ? 'paused' : 'on'}. ${count} prompts sent; pinky flex in ${left}.` }
    }
    await update($, isPaused, () => false)
    await showNextBody($)
    return { text: 'Flex time.' }
  })

  on('prompt.submit', async ($, e, next) => {
    if (e.origin.kind === 'composer' && !e.text.trimStart().startsWith('/')) {
      await update($, prompts, n => n + 1)
      if ((await read($, prompts)) % pinkyEvery === 0) {
        await showNextPinky($)
      }
    }

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const exercise = await read($, current)

    if (exercise === null || e.props.hasSurvey) {
      return next(e)
    }

    const { Box, Button, Text } = $.ui.resolve(e)
    const done = () => show($, null)
    const snooze = async () => {
      await show($, null)
      $.clock.after(snoozeMinutes * 60_000, () => void show($, exercise))
    }
    const poses = framesFor(exercise)
    const art = poses[(await read($, frame)) % poses.length] ?? []
    const isNarrow = e.props.bodyColumns < 40

    // No frame: the break sits centred, the drawing to the right of its text.
    return (
      <Box flexDirection="row" justifyContent="center">
        <Box flexDirection="column">
          <Text>
            <Text bold color="white" backgroundColor={ACCENT}>
              {exercise.kind === 'pinky' ? ' PINKY FLEX ' : ' FLEX TIME '}
            </Text>
            <Text color={ACCENT}> ▌█━━━━█▐ </Text>
            <Text bold>{exercise.name}</Text>
            <Text dimColor> ({exercise.seconds}s)</Text>
          </Text>
          {exercise.steps.map(step => (
            <Text dimColor wrap="truncate-end">
              {step}
            </Text>
          ))}
          <Box flexDirection="row">
            {/* A digit in an empty prompt presses these, as it answers a survey. */}
            <Button key="done" hotkey="1" plain label="Done 🏆" onPress={done} />
            <Text>   </Text>
            <Button key="snooze" hotkey="2" plain label={`Snooze ${snoozeMinutes}m`} onPress={snooze} />
          </Box>
        </Box>
        {!isNarrow && (
          <Box flexDirection="column" marginLeft={2}>
            {art.map(line => (
              <Text>{line}</Text>
            ))}
          </Box>
        )}
      </Box>
    )
  })
}
