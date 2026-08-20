/* ═══════════════════════════════════════════════════════════════
   SAVORIA — About Page Data
   All text is sample/demo content. Replace values as needed.
   Structure is intentionally kept data-only — no JSX here.
═══════════════════════════════════════════════════════════════ */

export const aboutData = {

  intro: {
    label: 'Our Story',
    headline: 'Every Dish\nHas a Story.',
    subheadline: 'Crafted from fire, time, and intention.',
    body: `SAVORIA was built on a single belief — that fine dining should feel deeply personal. That every plate that leaves our kitchen carries with it a conversation between land, craft, and guest. We did not set out to build a restaurant. We set out to create a feeling.`,
  },

  story: {
    label: 'The Beginning',
    headline: 'Where It All Started',
    paragraphs: [
      'In a quiet corner of the city, a small team of passionate cooks gathered around a shared question: what would it mean to cook without compromise? Not to chase trends, not to collect accolades — but to honour the ingredient, respect the technique, and serve something true.',
      'From that conversation, SAVORIA was born. A kitchen built on precision, patience, and the quiet obsession with getting things right — not because anyone was watching, but because it was the only way we knew how to work.',
      'Today, the kitchen has grown. The team has changed. But the obsession remains. And every evening, when the first plate leaves the pass, it carries the same intention it always did.',
    ],
    imagePlaceholder: 'The SAVORIA Kitchen — Original Location',
  },

  history: [
    {
      year: '2012',
      title: 'The Beginning',
      description: 'SAVORIA opens with a small team and a simple idea: fine dining should feel deeply personal. Classical technique meets contemporary Indian ingredients.',
    },
    {
      year: '2015',
      title: 'The Kitchen Evolves',
      description: 'A signature approach to seasonal sourcing and controlled-fire cooking takes shape. The tasting menu is introduced for the first time.',
    },
    {
      year: '2018',
      title: 'A New Identity',
      description: 'SAVORIA begins blending local ingredients with global culinary technique — creating a language that is entirely its own.',
    },
    {
      year: '2021',
      title: 'Expanding the Experience',
      description: 'Private dining and chef-led table experiences are launched. The kitchen begins hosting collaborative dinners with visiting chefs.',
    },
    {
      year: 'Today',
      title: 'Still Evolving',
      description: 'The menu changes with the seasons. The team continues to question, experiment, and refine — while protecting what matters most.',
    },
  ],

  kitchenStory: {
    label: 'Inside the Kitchen',
    headline: 'Before the Plate,\nThere Is Process.',
    intro: 'A finished dish is only the last step in a long conversation between the cook, the ingredient, and the idea. Inside the SAVORIA kitchen, that conversation never really ends.',
    phases: [
      {
        id: 'ingredients',
        label: 'Ingredients',
        headline: 'We begin with what the land gives us.',
        body: 'Everything starts with sourcing. Seasonal, character-driven ingredients chosen not for convenience but for what they bring to the plate.',
      },
      {
        id: 'technique',
        label: 'Technique',
        headline: 'Technique is where ingredients become intention.',
        body: 'Precise heat. Controlled time. Every cut, every reduction, every resting period is a decision. Technique is not decoration — it is the architecture of flavour.',
      },
      {
        id: 'fire',
        label: 'Fire',
        headline: 'Heat transforms simplicity into depth.',
        body: 'Fire is the oldest cooking tool and still the most honest. In our kitchen, it is controlled obsessively — because the difference between good and extraordinary is often a matter of seconds.',
      },
      {
        id: 'plate',
        label: 'The Plate',
        headline: 'Every detail exists for a reason.',
        body: 'Plating is not garnish — it is the final argument. The composition, the colour, the temperature of the plate beneath it. Each element placed with purpose.',
      },
    ],
    closing: 'And that is the SAVORIA philosophy.',
  },

  philosophy: [
    {
      icon: '◈',
      title: 'Ingredients',
      description: 'We choose ingredients for character, seasonality, and provenance. Quality is not a feature — it is the foundation.',
    },
    {
      icon: '◉',
      title: 'Technique',
      description: 'Precision allows simple ingredients to become memorable. We respect classical methods while remaining curious about what lies beyond them.',
    },
    {
      icon: '◎',
      title: 'Balance',
      description: 'Every dish balances texture, acidity, richness, temperature, and aroma. A plate that is only rich or only acidic is not yet complete.',
    },
    {
      icon: '◈',
      title: 'Hospitality',
      description: 'Fine dining is ultimately about how the guest feels. The food is the language, but hospitality is the conversation.',
    },
  ],

  kitchen: {
    label: 'Kitchen Culture',
    headline: 'Our Kitchen Is\nBuilt Around Curiosity.',
    body: `We do not have a rigid doctrine. We have a set of values that guide every decision made inside the kitchen — from how we source to how we train, from how we plate to how we talk to one another. The kitchen is collaborative. The best ideas come from the newest cook and the most experienced chef equally. We question, experiment, fail, refine, and begin again.`,
    process: [
      { step: 'Select',  desc: 'Source with intention. Every ingredient is chosen for character.' },
      { step: 'Prepare', desc: 'Mise en place is a discipline. Organisation is respect for the craft.' },
      { step: 'Cook',    desc: 'Controlled heat, precise timing, full attention.' },
      { step: 'Refine',  desc: 'Taste, adjust, question, taste again.' },
      { step: 'Plate',   desc: 'Compose with purpose. Every element earns its place.' },
      { step: 'Serve',   desc: 'The plate leaves the kitchen and becomes an experience.' },
    ],
  },

  milestones: [
    { value: '12+',  label: 'Years of Craft',          note: 'Sample value' },
    { value: '50+',  label: 'Signature Creations',     note: 'Sample value' },
    { value: '120+', label: 'Seasonal Menus',           note: 'Sample value' },
    { value: '25K+', label: 'Guests Welcomed',          note: 'Sample value' },
  ],

  closing: {
    label: 'Join Us',
    headline: 'The Story Continues\nat the Table.',
    body: 'Every evening is a new chapter. We would be honoured to share it with you.',
    cta: [
      { label: 'Explore the Menu', href: '/order', variant: 'gold' },
      { label: 'Reserve a Table',  href: '/contact', variant: 'ghost' },
    ],
  },
};
