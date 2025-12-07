import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// RFP APIs
export const rfpAPI = {
  create: (description) => api.post('/rfps', { description }),
  getAll: () => api.get('/rfps'),
  getById: (id) => api.get(`/rfps/${id}`),
  update: (id, data) => api.put(`/rfps/${id}`, data),
  delete: (id) => api.delete(`/rfps/${id}`),
  send: (rfpId, vendorIds) => api.post('/rfps/send', { rfpId, vendorIds }),
  getVendors: (id) => api.get(`/rfps/${id}/vendors`),
  getProposals: (id) => api.get(`/rfps/${id}/proposals`),
  compare: (id) => api.get(`/rfps/${id}/compare`),
};

// Vendor APIs
export const vendorAPI = {
  create: (data) => api.post('/vendors', data),
  getAll: () => api.get('/vendors'),
  getById: (id) => api.get(`/vendors/${id}`),
  update: (id, data) => api.put(`/vendors/${id}`, data),
  delete: (id) => api.delete(`/vendors/${id}`),
};

// Proposal APIs
export const proposalAPI = {
  create: (data) => api.post('/proposals', data),
  getByRfp: (rfpId) => api.get(`/proposals/rfp/${rfpId}`),
  getById: (id) => api.get(`/proposals/${id}`),
  process: (id) => api.post(`/proposals/${id}/process`),
  delete: (id) => api.delete(`/proposals/${id}`),
};

// Email APIs
export const emailAPI = {
  testConnection: () => api.get('/email/test-connection'),
  handleInbound: (data) => api.post('/email/inbound', data),
};

export default api;
