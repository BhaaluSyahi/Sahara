import api from './api';

class RequestService {
  // Create a new request
  async createRequest(requestData) {
    try {
      return await api.post('/requests', requestData);
    } catch (error) {
      throw error;
    }
  }

  // Get request by ID
  async getRequest(requestId) {
    try {
      return await api.get(`/requests/${requestId}`);
    } catch (error) {
      throw error;
    }
  }

  // Update request
  async updateRequest(requestId, requestData) {
    try {
      return await api.put(`/requests/${requestId}`, requestData);
    } catch (error) {
      throw error;
    }
  }

  // Delete request
  async deleteRequest(requestId) {
    try {
      return await api.delete(`/requests/${requestId}`);
    } catch (error) {
      throw error;
    }
  }

  // Get all requests (with optional filters)
  async getRequests(filters = {}) {
    try {
      return await api.get('/requests', filters);
    } catch (error) {
      throw error;
    }
  }

  // Get current user's requests
  async getMyRequests(status = null, title = null) {
    try {
      const params = {};
      if (status) params.status = status;
      if (title) params.title = title;
      return await api.get('/requests/my', params);
    } catch (error) {
      throw error;
    }
  }

  // Join a request
  async joinRequest(requestId) {
    try {
      return await api.post(`/requests/${requestId}/join`);
    } catch (error) {
      throw error;
    }
  }

  // Retry a failed request
  async retryRequest(requestId, category) {
    try {
      return await api.post(`/requests/${requestId}/retry`, { category });
    } catch (error) {
      throw error;
    }
  }

  // Get request participants
  async getRequestParticipants(requestId) {
    try {
      return await api.get(`/requests/${requestId}/participants`);
    } catch (error) {
      throw error;
    }
  }

  // Get requests by category
  async getRequestsByCategory(category) {
    try {
      return await api.get('/requests', { category });
    } catch (error) {
      throw error;
    }
  }

  // Search requests
  async searchRequests(query) {
    try {
      return await api.get('/requests/search', { q: query });
    } catch (error) {
      throw error;
    }
  }
}

export default new RequestService();
