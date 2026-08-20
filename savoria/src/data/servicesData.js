/* ═══════════════════════════════════════════════════════════════
   SAVORIA — Services Page Data
   All content below is SAMPLE / DEMO copy.
   Replace with real service descriptions and images.

   Images source: src/pages/Services/images/
   Imported as ES modules so Vite handles hashing & optimisation.
═══════════════════════════════════════════════════════════════ */

import imgBuffet          from '../pages/Services/images/Buffet.webp';
import imgDineIn          from '../pages/Services/images/Dine-In.webp';
import imgWedding         from '../pages/Services/images/Wedding & Marriage Catering.webp';
import imgPrivateDining   from '../pages/Services/images/Private-Dining.webp';
import imgCorporate       from '../pages/Services/images/Corporate-Catering.webp';
import imgCelebrations    from '../pages/Services/images/Birthday & Celebrations.webp';
import imgEventCatering   from '../pages/Services/images/Event-Catering.webp';
import imgTakeaway        from '../pages/Services/images/Takeaway & Pickup.webp';

export const servicesHero = {
  eyebrow: 'Our Services',
  headline: ['More Than', 'A Meal.'],
  subheadline: 'Experiences, Crafted Around You.',
  body: 'From intimate dinners to grand celebrations, SAVORIA brings the same deliberate attention to detail beyond the restaurant table.',
};

export const servicesIntro = {
  quote: 'Every occasion deserves its own rhythm.',
  body: 'Our services are designed around the people, settings, and moments that make an event worth remembering. We work closely with you to shape an experience — not just a meal.',
};

export const servicesList = [
  {
    id: 'buffet',
    number: '01',
    eyebrow: 'Group Dining',
    title: 'Buffet Experience',
    headline: 'A Table Made for Everyone.',
    description:
      'Our buffet service brings the craft of fine dining to larger gatherings. Curated menus, live counters, and attentive service ensure every guest is looked after — whether it is a corporate lunch or a family celebration.',
    image: imgBuffet,
    imageAlt: 'SAVORIA curated buffet service prepared for a private celebration',
    features: [
      'Curated multi-course menus',
      'Live cooking counters',
      'Vegetarian & non-vegetarian selections',
      'Flexible service styles',
      'Professional serving staff',
      'Custom menu planning',
    ],
    idealFor: ['Family Gatherings', 'Corporate Events', 'Celebrations', 'Community Events'],
    cta: { label: 'Inquire About Buffet', href: '/contact' },
    layout: 'image-right',
  },
  {
    id: 'dine-in',
    number: '02',
    eyebrow: 'Signature Experience',
    title: 'Dine-In Experience',
    headline: 'The SAVORIA Table.',
    description:
      'Step inside and let the kitchen guide you. Our à la carte menu is built around seasonal ingredients, chef-led composition, and a hospitality that never rushes. Whether lunch or dinner, romantic or family, the SAVORIA table is always ready.',
    image: imgDineIn,
    imageAlt: 'SAVORIA fine dining interior — candlelit table setting',
    features: [
      'À la carte & set-menu dining',
      'Seasonal chef-curated dishes',
      'Lunch & dinner service',
      'Sommelier-assisted wine selection',
      'Fine-dining atmosphere',
      'Special occasion arrangements',
    ],
    idealFor: ['Romantic Dinners', 'Family Dining', 'Special Occasions', 'Tasting Menus'],
    cta: { label: 'Explore the Menu', href: '/order' },
    layout: 'image-left',
  },
  {
    id: 'wedding-catering',
    number: '03',
    eyebrow: 'Celebrations',
    title: 'Wedding & Marriage Catering',
    headline: 'For the Moments That Deserve a Feast.',
    description:
      "SAVORIA's wedding and marriage catering is built around your story. From engagement dinners and mehendi functions to sangeet nights and grand reception feasts, we tailor every element — the menu, the presentation, the service — around your vision and your guests.",
    image: imgWedding,
    imagePosition: 'center 80%',
    imageAlt: 'SAVORIA wedding catering service — elegantly arranged reception banquet',
    features: [
      'Custom wedding menus',
      'Multi-function planning (reception, sangeet, mehendi)',
      'Vegetarian, Jain & non-vegetarian options',
      'Live counters & carving stations',
      'Dessert & mithai stations',
      'Professional serving staff',
      'Event coordination support',
      'Menu tasting sessions',
    ],
    idealFor: ['Wedding Receptions', 'Engagement Ceremonies', 'Sangeet & Mehendi', 'Anniversary Feasts', 'Traditional Ceremonies'],
    cta: { label: 'Plan Your Event', href: '/contact' },
    layout: 'feature',        // full-width feature treatment
  },
  {
    id: 'private-dining',
    number: '04',
    eyebrow: 'Exclusive',
    title: 'Private Dining',
    headline: 'A Table of Your Own.',
    description:
      'Reserve the private dining room for occasions that demand complete attention. A dedicated space, a personalised menu, and a single focus — you. Designed for those who value both the extraordinary and the uninterrupted.',
    image: imgPrivateDining,
    imageAlt: 'SAVORIA private dining room — intimate setting for exclusive occasions',
    features: [
      'Dedicated private dining space',
      'Personalised menu design',
      'Celebration setup & florals',
      'Dedicated service team',
      'Curated wine & beverage pairing',
      'Custom plating & presentation',
    ],
    idealFor: ['Birthdays', 'Anniversaries', 'Business Dinners', 'Intimate Celebrations'],
    cta: { label: 'Enquire Now', href: '/contact' },
    layout: 'image-right',
  },
  {
    id: 'corporate-catering',
    number: '05',
    eyebrow: 'Business',
    title: 'Corporate Catering',
    headline: 'Hospitality, Built for Business.',
    description:
      "We understand that corporate occasions require precision and reliability as much as quality. SAVORIA's corporate catering brings professionally presented menus to your boardroom, conference, or client dinner — on time, every time.",
    image: imgCorporate,
    imageAlt: 'SAVORIA corporate catering — professional setup for a business lunch',
    features: [
      'Flexible lunch & dinner menus',
      'Individual and buffet formats',
      'Allergen-aware menu options',
      'Scheduled delivery & service',
      'Professional presentation',
      'Scalable for any team size',
    ],
    idealFor: ['Corporate Lunches', 'Conferences', 'Client Dinners', 'Team Celebrations', 'Office Events'],
    cta: { label: 'Request a Proposal', href: '/contact' },
    layout: 'image-left',
  },
  {
    id: 'celebrations',
    number: '06',
    eyebrow: 'Personal Occasions',
    title: 'Birthday & Celebrations',
    headline: 'Make the Moment Yours.',
    description:
      'Milestone birthdays, anniversaries, graduations, family reunions — every celebration deserves a setting worthy of the occasion. SAVORIA creates the atmosphere and the menu while you focus on the moment.',
    image: imgCelebrations,
    imageAlt: 'SAVORIA celebration dining — special occasion table decorated for a birthday',
    features: [
      'Custom celebration menus',
      'Dessert & cake arrangement',
      'Table styling & decoration',
      'Personalised touches',
      'Photography-friendly presentation',
      'Flexible group sizing',
    ],
    idealFor: ['Birthdays', 'Anniversaries', 'Graduations', 'Family Gatherings', 'Milestone Events'],
    cta: { label: 'Plan Your Celebration', href: '/contact' },
    layout: 'image-right',
  },
  {
    id: 'event-catering',
    number: '07',
    eyebrow: 'Off-Premise',
    title: 'Event Catering',
    headline: 'From Our Kitchen to Your Event.',
    description:
      'Take the quality of the SAVORIA kitchen to your event space. We offer customisable catering packages for private parties, social gatherings, and community events — scaling our service to suit your occasion without ever scaling back on quality.',
    image: imgEventCatering,
    imageAlt: 'SAVORIA event catering — outdoor social gathering with professional food service',
    features: [
      'Customisable event menus',
      'Scalable for small & large gatherings',
      'Live stations available',
      'Full service or drop-off options',
      'Professional catering team',
      'Dietary requirement planning',
    ],
    idealFor: ['Private Parties', 'Social Events', 'Community Gatherings', 'House Parties'],
    cta: { label: 'Get in Touch', href: '/contact' },
    layout: 'image-left',
  },
  {
    id: 'takeaway',
    number: '08',
    eyebrow: 'Convenient',
    title: 'Takeaway & Pickup',
    headline: 'SAVORIA, Whenever You Need It.',
    description:
      'Pre-order from our curated selection and collect at a time that suits you. Perfect for celebration packages, group meal orders, and those occasions when you want fine-dining quality from your own space.',
    image: imgTakeaway,
    imageAlt: 'SAVORIA takeaway — elegantly packaged restaurant meal ready for pickup',
    features: [
      'Pre-order scheduling',
      'Celebration packages available',
      'Group meal planning',
      'Elegant packaging',
      'Full menu availability',
    ],
    idealFor: ['Celebration Packages', 'Group Meal Orders', 'Home Dining', 'Gift Orders'],
    cta: { label: 'Browse the Menu', href: '/order' },
    layout: 'image-right',
  },
];

export const whySavoria = [
  {
    number: '01',
    title: 'Custom Menus',
    body: 'Every menu is crafted around your occasion, guest list, and dietary preferences — never a generic package.',
  },
  {
    number: '02',
    title: 'Experienced Team',
    body: 'Professional hospitality from the first consultation through the final course — handled with care and precision.',
  },
  {
    number: '03',
    title: 'Seasonal Approach',
    body: 'Our menus evolve with the season and the ingredient, keeping every experience current and considered.',
  },
  {
    number: '04',
    title: 'Flexible Scale',
    body: 'From an intimate dinner for four to a large wedding reception — our service scales without compromising quality.',
  },
  {
    number: '05',
    title: 'Attention to Detail',
    body: 'From plating to pacing, every element of the experience is deliberate. Nothing is left to chance.',
  },
  {
    number: '06',
    title: 'Fine-Dining Quality',
    body: 'Regardless of format or scale, the standards of the SAVORIA kitchen remain constant.',
  },
];

export const servicesCTA = {
  headline: "Let's Create Something Worth Remembering.",
  body: 'Tell us about your occasion and our team will help shape the right experience — from the very first plate to the last.',
  primaryCta: { label: 'Plan an Event', href: '/contact' },
  secondaryCta: { label: 'Explore the Menu', href: '/order' },
};
