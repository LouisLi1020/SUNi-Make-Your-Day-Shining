// Basic API test using Node.js built-in fetch
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

class BasicAPITester {
  constructor() {
    this.results = [];
    this.authToken = null;
  }

  async runTest(name, testFn) {
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
        message: error.message || 'Unknown error',
        duration: Date.now() - startTime
      });
      console.log(`❌ ${name}: ${error.message || 'Unknown error'}`);
    }
  }

  async makeRequest(url, options = {}) {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return response;
  }

  async testHealthCheck() {
    const response = await this.makeRequest(`${BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed with status ${response.status}`);
    }
    const data = await response.json();
    if (!data.status || data.status !== 'OK') {
      throw new Error('Health check returned non-OK status');
    }
  }

  async testRootEndpoint() {
    const response = await this.makeRequest(BASE_URL);
    if (!response.ok) {
      throw new Error(`Root endpoint failed with status ${response.status}`);
    }
    const data = await response.json();
    if (!data.message || !data.message.includes('Suni API')) {
      throw new Error('Root endpoint returned unexpected message');
    }
  }

  async testUserRegistration() {
    const response = await this.makeRequest(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(testUser),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Registration failed with status ${response.status}: ${errorData.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    if (!data.success || !data.data.tokens) {
      throw new Error('Registration response missing success or tokens');
    }
    
    this.authToken = data.data.tokens.accessToken;
  }

  async testUserLogin() {
    const response = await this.makeRequest(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Login failed with status ${response.status}: ${errorData.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    if (!data.success || !data.data.tokens) {
      throw new Error('Login response missing success or tokens');
    }
    
    this.authToken = data.data.tokens.accessToken;
  }

  async testGetProfile() {
    if (!this.authToken) {
      throw new Error('No auth token available');
    }

    const response = await this.makeRequest(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Get profile failed with status ${response.status}: ${errorData.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    if (!data.success || !data.data.user) {
      throw new Error('Get profile response missing success or user data');
    }
  }

  async testUpdateProfile() {
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

    const response = await this.makeRequest(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Update profile failed with status ${response.status}: ${errorData.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error('Update profile response missing success');
    }
  }

  async testUnauthorizedAccess() {
    const response = await this.makeRequest(`${API_BASE}/auth/profile`);
    if (response.ok) {
      throw new Error('Should have failed without auth token');
    }
    if (response.status !== 401) {
      throw new Error(`Expected 401, got ${response.status}`);
    }
  }

  async testInvalidCredentials() {
    const response = await this.makeRequest(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      }),
    });
    
    if (response.ok) {
      throw new Error('Should have failed with invalid credentials');
    }
    if (response.status !== 401) {
      throw new Error(`Expected 401, got ${response.status}`);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Basic API Tests...\n');

    // Basic connectivity tests
    await this.runTest('Health Check', () => this.testHealthCheck());
    await this.runTest('Root Endpoint', () => this.testRootEndpoint());

    // Authentication tests
    await this.runTest('User Registration', () => this.testUserRegistration());
    await this.runTest('User Login', () => this.testUserLogin());
    await this.runTest('Get Profile', () => this.testGetProfile());
    await this.runTest('Update Profile', () => this.testUpdateProfile());

    // Security tests
    await this.runTest('Unauthorized Access', () => this.testUnauthorizedAccess());
    await this.runTest('Invalid Credentials', () => this.testInvalidCredentials());

    this.printResults();
  }

  printResults() {
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
  const tester = new BasicAPITester();
  await tester.runAllTests();
})().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});
