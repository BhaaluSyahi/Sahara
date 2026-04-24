import api from './api';

class OrganizationService {
  // Create organization
  async createOrganization(orgData) {
    try {
      return await api.post('/organizations', orgData);
    } catch (error) {
      throw error;
    }
  }

  // Get organization by ID
  async getOrganization(orgId) {
    try {
      return await api.get(`/organizations/${orgId}`);
    } catch (error) {
      throw error;
    }
  }

  // Update organization
  async updateOrganization(orgId, orgData) {
    try {
      return await api.put(`/organizations/${orgId}`, orgData);
    } catch (error) {
      throw error;
    }
  }

  // Get all organizations
  async getOrganizations() {
    try {
      return await api.get('/organizations');
    } catch (error) {
      throw error;
    }
  }

  // Upload document to organization
  async uploadDocument(orgId, file) {
    try {
      return await api.upload(`/organizations/${orgId}/documents`, file);
    } catch (error) {
      throw error;
    }
  }

  // Add member to organization
  async addMember(orgId, memberData) {
    try {
      return await api.post(`/organizations/${orgId}/members`, memberData);
    } catch (error) {
      throw error;
    }
  }

  // Get organization members
  async getMembers(orgId) {
    try {
      return await api.get(`/organizations/${orgId}/members`);
    } catch (error) {
      throw error;
    }
  }

  // Get organizations created by current user (employee)
  async getMyOrganizations() {
    try {
      return await api.get('/organizations/my');
    } catch (error) {
      throw error;
    }
  }
}

export default new OrganizationService();
