// All the site's copy and the clinic's settings. [BRACKETED] values are facts Janaíne still has to supply.

export const WHATSAPP = '5515991872757'
export const wa = (text?: string) => `https://wa.me/${WHATSAPP}${text ? `?text=${encodeURIComponent(text)}` : ''}`
// Janaíne's Google profile (map, route and reviews)
export const INSTAGRAM = 'https://www.instagram.com/janainemorenopodologia/'
export const GOOGLE = 'https://share.google/TPC2jIWT8JnhK5nhy'

export const IMG = {
  janaine: '/img/janaine.webp',
  encravada: '/img/encravada.webp',
  micose: '/img/micose.webp',
  peeling: '/img/peeling.webp',
  fissuras: '/img/fissuras.webp',
  calos: '/img/calos.webp',
  acidos: '/img/acidos.webp',
  infantil: '/img/infantil.webp',
  idosos: '/img/idosos.webp',
  domiciliar: '/img/domiciliar.webp',
  logo: '/img/logo-malva.webp',
  logoCreme: '/img/logo-creme.webp',
}

// ---- booking ----
// Provisional hours (the brief only says "consult available times"): replace with Janaíne's real ones.
// Keyed by weekday, 0 = Sunday; a day without a key is closed.
const WEEK = ['08:00', '09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30', '17:30']
export const HOURS: Record<number, string[]> = { 1: WEEK, 2: WEEK, 3: WEEK, 4: WEEK, 5: WEEK, 6: ['08:00', '09:00', '10:00', '11:00'] }
export const SLOT_MINUTES = 60
export const DAYS_AHEAD = 14
// a slot must start at least this long from now, so Janaíne has time to confirm it
export const LEAD_MINUTES = 120

// Google Calendar read as free/busy only: the calendar shared publicly as "See only free/busy" and an API key
// restricted to the site's domain and the Calendar API. Without both, the grid above is used as is.
export const GCAL_ID = import.meta.env.VITE_GCAL_ID ?? ''
export const GCAL_KEY = import.meta.env.VITE_GCAL_KEY ?? ''

export type Sym = { id: string; t: string; trat: string; exp: string }
export const URG: Sym = {
  id: 'urg', t: 'Urgência: dor forte ou unha inflamada', trat: 'Unha encravada (atendimento prioritário)',
  exp: 'Vamos buscar o primeiro horário possível. Se houver pus, febre ou a vermelhidão estiver se espalhando, procure também um médico.',
}
export const SYMS: Sym[] = [
  { id: 's1', t: 'Unha entrando na pele, dói ao calçar', trat: 'Unha encravada', exp: 'O tratamento alivia a dor e corrige a borda da unha que está pressionando a pele.' },
  { id: 's2', t: 'Unha amarelada, grossa ou descolando', trat: 'Micose nas unhas', exp: 'Alterações de cor e espessura podem ser fungos. Começa com avaliação e segue com acompanhamento.' },
  { id: 's3', t: 'Quero melhorar a aparência da unha', trat: 'Peeling ungueal', exp: 'Renova a superfície da unha, conforme a avaliação.' },
  { id: 's4', t: 'Calcanhar rachado ou ressecado', trat: 'Tratamento de fissuras', exp: 'Melhora a pele do calcanhar e evita que as rachaduras se aprofundem.' },
  { id: 's5', t: 'Calo ou pele grossa na sola', trat: 'Calos e calosidades', exp: 'Remoção cuidadosa e orientação para que o calo não volte.' },
  { id: 's6', t: 'Não sei / quero uma avaliação', trat: 'Consulta de avaliação', exp: 'Na avaliação você descobre o que tem e qual o melhor tratamento.' },
]

// ---- treatments ----
export type Trat = { id: string; nome: string; tec: string; img: string; alt: string; sym: string; sessoes: string; duracao: string; preco: string; linha: string; desc: string }
export const TRATS: Trat[] = [
  { id: 'encravada', nome: 'Unha encravada', tec: 'Onicocriptose', img: IMG.encravada, alt: 'Podóloga tratando uma unha encravada com pinça', sym: 's1', sessoes: '[Nº]', duracao: '[MIN]', preco: '[R$]',
    linha: 'Alívio da dor, da vermelhidão e do desconforto.',
    desc: 'Tratamento e cuidados especializados para unhas encravadas, que podem causar dor, vermelhidão e desconforto. O atendimento busca aliviar os sintomas e orientar os cuidados necessários para a recuperação.' },
  { id: 'micose', nome: 'Micose nas unhas', tec: 'Onicomicose', img: IMG.micose, alt: 'Unha do pé sendo tratada com motor podológico', sym: 's2', sessoes: '[Nº]', duracao: '[MIN]', preco: '[R$]',
    linha: 'Unhas com mudança de cor, espessura ou aparência.',
    desc: 'Cuidados para unhas com alterações causadas por fungos, como mudanças na coloração, espessura e aparência. Inclui avaliação, cuidados com a unha e acompanhamento da evolução.' },
  { id: 'peeling', nome: 'Peeling ungueal', tec: '', img: IMG.peeling, alt: 'Peeling na unha do dedão com lixa elétrica', sym: 's3', sessoes: '[Nº]', duracao: '[MIN]', preco: '[R$]',
    linha: 'Renovação e melhora da aparência da unha.',
    desc: 'Procedimento voltado aos cuidados da superfície das unhas, auxiliando na renovação e na melhora de sua aparência, conforme avaliação podológica.' },
  { id: 'fissuras', nome: 'Fissuras', tec: 'Calcanhar rachado', img: IMG.fissuras, alt: 'Calcanhar rachado sendo lixado', sym: 's4', sessoes: '[Nº]', duracao: '[MIN]', preco: '[R$]',
    linha: 'Rachaduras, principalmente nos calcanhares.',
    desc: 'Cuidados para pés com rachaduras, especialmente nos calcanhares, buscando melhorar as condições da pele, o conforto e prevenir o agravamento das fissuras.' },
  { id: 'calos', nome: 'Calos e calosidades', tec: '', img: IMG.calos, alt: 'Calo na sola do pé sendo removido com motor', sym: 's5', sessoes: '[Nº]', duracao: '[MIN]', preco: '[R$]',
    linha: 'Pele grossa que incomoda ao caminhar.',
    desc: 'Remoção cuidadosa de calos e calosidades que causam dor ou incômodo ao caminhar e ao calçar, com orientação para evitar que voltem.' },
  { id: 'acidos', nome: 'Tratamentos com ácidos', tec: '', img: IMG.acidos, alt: 'Ácido sendo aplicado com conta-gotas na unha do pé', sym: 's6', sessoes: '[Nº]', duracao: '[MIN]', preco: '[R$]',
    linha: 'Indicados conforme a avaliação de cada caso.',
    desc: 'Procedimentos com ácidos, conforme avaliação podológica e indicação para cada caso, como parte do tratamento de alterações nas unhas e na pele dos pés.' },
]

export const STEPS = [
  { t: 'Conversa e avaliação', d: 'Você conta o que sente, desde quando e o que já tentou. Avalio pés, unhas e pele com calma.', img: IMG.janaine, pos: '40% 25%', stock: false },
  { t: 'Explicação do tratamento', d: 'Antes de começar, explico o que vou fazer, por quê, e quantas sessões o seu caso deve precisar.', img: IMG.encravada, pos: '50% 50%', stock: true },
  { t: 'O procedimento', d: 'Feito com delicadeza e no seu ritmo, explicando cada etapa enquanto acontece.', img: IMG.micose, pos: '50% 50%', stock: true },
  { t: 'Cuidados em casa e alta', d: 'Você sai sabendo como cuidar dos pés em casa. Acompanho a evolução até a alta.', img: IMG.acidos, pos: '50% 50%', stock: true },
]

export const QUOTE = 'Cuidar dos pés é também cuidar da saúde, do bem-estar e da autoestima. Quero que cada atendimento traga confiança, acolhimento e conforto.'

export const FAQS = [
  { q: 'Quanto custa a consulta?', a: 'A avaliação custa [VALOR]. O valor de cada tratamento é informado depois da avaliação, porque depende do caso.' },
  { q: 'Quanto tempo dura o atendimento?', a: 'Em média [DURAÇÃO] minutos. A primeira consulta pode levar um pouco mais por causa da avaliação.' },
  { q: 'Quantas sessões vou precisar?', a: 'Depende do tratamento e do caso. Unha encravada costuma levar [Nº] sessões; micose exige acompanhamento por [PERÍODO]. Você sai da avaliação sabendo a estimativa.' },
  { q: 'Em quais bairros você atende em casa?', a: 'O atendimento domiciliar é para idosos, pessoas com mobilidade reduzida e acamados. Bairros atendidos: [LISTA]. Pode haver taxa de deslocamento: [VALOR].' },
  { q: 'Quais formas de pagamento você aceita?', a: '[PIX, DINHEIRO, CARTÃO — CONFIRMAR].' },
  { q: 'Preciso agendar antes?', a: 'Sim. O atendimento é somente com agendamento prévio, pelo WhatsApp ou pelo formulário desta página.' },
]

// Google reviews, copied from Janaíne's profile (Nov 2026). Names shortened to first name + initial.
export const RATING = { nota: '5,0', total: 7 }
export const REVIEWS = [
  { nome: 'Claudenice M.', quando: 'há 11 meses', texto: 'Super atenciosa, excelente profissional e super indico.' },
  { nome: 'Sonia P.', quando: 'há 4 anos', texto: 'Foi ótimo, super profissional, dedicada. Sua técnica e conhecimento dominam a profissional que é, em excelência.' },
  { nome: 'Patrick', quando: 'há 4 anos', texto: 'Super atenciosa no atendimento, recomendo muito. Sempre passo com ela.' },
  { nome: 'Stilo', quando: 'há 4 anos', texto: 'Excelente profissional, muito educada e sabe realmente o que faz em seu consultório. Super recomendo.' },
  { nome: 'Elaine R.', quando: 'há 4 anos', texto: 'Excelente profissional, estabelecimento aconchegante.' },
  { nome: 'Kleber C.', quando: 'há 1 ano', texto: 'Excelente profissional.' },
  { nome: 'Soeli A.', quando: 'há 4 anos', texto: 'Excelente, eu super recomendo.' },
]
