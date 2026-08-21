import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MenuDrawer({ item, onClose, onSave, onDelete }) {
  const isNew = item && !item.id;
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Mains',
    price: '',
    description: '',
    image: '',
    available: true,
    featured: false,
    chefSpecial: false,
    dietaryTags: '',
    spiceLevel: 'None'
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || 'Mains',
        price: item.price || '',
        description: item.description || '',
        image: item.image || '',
        available: item.available !== undefined ? item.available : true,
        featured: item.featured || false,
        chefSpecial: item.chefSpecial || false,
        dietaryTags: (item.dietaryTags || []).join(', '),
        spiceLevel: item.spiceLevel || 'None'
      });
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      price: Number(formData.price),
      dietaryTags: formData.dietaryTags.split(',').map(s => s.trim()).filter(Boolean)
    };
    onSave(item.id, dataToSave);
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', background: 'var(--surface-3)', 
    border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '6px',
    outline: 'none', boxSizing: 'border-box'
  };

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: '450px', maxWidth: '100%',
            background: 'var(--bg)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column'
          }}
        >
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>{isNew ? 'Add Menu Item' : 'Edit Menu Item'}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '8px', fontSize: '0.85rem' }}>Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '8px', fontSize: '0.85rem' }}>Category *</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={inputStyle}>
                    <option value="Starters">Starters</option>
                    <option value="Mains">Mains</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '8px', fontSize: '0.85rem' }}>Price (₹) *</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '8px', fontSize: '0.85rem' }}>Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, resize: 'vertical'}} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '8px', fontSize: '0.85rem' }}>Image Path/URL</label>
                <input type="text" placeholder="/assets/image.webp" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '8px', fontSize: '0.85rem' }}>Spice Level</label>
                  <select value={formData.spiceLevel} onChange={e => setFormData({...formData, spiceLevel: e.target.value})} style={inputStyle}>
                    <option value="None">None</option>
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Hot">Hot</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '8px', fontSize: '0.85rem' }}>Dietary Tags (comma sep)</label>
                  <input type="text" placeholder="Gluten-Free, Vegan" value={formData.dietaryTags} onChange={e => setFormData({...formData, dietaryTags: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '24px', padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cream)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.available} onChange={e => setFormData({...formData, available: e.target.checked})} />
                  Available
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cream)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
                  Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cream)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.chefSpecial} onChange={e => setFormData({...formData, chefSpecial: e.target.checked})} />
                  Chef Special
                </label>
              </div>
            </div>
            <div style={{ padding: '24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              {!isNew ? (
                <button type="button" onClick={() => onDelete(item.id)} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
              ) : <div></div>}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={onClose} style={{ background: 'transparent', color: 'var(--cream)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: 'var(--gold)', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Save</button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
