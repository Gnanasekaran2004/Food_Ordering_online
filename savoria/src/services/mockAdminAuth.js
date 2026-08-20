export const SESSION_KEY = 'savoria_admin_session_v1';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function adminLogin({ email, password }) {
  await delay(500);
  if (email === 'admin@savoria.com' && password === 'savoria-admin-2024') {
    const adminUser = { email, role: 'admin', name: 'Admin User' };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
    return adminUser;
  }
  const err = new Error('Invalid credentials');
  err.code = 'admin/invalid-credential';
  throw err;
}

export async function adminLogout() {
  await delay(500);
  sessionStorage.removeItem(SESSION_KEY);
}

export function getAdminSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch (e) {
    return null;
  }
}
