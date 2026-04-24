import api from './api';

class VolunteerService {
  // Get volunteer profile
  async getProfile() {
    try {
      return await api.get('/volunteers/profile');
    } catch (error) {
      throw error;
    }
  }

  // Create or update volunteer profile
  async createProfile(profileData) {
    try {
      return await api.post('/volunteers/profile', profileData);
    } catch (error) {
      throw error;
    }
  }

  // Update volunteer profile
  async updateProfile(profileData) {
    try {
      return await api.put('/volunteers/profile', profileData);
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

  // Get requests the volunteer has joined
  async getMyRequests(status = null) {
    try {
      const params = status ? { status } : {};
      return await api.get('/requests/my', params);
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

  // Create a rating
  async createRating(ratingData) {
    try {
      return await api.post('/ratings', ratingData);
    } catch (error) {
      throw error;
    }
  }

  // Get ratings for a target
  async getTargetRatings(targetType, targetId) {
    try {
      return await api.get(`/ratings/${targetType}/${targetId}`);
    } catch (error) {
      throw error;
    }
  }
}

export default new VolunteerService();
