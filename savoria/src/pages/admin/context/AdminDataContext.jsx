import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { subscribeToOrders } from '../../../services/adminOrderService';
import { subscribeToCustomers } from '../../../services/adminUserService';
import { subscribeToMenu } from '../../../services/adminMenuService';
import { subscribeToReservations } from '../../../services/adminReservationService';
import { subscribeToActivity } from '../../../services/adminActivityService';
import { subscribeToRestaurantConfig } from '../../../services/adminSettingsService';
import { getTrafficData } from '../data/adminMockData';

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const [range, setRange] = useState('30d');

  const [orders, setOrders]           = useState([]);
  const [customers, setCustomers]     = useState([]);
  const [menuItems, setMenuItems]     = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activity, setActivity]       = useState([]);
  const [settings, setSettings]       = useState(null);

  // Track per-stream loading independently — avoids race condition from counter
  const [streamsLoaded, setStreamsLoaded] = useState({
    orders: false, customers: false, menu: false, reservations: false, activity: false,
  });
  const loading = !Object.values(streamsLoaded).every(Boolean);

  const markLoaded = (key) =>
    setStreamsLoaded(prev => (prev[key] ? prev : { ...prev, [key]: true }));

  useEffect(() => {
    // Reset loading state when range changes
    setStreamsLoaded({ orders: false, customers: false, menu: false, reservations: false, activity: false });

    const unsubOrders = subscribeToOrders(range, (data, err) => {
      if (!err) setOrders(data);
      markLoaded('orders');
    });
    const unsubCustomers = subscribeToCustomers((data, err) => {
      if (!err) setCustomers(data);
      markLoaded('customers');
    });
    const unsubMenu = subscribeToMenu((data, err) => {
      if (!err) setMenuItems(data);
      markLoaded('menu');
    });
    const unsubReservations = subscribeToReservations((data, err) => {
      if (!err) setReservations(data);
      markLoaded('reservations');
    });
    const unsubActivity = subscribeToActivity((data, err) => {
      if (!err) setActivity(data);
      markLoaded('activity');
    });
    // Settings subscription (no loading gate needed — it's supplementary)
    const unsubSettings = subscribeToRestaurantConfig((data, err) => {
      if (!err) setSettings(data);
    });

    return () => {
      unsubOrders();
      unsubCustomers();
      unsubMenu();
      unsubReservations();
      unsubActivity();
      unsubSettings();
    };
  }, [range]); // Only re-subscribe when range changes

  // ─────────────────────────────────────────────────────────
  // REAL ANALYTICS FROM FIREBASE DATA
  // ─────────────────────────────────────────────────────────

  const totalOrders   = orders.length;
  const totalRevenue  = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

  const completedOrders  = orders.filter(o => o.status === 'Completed').length;
  const cancelledOrders  = orders.filter(o => o.status === 'Cancelled').length;
  const pendingOrders    = orders.filter(o => o.status === 'Pending').length;
  const completionRate   = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) + '%' : '0%';
  const cancellationRate = totalOrders > 0 ? ((cancelledOrders  / totalOrders) * 100).toFixed(1) + '%' : '0%';

  const summary = {
    views:          'N/A',  // Traffic tracking not implemented
    viewsTrend:     null,
    orders:         totalOrders.toString(),
    ordersTrend:    null,   // Period comparison requires historical data
    revenue:        '₹' + totalRevenue.toLocaleString('en-IN'),
    revenueTrend:   null,
    avgOrderValue:  '₹' + avgOrderValue.toFixed(0),
    aovTrend:       null,
    customers:      customers.length.toString(),
    reservations:   reservations.length.toString(),
    conversionRate: 'N/A',  // Requires traffic tracking
    completionRate,
  };

  const orderStatusData = {
    pending:   pendingOrders,
    confirmed: orders.filter(o => o.status === 'Confirmed').length,
    preparing: orders.filter(o => o.status === 'Preparing').length,
    ready:     orders.filter(o => o.status === 'Ready').length,
    completed: completedOrders,
    cancelled: cancelledOrders,
    refunded:  orders.filter(o => o.status === 'Refunded').length,
  };

  // Top dishes derived from order items
  const dishCounts = {};
  orders.forEach(o => {
    (o.orderItems || []).forEach(item => {
      if (!dishCounts[item.name]) {
        const matchedMenu = menuItems.find(m => m.name === item.name);
        dishCounts[item.name] = {
          name: item.name, orders: 0, revenue: 0,
          category: matchedMenu ? matchedMenu.category : 'Food',
        };
      }
      dishCounts[item.name].orders  += (item.qty || 1);
      dishCounts[item.name].revenue += ((item.price || 0) * (item.qty || 1));
    });
  });
  const topDishes = Object.values(dishCounts).sort((a, b) => b.orders - a.orders).slice(0, 5);

  // Revenue chart — real data, no fake previous-period line
  const revenueChartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayRev = orders.filter(o => {
      const oDate = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.date);
      return oDate.toDateString() === d.toDateString();
    }).reduce((sum, o) => sum + (o.amount || 0), 0);
    revenueChartData.push({ label: dateStr, value: dayRev }); // No fake prev
  }

  // Kitchen metrics — real calculations where possible, labeled honestly
  const kitchenMetrics = {
    totalOrders:      totalOrders,
    completionRate,
    cancellationRate,
    avgPrepTime:      'N/A', // Requires kitchen timing data not currently tracked
    throughput:       totalOrders > 0 ? (totalOrders / 7).toFixed(1) + ' orders/day' : 'N/A',
  };

  // Derive real notifications from live data instead of mock array
  const notifications = [];
  if (pendingOrders > 0) {
    notifications.push({
      id: 'pending-orders',
      type: 'info',
      title: `${pendingOrders} pending order${pendingOrders > 1 ? 's' : ''} awaiting confirmation`,
      time: new Date().toISOString(),
    });
  }
  if (cancelledOrders > 0) {
    notifications.push({
      id: 'cancelled-orders',
      type: 'warning',
      title: `${cancelledOrders} cancelled order${cancelledOrders > 1 ? 's' : ''} in current period`,
      time: new Date().toISOString(),
    });
  }
  // Surface the last 3 activity entries as notifications
  activity.slice(0, 3).forEach(a => {
    notifications.push({
      id: 'activity-' + a.id,
      type: 'info',
      title: a.summary || a.message || 'Recent activity',
      time: a.createdAt?.toDate ? a.createdAt.toDate().toISOString() : (a.time || new Date().toISOString()),
    });
  });

  const value = {
    loading,
    range,
    setRange,
    orders,
    customers,
    menuItems,
    reservations,
    activity,
    settings,

    // Real Analytics
    summary,
    traffic:         getTrafficData(range), // Website traffic is not tracked — kept as visual placeholder only
    revenue:         revenueChartData,
    topDishes,
    kitchenMetrics,
    orderStatusData,
    notifications:   notifications.slice(0, 5), // Cap to 5 most relevant
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData(localRange) {
  const context = useContext(AdminDataContext);
  if (!context) throw new Error('useAdminData must be used within an AdminDataProvider');

  // Sync local range to global context without adding context to deps
  // (adding the full context object causes an infinite re-subscribe loop)
  const setRange = context.setRange;
  const contextRange = context.range;
  useEffect(() => {
    if (localRange && localRange !== contextRange) {
      setRange(localRange);
    }
  }, [localRange, contextRange, setRange]);

  return context;
}
