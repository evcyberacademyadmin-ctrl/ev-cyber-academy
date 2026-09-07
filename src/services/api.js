const API_BASE = '/api';

export async function fetchPublicConfig() {
  const res = await fetch(`${API_BASE}/public/config`);
  if (!res.ok) {
    throw new Error('Failed to fetch public configuration');
  }
  return res.json();
}

export async function registerWebinar(formData) {
  const res = await fetch(`${API_BASE}/public/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  return data;
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

export async function fetchAdminStats(token) {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
}

export async function fetchRegistrations(token, search = '', status = 'All') {
  const url = new URL(`${window.location.origin}${API_BASE}/admin/registrations`);
  if (search) url.searchParams.append('search', search);
  if (status) url.searchParams.append('status', status);

  const res = await fetch(url.toString(), {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch registrations');
  return res.json();
}

export async function updateRegistrationStatus(token, id, status, notes) {
  const res = await fetch(`${API_BASE}/admin/registrations/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status, notes })
  });
  if (!res.ok) throw new Error('Failed to update registration');
  return res.json();
}

export async function deleteRegistration(token, id) {
  const res = await fetch(`${API_BASE}/admin/registrations/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete registration');
  return res.json();
}

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
