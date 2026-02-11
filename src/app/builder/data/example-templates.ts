import { PageTemplate } from '../models/page-template';

export const EXAMPLE_TEMPLATES: PageTemplate[] = [
  {
    id: 'template-landing',
    name: 'Landing Page Semplice',
    previewImage: 'https://picsum.photos/id/1015/600/400', // puoi sostituire con data URL
    settings: { background: '#f8fafc' },
    body: [
      {
        id: 'sec1',
        layout: 'full',
        props: { background: '#ffffff' },
        components: [[
          { id: 'c1', type: 'heading', props: { text: 'Benvenuti nel nostro evento', level: 1, color: '#1e40af' } },
          { id: 'c2', type: 'text', props: { text: 'Unisciti a noi per una giornata indimenticabile.', color: '#374151' } },
          { id: 'c3', type: 'button', props: { text: 'Iscriviti ora', color: '#3b82f6', link: '#', align: 'center' } }
        ]]
      },
      {
        id: 'sec2',
        layout: '2_columns',
        props: { gap: 40, ratio: '1fr 1fr' },
        components: [
          [{ id: 'c4', type: 'image', props: { image: 'https://picsum.photos/id/201/600/400' } }],
          [{ id: 'c5', type: 'text', props: { text: 'Descrizione dettagliata dell\'evento...' } }]
        ]
      }
    ]
  },

  {
    id: 'template-locandina',
    name: 'Locandina Evento',
    previewImage: 'https://picsum.photos/id/870/600/800',
    settings: { background: '#0f172a', width: '1080px', height: '1920px' },
    body: [
      {
        id: 'sec1',
        layout: 'full',
        props: { background: 'transparent' },
        components: [[
          { id: 'c1', type: 'heading', props: { text: 'FESTA DI PRIMAVERA', level: 1, color: '#fbbf24' } },
          { id: 'c2', type: 'text', props: { text: 'Sabato 15 Marzo 2025\nOre 21:00', color: '#e2e8f0' } },
          { id: 'c3', type: 'qrcode', props: { 
            textBefore: 'Scansiona per info', 
            textAfter: 'Ti aspettiamo!', 
            url: 'https://example.com/evento' 
          }}
        ]]
      },
      {
        id: 'sec2',
        layout: 'flex',
        props: { direction: 'row', gap: 24, wrap: true },
        components: [[
          { id: 'c4', type: 'button', props: { text: 'Prenota posto', color: '#22c55e', link: '#', align: 'center' } }
        ]]
      }
    ]
  }
];