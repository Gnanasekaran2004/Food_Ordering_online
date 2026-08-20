import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getUserOrders } from '../../services/orderService';
import { formatINR } from '../../utils/orderUtils';

/* ═══════════════════════════════════════════════════════════════
   SAVORIA — PROFILE PAGE
   Premium personal account dashboard.
═══════════════════════════════════════════════════════════════ */

/* ── Initials avatar ───────────────────────────────────────── */
function Avatar({ user, size = 80 }) {
  const initials = (user?.displayName || user?.username || '?')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: '1px solid rgba(201,168,76,0.3)',
      background: `radial-gradient(ellipse at 40% 30%, rgba(201,168,76,0.12) 0%, rgba(14,14,14,0.95) 70%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '0 0 0 4px rgba(201,168,76,0.05), 0 12px 40px rgba(0,0,0,0.5)',
    }}>
      <span style={{
        fontFamily: 'var(--font-label)', fontSize: size * 0.28,
        color: 'var(--gold)', letterSpacing: '0.1em',
      }}>{initials}</span>
    </div>
  );
}

/* ── Section card ──────────────────────────────────────────── */
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '3px',
      padding: 'clamp(1.5rem, 3vw, 2rem)',
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Editable field ────────────────────────────────────────── */
function ProfileField({ label, value, onChange, error, readOnly, type = 'text', hint }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{
        fontFamily: 'var(--font-label)', fontSize: '0.48rem', letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: error ? 'rgba(224,92,92,0.8)' : readOnly ? 'var(--muted-2)' : focused ? 'var(--gold)' : 'var(--muted)',
        transition: 'color 0.3s ease',
      }}>{label}</label>
      <input
        type={type} value={value} onChange={onChange} readOnly={readOnly}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '0.7rem 0', background: 'transparent', border: 'none',
          borderBottom: `1px solid ${error ? 'rgba(224,92,92,0.4)' : readOnly ? 'rgba(255,255,255,0.04)' : focused ? 'var(--gold)' : 'rgba(255,255,255,0.10)'}`,
          color: readOnly ? 'var(--muted)' : 'var(--cream)',
          fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 300,
          outline: 'none', transition: 'border-color 0.3s ease',
          cursor: readOnly ? 'default' : 'text',
        }}
      />
      {error && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'rgba(224,92,92,0.8)', fontWeight: 300, margin: 0 }}>{error}</p>}
      {hint && !error && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 300, margin: 0 }}>{hint}</p>}
    </div>
  );
}

/* ── Select field ──────────────────────────────────────────── */
function ProfileSelect({ label, value, onChange, options, readOnly }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{
        fontFamily: 'var(--font-label)', fontSize: '0.48rem', letterSpacing: '0.2em',
        textTransform: 'uppercase', color: readOnly ? 'var(--muted-2)' : 'var(--muted)',
      }}>{label}</label>
      <select
        value={value} onChange={onChange} disabled={readOnly}
        style={{
          width: '100%', padding: '0.7rem 0', background: 'transparent', border: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.10)',
          color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 300,
          outline: 'none', cursor: readOnly ? 'default' : 'pointer',
          appearance: 'none',
          backgroundImage: readOnly ? 'none' : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235C5147' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center',
          paddingRight: readOnly ? 0 : '1.5rem',
          opacity: readOnly ? 0.5 : 1,
        }}
      >
        {options.map(o => <option key={o.value} value={o.value} style={{ background: 'var(--surface-2)' }}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* ── Allergy chip toggle ────────────────────────────────────── */
const ALLERGEN_OPTIONS = ['Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy'];

function AllergyChips({ selected, onChange, readOnly }) {
  function toggle(item) {
    if (readOnly) return;
    onChange(selected.includes(item) ? selected.filter(a => a !== item) : [...selected, item]);
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.3rem' }}>
      {ALLERGEN_OPTIONS.map(a => (
        <button
          key={a} type="button" onClick={() => toggle(a)} disabled={readOnly}
          aria-pressed={selected.includes(a)}
          style={{
            padding: '0.35rem 0.8rem',
            border: `1px solid ${selected.includes(a) ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'}`,
            background: selected.includes(a) ? 'rgba(201,168,76,0.07)' : 'transparent',
            color: selected.includes(a) ? 'var(--gold)' : 'var(--muted)',
            fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 300,
            borderRadius: '2px', cursor: readOnly ? 'default' : 'pointer',
            transition: 'all 0.25s ease',
            opacity: readOnly ? 0.6 : 1,
          }}
        >{a}</button>
      ))}
    </div>
  );
}

/* ── Format date ────────────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [saveMsg, setSaveMsg]       = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const [errors, setErrors]         = useState({});
  const [orders, setOrders]         = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserOrders(user.uid).then(res => {
        setOrders(res);
        setOrdersLoading(false);
      }).catch(err => {
        console.error('Failed to load orders:', err);
        setOrdersLoading(false);
      });
    }
  }, [user]);

  // Draft form state (only used while editing)
  const [draft, setDraft] = useState({});

  function startEditing() {
    setDraft({
      displayName:      user.displayName,
      username:         user.username,
      phone:            user.phone || '',
      dietaryPreference: user.dietaryPreference || 'no-preference',
      allergies:        user.allergies || [],
      diningPreference: user.diningPreference || 'no-preference',
    });
    setErrors({});
    setSaveMsg('');
    setEditing(true);
  }

  function cancelEditing() { setEditing(false); setSaveMsg(''); }

  function setDraftField(key) { return (e) => setDraft(d => ({ ...d, [key]: e.target.value })); }

  function validateDraft() {
    const errs = {};
    if (!draft.displayName?.trim()) errs.displayName = 'Name is required.';
    if (!draft.username?.trim())    errs.username    = 'Username is required.';
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(draft.username.trim()))
      errs.username = 'Username: 3–20 chars, letters/numbers/underscores.';
    return errs;
  }

  async function handleSave(e) {
    e.preventDefault();
    const errs = validateDraft();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    setSaveMsg('');
    try {
      await updateProfile(draft);
      setEditing(false);
      setSaveMsg('Profile updated successfully.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg(err.code === 'auth/username-taken' ? 'That username is already taken.' : 'Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    navigate('/', { replace: true });
  }

  if (!user) return null; // ProtectedRoute handles redirect

  const displayData = editing ? draft : user;

  return (
    <main className="page-enter" aria-label="Your SAVORIA profile" style={{ background: 'var(--bg)', minHeight: '100svh', paddingTop: '73px' }}>
      {/* ── Hero header ──────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 6rem)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 50% 80% at 10% 50%, rgba(201,168,76,0.04) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="section-label" style={{ marginBottom: '1.5rem' }}>Your Savoria</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1.5rem, 4vw, 2.5rem)', flexWrap: 'wrap' }}
          >
            <Avatar user={user} size={80} />
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, marginBottom: '0.4rem',
              }}>{user.displayName}</h1>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.18em', color: 'var(--gold)', marginBottom: '0.3rem' }}>
                @{user.username}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 300 }}>
                {user.email} · Member since {formatDate(user.createdAt)}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 6rem)' }}>
        <form onSubmit={handleSave} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }} className="profile-grid">

            {/* ── Personal Information ─────────────────── */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <Card>
                <h2 style={{
                  fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.75rem',
                }}>Personal Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <ProfileField label="Full Name" value={displayData.displayName || ''} readOnly={!editing}
                    onChange={setDraftField('displayName')} error={errors.displayName} />
                  <ProfileField label="Username" value={displayData.username || ''} readOnly={!editing}
                    onChange={setDraftField('username')} error={errors.username} hint={editing ? 'Letters, numbers and underscores.' : ''} />
                  <ProfileField label="Email" value={user.email} readOnly hint="Email cannot be changed here." type="email" />
                  <ProfileField label="Phone" value={displayData.phone || ''} readOnly={!editing}
                    onChange={setDraftField('phone')} type="tel" hint={editing ? 'Optional.' : ''} />
                </div>
              </Card>
            </motion.div>

            {/* ── Dining Preferences ───────────────────── */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <Card>
                <h2 style={{
                  fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.75rem',
                }}>Dining Preferences</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <ProfileSelect
                    label="Dietary Preference"
                    value={displayData.dietaryPreference || 'no-preference'}
                    onChange={editing ? (e) => setDraft(d => ({ ...d, dietaryPreference: e.target.value })) : undefined}
                    readOnly={!editing}
                    options={[
                      { value: 'no-preference', label: 'No preference' },
                      { value: 'vegetarian',    label: 'Vegetarian' },
                      { value: 'vegan',         label: 'Vegan' },
                      { value: 'jain',          label: 'Jain' },
                    ]}
                  />
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-label)', fontSize: '0.48rem', letterSpacing: '0.2em',
                      textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.6rem',
                    }}>Allergies / Intolerances</p>
                    <AllergyChips
                      selected={displayData.allergies || []}
                      onChange={editing ? (v) => setDraft(d => ({ ...d, allergies: v })) : undefined}
                      readOnly={!editing}
                    />
                  </div>
                  <ProfileSelect
                    label="Seating Preference"
                    value={displayData.diningPreference || 'no-preference'}
                    onChange={editing ? (e) => setDraft(d => ({ ...d, diningPreference: e.target.value })) : undefined}
                    readOnly={!editing}
                    options={[
                      { value: 'no-preference', label: 'No preference' },
                      { value: 'window',        label: 'Window seating' },
                      { value: 'quiet',         label: 'Quiet area' },
                      { value: 'outdoor',       label: 'Outdoor seating' },
                    ]}
                  />
                </div>
              </Card>
            </motion.div>

            {/* ── Account Info ─────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <Card>
                <h2 style={{
                  fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem',
                }}>Account Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'Account Email', value: user.email },
                    { label: 'Username', value: `@${user.username}` },
                    { label: 'Member Since', value: formatDate(user.createdAt) },
                    { label: 'Last Updated', value: formatDate(user.updatedAt) },
                    { label: 'Authentication', value: 'Active' },
                  ].map(row => (
                    <div key={row.label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                      padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                      gap: '1rem',
                    }}>
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.48rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', flexShrink: 0 }}>
                        {row.label}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cream)', fontWeight: 300, textAlign: 'right' }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* ── Actions ──────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <Card>
                <h2 style={{
                  fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.75rem',
                }}>Account Actions</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {!editing ? (
                    <button type="button" onClick={startEditing} className="btn-gold" style={{ justifyContent: 'center' }}>
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <>
                      <button type="submit" className="btn-gold" style={{ justifyContent: 'center', opacity: saving ? 0.7 : 1 }} disabled={saving}>
                        <span>{saving ? 'Saving…' : 'Save Changes'}</span>
                      </button>
                      <button type="button" onClick={cancelEditing} className="btn-ghost" style={{ justifyContent: 'center' }} disabled={saving}>
                        <span>Cancel</span>
                      </button>
                    </>
                  )}

                  <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }} />

                  <Link to="/order" className="btn-ghost" style={{ justifyContent: 'center', textDecoration: 'none' }}>
                    <span>Browse Menu</span>
                  </Link>

                  <button
                    type="button" onClick={handleLogout} disabled={loggingOut}
                    style={{
                      background: 'transparent', border: '1px solid rgba(224,92,92,0.2)',
                      borderRadius: '2px', padding: '0.875rem 2.25rem',
                      color: 'rgba(224,92,92,0.7)', fontFamily: 'var(--font-label)', fontSize: '0.65rem',
                      letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer',
                      transition: 'all 0.3s ease', opacity: loggingOut ? 0.6 : 1,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(224,92,92,0.5)'; e.currentTarget.style.color = 'rgba(224,92,92,1)'; e.currentTarget.style.background = 'rgba(224,92,92,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(224,92,92,0.2)'; e.currentTarget.style.color = 'rgba(224,92,92,0.7)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span>{loggingOut ? 'Signing out…' : 'Sign Out'}</span>
                  </button>
                </div>

                {/* Save feedback */}
                <AnimatePresence>
                  {saveMsg && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 300, marginTop: '1rem',
                        color: saveMsg.includes('success') ? 'rgba(100,200,120,0.85)' : 'rgba(224,92,92,0.8)',
                      }}>
                      {saveMsg}
                    </motion.p>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          </div>
        </form>
      </section>


      {/* ── Order History ────────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 6rem) clamp(2rem, 5vw, 4rem)' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <Card>
            <h2 style={{
              fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.75rem',
            }}>Order History</h2>
            
            {ordersLoading ? (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>
                Loading orders...
              </p>
            ) : orders.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>
                You have not placed any orders yet.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th style={{ padding: '0.75rem 0', fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>Order ID</th>
                      <th style={{ padding: '0.75rem 0', fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>Date</th>
                      <th style={{ padding: '0.75rem 0', fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>Items</th>
                      <th style={{ padding: '0.75rem 0', fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>Total</th>
                      <th style={{ padding: '0.75rem 0', fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '1rem 0', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cream)', fontWeight: 300 }}>{order.id}</td>
                        <td style={{ padding: '1rem 0', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 300 }}>{order.date}</td>
                        <td style={{ padding: '1rem 0', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cream)', fontWeight: 300 }}>{order.items?.length || 0}</td>
                        <td style={{ padding: '1rem 0', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cream)' }}>₹{formatINR(order.total)}</td>
                        <td style={{ padding: '1rem 0' }}>
                          <span style={{ 
                            padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontFamily: 'var(--font-body)',
                            background: order.orderStatus === 'Completed' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(201, 168, 76, 0.1)',
                            color: order.orderStatus === 'Completed' ? '#4caf50' : 'var(--gold)',
                          }}>
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      </section>


      <style>{`
        @media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}
