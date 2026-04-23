import api from './api';

class AuthService {
  // Register new user
  async register(email, password, role) {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        role // 'employee' or 'volunteer'
      });
      
      if (response.access_token) {
        localStorage.setItem('sahara_token', response.access_token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      if (response.access_token) {
        localStorage.setItem('sahara_token', response.access_token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('sahara_token');
  }

  // Get current token
  getToken() {
    return localStorage.getItem('sahara_token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Simple JWT token validation (you might want to add more sophisticated validation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  // Get user info from token
  getUserFromToken() {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        user_id: payload.sub,
        role: payload.role
      };
    } catch (error) {
      return null;
    }
  }
}

const authService = new AuthService();
export default authService;
