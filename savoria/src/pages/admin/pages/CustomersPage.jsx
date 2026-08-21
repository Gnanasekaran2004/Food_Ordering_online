import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { updateCustomerStatus } from '../../../services/adminUserService';
import AdminTable from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import CustomerDrawer from '../components/CustomerDrawer';
import KpiCard from '../components/KpiCard';

export default function CustomersPage() {
  const { customers } = useAdminData('30d');
  const { adminUser } = useAdminAuth();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleCloseDrawer = async (customer, newStatus) => {
    if (newStatus && customer && newStatus !== customer.status) {
      try {
        await updateCustomerStatus(customer.id, newStatus, adminUser);
      } catch (err) {
        console.error("Failed to update status", err);
        alert("Failed to update status");
      }
    } else if (!newStatus) {
      setSelectedCustomer(null);
    }
  };

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: 'name', label: 'Customer', render: (r) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 600 }}>{r.name.substring(0,2).toUpperCase()}</div>
        <div><div style={{ color: 'var(--cream)' }}>{r.name}</div><div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{r.email}</div></div>
      </div>
    )},
    { key: 'orders', label: 'Orders' },
    { key: 'totalSpent', label: 'Total Spent', render: (r) => `₹${r.totalSpent.toLocaleString()}` },
    { key: 'lastOrder', label: 'Last Order', render: (r) => new Date(r.lastOrder).toLocaleDateString() },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: 'Actions', render: (r) => <button onClick={(e) => { e.stopPropagation(); setSelectedCustomer(r); }} style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--cream)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>View</button> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Customers</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <KpiCard label="Total Customers" value={customers.length} icon="👥" loading={false} />
        <KpiCard label="Active Now" value={customers.filter(c => c.status === 'Active').length} icon="⚡" loading={false} />
        <KpiCard label="Avg Lifetime Value" value={Math.floor(customers.reduce((a,c)=>a+c.totalSpent,0)/customers.length)} icon="₹" loading={false} />
      </div>
      <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', maxWidth: '400px', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
      <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <AdminTable columns={columns} data={filtered} onRowClick={setSelectedCustomer} emptyMessage="No customers found." />
      </div>
      <CustomerDrawer customer={selectedCustomer} onClose={handleCloseDrawer} />
    </div>
  );
}
