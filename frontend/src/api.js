const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const user = sessionStorage.getItem('user');
  const role = user ? JSON.parse(user).role : '';
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', 'x-user-role': role },
    ...options,
  });
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getCategories: () => request('/api/categories'),
  getCategory: (id) => request(`/api/categories/${id}`),
  createCategory: (body) => request('/api/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id, body) => request(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id) => request(`/api/categories/${id}`, { method: 'DELETE' }),

  getAiTools: (categoryId) => request(`/api/ai-tools${categoryId ? `?category_id=${categoryId}` : ''}`),
  createAiTool: (body) => request('/api/ai-tools', { method: 'POST', body: JSON.stringify(body) }),
  updateAiTool: (id, body) => request(`/api/ai-tools/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAiTool: (id) => request(`/api/ai-tools/${id}`, { method: 'DELETE' }),

  login: (body) => request('/api/login', { method: 'POST', body: JSON.stringify(body) }),
};
