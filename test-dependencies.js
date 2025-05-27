#!/usr/bin/env node

/**
 * Installation Test Script
 * Tests if all required dependencies are available
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing SimpFlow Backend Dependencies...\n');

// Test required modules
const requiredModules = [
    'express',
    'cors',
    'body-parser',
    'dotenv',
    'googleapis',
    '@notionhq/client',
    'pg',
    'nodemailer',
    'uuid',
    'helmet'
];

let allModulesFound = true;

requiredModules.forEach(module => {
    try {
        require(module);
        console.log(`✅ ${module} - Found`);
    } catch (error) {
        console.log(`❌ ${module} - Missing`);
        allModulesFound = false;
    }
});

console.log('\n' + '='.repeat(50));

if (allModulesFound) {
    console.log('🎉 All dependencies are installed correctly!');
    console.log('\nNext steps:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Configure your environment variables');
    console.log('3. Run: npm start');
} else {
    console.log('⚠️  Some dependencies are missing.');
    console.log('Run: npm install');
}

console.log('\n📚 See DEPLOYMENT.md for detailed setup instructions');
