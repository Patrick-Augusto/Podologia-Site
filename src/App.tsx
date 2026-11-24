import { useEffect, useRef, useState, type RefObject } from 'react'
import Agendamento, { type Preset } from './agenda/Agendamento'
import { FAQS, GOOGLE, INSTAGRAM, IMG, QUOTE, RATING, REVIEWS, STEPS, TRATS, wa } from './data'

const Arrow = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)

// runs `fn` on scroll and resize, at most once a frame
function useScrollFrame(fn: () => void) {
  const fnRef = useRef(fn)
  fnRef.current = fn
  useEffect(() => {
    let raf = 0
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => fnRef.current()) }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])
}

// true once the element has been 20% on screen; never goes back
function useSeenOnce(ref: RefObject<Element | null>) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (!ref.current || seen) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.2 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref, seen])
  return seen
}

function Nav() {
  const [mega, setMega] = useState(false)
  const [mob, setMob] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const close = () => { setMega(false); setMob(false) }

  useEffect(() => {
    if (!mega && !mob) return
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    const click = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) close() }
    document.addEventListener('keydown', key)
    document.addEventListener('click', click)
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('click', click) }
  }, [mega, mob])

  return (
    <header className="nav" ref={ref}>
      <div className="wrap nav-in" style={{ position: 'relative' }}>
        <nav className="nav-l" aria-label="Principal">
          <button className="nav-link" type="button" aria-expanded={mega} aria-controls="mega" onClick={() => setMega(!mega)}>
            Tratamentos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={mega ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} /></svg>
          </button>
          <a className="nav-link" href="#consulta">A consulta</a>
          <a className="nav-link" href="#atendimento">Atendimento</a>
          <a className="nav-link" href="#sobre">Sobre</a>
          <button className="burger" type="button" aria-label={mob ? 'Fechar menu' : 'Abrir menu'} aria-expanded={mob} aria-controls="mnav" onClick={() => setMob(!mob)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d={mob ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
          </button>
        </nav>
        <a className="brand" href="#inicio">
          <img src={IMG.logo} alt="" width="54" height="54" />
          <span><span className="brand-n" translate="no">Janaíne Moreno</span><span className="brand-s">Podologia</span></span>
        </a>
        <div className="nav-r"><a className="btn btn-p btn-sm" href="#agendar">Agendar horário</a></div>
        {mega && (
          <div className="mega" id="mega">
            <div className="wrap mega-g">
              <a className="mcard" href="#tratamentos" onClick={close}>
                <div className="mcard-i"><img className="ph stock" src="/img/encravada-560.webp" alt="" /></div>
                <div><b>Unhas e pele dos pés</b><span>Unha encravada, micose, fissuras, calos, peeling e ácidos</span></div>
              </a>
              <a className="mcard" href="#atendimento" onClick={close}>
                <div className="mcard-i"><img className="ph stock" src="/img/idosos-560.webp" alt="" /></div>
                <div><b>Crianças, idosos e em casa</b><span>Podologia infantil, terceira idade e home care</span></div>
              </a>
              <a className="mcard" href="#sobre" onClick={close}>
                <div className="mcard-i"><img className="ph" src="/img/janaine-560.webp" alt="" style={{ objectPosition: '40% 25%' }} /></div>
                <div><b>A podóloga</b><span>Quem é a Janaíne e como ela trabalha</span></div>
              </a>
            </div>
          </div>
        )}
      </div>
      {mob && (
        <div className="wrap mnav" id="mnav">
          {[['#tratamentos', 'Tratamentos'], ['#consulta', 'A consulta'], ['#atendimento', 'Atendimento'], ['#sobre', 'Sobre'], ['#duvidas', 'Dúvidas'], ['#contato', 'Contato']].map(([href, label]) => (
            <a key={href} href={href} onClick={close}>{label}</a>
          ))}
        </div>
      )}
    </header>
  )
}

function Hero({ agendar }: { agendar: (p: Preset) => void }) {
  return (
    <section id="inicio" className="hero">
      <div className="wrap">
        <div className="hero-g">
          <div>
            <a className="urg r1" href="#agendar" onClick={() => agendar({ sym: 'urg' })}>
              <span className="urg-dot" aria-hidden="true" />
              <span>Unha encravada doendo? <span className="urg-l">Ver o primeiro horário livre →</span></span>
            </a>
            <h1 className="r2">Podóloga no Centro de <em>Tietê</em></h1>
            <p className="lead r3" style={{ marginTop: 24 }}>Tratamento de unha encravada, micose, fissuras e calos, com atenção individual e explicação de cada etapa. Também atendo em casa idosos e pessoas acamadas.</p>
            <div className="r4" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 34 }}>
              <a className="btn btn-p" href="#agendar">Agendar horário <Arrow /></a>
              <a className="btn btn-o" href="#tratamentos">Ver os tratamentos</a>
            </div>
            <p className="r5" style={{ marginTop: 22, fontSize: 14.5, color: '#6b5650', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              Somente com hora marcada · Rua Antônio Nery, 527
            </p>
          </div>
          <div className="r3" style={{ position: 'relative' }}>
            <div className="hero-pic"><img className="ph" src={IMG.janaine} alt="Janaíne Moreno de jaleco rosa no consultório" width="1043" height="781" fetchPriority="high" /></div>
            <div className="hcard">
              <div className="hcard-i"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg></div>
              <div><b style={{ display: 'block', fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 20, lineHeight: 1.2 }}>Home care</b><span style={{ fontSize: 14.5, color: '#6b5650' }}>Atendimento em casa para idosos e acamados</span></div>
            </div>
          </div>
        </div>
        <div className="trust">
          <div><b>Desde 2021</b><span>atendendo em Tietê</span></div>
          <div><b>5</b><span>cursos de aperfeiçoamento</span></div>
          <div><b>{RATING.nota} ★</b><span>{RATING.total} avaliações no Google</span></div>
          <div><b>Em casa</b><span>para idosos e acamados</span></div>
        </div>
      </div>
    </section>
  )
}

function Tratamentos({ agendar }: { agendar: (p: Preset) => void }) {
  const [i, setI] = useState(0)
  const cur = TRATS[i]
  return (
    <section id="tratamentos" className="sec">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow">Tratamentos</p>
            <h2 className="h2" style={{ marginTop: 14, maxWidth: '15ch' }}>Tratamentos para unhas e pele dos pés</h2>
          </div>
          <p className="lead" style={{ maxWidth: '40ch' }}>Toda consulta começa com avaliação. O tratamento e o número de sessões dependem do seu caso.</p>
        </div>
        <div className="tr-g">
          <div className="tr-list">
            {TRATS.map((t, n) => (
              <button key={t.id} type="button" className={`tr-item${n === i ? ' on' : ''}`} onMouseEnter={() => setI(n)} onClick={() => setI(n)} aria-pressed={n === i}>
                <span className="tr-n">{String(n + 1).padStart(2, '0')}</span>
                <span><span className="tr-t">{t.nome}{t.tec && <span className="tr-tec">{t.tec}</span>}</span><span className="tr-d">{t.linha}</span></span>
                <span className="tr-a"><Arrow size={22} /></span>
              </button>
            ))}
          </div>
          <div className="tr-panel" aria-live="polite">
            <div className="tr-pic"><img key={cur.id} className="ph stock" src={cur.img} alt={cur.alt} width="1043" height="695" /></div>
            <div className="tr-body">
              <div>
                <h3 style={{ fontSize: 32, lineHeight: 1.1 }}>{cur.nome}</h3>
                <p style={{ marginTop: 10, color: '#6b5650', fontSize: 16.5 }}>{cur.desc}</p>
              </div>
              <div className="tr-meta">
                <span className="chip">Sessões: {cur.sessoes}</span>
                <span className="chip">Duração: {cur.duracao} min</span>
                <span className="chip">A partir de {cur.preco}</span>
              </div>
              <div className="ba"><div>Antes · [foto real com autorização]</div><div>Depois · [foto real com autorização]</div></div>
              <a className="btn btn-p" href="#agendar" onClick={() => agendar({ sym: cur.sym })} style={{ alignSelf: 'flex-start' }}>Agendar este tratamento</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Consulta() {
  const ref = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  useScrollFrame(() => {
    const el = ref.current
    const sticky = el?.firstElementChild as HTMLElement | null
    if (!el || !sticky) return
    const r = el.getBoundingClientRect()
    const travel = r.height - sticky.offsetHeight
    if (travel <= 40) return // phone / reduced motion: not pinned, every step open
    const p = (84 - r.top) / travel
    setStep(Math.max(0, Math.min(3, Math.floor(p * 4))))
  })
  const cur = STEPS[step]
  const cls = (n: number) => (n === step ? 'on' : n < step ? 'done' : '')
  return (
    <section id="consulta" className="dark co-scroll" ref={ref}>
      <div className="co-sticky">
        <div className="wrap co-g">
          <div>
            <p className="eyebrow">Como é a consulta</p>
            <h2 className="h2" style={{ marginTop: 14, maxWidth: '14ch' }}>Você sabe o que vai acontecer antes de começar</h2>
            <div className="co-prog"><span>Passo <b>{step + 1}</b> de 4</span>{step < 3 && <span className="co-hint" aria-hidden="true">Role para continuar ↓</span>}</div>
            <ol className="steps">
              {STEPS.map((s, n) => (
                <li key={s.t} className={`step ${cls(n)}`} aria-current={n === step ? 'step' : undefined}>
                  <span className="step-n">{n + 1}</span>
                  <span><span className="step-t">{s.t}</span><span className="step-d">{s.d}</span></span>
                </li>
              ))}
            </ol>
          </div>
          <div className="co-pic">
            <img key={step} className={`ph${cur.stock ? ' stock' : ''}`} src={cur.img} alt="" style={{ objectPosition: cur.pos }} />
            <div className="co-bar" aria-hidden="true">{STEPS.map((s, n) => <i key={s.t} className={cls(n)} />)}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Atendimento({ agendar }: { agendar: (p: Preset) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useSeenOnce(ref)
  const cards = [
    { img: IMG.infantil, alt: 'Criança sorrindo em cadeira de podologia', pos: '30% 50%', h: 'Podologia infantil', p: 'Atendimento delicado e individualizado para os pequenos, respeitando cada fase do desenvolvimento e as necessidades dos pés e das unhas infantis.', cta: 'Agendar para meu filho' },
    { img: IMG.idosos, alt: 'Podóloga atendendo senhora idosa', pos: '50% 50%', h: 'Podologia para idosos', p: 'Cuidados com a saúde dos pés na terceira idade, com atenção às alterações das unhas, da pele, às calosidades e às necessidades de cada paciente.', cta: 'Agendar consulta' },
    { img: IMG.domiciliar, alt: 'Atendimento podológico em casa, paciente acamada', pos: '50% 50%', h: 'Atendimento domiciliar', p: 'No conforto do lar, para idosos, pessoas com mobilidade reduzida e pacientes acamados. Bairros atendidos: [LISTA DE BAIRROS].', cta: 'Pedir atendimento em casa', casa: true },
  ]
  return (
    <section id="atendimento" className="sec beige">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow">Atendimento</p>
            <h2 className="h2" style={{ marginTop: 14, maxWidth: '17ch' }}>Atendimento para crianças, idosos e em casa</h2>
          </div>
          <a className="btn btn-o" href="#agendar">Agendar atendimento</a>
        </div>
        <div className="at-g" ref={ref}>
          {cards.map((c, n) => (
            <article key={c.h} className={`acard ${seen ? `r${n + 1}` : 'pre'}`}>
              <div className="acard-i"><img className="ph stock" src={c.img} alt={c.alt} style={{ objectPosition: c.pos }} loading="lazy" /></div>
              <div className="acard-b">
                {c.casa && <span className="badge">Home care</span>}
                <h3>{c.h}</h3>
                <p>{c.p}</p>
                <a href="#agendar" onClick={() => c.casa && agendar({ local: 'casa' })}>{c.cta} <span aria-hidden="true">→</span></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Frase() {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = QUOTE.split(' ')
  const [lit, setLit] = useState(words.length)
  useScrollFrame(() => {
    if (!ref.current) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setLit(words.length)
    const r = ref.current.getBoundingClientRect()
    const vh = window.innerHeight
    const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.35)))
    setLit(Math.round(p * words.length))
  })
  return (
    <section className="sec" aria-label="Frase da Janaíne">
      <div className="wrap">
        <p className="quote" ref={ref} aria-label={QUOTE}>
          {words.map((w, n) => <span key={n} className={`w${n < lit ? ' on' : ''}`} aria-hidden="true">{w} </span>)}
        </p>
        <div className="quote-by">
          <img src="/img/janaine-560.webp" alt="" />
          <span><b style={{ color: '#2e211e', fontWeight: 600 }}>Janaíne Moreno</b> · Podóloga</span>
        </div>
      </div>
    </section>
  )
}

const Star = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" /></svg>

function Depoimentos() {
  return (
    <section id="depoimentos" className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head" style={{ marginBottom: 36 }}>
          <div>
            <p className="eyebrow">Avaliações</p>
            <h2 className="h2" style={{ marginTop: 14 }}>Quem já foi atendida</h2>
          </div>
          <a href={GOOGLE} target="_blank" rel="noopener" style={{ fontWeight: 600, textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>Ver todas no Google →</a>
        </div>
        <div className="dp-g">
          <div className="gbox">
            <span style={{ fontSize: 14, color: '#bba79e' }}>Nota no Google</span>
            <b>{RATING.nota}</b>
            <div className="stars" role="img" aria-label="5 estrelas"><Star /><Star /><Star /><Star /><Star /></div>
            <span style={{ fontSize: 15, color: '#cdbbb2' }}>com base em {RATING.total} avaliações</span>
          </div>
          {REVIEWS.slice(0, 2).map(r => (
            <figure key={r.nome} className="dcard" style={{ margin: 0 }}>
              <p>“{r.texto}”</p>
              <small>{r.nome} · avaliação no Google, {r.quando}</small>
            </figure>
          ))}
        </div>
        <ul className="dp-more">
          {REVIEWS.slice(2).map(r => (
            <li key={r.nome}>
              <div className="stars" role="img" aria-label="5 estrelas"><Star /><Star /><Star /><Star /><Star /></div>
              <p>“{r.texto}”</p>
              <small>{r.nome} · {r.quando}</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Sobre() {
  return (
    <section id="sobre" className="sec beige">
      <div className="wrap sb-g">
        <div className="sb-pic"><img className="ph" src={IMG.janaine} alt="Retrato da podóloga Janaíne Moreno" loading="lazy" /></div>
        <div>
          <p className="eyebrow">Sobre</p>
          <h2 className="h2" style={{ marginTop: 14, maxWidth: '16ch' }}>Sobre a podóloga Janaíne Moreno</h2>
          <p style={{ marginTop: 24, fontSize: 18, color: '#4d3b36', maxWidth: '58ch' }}>Nasci em Sorocaba e moro em Tietê há 12 anos. A podologia sempre me encantou, e foi essa paixão que me levou a fazer o curso em Piracicaba. Atuo desde 2021. O que mais me motiva é ver o paciente recuperar o conforto, a autoestima e a qualidade de vida, e concluir o tratamento com a alta.</p>
          <div className="facts">
            <div className="fact">
              <h3>Aperfeiçoamento</h3>
              <div className="tags">{['Ácidos', 'Feridas e machucados', 'Resina composta', 'Onicomicose', 'Onicocriptose'].map(t => <span key={t} className="tag">{t}</span>)}</div>
            </div>
            <div className="fact">
              <h3>Quem eu atendo</h3>
              <ul><li>Adultos de todas as idades</li><li>Crianças</li><li>Idosos e pessoas acamadas, em casa</li></ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Duvidas() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="duvidas" className="sec">
      <div className="wrap fq-g">
        <div>
          <p className="eyebrow">Dúvidas frequentes</p>
          <h2 className="h2" style={{ marginTop: 14 }}>Antes de agendar</h2>
          <p className="lead" style={{ marginTop: 20 }}>Não achou sua resposta? Mande uma mensagem pelo WhatsApp.</p>
          <a className="btn btn-o" href={wa()} target="_blank" rel="noopener" style={{ marginTop: 24 }}>Perguntar no WhatsApp</a>
        </div>
        <div style={{ borderTop: '1px solid rgba(125,79,71,.22)' }}>
          {FAQS.map((f, n) => (
            <div key={f.q} className={`fq${open === n ? ' on' : ''}`}>
              <button type="button" className="fq-q" aria-expanded={open === n} aria-controls={`fq-${n}`} onClick={() => setOpen(open === n ? null : n)}>
                {f.q}
                <span className="fq-x" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></span>
              </button>
              {open === n && <p className="fq-a" id={`fq-${n}`}>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Rodape() {
  return (
    <footer id="contato" className="dark" style={{ paddingTop: 'clamp(56px, 6vw, 80px)' }}>
      <div className="wrap">
        <div className="ft-top">
          <div>
            <img src={IMG.logoCreme} alt="" width="76" height="76" style={{ marginBottom: 22 }} loading="lazy" />
            <h2>Agende seu atendimento</h2>
            <p style={{ marginTop: 14, color: '#cdbbb2', fontSize: 17 }}>Atendimento somente com agendamento prévio.</p>
          </div>
          <a className="btn btn-c" href="#agendar" style={{ minHeight: 64, padding: '0 34px', fontSize: 18 }}>Agendar horário</a>
        </div>
        <div className="ft-g">
          <div>
            <h4>Consultório</h4>
            <p>Rua Antônio Nery, 527<br />Centro, Tietê – SP</p>
            <a href={GOOGLE} target="_blank" rel="noopener" style={{ textDecoration: 'underline' }}>Ver no mapa →</a>
          </div>
          <div>
            <h4>Contato</h4>
            <div className="ft-l">
              <a href="tel:+5515991872757">(15) 99187-2757</a>
              <a href={wa()} target="_blank" rel="noopener">WhatsApp</a>
              <a href={INSTAGRAM} target="_blank" rel="noopener">Instagram · @janainemorenopodologia</a>
            </div>
          </div>
          <div>
            <h4>Em casa</h4>
            <p style={{ color: '#cdbbb2', fontSize: 15.5 }}>Atendimento domiciliar para idosos, pessoas com mobilidade reduzida e acamados. Bairros: [LISTA].</p>
          </div>
          <div>
            <h4>Navegação</h4>
            <div className="ft-l">
              <a href="#tratamentos">Tratamentos</a>
              <a href="#consulta">A consulta</a>
              <a href="#atendimento">Atendimento</a>
              <a href="#sobre">Sobre</a>
              <a href="#duvidas">Dúvidas</a>
            </div>
          </div>
        </div>
        <div className="ft-b"><span>© 2026 Janaíne Moreno Podologia</span><span>Tietê – SP</span></div>
      </div>
    </footer>
  )
}

export default function App() {
  const [preset, setPreset] = useState<Preset>({})
  const agendar = (p: Preset) => setPreset(prev => ({ ...p, n: (prev.n ?? 0) + 1 }))
  // the phone's booking bar hides while the booking form is on screen
  const [formOnScreen, setFormOnScreen] = useState(false)
  useEffect(() => {
    const el = document.getElementById('agendar')
    if (!el) return
    const io = new IntersectionObserver(([e]) => setFormOnScreen(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="jm">
      <Nav />
      <main>
        <Hero agendar={agendar} />
        <Tratamentos agendar={agendar} />
        <Consulta />
        <Atendimento agendar={agendar} />
        <Frase />
        <Depoimentos />
        <Sobre />
        <Duvidas />
        <Agendamento preset={preset} />
      </main>
      <Rodape />
      {!formOnScreen && <div className="bbar"><a className="btn btn-p" href="#agendar">Agendar horário</a></div>}
    </div>
  )
}
