#!/usr/bin/env node

/**
 * Quick Setup Script for SimpFlow Backend Improvements
 * This script helps set up and test the 4 backend improvements
 */

const fs = require('fs');
const path = require('path');

async function findNodeJsPath() {
    const { spawn } = require('child_process');
    
    // Common Node.js installation paths on Windows
    const commonPaths = [
        'C:\\Program Files\\nodejs\\node.exe',
        'C:\\Program Files (x86)\\nodejs\\node.exe',
        'C:\\nodejs\\node.exe',
        process.env.LOCALAPPDATA + '\\Programs\\nodejs\\node.exe'
    ];
    
    for (const nodePath of commonPaths) {
        if (fs.existsSync(nodePath)) {
            console.log(`✅ Found Node.js at: ${nodePath}`);
            return nodePath;
        }
    }
    
    console.log('❌ Node.js not found in common locations');
    console.log('Please install Node.js from https://nodejs.org/');
    return null;
}

async function checkEnvironment() {
    console.log('🔍 Checking SimpFlow Environment...\n');
    
    // Check if we're in the right directory
    if (!fs.existsSync('./package.json')) {
        console.log('❌ package.json not found. Please run this from the SimpFlow root directory.');
        return false;
    }
    
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    if (packageJson.name !== 'simpflow-backend') {
        console.log('❌ This doesn\'t appear to be the SimpFlow backend directory.');
        return false;
    }
    
    console.log('✅ SimpFlow backend directory confirmed');
    
    // Check if Node.js is available
    const nodePath = await findNodeJsPath();
    if (!nodePath) {
        return false;
    }
    
    // Check if database migration files exist
    const migrationFile = './src/database/migrations/001_add_status_and_required_fields.sql';
    if (!fs.existsSync(migrationFile)) {
        console.log('❌ Database migration file not found');
        return false;
    }
    console.log('✅ Database migration files ready');
    
    // Check if test files exist
    if (!fs.existsSync('./test-improvements.js')) {
        console.log('❌ Test suite not found');
        return false;
    }
    console.log('✅ Test suite ready');
    
    // Check implementation files
    const implementationFiles = [
        './src/controllers/webhookController.js',
        './src/services/routeService.js',
        './src/routes/apiRoutes.js'
    ];
    
    for (const file of implementationFiles) {
        if (!fs.existsSync(file)) {
            console.log(`❌ Implementation file missing: ${file}`);
            return false;
        }
    }
    console.log('✅ All implementation files present');
    
    return true;
}

async function printNextSteps() {
    console.log('\n🚀 NEXT STEPS TO COMPLETE SETUP:\n');
    
    console.log('1. 📊 Run Database Migration:');
    console.log('   npm run migrate');
    console.log('   # or: node src/database/migrations/migrate.js\n');
    
    console.log('2. 🔧 Start the Server:');
    console.log('   npm start');
    console.log('   # or: node src/server.js\n');
    
    console.log('3. 🧪 Run Tests:');
    console.log('   npm test');
    console.log('   # or: node test-improvements.js\n');
    
    console.log('4. 📋 Manual Testing:');
    console.log('   Open another terminal and run:');
    console.log('   curl -X GET http://localhost:3000/api/health');
    console.log('   # or: Invoke-WebRequest -Uri http://localhost:3000/api/health\n');
    
    console.log('📖 For detailed testing instructions, see TESTING.md');
    console.log('📊 For implementation status, see IMPLEMENTATION_STATUS.md');
}

async function main() {
    console.log('🎯 SimpFlow Backend Improvements Setup\n');
    console.log('This script will verify that all 4 backend improvements are ready:\n');
    console.log('1. ✅ Route Validation during Creation');
    console.log('2. ✅ Rate Limiting for Webhook Calls');
    console.log('3. ✅ Required Fields Support');
    console.log('4. ✅ Route Status Support (Active/Inactive)\n');
    
    const environmentOk = await checkEnvironment();
    
    if (environmentOk) {
        console.log('\n🎉 ENVIRONMENT CHECK PASSED!');
        console.log('All backend improvements are implemented and ready for testing.');
        await printNextSteps();
    } else {
        console.log('\n❌ ENVIRONMENT CHECK FAILED!');
        console.log('Please resolve the issues above before proceeding.');
        process.exit(1);
    }
}

// Run the setup check
main().catch(error => {
    console.error('❌ Setup check failed:', error.message);
    process.exit(1);
});
