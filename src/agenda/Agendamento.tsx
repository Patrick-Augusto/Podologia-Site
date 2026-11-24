import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { DAYS_AHEAD, GCAL_ID, GCAL_KEY, HOURS, LEAD_MINUTES, SLOT_MINUTES, SYMS, URG, wa } from '../data'
import { buildDays, fetchBusy, firstFree, type Busy, type Slot } from './slots'

// a choice made elsewhere on the page ("Agendar este tratamento", the urgency link, "Pedir atendimento em casa");
// n changes on every click so the same choice can be applied twice
export type Preset = { sym?: string; local?: 'cons' | 'casa'; n?: number }

const WD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
const WDL = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
const MO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const dayLabel = (d: Date) => `${WDL[d.getDay()]}, ${d.getDate()} de ${MO[d.getMonth()]}`
const STEP_NAMES = ['Motivo', 'Local', 'Horário', 'Seus dados']

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
)
const WaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 1-13.3 7.9L3 21l1.2-4.5A9 9 0 1 1 21 12z" /></svg>
)

type Flow = { step: number; ok: boolean[]; firstTodo: number; go: (n: number) => void; heads: RefObject<(HTMLHeadingElement | null)[]> }

// one step: its header always shows; done and closed it shows the answer and "Alterar"; open it shows its body.
// Kept outside Agendamento so typing in a field never remounts it.
function Step({ f, n, title, answer, children }: { f: Flow; n: number; title: string; answer: string; children: ReactNode }) {
  const open = f.step === n
  const done = f.ok[n] && !open
  const reachable = n <= f.firstTodo || f.ok[n]
  return (
    <div className={`ag-s${open ? ' open' : ''}${!open && !reachable ? ' locked' : ''}`} role="group" aria-labelledby={`ag-h${n}`}>
      <div className="ag-h">
        <span className={`ag-n${done ? ' done' : ''}`} aria-hidden="true">{done ? <Check /> : n + 1}</span>
        <div className="ag-ht">
          <h3 id={`ag-h${n}`} tabIndex={-1} ref={el => { f.heads.current[n] = el }}>{title}</h3>
          {done && <p className="ag-ans">{answer}</p>}
        </div>
        {done && <button type="button" className="ag-edit" onClick={() => f.go(n)} aria-label={`Alterar ${STEP_NAMES[n].toLowerCase()}`}>Alterar</button>}
      </div>
      {open && <div className="ag-body">{children}</div>}
    </div>
  )
}

const NEXT = ['Continuar para o local', 'Continuar para o horário', 'Continuar para seus dados']
function StepNav({ f, n }: { f: Flow; n: number }) {
  return (
    <div className="ag-nav">
      {n > 0 && <button type="button" className="ag-back" onClick={() => f.go(n - 1)}>← Voltar</button>}
      <button type="button" className="btn btn-p" disabled={!f.ok[n]} onClick={() => f.go(n + 1)}>
        {NEXT[n]} <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}

export default function Agendamento({ preset }: { preset: Preset }) {
  const [busy, setBusy] = useState<Busy[]>([])
  const [step, setStep] = useState(0) // the step that is open
  const [sym, setSym] = useState<string | null>(null)
  const [local, setLocal] = useState<'cons' | 'casa' | null>(null)
  const [bairro, setBairro] = useState('')
  const [day, setDay] = useState(-1) // -1: the first open day
  const [hora, setHora] = useState<string | null>(null)
  const [first, setFirst] = useState(false)
  const [nome, setNome] = useState('')
  const [obs, setObs] = useState('')
  const [jump, setJump] = useState(0) // bumped by a preset: open the first step still to do
  const moved = useRef(false) // only scroll to a step the visitor moved to, never on load
  const heads = useRef<(HTMLHeadingElement | null)[]>([])

  useEffect(() => {
    if (!GCAL_ID || !GCAL_KEY) return
    const now = new Date()
    fetchBusy(GCAL_ID, GCAL_KEY, now, new Date(now.getTime() + (DAYS_AHEAD + 1) * 86_400_000))
      .then(setBusy)
      .catch(err => console.warn('[agenda] Google Agenda indisponível, usando a grade de horários:', err))
  }, [])

  useEffect(() => {
    if (!preset.n) return
    if (preset.sym) { setSym(preset.sym); setFirst(preset.sym === URG.id); setHora(null) }
    if (preset.local) setLocal(preset.local)
    setJump(j => j + 1)
  }, [preset])

  const days = useMemo(
    () => buildDays(new Date(), HOURS, { days: DAYS_AHEAD, slotMinutes: SLOT_MINUTES, leadMinutes: LEAD_MINUTES, busy }),
    [busy],
  )
  const dayIdx = day >= 0 ? day : Math.max(0, days.findIndex(d => !d.closed))
  const cur = days[dayIdx]
  const ff = firstFree(days)
  const ffLabel = ff ? `${dayLabel(days[ff.day].date)}, às ${ff.slot.time}` : ''

  const isUrgent = sym === URG.id
  const symObj = isUrgent ? URG : SYMS.find(s => s.id === sym) ?? null
  const quando = first && ff ? `Primeiro horário possível (${ffLabel})` : hora ? `${dayLabel(cur.date)}, às ${hora}` : ''
  const localTxt = local === 'casa' ? `Em casa${bairro.trim() ? ` · ${bairro.trim()}` : ''}` : local === 'cons' ? 'Consultório, Centro' : ''
  const ok = [!!symObj, local === 'cons' || (local === 'casa' && bairro.trim().length > 1), !!quando, nome.trim().length > 1]
  const ready = ok.every(Boolean)
  const firstTodo = ok.indexOf(false) === -1 ? 3 : ok.indexOf(false)
  const msg = [
    isUrgent ? 'Olá, Janaíne! Preciso de um horário com urgência.' : 'Olá, Janaíne! Gostaria de agendar um horário.',
    `Motivo: ${symObj?.t ?? '-'}`,
    `Tratamento indicado: ${symObj?.trat ?? '-'}`,
    `Local: ${localTxt || '-'}`,
    `Quando: ${quando || '-'}`,
    `Nome: ${nome.trim() || '-'}`,
    ...(obs.trim() ? [`Observação: ${obs.trim()}`] : []),
  ].join('\n')

  const go = (n: number) => { moved.current = true; setStep(n) }
  useEffect(() => { if (jump) go(firstTodo) }, [jump]) // eslint-disable-line react-hooks/exhaustive-deps
  // the step that opens takes the focus and comes into view, so keyboard and screen reader users follow along
  useEffect(() => {
    if (!moved.current) return
    const h = heads.current[step]
    h?.focus({ preventScroll: true })
    h?.closest('.ag-s')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }, [step, jump])

  const pickSym = (id: string) => { setSym(id); setFirst(id === URG.id); if (id === URG.id) setHora(null) }
  const pickSlot = (s: Slot) => { setHora(s.time); setFirst(false) }

  const f: Flow = { step, ok, firstTodo, go, heads }
  const morning = cur.slots.filter(s => s.time < '12:00')
  const afternoon = cur.slots.filter(s => s.time >= '12:00')
  const freeCount = (d: typeof cur) => d.slots.filter(s => !s.taken).length
  const slotGroup = (label: string, list: Slot[]) => list.length > 0 && (
    <div className="ag-period">
      <p className="ag-plabel">{label}</p>
      <div className="slots" role="group" aria-label={`${label}, ${dayLabel(cur.date)}`}>
        {list.map(s => {
          const on = !first && hora === s.time
          return (
            <button key={s.time} type="button" className={`slot${on ? ' on' : ''}`} disabled={s.taken} aria-pressed={on}
              aria-label={`${s.time}${s.taken ? ', ocupado' : ''}`} onClick={() => pickSlot(s)}>{s.time}</button>
          )
        })}
      </div>
    </div>
  )

  return (
    <section id="agendar" className="sec beige">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow">Agendamento</p>
            <h2 className="h2" style={{ marginTop: 14 }}>Peça seu horário em 4 passos</h2>
          </div>
          <p className="lead" style={{ maxWidth: '38ch' }}>Leva menos de um minuto. A confirmação chega pelo WhatsApp.</p>
        </div>
        <div className="ag-g">
          <div>
            <ol className="ag-prog" aria-label="Progresso do agendamento">
              {STEP_NAMES.map((name, n) => (
                <li key={name} className={n === step ? 'on' : ok[n] ? 'done' : ''} aria-current={n === step ? 'step' : undefined}>
                  <button type="button" disabled={!(n <= firstTodo || ok[n])} onClick={() => go(n)}>
                    <i aria-hidden="true" /><span><small>Passo {n + 1}</small>{name}</span>
                  </button>
                </li>
              ))}
            </ol>

            <Step f={f} n={0} title="O que está sentindo?" answer={symObj ? `${symObj.t} · ${symObj.trat}` : ''}>
              <p className="ag-hint">Escolha o que mais parece com o seu caso. Se não souber, tudo bem: tem a opção de avaliação.</p>
              <button type="button" className={`opt opt-u${isUrgent ? ' on' : ''}`} onClick={() => pickSym(URG.id)} aria-pressed={isUrgent}>
                <span className="opt-r" />Urgência: dor forte, inchaço ou unha inflamada agora
              </button>
              <div className="sym-g">
                {SYMS.map(s => (
                  <button key={s.id} type="button" className={`opt${sym === s.id ? ' on' : ''}`} onClick={() => pickSym(s.id)} aria-pressed={sym === s.id}>
                    <span className="opt-r" />{s.t}
                  </button>
                ))}
              </div>
              {symObj && (
                <div className="ind" aria-live="polite">
                  <div className="ind-i"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg></div>
                  <div><b style={{ display: 'block', fontSize: 16 }}>Indicado: {symObj.trat}</b><span style={{ fontSize: 15, color: '#6b5650' }}>{symObj.exp}</span></div>
                </div>
              )}
              <StepNav f={f} n={0} />
            </Step>

            <Step f={f} n={1} title="Onde prefere ser atendida?" answer={localTxt}>
              <div className="loc-g">
                <button type="button" className={`opt${local === 'cons' ? ' on' : ''}`} onClick={() => setLocal('cons')} aria-pressed={local === 'cons'}>
                  <span className="opt-r" /><span>No consultório<br /><span style={{ fontSize: 13.5, color: '#6b5650', fontWeight: 400 }}>Rua Antônio Nery, 527, Centro</span></span>
                </button>
                <button type="button" className={`opt${local === 'casa' ? ' on' : ''}`} onClick={() => setLocal('casa')} aria-pressed={local === 'casa'}>
                  <span className="opt-r" /><span>Em casa<br /><span style={{ fontSize: 13.5, color: '#6b5650', fontWeight: 400 }}>Idosos, mobilidade reduzida, acamados</span></span>
                </button>
              </div>
              {local === 'casa' && (
                <div className="field" style={{ animation: 'drop .25s ease' }}>
                  <label htmlFor="bairro">Em qual bairro?</label>
                  <input id="bairro" type="text" autoComplete="address-level3" placeholder="Ex.: Centro, Jardim Bela Vista…" value={bairro}
                    onChange={e => setBairro(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && ok[1]) go(2) }} />
                  <span className="ag-help">A Janaíne confirma se atende o seu bairro.</span>
                </div>
              )}
              <StepNav f={f} n={1} />
            </Step>

            <Step f={f} n={2} title="Dia e horário" answer={quando}>
              {isUrgent && (
                <>
                  <button type="button" className={`first${first ? ' on' : ''}`} onClick={() => { setFirst(true); setHora(null) }} aria-pressed={first} disabled={!ff}>
                    <span>Primeiro horário possível<br /><span style={{ fontWeight: 500, fontSize: 14 }}>{ffLabel || `Sem horários nos próximos ${DAYS_AHEAD} dias`}</span></span>
                    <span className="opt-r" aria-hidden="true" />
                  </button>
                  <p className="ag-plabel" style={{ marginTop: 4 }}>Ou escolha outro dia</p>
                </>
              )}
              <div className="days" role="group" aria-label={`Próximos ${DAYS_AHEAD} dias`}>
                {days.map((d, i) => {
                  const on = !first && i === dayIdx
                  const free = freeCount(d)
                  return (
                    <button key={d.date.toISOString()} type="button" className={`day${on ? ' on' : ''}`} disabled={d.closed || free === 0} aria-pressed={on}
                      aria-label={`${dayLabel(d.date)}${d.closed ? ', fechado' : free === 0 ? ', sem horários' : `, ${free} horários livres`}`}
                      onClick={() => { setDay(i); setHora(null); setFirst(false) }}>
                      <small>{i === 0 ? 'hoje' : i === 1 ? 'amanhã' : WD[d.date.getDay()]}</small><b>{d.date.getDate()}</b><small>{MO[d.date.getMonth()]}</small>
                    </button>
                  )
                })}
              </div>
              {!first && (
                <>
                  <p className="ag-day">{dayLabel(cur.date)} · {freeCount(cur)} {freeCount(cur) === 1 ? 'horário livre' : 'horários livres'}</p>
                  {slotGroup('Manhã', morning)}
                  {slotGroup('Tarde', afternoon)}
                </>
              )}
              <p className="ag-help" style={{ marginTop: 14 }}>A Janaíne confirma o horário pelo WhatsApp antes do atendimento.</p>
              <StepNav f={f} n={2} />
            </Step>

            <Step f={f} n={3} title="Seus dados" answer={nome.trim()}>
              <div className="field" style={{ marginTop: 0 }}>
                <label htmlFor="nome">Como podemos te chamar?</label>
                <input id="nome" type="text" autoComplete="name" placeholder="Nome e sobrenome…" value={nome} onChange={e => setNome(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="obs">Algo que a Janaíne deva saber? <span style={{ fontWeight: 400, color: '#6b5650' }}>(opcional)</span></label>
                <input id="obs" type="text" autoComplete="off" placeholder="Ex.: sou diabética, uso anticoagulante…" value={obs} onChange={e => setObs(e.target.value)} />
              </div>
              <div className="ag-nav">
                <button type="button" className="ag-back" onClick={() => go(2)}>← Voltar</button>
                <a className="btn btn-p" href={ready ? wa(msg) : '#agendar'} target={ready ? '_blank' : undefined} rel="noopener"
                  aria-disabled={!ready} onClick={e => { if (!ready) e.preventDefault() }}>
                  <WaIcon /> Enviar pedido pelo WhatsApp
                </a>
              </div>
            </Step>
          </div>

          <aside className="sum" aria-label="Resumo do pedido">
            <h3>Seu pedido</h3>
            <dl>
              {[
                ['Motivo', symObj?.t ?? '', 'Escolha no passo 1'],
                ['Tratamento', symObj?.trat ?? '', '—'],
                ['Local', localTxt, 'Escolha no passo 2'],
                ['Quando', quando, 'Escolha no passo 3'],
                ['Nome', nome.trim(), 'Preencha no passo 4'],
              ].map(([dt, value, empty]) => (
                <div className="sum-r" key={dt}><dt>{dt}</dt><dd className={value ? '' : 'empty'}>{value || empty}</dd></div>
              ))}
            </dl>
            <a className="btn btn-c wa" href={ready ? wa(msg) : '#agendar'} target={ready ? '_blank' : undefined} rel="noopener"
              aria-disabled={!ready} onClick={e => { if (!ready) { e.preventDefault(); go(firstTodo) } }}>
              <WaIcon /> Enviar pedido pelo WhatsApp
            </a>
            <p className="sum-note" role="status">
              {ready ? 'Tudo certo. A Janaíne confirma o horário pelo WhatsApp.' : `Passo ${firstTodo + 1} de 4: ${['escolha o motivo', local === 'casa' ? 'escreva o bairro' : 'escolha o local', 'escolha o horário', 'escreva seu nome'][firstTodo]}.`}
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
