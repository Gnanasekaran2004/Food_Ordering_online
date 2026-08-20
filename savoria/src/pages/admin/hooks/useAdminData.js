import { useState, useEffect, useCallback } from 'react';
import { getRecentOrders, getRecentCustomers } from '../../../services/adminService';
import {
  getSummary, getTrafficData, getRevenueData,
  TOP_DISHES, RESERVATIONS, ACTIVITY, NOTIFICATIONS, KITCHEN_METRICS,
  MENU_ITEMS, getOrderStatusData, CUSTOMERS as MOCK_CUSTOMERS, ORDERS as MOCK_ORDERS
} from '../data/adminMockData';

export function useAdminData(range = '30d') {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedOrders, fetchedCustomers] = await Promise.all([
        getRecentOrders(50),
        getRecentCustomers(50)
      ]);
      setOrders(fetchedOrders.length > 0 ? fetchedOrders : MOCK_ORDERS);
      setCustomers(fetchedCustomers.length > 0 ? fetchedCustomers : MOCK_CUSTOMERS);
    } catch (err) {
      console.error("Failed to load admin data from Firebase:", err);
      // Fallback to mock data if Firebase fails or lacks permissions
      setOrders(MOCK_ORDERS);
      setCustomers(MOCK_CUSTOMERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [range, fetchData]);

  return {
    loading,
    refreshData: fetchData,
    summary: getSummary(range),
    traffic: getTrafficData(range),
    revenue: getRevenueData(range),
    orders,
    customers,
    topDishes: TOP_DISHES,
    reservations: RESERVATIONS,
    activity: ACTIVITY,
    notifications: NOTIFICATIONS,
    kitchenMetrics: KITCHEN_METRICS,
    menuItems: MENU_ITEMS,
    orderStatusData: getOrderStatusData(range)
  };
}
