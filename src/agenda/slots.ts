export type Busy = { start: Date; end: Date }
export type Slot = { time: string; at: Date; taken: boolean }
export type Day = { date: Date; closed: boolean; slots: Slot[] }

// Every day from `from` on, closed ones included (the day strip shows them disabled).
// A slot is taken when it starts before now + lead time or overlaps a busy block.
export function buildDays(
  from: Date,
  hours: Record<number, string[]>,
  opts: { days: number; slotMinutes: number; leadMinutes: number; busy?: Busy[] },
): Day[] {
  const earliest = from.getTime() + opts.leadMinutes * 60_000
  const len = opts.slotMinutes * 60_000
  const busy = opts.busy ?? []
  return Array.from({ length: opts.days }, (_, i) => {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i)
    const times = hours[date.getDay()] ?? []
    const slots = times.map(time => {
      const [h, m] = time.split(':').map(Number)
      const at = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m)
      const t = at.getTime()
      const taken = t < earliest || busy.some(b => t < b.end.getTime() && t + len > b.start.getTime())
      return { time, at, taken }
    })
    return { date, closed: times.length === 0, slots }
  })
}

export function firstFree(days: Day[]): { day: number; slot: Slot } | null {
  for (let d = 0; d < days.length; d++) {
    const slot = days[d].slots.find(s => !s.taken)
    if (slot) return { day: d, slot }
  }
  return null
}

// Busy times from a public free/busy Google Calendar. Throws on any failure; the caller falls back to the hours alone.
export async function fetchBusy(calendarId: string, key: string, from: Date, to: Date): Promise<Busy[]> {
  const res = await fetch(`https://www.googleapis.com/calendar/v3/freeBusy?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeMin: from.toISOString(), timeMax: to.toISOString(), items: [{ id: calendarId }] }),
  })
  if (!res.ok) throw new Error(`freeBusy ${res.status}`)
  const cal = (await res.json()).calendars?.[calendarId]
  if (!cal || cal.errors?.length) throw new Error(`freeBusy: ${cal?.errors?.[0]?.reason ?? 'calendar missing'}`)
  return (cal.busy as { start: string; end: string }[]).map(b => ({ start: new Date(b.start), end: new Date(b.end) }))
}
