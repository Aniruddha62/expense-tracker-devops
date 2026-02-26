import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080' });

export const expenseApi = {
  getAll:       ()          => api.get('/api/expenses'),
  getById:      (id)        => api.get('/api/expenses/' + id),
  create:       (data)      => api.post('/api/expenses', data),
  update:       (id, data)  => api.put('/api/expenses/' + id, data),
  delete:       (id)        => api.delete('/api/expenses/' + id),
  getByCategory:(cat)       => api.get('/api/expenses/category/' + cat),
  search:       (kw)        => api.get('/api/expenses/search?keyword=' + kw),
  dashboard:    ()          => api.get('/api/expenses/dashboard'),
  summary:      (y, m)      => api.get('/api/expenses/summary?year=' + y + '&month=' + m),
};

export const budgetApi = {
  save:      (data)      => api.post('/api/budgets', data),
  get:       (m, y)      => api.get('/api/budgets?month=' + m + '&year=' + y),
  vsActual:  (m, y)      => api.get('/api/budgets/vs-actual?month=' + m + '&year=' + y),
  delete:    (id)        => api.delete('/api/budgets/' + id),
};
