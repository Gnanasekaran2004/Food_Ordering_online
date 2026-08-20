import React, { useState } from 'react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Settings</h2>
        <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Settings will persist once Firebase is connected</span>
      </div>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--gold)', fontSize: '1.1rem' }}>Restaurant Profile</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Restaurant Name</label>
              <input type="text" defaultValue="SAVORIA" style={{ width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Tagline</label>
              <input type="text" defaultValue="A Culinary Journey of Excellence" style={{ width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Description</label>
              <textarea rows={4} defaultValue="Experience fine dining at its best." style={{ width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none', resize: 'vertical' }} />
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--gold)', fontSize: '1.1rem' }}>Business Hours</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ width: 100, color: 'var(--cream)', fontSize: '0.9rem' }}>{d}</span>
                <input type="time" defaultValue="17:00" style={{ padding: '8px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '4px', outline: 'none' }} />
                <span style={{ color: 'var(--muted)' }}>to</span>
                <input type="time" defaultValue="23:00" style={{ padding: '8px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '4px', outline: 'none' }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--gold)', fontSize: '1.1rem' }}>Admin Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--cream)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Enable Email Notifications
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--cream)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Enable Order Alerts Sound
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button type="submit" style={{ background: 'var(--gold)', color: 'black', border: 'none', padding: '12px 32px', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Save Changes</button>
          {saved && <span style={{ color: '#10b981', fontSize: '0.9rem' }}>✓ Changes saved successfully</span>}
        </div>
      </form>
    </div>
  );
}
