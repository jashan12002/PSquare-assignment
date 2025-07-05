import axios from 'axios';

const API_URL = 'https://psquare-backend-3p30.onrender.com/api';
const BASE_URL = 'https://psquare-backend-3p30.onrender.com';

// const API_URL = 'http://localhost:5000/api';
// const BASE_URL = 'http://localhost:5000';

const apiService = {
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async login(userData) {
    const response = await axios.post(`${API_URL}/users/login`, userData);
    return response.data;
  },

  async register(userData) {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  },

  async getUserProfile() {
    const headers = this.getAuthHeader();
    console.log("headers",headers);
    const response = await axios.get(`${API_URL}/users/profile`, { 
      headers 
    });
    return response.data;
  },

  async getCandidates() {
    const headers = this.getAuthHeader();
    const response = await axios.get(`${API_URL}/candidates`, { 
      headers 
    });
    return response.data;
  },

  async getCandidateById(id) {
    const headers = this.getAuthHeader();
    const response = await axios.get(`${API_URL}/candidates/${id}`, { 
      headers 
    });
    return response.data;
  },

  async createCandidate(candidateData) {
    const headers = this.getAuthHeader();
    
    if (candidateData.resume instanceof File) {
      const formData = new FormData();
      
      Object.keys(candidateData).forEach(key => {
        if (key === 'resume') {
          formData.append('resume', candidateData.resume);
        } else {
          formData.append(key, candidateData[key]);
        }
      });
      
      const response = await axios.post(`${API_URL}/candidates`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } else {
      const response = await axios.post(`${API_URL}/candidates`, candidateData, {
        headers
      });
      return response.data;
    }
  },

  async updateCandidateStatus(id, status) {
    const headers = this.getAuthHeader();
    const response = await axios.put(`${API_URL}/candidates/${id}`, { status }, {
      headers
    });
    return response.data;
  },

  async deleteCandidate(id) {
    const headers = this.getAuthHeader();
    const response = await axios.delete(`${API_URL}/candidates/${id}`, {
      headers
    });
    return response.data;
  },

  async moveToEmployee(id) {
    const headers = this.getAuthHeader();
    const response = await axios.post(`${API_URL}/candidates/${id}/hire`, {}, {
      headers
    });
    return response.data;
  },

  async downloadResume(id) {
    const headers = this.getAuthHeader();
    const response = await axios.get(`${API_URL}/candidates/${id}/resume`, {
      headers,
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    const link = document.createElement('a');
    link.href = url;
    
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `resume-${id}.pdf`;
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return true;
  },

  async getEmployees() {
    const headers = this.getAuthHeader();
    const response = await axios.get(`${API_URL}/employees`, { 
      headers 
    });
    return response.data;
  },

  async getEmployeeById(id) {
    const headers = this.getAuthHeader();
    const response = await axios.get(`${API_URL}/employees/${id}`, { 
      headers 
    });
    return response.data;
  },

  async updateEmployee(id, employeeData) {
    const headers = this.getAuthHeader();
    const response = await axios.put(`${API_URL}/employees/${id}`, employeeData, {
      headers
    });
    return response.data;
  },

  async deleteEmployee(id) {
    const headers = this.getAuthHeader();
    const response = await axios.delete(`${API_URL}/employees/${id}`, {
      headers
    });
    return response.data;
  },

  async getAttendance() {
    const headers = this.getAuthHeader();
    const response = await axios.get(`${API_URL}/attendance`, { 
      headers 
    });
    return response.data;
  },

  async getAttendanceByEmployee(employeeId) {
    const headers = this.getAuthHeader();
    const response = await axios.get(`${API_URL}/attendance/employee/${employeeId}`, { 
      headers 
    });
    return response.data;
  },

  async createAttendance(attendanceData) {
    const headers = this.getAuthHeader();
    const response = await axios.post(`${API_URL}/attendance`, attendanceData, {
      headers
    });
    return response.data;
  },

  async updateAttendance(id, status) {
    const headers = this.getAuthHeader();
    const response = await axios.put(`${API_URL}/attendance/${id}`, { status }, {
      headers
    });
    return response.data;
  },

  async deleteAttendance(id) {
    const headers = this.getAuthHeader();
    const response = await axios.delete(`${API_URL}/attendance/${id}`, {
      headers
    });
    return response.data;
  },

  async getLeaves() {
    const headers = this.getAuthHeader();
    const response = await axios.get(`${API_URL}/leaves`, { 
      headers 
    });
    return response.data;
  },

  async getApprovedLeaves() {
    const headers = this.getAuthHeader();
    const response = await axios.get(`${API_URL}/leaves/approved`, { 
      headers 
    });
    return response.data;
  },

  async getLeavesByEmployee(employeeId) {
    const headers = this.getAuthHeader();
    const response = await axios.get(`${API_URL}/leaves/employee/${employeeId}`, { 
      headers 
    });
    return response.data;
  },

  async createLeave(leaveData) {
    const headers = this.getAuthHeader();
    
    const config = {
      headers: headers
    };
    
    const response = await axios.post(`${API_URL}/leaves`, leaveData, config);
    return response.data;
  },

  async updateLeaveStatus(id, status) {
    const headers = this.getAuthHeader();
    const response = await axios.put(`${API_URL}/leaves/${id}`, { status }, {
      headers
    });
    return response.data;
  },

  async deleteLeave(id) {
    const headers = this.getAuthHeader();
    const response = await axios.delete(`${API_URL}/leaves/${id}`, {
      headers
    });
    return response.data;
  },

  async downloadLeaveDocument(documentPath) {
    const headers = this.getAuthHeader();
    try {
      let url;
      if (documentPath.startsWith('http')) {
        url = documentPath;
      } else if (documentPath.startsWith('/')) {
        url = `${BASE_URL}${documentPath}`;
      } else {
        url = `${BASE_URL}/${documentPath}`;
      }

      console.log('Downloading document from URL:', url);
      
      const response = await axios.get(url, {
        headers,
        responseType: 'blob'
      });

      const contentType = response.headers['content-type'];
      
      const blob = new Blob([response.data], { type: contentType });
      
      const url_obj = window.URL.createObjectURL(blob);
      
      const filename = documentPath.split('/').pop();
      
      const link = document.createElement('a');
      link.href = url_obj;
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url_obj);
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  }
};

export default apiService; 