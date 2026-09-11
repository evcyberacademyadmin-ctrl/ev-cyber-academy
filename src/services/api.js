const API_BASE = '/api';

export async function fetchPublicConfig() {
  const res = await fetch(`${API_BASE}/public/config`);
  if (!res.ok) {
    throw new Error('Failed to fetch public configuration');
  }
  return res.json();
}

export async function fetchPublicWebinars() {
  const res = await fetch(`${API_BASE}/public/webinars`);
  if (!res.ok) {
    throw new Error('Failed to fetch public webinars');
  }
  return res.json();
}

export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }
  return data;
}

// Multi-Webinar Management APIs
export async function fetchAdminWebinars(token) {
  const res = await fetch(`${API_BASE}/admin/webinars`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch webinars');
  return res.json();
}

export async function createAdminWebinar(token, webinarData) {
  const res = await fetch(`${API_BASE}/admin/webinars`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(webinarData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create webinar');
  return data;
}

export async function updateAdminWebinar(token, id, webinarData) {
  const res = await fetch(`${API_BASE}/admin/webinars/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(webinarData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update webinar');
  return data;
}

export async function toggleWebinarPin(token, id, is_pinned) {
  const res = await fetch(`${API_BASE}/admin/webinars/${id}/pin`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ is_pinned })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to toggle pin');
  return data;
}

export async function toggleWebinarStatus(token, id, status) {
  const res = await fetch(`${API_BASE}/admin/webinars/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to toggle status');
  return data;
}

export async function deleteAdminWebinar(token, id) {
  const res = await fetch(`${API_BASE}/admin/webinars/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete webinar');
  return data;
}

// Global Config APIs
export async function updateWebinarConfig(token, configData) {
  const res = await fetch(`${API_BASE}/admin/config/webinar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(configData)
  });
  if (!res.ok) throw new Error('Failed to update webinar configuration');
  return res.json();
}

export async function updateFaqsConfig(token, faqs) {
  const res = await fetch(`${API_BASE}/admin/config/faqs`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ faqs })
  });
  if (!res.ok) throw new Error('Failed to update FAQs');
  return res.json();
}

export async function updateResourcesConfig(token, resources) {
  const res = await fetch(`${API_BASE}/admin/config/resources`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ resources })
  });
  if (!res.ok) throw new Error('Failed to update resources');
  return res.json();
}

export async function updateFormFieldsConfig(token, fields) {
  const res = await fetch(`${API_BASE}/admin/config/form-fields`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ fields })
  });
  if (!res.ok) throw new Error('Failed to update form fields');
  return res.json();
}
