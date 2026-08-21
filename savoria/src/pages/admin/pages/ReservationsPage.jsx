import React from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { updateReservationStatus } from '../../../services/adminReservationService';
import AdminTable from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import KpiCard from '../components/KpiCard';

export default function ReservationsPage() {
  const { reservations } = useAdminData('30d');
  const { adminUser } = useAdminAuth();

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateReservationStatus(id, newStatus, adminUser);
    } catch (err) {
      console.error("Failed to update reservation", err);
    }
  };

  const columns = [
    { key: 'id', label: 'Res ID' },
    { key: 'name', label: 'Name' },
    { key: 'party', label: 'Party Size' },
    { key: 'date', label: 'Date', render: r => new Date(r.date).toLocaleDateString() },
    { key: 'time', label: 'Time' },
    { key: 'status', label: 'Status', render: r => (
      <select 
        value={r.status} 
        onChange={e => handleStatusChange(r.id, e.target.value)}
        style={{ background: 'var(--surface)', color: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '4px', padding: '4px 8px' }}
      >
        <option value="Upcoming">Upcoming</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    )},
    { key: 'notes', label: 'Notes', render: r => <span style={{ color: 'var(--muted)' }}>{r.notes || '-'}</span> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Reservations</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <KpiCard label="Total" value={reservations.length} icon="📅" />
        <KpiCard label="Upcoming" value={reservations.filter(r=>r.status==='Upcoming').length} icon="⏳" />
        <KpiCard label="Completed" value={reservations.filter(r=>r.status==='Completed').length} icon="✅" />
        <KpiCard label="Cancelled" value={reservations.filter(r=>r.status==='Cancelled').length} icon="✕" trendPositive={false} />
      </div>
      <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <AdminTable columns={columns} data={reservations} emptyMessage="No reservations found." />
      </div>
    </div>
  );
}
