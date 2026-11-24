import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildDays, firstFree } from './slots.ts'

const hours = { 1: ['08:00', '09:00', '10:00', '11:00', '13:30'] }
// Monday 2026-11-23, 07:00 local
const monday = new Date(2026, 10, 23, 7, 0)
const free = (d: { slots: { time: string; taken: boolean }[] }) => d.slots.filter(s => !s.taken).map(s => s.time)

test('closed days are kept and flagged', () => {
  const days = buildDays(monday, hours, { days: 7, slotMinutes: 60, leadMinutes: 0 })
  assert.equal(days.length, 7)
  assert.deepEqual(days.map(d => d.closed), [false, true, true, true, true, true, true])
  assert.deepEqual(free(days[0]), ['08:00', '09:00', '10:00', '11:00', '13:30'])
})

test('lead time and busy blocks take slots; firstFree skips them', () => {
  const busy = [{ start: new Date(2026, 10, 23, 9, 30), end: new Date(2026, 10, 23, 10, 15) }]
  const days = buildDays(monday, hours, { days: 1, slotMinutes: 60, leadMinutes: 90, busy })
  assert.deepEqual(free(days[0]), ['11:00', '13:30'])
  assert.equal(firstFree(days)?.slot.time, '11:00')
  assert.equal(firstFree(buildDays(monday, {}, { days: 3, slotMinutes: 60, leadMinutes: 0 })), null)
})
