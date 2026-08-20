
export const restaurant = {
  name: 'Savoria',
  tagline: 'The Art of Fine Dining',
  taglineSub: 'Mumbai · Est. 2012',
  philosophy:
    'Founded in the heart of Mumbai in 2012, Savoria emerged from a singular vision — to create a dining experience that transcends the ordinary. Our culinary philosophy is rooted in the belief that a great meal is not merely sustenance. It is an art form. A conversation. A memory.',
  philosophyShort:
    'Where craft meets ingredient. Where tradition meets invention.',
  chef: {
    name: 'Arjun Malhotra',
    title: 'Executive Chef & Founder',
    quote:
      'Cooking is not about feeding the body. It is about feeding the soul — one precisely considered ingredient at a time.',
  },
  location: '12, Bandra Kurla Complex, Mumbai — 400 051',
  phone: '+91 98765 43210',
  email: 'dine@savoria.in',
  hours: {
    weekdays: 'Monday – Thursday',
    weekdayTime: '12 : 00 — 22 : 30',
    weekend: 'Friday – Sunday',
    weekendTime: '12 : 00 — 23 : 30',
  },
  social: [
    { label: 'Instagram', handle: '@savoria.in', href: '#' },
    { label: 'Facebook',  handle: '/savoriarestaurant', href: '#' },
    { label: 'Twitter',   handle: '@savoria_in', href: '#' },
  ],
};

// ── Navigation Links ──────────────────────────────────────────
export const navLinks = [
  { label: 'Home',      to: '/' },
  { label: 'Order',     to: '/order' },
  { label: 'About Us',  to: '/about' },
  { label: 'Services',  to: '/services' },
  { label: 'Contact',   to: '/contact' },
];

// ── Restaurant Story Milestones ───────────────────────────────
export const milestones = [
  {
    year: '2012',
    title: 'The Beginning',
    text: 'Savoria opens in Bandra — a 40-seat intimate dining room built on a single conviction: excellence without compromise.',
  },
  {
    year: '2016',
    title: 'Recognition',
    text: 'Named "Best New Restaurant" at the Indian Restaurant Awards. The BKC flagship opens, tripling seating capacity.',
  },
  {
    year: '2020',
    title: 'The Tasting Menu',
    text: 'Launch of the signature 12-course Tasting Menu. Heralded internationally as one of South Asia\'s finest culinary experiences.',
  },
  {
    year: '2024',
    title: 'Global Stage',
    text: 'Ranked among Asia\'s 50 Best Restaurants. Third consecutive Michelin recognition. The world takes notice.',
  },
];

import imgFineDining from './images/common_seats.webp';
import imgChefsTable from './images/plating.webp';
import imgPrivateDining from './images/premium.webp';
import imgTastingMenu from './images/food.webp';
import imgEvents from './images/customer.webp';

export const services = [
  {
    id: 'fine-dining',
    number: '01',
    title: 'Fine Dining',
    category: 'Signature Experience',
    description:
      'An elevated à la carte journey through seasonally composed menus — each dish a considered work of culinary art.',
    imageSrc: imgFineDining,
    imagePlaceholderLabel: 'Fine Dining — Restaurant Interior',
    size: 'large', 
  },
  {
    id: 'chefs-table',
    number: '02',
    title: "Chef's Table",
    category: 'Exclusive',
    description:
      'An intimate 8-seat counter experience — front-row to the alchemy of the kitchen.',
    imageSrc: imgChefsTable,
    imagePlaceholderLabel: "Chef's Table — Kitchen Counter",
    size: 'tall',
  },
  {
    id: 'private-dining',
    number: '03',
    title: 'Private Dining',
    category: 'Events',
    description:
      'Bespoke celebrations curated entirely around your vision, with a dedicated private dining room.',
    imageSrc: imgPrivateDining,
    imagePlaceholderLabel: 'Private Dining — Private Room',
    size: 'medium',
  },
  {
    id: 'tasting-menu',
    number: '04',
    title: '12-Course Menu',
    category: 'Signature',
    description:
      'A cinematic culinary narrative — twelve chapters, each revealing a new dimension of flavor.',
    imageSrc: imgTastingMenu,
    imagePlaceholderLabel: '12-Course Tasting Menu — Course Presentation',
    size: 'medium',
  },
  {
    id: 'events',
    number: '05',
    title: 'Culinary Events',
    category: 'Experiences',
    description:
      'Wine pairing evenings, seasonal tastings, and exclusive collaborations with visiting international chefs.',
    imageSrc: imgEvents,
    imagePlaceholderLabel: 'Culinary Events — Wine Pairing Evening',
    size: 'medium',
  },
];

// ── Marquee items ─────────────────────────────────────────────
export const marqueeItems = [
  { text: 'Fine Dining',          accent: false },
  { text: '✦',                    accent: true  },
  { text: 'Mumbai',               accent: false },
  { text: '✦',                    accent: true  },
  { text: "Asia's 50 Best",       accent: false },
  { text: '✦',                    accent: true  },
  { text: 'Est. 2012',            accent: false },
  { text: '✦',                    accent: true  },
  { text: 'Michelin Recognised',  accent: false },
  { text: '✦',                    accent: true  },
  { text: 'Tasting Menu',         accent: false },
  { text: '✦',                    accent: true  },
  { text: "Chef's Table",         accent: false },
  { text: '✦',                    accent: true  },
  { text: 'Private Events',       accent: false },
  { text: '✦',                    accent: true  },
];

// ── Footer navigation ─────────────────────────────────────────
export const footerNav = {
  Explore: ['Fine Dining', 'Tasting Menu', "Chef's Table", 'Private Dining', 'Culinary Events'],
  Information: ['About Us', 'Our Team', 'Press & Awards', 'Gift Cards', 'Careers'],
};
