import 'dotenv/config';
import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:5000';
const API_BASE = `${BASE_URL}/api`;

// Test data
const testUser = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'test123456',
  confirmPassword: 'test123456'
};

const loginData = {
  email: 'test@example.com',
  password: 'test123456'
};

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  message: string;
  duration: number;
}

class APITester {
  private results: TestResult[] = [];
  private authToken: string | null = null;

  async runTest(name: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      this.results.push({
        name,
        status: 'PASS',
        message: 'Test passed',
        duration: Date.now() - startTime
      });
      console.log(`✅ ${name}`);
    } catch (error) {
      this.results.push({
        name,
        status: 'FAIL',
        message: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      });
      console.log(`❌ ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async testHealthCheck(): Promise<void> {
    const response = await axios.get(`${BASE_URL}/health`);
    if (response.status !== 200) {
      throw new Error(`Health check failed with status ${response.status}`);
    }
    if (!response.data.status || response.data.status !== 'OK') {
      throw new Error('Health check returned non-OK status');
    }
  }

  async testRootEndpoint(): Promise<void> {
    const response = await axios.get(BASE_URL);
    if (response.status !== 200) {
      throw new Error(`Root endpoint failed with status ${response.status}`);
    }
    if (!response.data.message || !response.data.message.includes('Suni API')) {
      throw new Error('Root endpoint returned unexpected message');
    }
  }

  async testUserRegistration(): Promise<void> {
    try {
      // Try to delete existing user first
      await axios.delete(`${API_BASE}/users/test-user`, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });
    } catch (error) {
      // Ignore if user doesn't exist
    }

    const response = await axios.post(`${API_BASE}/auth/register`, testUser);
    if (response.status !== 201) {
      throw new Error(`Registration failed with status ${response.status}`);
    }
    if (!response.data.success || !response.data.data.tokens) {
      throw new Error('Registration response missing success or tokens');
    }
    
    this.authToken = response.data.data.tokens.accessToken;
  }

  async testUserLogin(): Promise<void> {
    const response = await axios.post(`${API_BASE}/auth/login`, loginData);
    if (response.status !== 200) {
      throw new Error(`Login failed with status ${response.status}`);
    }
    if (!response.data.success || !response.data.data.tokens) {
      throw new Error('Login response missing success or tokens');
    }
    
    this.authToken = response.data.data.tokens.accessToken;
  }

  async testGetProfile(): Promise<void> {
    if (!this.authToken) {
      throw new Error('No auth token available');
    }

    const response = await axios.get(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });
    if (response.status !== 200) {
      throw new Error(`Get profile failed with status ${response.status}`);
    }
    if (!response.data.success || !response.data.data.user) {
      throw new Error('Get profile response missing success or user data');
    }
  }

  async testUpdateProfile(): Promise<void> {
    if (!this.authToken) {
      throw new Error('No auth token available');
    }

    const updateData = {
      name: 'Updated Test User',
      profile: {
        firstName: 'Updated',
        lastName: 'User',
        phone: '+1234567890'
      }
    };

    const response = await axios.put(`${API_BASE}/auth/profile`, updateData, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });
    if (response.status !== 200) {
      throw new Error(`Update profile failed with status ${response.status}`);
    }
    if (!response.data.success) {
      throw new Error('Update profile response missing success');
    }
  }

  async testChangePassword(): Promise<void> {
    if (!this.authToken) {
      throw new Error('No auth token available');
    }

    const passwordData = {
      currentPassword: 'test123456',
      newPassword: 'newtest123456',
      confirmPassword: 'newtest123456'
    };

    const response = await axios.put(`${API_BASE}/auth/change-password`, passwordData, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });
    if (response.status !== 200) {
      throw new Error(`Change password failed with status ${response.status}`);
    }
    if (!response.data.success) {
      throw new Error('Change password response missing success');
    }

    // Change password back for other tests
    const revertData = {
      currentPassword: 'newtest123456',
      newPassword: 'test123456',
      confirmPassword: 'test123456'
    };

    await axios.put(`${API_BASE}/auth/change-password`, revertData, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });
  }

  async testRefreshToken(): Promise<void> {
    if (!this.authToken) {
      throw new Error('No auth token available');
    }

    // First get a refresh token by logging in again
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
    const refreshToken = loginResponse.data.data.tokens.refreshToken;

    const response = await axios.post(`${API_BASE}/auth/refresh-token`, {
      refreshToken
    });
    if (response.status !== 200) {
      throw new Error(`Refresh token failed with status ${response.status}`);
    }
    if (!response.data.success || !response.data.data.tokens) {
      throw new Error('Refresh token response missing success or tokens');
    }
  }

  async testUnauthorizedAccess(): Promise<void> {
    try {
      await axios.get(`${API_BASE}/auth/profile`);
      throw new Error('Should have failed without auth token');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // This is expected
        return;
      }
      throw error;
    }
  }

  async testInvalidCredentials(): Promise<void> {
    try {
      await axios.post(`${API_BASE}/auth/login`, {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });
      throw new Error('Should have failed with invalid credentials');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // This is expected
        return;
      }
      throw error;
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting API Tests...\n');

    // Basic connectivity tests
    await this.runTest('Health Check', () => this.testHealthCheck());
    await this.runTest('Root Endpoint', () => this.testRootEndpoint());

    // Authentication tests
    await this.runTest('User Registration', () => this.testUserRegistration());
    await this.runTest('User Login', () => this.testUserLogin());
    await this.runTest('Get Profile', () => this.testGetProfile());
    await this.runTest('Update Profile', () => this.testUpdateProfile());
    await this.runTest('Change Password', () => this.testChangePassword());
    await this.runTest('Refresh Token', () => this.testRefreshToken());

    // Security tests
    await this.runTest('Unauthorized Access', () => this.testUnauthorizedAccess());
    await this.runTest('Invalid Credentials', () => this.testInvalidCredentials());

    this.printResults();
  }

  printResults(): void {
    console.log('\n📊 Test Results Summary:');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total Time: ${totalTime}ms`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => {
          console.log(`  - ${r.name}: ${r.message}`);
        });
    }

    console.log('\n✅ All tests completed!');
  }
}

// Run tests
(async () => {
  const tester = new APITester();
  await tester.runAllTests();
})().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});
