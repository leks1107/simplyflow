# SimpFlow - Complete Monorepo Implementation

## Overview

SimpFlow is now a complete monorepo with both backend and frontend applications. The project provides a no-code webhook processing platform with a modern web interface.

## Project Structure

```
c:\simplyflow/
├── README.md                           # Main project documentation
├── setup-check-complete.ps1            # Complete system status check
├── backend/                            # Node.js/Express backend
│   ├── package.json                   # Backend dependencies
│   ├── setup-check.js                 # Backend status check
│   └── src/                           # Backend source code
│       ├── app.js                     # Express application
│       ├── server.js                  # Server entry point
│       ├── controllers/               # Route controllers
│       ├── database/                  # Database and migrations
│       ├── middleware/                # Express middleware
│       ├── routes/                    # API routes
│       ├── services/                  # Business logic services
│       └── utils/                     # Utility functions
└── frontend/                          # Next.js/React frontend
    ├── package.json                   # Frontend dependencies
    ├── tsconfig.json                  # TypeScript configuration
    ├── tailwind.config.js             # TailwindCSS configuration
    ├── next.config.js                 # Next.js configuration
    ├── setup-frontend.ps1             # Frontend setup script
    ├── README.md                      # Frontend documentation
    └── src/                           # Frontend source code
        ├── app/                       # Next.js App Router pages
        │   ├── globals.css           # Global styles
        │   ├── layout.tsx            # Root layout
        │   ├── page.tsx              # Dashboard
        │   ├── create/page.tsx       # Route creation
        │   ├── docs/page.tsx         # Documentation
        │   └── route/[id]/page.tsx   # Route details
        ├── components/               # React components
        │   ├── layout/              # Layout components
        │   ├── route/               # Route-specific components
        │   └── ui/                  # Base UI components
        └── utils/                   # Utilities and API client
            ├── api.ts               # API client
            └── helpers.ts           # Helper functions
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Validation**: Joi
- **Logging**: Winston
- **Testing**: Jest

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript compiler

## Features

### Backend API
- RESTful API for webhook route management
- Webhook endpoint processing with filtering
- Support for multiple source types (Generic, GitHub, Stripe)
- Multiple target integrations (HTTP, Slack, Discord, Email, Sheets, Notion)
- Request/response logging and analytics
- Data validation and error handling

### Frontend Interface
- **Dashboard**: Route overview with statistics and quick actions
- **Route Creation Wizard**: Step-by-step route configuration
- **Route Management**: Individual route details with logs and analytics
- **Webhook Testing**: Built-in testing tools with cURL/PowerShell commands
- **Documentation**: Comprehensive usage guide
- **Responsive Design**: Mobile-friendly interface

## Quick Start

### Prerequisites
1. Install Node.js 18+ from [nodejs.org](https://nodejs.org/)

### Setup
1. Run the complete system check:
   ```powershell
   .\setup-check-complete.ps1
   ```

2. Start the backend:
   ```powershell
   cd backend
   npm install
   npm start
   ```

3. Start the frontend (in new terminal):
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

4. Access the applications:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000/api

## API Endpoints

### Routes Management
- `GET /api/routes` - List all routes
- `POST /api/routes` - Create new route
- `GET /api/routes/:id` - Get route details
- `PUT /api/routes/:id` - Update route
- `DELETE /api/routes/:id` - Delete route

### Webhook Processing
- `POST /webhook/:routeId` - Process webhook

### Monitoring
- `GET /api/routes/:id/logs` - Get route logs
- `GET /api/health` - Health check
- `POST /api/test-webhook/:routeId` - Test webhook

## Frontend Pages

### Dashboard (`/`)
- Route overview with statistics
- Quick route creation
- Active/inactive counts
- Recent activity

### Create Route (`/create`)
- Multi-step wizard
- Source configuration
- Target setup
- Filter configuration
- Review and create

### Route Details (`/route/[id]`)
- Route configuration
- Performance analytics
- Request/response logs
- Webhook testing tools

### Documentation (`/docs`)
- Getting started guide
- Supported integrations
- Filter configuration
- Troubleshooting

## Components Architecture

### UI Components
- **Button**: Multiple variants (primary, secondary, outline, ghost, danger)
- **Card**: Container with header, title, content
- **InputField**: Form input with validation and icons
- **SelectField**: Dropdown with options
- **Badge**: Status indicators

### Route Components
- **RouteCard**: Route display card
- **RouteWizard**: Multi-step creation flow
- **RouteStats**: Performance metrics
- **WebhookPreview**: URL and test commands
- **FiltersEditor**: Filter configuration

### Layout Components
- **Header**: Navigation with responsive menu
- **Layout**: Root application layout

## Development

### Backend Development
```powershell
cd backend
npm run dev          # Start with nodemon
npm test            # Run tests
npm run setup-check # Check backend status
```

### Frontend Development
```powershell
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run lint        # Run ESLint
npm run type-check  # Check TypeScript
```

## Configuration

### Backend Configuration
- Port: 3000
- Database: SQLite (data/database.sqlite)
- Logs: logs/ directory

### Frontend Configuration
- Port: 3001
- API URL: http://localhost:3000/api
- Environment: .env.local

## Integration Examples

### Creating a Route via API
```javascript
const route = await fetch('http://localhost:3000/api/routes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'GitHub to Slack',
    source: { type: 'github', config: { secret: 'your-secret' } },
    target: { type: 'slack', config: { url: 'https://hooks.slack.com/...' } },
    filters: [{ field: 'action', operator: 'equals', value: 'opened' }]
  })
})
```

### Testing a Webhook
```bash
curl -X POST http://localhost:3000/webhook/your-route-id \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Next Steps

1. **Production Deployment**: 
   - Configure environment variables
   - Set up reverse proxy (nginx)
   - Configure SSL certificates
   - Set up monitoring

2. **Additional Features**:
   - User authentication
   - Team collaboration
   - Advanced analytics
   - Rate limiting
   - Webhook replay

3. **Integrations**:
   - More source types (GitLab, Bitbucket)
   - Additional targets (Teams, Telegram)
   - Database integrations
   - File storage services

## Support

- Check the complete system status: `.\setup-check-complete.ps1`
- View frontend README: `frontend/README.md`
- Backend documentation: `backend/` directory
- API documentation: `/api` endpoints

The SimpFlow monorepo is now complete with a fully functional backend API and modern frontend interface!
