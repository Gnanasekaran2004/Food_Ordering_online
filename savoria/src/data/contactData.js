/* ═══════════════════════════════════════════════════════════════
   SAVORIA — Contact Page Data
   All values below are SAMPLE / DEMO content.
   Replace with real restaurant information before production.
═══════════════════════════════════════════════════════════════ */

export const contactData = {
  restaurantName: 'SAVORIA Fine Dining',

  tagline: 'Come to the Table',

  intro:
    'For reservations, private dining, celebrations, or simply to learn more about SAVORIA, our team would be delighted to hear from you.',

  address: {
    line1:      '42 Heritage Avenue',
    area:       'Lower Parel',
    city:       'Mumbai',
    state:      'Maharashtra',
    postalCode: '400013',
    country:    'India',
  },

  phone:       '+91 22 4567 8900',
  phoneReservations: '+91 22 4567 8901',
  email:       'hello@savoria.example',

  restaurantSchedule: {
    timezone: 'Asia/Kolkata',
    // 0 = Sunday, 1 = Monday, etc.
    hours: {
      0: [{ name: 'Lunch', open: '12:30', close: '15:30' }, { name: 'Dinner', open: '18:30', close: '23:30' }],
      1: [], // Closed
      2: [{ name: 'Lunch', open: '12:30', close: '15:30' }, { name: 'Dinner', open: '18:30', close: '23:30' }],
      3: [{ name: 'Lunch', open: '12:30', close: '15:30' }, { name: 'Dinner', open: '18:30', close: '23:30' }],
      4: [{ name: 'Lunch', open: '12:30', close: '15:30' }, { name: 'Dinner', open: '18:30', close: '23:30' }],
      5: [{ name: 'Lunch', open: '12:30', close: '15:30' }, { name: 'Dinner', open: '18:30', close: '23:30' }],
      6: [{ name: 'Lunch', open: '12:30', close: '15:30' }, { name: 'Dinner', open: '18:30', close: '23:30' }],
    },
    display: [
      { days: 'Tuesday – Sunday', lunch: '12:30 PM – 3:30 PM', dinner: '6:30 PM – 11:30 PM' },
      { days: 'Monday',           closed: true },
    ]
  },

  reservationNote:
    'For large parties (8+), private dining, and special occasions, please call our reservations line directly.',

  social: [
    { label: 'Instagram', handle: '@savoria.example', href: '#' },
    { label: 'Facebook',  handle: 'SAVORIA Fine Dining', href: '#' },
  ],

  inquiryTypes: [
    'General Inquiry',
    'Reservation',
    'Private Dining',
    'Events & Celebrations',
    'Feedback',
    'Partnership',
  ],
};
