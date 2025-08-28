import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.Authorization;
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse> {
    return this.api.post('/auth/login', { email, password });
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    languagePreference?: string;
  }): Promise<ApiResponse> {
    return this.api.post('/auth/register', userData);
  }

  async logout(): Promise<ApiResponse> {
    return this.api.post('/auth/logout');
  }

  async verifyToken(): Promise<ApiResponse> {
    return this.api.get('/auth/verify');
  }

  async getProfile(): Promise<ApiResponse> {
    return this.api.get('/auth/profile');
  }

  async updateProfile(userData: any): Promise<ApiResponse> {
    return this.api.put('/auth/profile', userData);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return this.api.put('/auth/change-password', { currentPassword, newPassword });
  }

  // Services endpoints
  async getServices(): Promise<ApiResponse> {
    return this.api.get('/services');
  }

  async getServiceById(id: string): Promise<ApiResponse> {
    return this.api.get(`/services/${id}`);
  }

  async getAvailableSlots(serviceId: string, date: string): Promise<ApiResponse> {
    return this.api.get(`/services/${serviceId}/available-slots?date=${date}`);
  }

  async getServiceCategories(): Promise<ApiResponse> {
    return this.api.get('/services/categories/list');
  }

  // Appointments endpoints
  async bookAppointment(appointmentData: {
    serviceId: number;
    appointmentDate: string;
    appointmentTime: string;
    notes?: string;
  }): Promise<ApiResponse> {
    return this.api.post('/appointments/book', appointmentData);
  }

  async getMyAppointments(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    return this.api.get(`/appointments/my-appointments?${queryParams.toString()}`);
  }

  async getAppointmentById(id: string): Promise<ApiResponse> {
    return this.api.get(`/appointments/${id}`);
  }

  async cancelAppointment(id: string): Promise<ApiResponse> {
    return this.api.delete(`/appointments/${id}`);
  }

  async rescheduleAppointment(id: string, appointmentDate: string, appointmentTime: string): Promise<ApiResponse> {
    return this.api.put(`/appointments/${id}/reschedule`, { appointmentDate, appointmentTime });
  }

  async submitAppointmentFeedback(id: string, rating: number, comment?: string): Promise<ApiResponse> {
    return this.api.post(`/appointments/${id}/feedback`, { rating, comment });
  }

  // Queue endpoints
  async getQueueServices(): Promise<ApiResponse> {
    return this.api.get('/queue/services');
  }

  async joinQueue(serviceId: number, priority?: number, notes?: string): Promise<ApiResponse> {
    return this.api.post('/queue/join', { serviceId, priority, notes });
  }

  async getQueueStatus(serviceId: string, date?: string): Promise<ApiResponse> {
    const queryParams = date ? `?date=${date}` : '';
    return this.api.get(`/queue/status/${serviceId}${queryParams}`);
  }

  async getMyTicket(serviceId?: string): Promise<ApiResponse> {
    const queryParams = serviceId ? `?serviceId=${serviceId}` : '';
    return this.api.get(`/queue/my-ticket${queryParams}`);
  }

  async cancelTicket(ticketId: string): Promise<ApiResponse> {
    return this.api.delete(`/queue/my-ticket/${ticketId}`);
  }

  // Staff/Admin queue management
  async callNextCustomer(serviceId: string): Promise<ApiResponse> {
    return this.api.post(`/queue/call-next/${serviceId}`);
  }

  async serveCustomer(ticketId: string): Promise<ApiResponse> {
    return this.api.put(`/queue/serve/${ticketId}`);
  }

  async completeService(ticketId: string, notes?: string): Promise<ApiResponse> {
    return this.api.put(`/queue/complete/${ticketId}`, { notes });
  }

  async skipCustomer(ticketId: string, reason?: string): Promise<ApiResponse> {
    return this.api.put(`/queue/skip/${ticketId}`, { reason });
  }

  async getQueueAnalytics(serviceId: string, startDate?: string, endDate?: string): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    return this.api.get(`/queue/analytics/${serviceId}?${queryParams.toString()}`);
  }

  // Admin endpoints
  async getAdminDashboard(): Promise<ApiResponse> {
    return this.api.get('/admin/dashboard');
  }
}

export const apiService = new ApiService();
