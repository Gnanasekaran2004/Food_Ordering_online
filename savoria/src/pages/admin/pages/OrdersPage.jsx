import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { updateOrderStatus } from '../../../services/adminOrderService';
import AdminTable from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import OrderDrawer from '../components/OrderDrawer';

export default function OrdersPage() {
  const { orders } = useAdminData('30d');
  const { adminUser } = useAdminAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleCloseDrawer = async (order, newStatus) => {
    if (newStatus && order && newStatus !== order.status) {
      try {
        await updateOrderStatus(order.id, newStatus, adminUser);
      } catch (err) {
        console.error("Failed to update status", err);
        alert("Failed to update status");
      }
    } else if (!newStatus) {
      setSelectedOrder(null);
    }
  };

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date', render: (r) => new Date(r.date).toLocaleString() },
    { key: 'items', label: 'Items' },
    { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount.toLocaleString()}` },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'payment', label: 'Payment', render: (r) => <StatusBadge status={r.payment} /> },
    { key: 'actions', label: 'Actions', render: (r) => <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(r); }} style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--cream)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>View</button> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Orders</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['All', 'Pending', 'Preparing', 'Completed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              background: statusFilter === s ? 'var(--gold)' : 'var(--surface)',
              color: statusFilter === s ? 'black' : 'var(--muted)',
              border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: statusFilter === s ? 600 : 400
            }}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <input type="text" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
      </div>
      <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <AdminTable columns={columns} data={filtered} onRowClick={setSelectedOrder} emptyMessage="No orders found." />
      </div>
      <OrderDrawer order={selectedOrder} onClose={handleCloseDrawer} />
    </div>
  );
}
