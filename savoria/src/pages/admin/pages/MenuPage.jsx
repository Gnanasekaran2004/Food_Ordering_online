import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '../../../services/adminMenuService';
import MenuDrawer from '../components/MenuDrawer';
import { dishes } from '../../../data/menuData';

export default function MenuPage() {
  const { menuItems } = useAdminData('30d');
  const { adminUser } = useAdminAuth();
  const [search, setSearch] = useState('');
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const handleSeedMenu = async () => {
    if (window.confirm("Seed menu items to Firebase? This will take a few seconds.")) {
      try {
        for (const dish of dishes) {
          await createMenuItem({
            name: dish.name,
            category: dish.category,
            price: dish.price,
            description: dish.description,
            image: dish.image,
            available: dish.available,
            featured: dish.featured,
            chefSpecial: dish.chefSpecial,
            dietaryTags: dish.dietaryTags,
            spiceLevel: dish.spiceLevel || 'None'
          }, adminUser);
        }
        alert("Menu seeded successfully!");
      } catch (err) {
        console.error("Failed to seed menu", err);
        alert("Failed to seed menu");
      }
    }
  };

  const toggleAvail = async (id, currentAvail) => {
    try {
      await updateMenuItem(id, { available: !currentAvail }, adminUser);
    } catch (err) {
      console.error("Failed to toggle availability", err);
    }
  };

  const handleSave = async (id, data) => {
    try {
      if (id) {
        await updateMenuItem(id, data, adminUser);
      } else {
        await createMenuItem(data, adminUser);
      }
      setIsDrawerOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error("Failed to save menu item", err);
      alert("Failed to save menu item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        const item = menuItems.find(i => i.id === id);
        await deleteMenuItem(id, item?.name, adminUser);
        setIsDrawerOpen(false);
        setSelectedItem(null);
      } catch (err) {
        console.error("Failed to delete menu item", err);
      }
    }
  };

  const openNew = () => {
    setSelectedItem({ name: '', category: 'Mains', price: '', description: '', available: true });
    setIsDrawerOpen(true);
  };

  const openEdit = (item) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const filtered = menuItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Menu Management</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          {menuItems.length === 0 && (
            <button onClick={handleSeedMenu} style={{ background: 'var(--surface-3)', color: 'var(--cream)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
              Seed Database
            </button>
          )}
          <button onClick={openNew} style={{ background: 'var(--gold)', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            + Add Item
          </button>
        </div>
      </div>
      <input type="text" placeholder="Search menu items..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', maxWidth: '400px', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filtered.map(item => (
          <div key={item.id} style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', cursor: 'pointer' }} onClick={() => openEdit(item)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', color: 'var(--cream)', fontSize: '1.1rem' }}>{item.name}</h3>
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{item.category}</span>
              </div>
              <div style={{ color: 'var(--gold)', fontWeight: 600 }}>₹{item.price.toLocaleString()}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {item.featured && <span style={{ padding: '4px 8px', background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>Featured</span>}
              {item.chefSpecial && <span style={{ padding: '4px 8px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>Chef Special</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <div><div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Orders (30d)</div><div style={{ color: 'var(--cream)' }}>{item.orders || 0}</div></div>
              <div><div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Revenue (30d)</div><div style={{ color: 'var(--cream)' }}>₹{(item.revenue || 0).toLocaleString()}</div></div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: item.available ? '#10b981' : '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>{item.available ? 'Available' : 'Unavailable'}</span>
              <button onClick={(e) => { e.stopPropagation(); toggleAvail(item.id, item.available); }} style={{
                background: item.available ? 'transparent' : 'var(--gold)',
                color: item.available ? 'var(--muted)' : 'black',
                border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
              }}>
                {item.available ? 'Mark Unavailable' : 'Mark Available'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isDrawerOpen && (
        <MenuDrawer 
          item={selectedItem} 
          onClose={() => { setIsDrawerOpen(false); setSelectedItem(null); }} 
          onSave={handleSave} 
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
