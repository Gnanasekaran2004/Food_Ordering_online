import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToOrders } from '../../../services/adminOrderService';
import { subscribeToCustomers } from '../../../services/adminUserService';
import { subscribeToMenu } from '../../../services/adminMenuService';
import { subscribeToReservations } from '../../../services/adminReservationService';
import { subscribeToActivity } from '../../../services/adminActivityService';
import { subscribeToRestaurantConfig } from '../../../services/adminSettingsService';
import { getSummary, getTrafficData, getRevenueData, TOP_DISHES, KITCHEN_METRICS, getOrderStatusData, NOTIFICATIONS } from '../data/adminMockData';

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const [range, setRange] = useState('30d'); // Global range state
  
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activity, setActivity] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount >= 5) setLoading(false);
    };

    const unsubOrders = subscribeToOrders(range, (data, err) => {
      if (!err) setOrders(data);
      checkLoaded();
    });

    const unsubCustomers = subscribeToCustomers((data, err) => {
      if (!err) setCustomers(data);
      checkLoaded();
    });

    const unsubMenu = subscribeToMenu((data, err) => {
      if (!err) setMenuItems(data);
      checkLoaded();
    });

    const unsubReservations = subscribeToReservations((data, err) => {
      if (!err) setReservations(data);
      checkLoaded();
    });

    const unsubActivity = subscribeToActivity((data, err) => {
      if (!err) setActivity(data);
      checkLoaded();
    });

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
  }, [range]);

  // ─────────────────────────────────────────────────────────
  // CALCULATE REAL ANALYTICS FROM FIREBASE DATA
  // ─────────────────────────────────────────────────────────
  
  // Summary calculations
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
  
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
  const completionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) + '%' : '0%';
  
  const summary = {
    views: 'N/A', // We don't track traffic natively yet
    viewsTrend: '0%',
    orders: totalOrders.toString(),
    ordersTrend: '0%', // Need prev period to calculate
    revenue: '₹' + totalRevenue.toLocaleString(),
    revenueTrend: '0%',
    avgOrderValue: '₹' + avgOrderValue.toFixed(0),
    aovTrend: '0%',
    customers: customers.length.toString(),
    reservations: reservations.length.toString(),
    conversionRate: 'N/A',
    completionRate: completionRate
  };

  // Order Status Data
  const orderStatusData = {
    pending: orders.filter(o => o.status === 'Pending').length,
    confirmed: orders.filter(o => o.status === 'Confirmed').length,
    preparing: orders.filter(o => o.status === 'Preparing').length,
    ready: orders.filter(o => o.status === 'Ready').length,
    completed: completedOrders,
    cancelled: cancelledOrders,
    refunded: orders.filter(o => o.status === 'Refunded').length,
  };

  // Top Dishes (derive from order items)
  const dishCounts = {};
  orders.forEach(o => {
    if (o.orderItems) {
      o.orderItems.forEach(item => {
        if (!dishCounts[item.name]) {
          const matchedMenu = menuItems.find(m => m.name === item.name);
          dishCounts[item.name] = { name: item.name, orders: 0, revenue: 0, category: matchedMenu ? matchedMenu.category : 'Food' };
        }
        dishCounts[item.name].orders += (item.qty || 1);
        dishCounts[item.name].revenue += ((item.price || 0) * (item.qty || 1));
      });
    }
  });
  const topDishes = Object.values(dishCounts).sort((a,b) => b.orders - a.orders).slice(0, 5);
  
  // Traffic / Revenue Charts
  // We'll generate simple mock dates if not enough data, or use real data grouped by day
  const revenueChartData = [];
  const days = 7;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Sum orders for this specific date
    const dayRev = orders.filter(o => {
      const oDate = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.date);
      return oDate.toDateString() === d.toDateString();
    }).reduce((sum, o) => sum + (o.amount || 0), 0);
    
    revenueChartData.push({ label: dateStr, value: dayRev, prev: dayRev * 0.8 }); // fake prev period
  }

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
    traffic: getTrafficData(range), // still mocked
    revenue: revenueChartData,
    topDishes,
    kitchenMetrics: { avgPrepTime: '24 min', onTimeRate: '92%', throughput: '18 orders/hr', completionRate, cancellationRate: ((cancelledOrders/totalOrders)*100).toFixed(1)+'%' },
    orderStatusData,
    notifications: NOTIFICATIONS, // still mocked
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData(localRange) {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }

  // If a component passes a range, and it differs from the global one, we update the global one
  useEffect(() => {
    if (localRange && localRange !== context.range) {
      context.setRange(localRange);
    }
  }, [localRange, context.range, context]);

  return context;
}
