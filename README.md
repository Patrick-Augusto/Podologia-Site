# Janaíne Moreno Podologia

Site da podóloga Janaíne Moreno, no Centro de Tietê (SP): tratamentos, como é a consulta, atendimento domiciliar, avaliações do Google e um agendamento guiado em 4 passos que envia o pedido pelo WhatsApp.

Vite + React + TypeScript.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm test         # testes da grade de horários
```

## Onde mudar o quê

- `src/data.ts`: textos, tratamentos, perguntas frequentes, avaliações, horários de atendimento e WhatsApp.
- `src/App.tsx`: as seções da página.
- `src/agenda/`: o agendamento e a grade de horários.
- `src/styles.css`: o visual.

## Google Agenda (opcional)

Para o agendamento mostrar só os horários livres de verdade, copie `.env.example` para `.env` e preencha:

- `VITE_GCAL_ID`: o ID da agenda, compartilhada publicamente como "Ver apenas livre/ocupado".
- `VITE_GCAL_KEY`: uma chave de API do Google restrita ao domínio do site e à Google Calendar API.

Sem isso, o site usa a grade de horários de `src/data.ts` e a Janaíne confirma cada pedido pelo WhatsApp.
