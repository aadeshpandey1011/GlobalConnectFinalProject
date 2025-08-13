// authUtils.js - Create this utility file for consistent auth handling

class AuthService {
  constructor() {
    this.baseURL = 'https://globalconnectfinalproject.onrender.com/api';
    this.isRefreshing = false;
  }

  // Get auth data from localStorage
  getAuthData() {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    const isLogin = localStorage.getItem('isLogin');
    
    return {
      token,
      userInfo: userInfo ? JSON.parse(userInfo) : null,
      isLogin: isLogin === 'true'
    };
  }

  // Set auth data consistently
  setAuthData(token, userInfo) {
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    localStorage.setItem('isLogin', 'true');
  }

  // Clear auth data
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isLogin');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const { token, isLogin } = this.getAuthData();
    return !!(token && isLogin);
  }

  // Create axios instance with consistent headers
  createAuthenticatedRequest() {
    const { token } = this.getAuthData();
    
    const config = {
      withCredentials: true, // For cookie-based auth
    };

    // Add Authorization header if token exists
    if (token) {
      config.headers = {
        'Authorization': `Bearer ${token}`
      };
    }

    return config;
  }

  // Make authenticated API call
  async makeAuthenticatedRequest(method, endpoint, data = null) {
    const config = this.createAuthenticatedRequest();
    config.method = method;
    config.url = `${this.baseURL}${endpoint}`;
    
    if (data) {
      config.data = data;
    }

    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      // Handle 401 errors by attempting to refresh or redirect
      if (error.response?.status === 401) {
        await this.handleAuthError();
        throw error;
      }
      throw error;
    }
  }

  // Handle authentication errors
  async handleAuthError() {
    console.warn('Authentication failed, clearing auth data');
    this.clearAuthData();
    
    // Don't redirect immediately, let the component handle it
    return false;
  }

  // Validate current session
  async validateSession() {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      const response = await this.makeAuthenticatedRequest('GET', '/auth/self');
      // Update user info if successful
      this.setAuthData(this.getAuthData().token, response.data.user);
      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }

  // Login method
  async login(credentials) {
    try {
      const response = await axios.post(`${this.baseURL}/auth/login`, credentials, {
        withCredentials: true
      });
      
      this.setAuthData(response.data.token, response.data.userExist);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Logout method
  async logout() {
    try {
      await axios.post(`${this.baseURL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      this.clearAuthData();
    }
  }
}

// Create singleton instance
const authService = new AuthService();
export default authService;