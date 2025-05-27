/**
 * Test Suite for SimpFlow Backend Improvements
 * Tests the 4 key improvements: route validation, rate limiting, required fields, and route status
 */

const axios = require('axios');
const logger = require('./src/utils/logger');

class SimpFlowTester {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
        this.testResults = [];
    }

    /**
     * Log test result
     */
    logResult(testName, success, message, details = {}) {
        const result = {
            test: testName,
            success,
            message,
            details,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.push(result);
        
        if (success) {
            logger.info(`✅ ${testName}: ${message}`);
        } else {
            logger.error(`❌ ${testName}: ${message}`);
        }
    }

    /**
     * Test 1: Route Validation during Creation
     */
    async testRouteValidation() {
        console.log('\n🧪 Testing Route Validation...');
        
        try {
            // Test invalid Google Sheets config (missing spreadsheetId)
            const invalidSheetsRoute = {
                name: 'Invalid Sheets Route',
                source: 'typeform',
                target: 'sheets',
                credentials: {
                    sheetName: 'Sheet1'
                    // Missing spreadsheetId
                },
                filters: []
            };

            const response = await axios.post(`${this.baseUrl}/api/routes`, invalidSheetsRoute, {
                validateStatus: () => true
            });

            if (response.status === 400 && response.data.error?.includes('spreadsheetId')) {
                this.logResult('Route Validation - Invalid Sheets Config', true, 'Correctly rejected invalid Google Sheets configuration');
            } else {
                this.logResult('Route Validation - Invalid Sheets Config', false, `Expected 400 error for missing spreadsheetId, got ${response.status}`);
            }

            // Test invalid filter structure
            const invalidFilterRoute = {
                name: 'Invalid Filter Route',
                source: 'typeform',
                target: 'sheets',
                credentials: {
                    spreadsheetId: 'test_id',
                    sheetName: 'Sheet1'
                },
                filters: [
                    { field: 'email' } // Missing op and value
                ]
            };

            const filterResponse = await axios.post(`${this.baseUrl}/api/routes`, invalidFilterRoute, {
                validateStatus: () => true
            });

            if (filterResponse.status === 400) {
                this.logResult('Route Validation - Invalid Filter', true, 'Correctly rejected invalid filter structure');
            } else {
                this.logResult('Route Validation - Invalid Filter', false, `Expected 400 error for invalid filter, got ${filterResponse.status}`);
            }

        } catch (error) {
            this.logResult('Route Validation', false, `Test failed: ${error.message}`);
        }
    }

    /**
     * Test 2: Rate Limiting
     */
    async testRateLimiting() {
        console.log('\n🧪 Testing Rate Limiting...');
        
        try {
            // First, create a test route
            const testRoute = {
                name: 'Rate Limit Test Route',
                source: 'typeform',
                target: 'sheets',
                credentials: {
                    spreadsheetId: 'test_spreadsheet_id',
                    sheetName: 'Sheet1'
                },
                filters: []
            };

            const createResponse = await axios.post(`${this.baseUrl}/api/routes`, testRoute);
            const routeId = createResponse.data.route?.id;

            if (!routeId) {
                this.logResult('Rate Limiting Setup', false, 'Could not create test route for rate limiting test');
                return;
            }

            // Send 6 rapid requests (should hit the 5/second limit)
            const webhookData = {
                form_response: {
                    answers: [
                        { field: { type: 'email' }, email: 'test@example.com' },
                        { field: { ref: 'city' }, text: 'New York' }
                    ]
                }
            };

            const promises = [];
            for (let i = 0; i < 6; i++) {
                promises.push(
                    axios.post(`${this.baseUrl}/api/trigger/${routeId}`, webhookData, {
                        validateStatus: () => true
                    })
                );
            }

            const responses = await Promise.all(promises);
            const rateLimitedResponses = responses.filter(r => r.status === 429);

            if (rateLimitedResponses.length > 0) {
                this.logResult('Rate Limiting', true, `Successfully rate limited ${rateLimitedResponses.length} requests out of 6`);
            } else {
                this.logResult('Rate Limiting', false, 'No requests were rate limited - rate limiting may not be working');
            }

        } catch (error) {
            this.logResult('Rate Limiting', false, `Test failed: ${error.message}`);
        }
    }

    /**
     * Test 3: Required Fields Validation
     */
    async testRequiredFields() {
        console.log('\n🧪 Testing Required Fields...');
        
        try {
            // Create route with required fields
            const routeWithRequiredFields = {
                name: 'Required Fields Test Route',
                source: 'typeform',
                target: 'sheets',
                credentials: {
                    spreadsheetId: 'test_spreadsheet_id',
                    sheetName: 'Sheet1'
                },
                requiredFields: ['email', 'city'],
                filters: []
            };

            const createResponse = await axios.post(`${this.baseUrl}/api/routes`, routeWithRequiredFields);
            const routeId = createResponse.data.route?.id;

            if (!routeId) {
                this.logResult('Required Fields Setup', false, 'Could not create test route for required fields test');
                return;
            }

            // Test with missing required field
            const incompleteData = {
                form_response: {
                    answers: [
                        { field: { type: 'email' }, email: 'test@example.com' }
                        // Missing city field
                    ]
                }
            };

            const response = await axios.post(`${this.baseUrl}/api/trigger/${routeId}`, incompleteData, {
                validateStatus: () => true
            });

            if (response.status === 200 && response.data.reason === 'missing_fields') {
                this.logResult('Required Fields', true, 'Correctly detected missing required fields');
            } else {
                this.logResult('Required Fields', false, `Expected missing_fields response, got ${response.status}: ${JSON.stringify(response.data)}`);
            }

        } catch (error) {
            this.logResult('Required Fields', false, `Test failed: ${error.message}`);
        }
    }

    /**
     * Test 4: Route Status (Active/Inactive)
     */
    async testRouteStatus() {
        console.log('\n🧪 Testing Route Status...');
        
        try {
            // Create an inactive route
            const inactiveRoute = {
                name: 'Inactive Route Test',
                source: 'typeform',
                target: 'sheets',
                status: 'inactive',
                credentials: {
                    spreadsheetId: 'test_spreadsheet_id',
                    sheetName: 'Sheet1'
                },
                filters: []
            };

            const createResponse = await axios.post(`${this.baseUrl}/api/routes`, inactiveRoute);
            const routeId = createResponse.data.route?.id;

            if (!routeId) {
                this.logResult('Route Status Setup', false, 'Could not create test route for status test');
                return;
            }

            // Try to trigger inactive route
            const webhookData = {
                form_response: {
                    answers: [
                        { field: { type: 'email' }, email: 'test@example.com' },
                        { field: { ref: 'city' }, text: 'New York' }
                    ]
                }
            };

            const response = await axios.post(`${this.baseUrl}/api/trigger/${routeId}`, webhookData, {
                validateStatus: () => true
            });

            if (response.status === 200 && response.data.reason === 'route_inactive') {
                this.logResult('Route Status', true, 'Correctly rejected inactive route');
            } else {
                this.logResult('Route Status', false, `Expected route_inactive response, got ${response.status}: ${JSON.stringify(response.data)}`);
            }

        } catch (error) {
            this.logResult('Route Status', false, `Test failed: ${error.message}`);
        }
    }

    /**
     * Test server health
     */
    async testServerHealth() {
        console.log('\n🧪 Testing Server Health...');
        
        try {
            const response = await axios.get(`${this.baseUrl}/api/health`);
            
            if (response.status === 200) {
                this.logResult('Server Health', true, 'Server is running and responding');
            } else {
                this.logResult('Server Health', false, `Server responded with status ${response.status}`);
            }
        } catch (error) {
            this.logResult('Server Health', false, `Server not accessible: ${error.message}`);
        }
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🚀 Starting SimpFlow Backend Tests...\n');
        
        await this.testServerHealth();
        await this.testRouteValidation();
        await this.testRateLimiting();
        await this.testRequiredFields();
        await this.testRouteStatus();
        
        // Print summary
        console.log('\n📊 Test Summary:');
        console.log('================');
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.success).length;
        const failedTests = totalTests - passedTests;
        
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests} ✅`);
        console.log(`Failed: ${failedTests} ❌`);
        console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        
        if (failedTests > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(r => !r.success)
                .forEach(result => {
                    console.log(`  - ${result.test}: ${result.message}`);
                });
        }
        
        console.log('\n🎉 Testing completed!');
        
        return {
            total: totalTests,
            passed: passedTests,
            failed: failedTests,
            results: this.testResults
        };
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new SimpFlowTester();
    
    tester.runAllTests()
        .then((summary) => {
            process.exit(summary.failed > 0 ? 1 : 0);
        })
        .catch((error) => {
            console.error('❌ Test runner failed:', error.message);
            process.exit(1);
        });
}

module.exports = SimpFlowTester;
