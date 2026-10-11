import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

const BAND = {
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 12,
    bodyColumns: 100,
    scroll: { offset: 0, bodyRows: 11 },
    view: {},
  },
} as const

const MIN = 60_000

function engine(on: On) {
  on('session.start', (_$, e) => ({ cwd: e.cwd }))
  on('command.register', (_$, e) => ({ value: { command: e.name } }))
  on('ui.toast', () => ({ value: undefined }))
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine</Text>
  })
}

async function start($: Engine, on: On) {
  engine(on)
  const clock = mock.clock(on)
  await $.session.start({ cwd: '/tmp', surface: 'terminal', isInteractive: true })
  return clock
}

async function isShowing($: Engine) {
  const ui = await $.ui.mount({ plugin: 'flex', surface: 'terminal', ...BAND })
  const texts = (await ui.findAll({ type: 'Text' })).map(t => t.text).join('\n')
  await ui.unmount()
  return /FLEX/.test(texts)
}

async function press($: Engine, key: 'done' | 'snooze') {
  const ui = await $.ui.mount({ plugin: 'flex', surface: 'terminal', ...BAND })
  await ui.press({ key })
  await ui.unmount()
}

test('the next break comes a full interval after Done, not on the old beat', async ($, on) => {
  const clock = await start($, on)

  await clock.advance(10 * MIN)
  expect(await isShowing($)).toBe(true)

  // Left up for 7 minutes before Done.
  await clock.advance(7 * MIN)
  await press($, 'done')

  await clock.advance(9 * MIN)
  expect(await isShowing($)).toBe(false)
  await clock.advance(1 * MIN)
  expect(await isShowing($)).toBe(true)
})

test('a snoozed break does not bring the next one 5 minutes after it', async ($, on) => {
  const clock = await start($, on)

  await clock.advance(10 * MIN)
  await press($, 'snooze')
  await clock.advance(5 * MIN)
  expect(await isShowing($)).toBe(true)
  await press($, 'done')

  await clock.advance(9 * MIN)
  expect(await isShowing($)).toBe(false)
  await clock.advance(1 * MIN)
  expect(await isShowing($)).toBe(true)
})

test('/flex restarts the countdown', async ($, on) => {
  const clock = await start($, on)

  await clock.advance(9 * MIN)
  await $.command.run({
    command: 'flex',
    args: '',
    origin: { kind: 'composer' },
    presentation: { isFullscreen: false, columns: 120 } as never,
  })
  await press($, 'done')

  await clock.advance(9 * MIN)
  expect(await isShowing($)).toBe(false)
  await clock.advance(1 * MIN)
  expect(await isShowing($)).toBe(true)
})
