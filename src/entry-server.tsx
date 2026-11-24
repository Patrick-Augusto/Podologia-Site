import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { FAQS, GOOGLE, INSTAGRAM, TRATS, WHATSAPP } from './data'

export const render = () => renderToString(<StrictMode><App /></StrictMode>)

// what the page is about, for Google and AI search (schema.org). No rating here: Google ignores
// self-hosted review markup for a local business, the reviews live on the Google profile.
export function schema(siteUrl: string) {
  const url = siteUrl ? `${siteUrl}/` : undefined
  const business = {
    '@context': 'https://schema.org',
    '@type': ['MedicalBusiness', 'LocalBusiness'],
    '@id': url ? `${url}#clinica` : undefined,
    name: 'Janaíne Moreno Podologia',
    description: 'Podóloga no Centro de Tietê (SP). Tratamento de unha encravada, micose nas unhas, fissuras, calos, peeling ungueal e tratamentos com ácidos. Atendimento infantil, para idosos e domiciliar para pessoas acamadas.',
    url,
    image: url ? `${url}img/janaine.webp` : undefined,
    logo: url ? `${url}img/logo-malva.png` : undefined,
    telephone: `+${WHATSAPP}`,
    medicalSpecialty: 'Podiatric',
    founder: { '@type': 'Person', name: 'Janaíne Moreno', jobTitle: 'Podóloga' },
    foundingDate: '2021',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rua Antônio Nery, 527',
      addressLocality: 'Tietê',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    areaServed: { '@type': 'City', name: 'Tietê' },
    hasMap: GOOGLE,
    sameAs: [INSTAGRAM, GOOGLE],
    availableService: TRATS.map(t => ({ '@type': 'MedicalProcedure', name: t.tec ? `${t.nome} (${t.tec})` : t.nome, description: t.desc })),
  }
  // only answers with real facts: the ones still waiting for Janaíne's data ([VALOR]…) stay out
  const faqs = FAQS.filter(f => !/\[/.test(f.a))
  const faq = faqs.length && {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  return [business, faq].filter(Boolean)
}
