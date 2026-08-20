export const RANGES = ['today', '7d', '30d', '3m', '12m'];

export const getSummary = (range) => {
  const multipliers = { today: 1, '7d': 7, '30d': 30, '3m': 90, '12m': 365 };
  const m = multipliers[range] || 30;
  return {
    views: 1250 * m,
    orders: 45 * m,
    revenue: 125000 * m,
    avgOrderValue: 2750,
    customers: 20 * m,
    reservations: 15 * m,
    cancellationRate: '2.5%',
    retention: '68%',
    conversionRate: '3.6%',
    completionRate: '98%',
    viewsTrend: '+12.5%',
    ordersTrend: '+8.2%',
    revenueTrend: '+15.4%',
    aovTrend: '+2.1%'
  };
};

export const getTrafficData = (range) => {
  return Array.from({ length: 7 }).map((_, i) => ({
    label: `Day ${i+1}`,
    views: Math.floor(Math.random() * 1000 + 500),
    unique: Math.floor(Math.random() * 500 + 200)
  }));
};

export const getRevenueData = (range) => {
  return Array.from({ length: 7 }).map((_, i) => ({
    label: `Day ${i+1}`,
    revenue: Math.floor(Math.random() * 50000 + 10000),
    prev: Math.floor(Math.random() * 40000 + 10000)
  }));
};

export const ORDERS = Array.from({ length: 20 }).map((_, i) => {
  const statuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled', 'Refunded'];
  const payments = ['Paid', 'Refunded', 'Pending'];
  return {
    id: `ORD-${1000 + i}`,
    customer: `Customer ${i + 1}`,
    email: `customer${i+1}@example.com`,
    date: new Date(Date.now() - i * 3600000).toISOString(),
    items: Math.floor(Math.random() * 5) + 1,
    amount: Math.floor(Math.random() * 10000) + 500,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    payment: payments[Math.floor(Math.random() * payments.length)],
    orderItems: [{ name: 'Braised A5 Wagyu Short Rib', qty: 1, price: 4500 }]
  };
});

export const CUSTOMERS = Array.from({ length: 15 }).map((_, i) => ({
  id: `CUST-${i+1}`,
  name: `Customer ${i + 1}`,
  email: `customer${i+1}@example.com`,
  phone: `+91 98765432${10 + i}`,
  orders: Math.floor(Math.random() * 50) + 1,
  totalSpent: Math.floor(Math.random() * 100000) + 1000,
  lastOrder: new Date(Date.now() - i * 86400000).toISOString(),
  status: Math.random() > 0.2 ? 'Active' : 'Inactive',
  joinDate: new Date(Date.now() - i * 86400000 * 30).toISOString(),
  favoriteDish: 'Braised A5 Wagyu Short Rib'
}));

export const TOP_DISHES = [
  { rank: 1, name: 'Braised A5 Wagyu Short Rib', category: 'Mains', orders: 450, revenue: 2025000, trend: '+15%' },
  { rank: 2, name: 'Butter-Poached Lobster', category: 'Mains', orders: 320, revenue: 1120000, trend: '+8%' },
  { rank: 3, name: 'Seared Scallop Amuse-Bouche', category: 'Starters', orders: 280, revenue: 420000, trend: '+5%' }
];

export const RESERVATIONS = Array.from({ length: 12 }).map((_, i) => ({
  id: `RES-${i+1}`,
  name: `Party of ${(i%4)+2}`,
  party: (i%4)+2,
  date: new Date().toISOString().split('T')[0],
  time: `19:30`,
  status: i < 3 ? 'Completed' : i > 10 ? 'Cancelled' : 'Upcoming',
  notes: 'Window seat preferred'
}));

export const ACTIVITY = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  type: ['Orders', 'Customers', 'Reservations', 'Menu', 'System'][i % 5],
  message: `Activity message ${i+1}`,
  time: new Date(Date.now() - i * 3600000).toISOString(),
  icon: 'dot'
}));

export const NOTIFICATIONS = Array.from({ length: 8 }).map((_, i) => {
  const types = ['warning', 'info', 'success', 'error'];
  return {
    id: i,
    type: types[i % 4],
    title: `Notification ${i+1}`,
    message: `Detailed message for notification ${i+1}`,
    time: new Date(Date.now() - i * 1800000).toISOString(),
    read: i > 3
  };
});

export const KITCHEN_METRICS = {
  avgPrepTime: '18 min',
  onTimeRate: '94.2%',
  throughput: '21 orders/hr',
  completionRate: '97.8%',
  cancellationRate: '3.2%'
};

export const MENU_ITEMS = [
  { id: 'm1', name: 'Braised A5 Wagyu Short Rib', category: 'Mains', price: 4500, available: true, featured: true, chefSpecial: true, orders: 450, revenue: 2025000 },
  { id: 'm2', name: 'Butter-Poached Lobster', category: 'Mains', price: 3500, available: true, featured: false, chefSpecial: true, orders: 320, revenue: 1120000 }
];

export const ORDER_STATUS_DATA = { pending: 15, confirmed: 25, preparing: 10, ready: 5, completed: 150, cancelled: 5, refunded: 2 };

export const getOrderStatusData = (range) => ORDER_STATUS_DATA;
