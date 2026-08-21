import React, { useState, useEffect } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { updateRestaurantConfig } from '../../../services/adminSettingsService';

export default function SettingsPage() {
  const { settings } = useAdminData();
  const { adminUser } = useAdminAuth();
  
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: 'SAVORIA',
    tagline: 'A Culinary Journey of Excellence',
    description: 'Experience fine dining at its best.',
    hours: {
      Monday: { open: '17:00', close: '23:00' },
      Tuesday: { open: '17:00', close: '23:00' },
      Wednesday: { open: '17:00', close: '23:00' },
      Thursday: { open: '17:00', close: '23:00' },
      Friday: { open: '17:00', close: '23:00' },
      Saturday: { open: '17:00', close: '23:00' },
      Sunday: { open: '17:00', close: '23:00' },
    },
    notifications: true,
    sound: true
  });

  useEffect(() => {
    if (settings) {
      setFormData(prev => ({ ...prev, ...settings }));
    }
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateRestaurantConfig(formData, adminUser);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving config:", err);
      alert("Failed to save settings");
    }
  };

  const handleHourChange = (day, type, value) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [type]: value
        }
      }
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Settings</h2>
      </div>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--gold)', fontSize: '1.1rem' }}>Restaurant Profile</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Restaurant Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Tagline</label>
              <input type="text" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Description</label>
              <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none', resize: 'vertical' }} />
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--gold)', fontSize: '1.1rem' }}>Business Hours</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(formData.hours).map(([day, times]) => (
              <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ width: 100, color: 'var(--cream)', fontSize: '0.9rem' }}>{day}</span>
                <input type="time" value={times.open} onChange={e => handleHourChange(day, 'open', e.target.value)} style={{ padding: '8px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '4px', outline: 'none' }} />
                <span style={{ color: 'var(--muted)' }}>to</span>
                <input type="time" value={times.close} onChange={e => handleHourChange(day, 'close', e.target.value)} style={{ padding: '8px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '4px', outline: 'none' }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--gold)', fontSize: '1.1rem' }}>Admin Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--cream)', cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.notifications} onChange={e => setFormData({...formData, notifications: e.target.checked})} /> Enable Email Notifications
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--cream)', cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.sound} onChange={e => setFormData({...formData, sound: e.target.checked})} /> Enable Order Alerts Sound
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
