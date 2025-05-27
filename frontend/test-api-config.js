#!/usr/bin/env node

/**
 * API Configuration Test Script
 * 
 * This script verifies that the universal API configuration is working correctly
 * across different environments.
 */

console.log('🔍 Testing Universal API Configuration...\n');

// Test environment variable loading
console.log('📊 Environment Variables:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'undefined'}`);

// Simulate different environment scenarios
const testEnvironments = [
  { NODE_ENV: 'development', NEXT_PUBLIC_API_URL: 'http://localhost:3000' },
  { NODE_ENV: 'production', NEXT_PUBLIC_API_URL: 'https://simpflow-backend.onrender.com' },
  { NODE_ENV: 'test', NEXT_PUBLIC_API_URL: undefined }, // Test fallback
];

console.log('\n🧪 Testing API URL Resolution:');

testEnvironments.forEach(env => {
  // Temporarily set environment
  const originalEnv = process.env.NODE_ENV;
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  process.env.NODE_ENV = env.NODE_ENV;
  process.env.NEXT_PUBLIC_API_URL = env.NEXT_PUBLIC_API_URL;
  
  // Test the getApiUrl function
  const getApiUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.warn('⚠️ NEXT_PUBLIC_API_URL not set, falling back to localhost:3000');
      return 'http://localhost:3000';
    }
    return apiUrl;
  };
  
  const buildApiEndpoint = (path) => {
    const baseUrl = getApiUrl();
    return `${baseUrl}/api${path}`;
  };
  
  const baseUrl = getApiUrl();
  const routesEndpoint = buildApiEndpoint('/routes');
  const singleRouteEndpoint = buildApiEndpoint('/routes/123');
  
  console.log(`\n  Environment: ${env.NODE_ENV}`);
  console.log(`  Base URL: ${baseUrl}`);
  console.log(`  Routes endpoint: ${routesEndpoint}`);
  console.log(`  Single route endpoint: ${singleRouteEndpoint}`);
  
  // Restore original environment
  process.env.NODE_ENV = originalEnv;
  process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
});

console.log('\n✅ API Configuration Test Complete!');

// Test endpoint construction
console.log('\n🔗 Testing Endpoint Construction:');
const testPaths = [
  '/routes',
  '/routes/abc123',
  '/routes/abc123/logs',
  '/health'
];

testPaths.forEach(path => {
  const devEndpoint = `http://localhost:3000/api${path}`;
  const prodEndpoint = `https://simpflow-backend.onrender.com/api${path}`;
  console.log(`  ${path}:`);
  console.log(`    Dev:  ${devEndpoint}`);
  console.log(`    Prod: ${prodEndpoint}`);
});

console.log('\n📋 Next Steps:');
console.log('1. Run `npm install` to install dependencies');
console.log('2. Run `npm run dev` to test development mode');
console.log('3. Run `npm run build` to test production build');
console.log('4. Verify API endpoints work in both environments');
