# SimpFlow Frontend

Modern, responsive web interface for the SimpFlow webhook processing platform built with Next.js 14, TypeScript, and TailwindCSS.

## Features

- 🎯 **No-Code Interface** - Create and manage webhook routes without coding
- 📊 **Real-time Dashboard** - Monitor route performance and statistics
- 🔧 **Route Wizard** - Step-by-step route creation with guided configuration
- 📈 **Analytics** - View detailed logs, success rates, and processing times
- 🎨 **Modern UI** - Clean, responsive design with TailwindCSS
- ⚡ **Fast Performance** - Built with Next.js 14 App Router

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom design system
- **HTTP Client**: Axios for API communication
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript compiler

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- SimpFlow backend running on `http://localhost:3000`

### Installation

1. Install Node.js from [nodejs.org](https://nodejs.org/)

2. Run the setup script:
   ```powershell
   npm run setup
   ```

3. Or manually install dependencies:
   ```powershell
   npm install
   ```

4. Start the development server:
   ```powershell
   npm run dev
   ```

5. Open [http://localhost:3001](http://localhost:3001) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout with header
│   ├── page.tsx           # Dashboard page
│   ├── create/            # Route creation wizard
│   ├── docs/              # Documentation page
│   └── route/[id]/        # Individual route detail page
├── components/            # Reusable components
│   ├── layout/           # Layout components (Header, etc.)
│   ├── route/            # Route-specific components
│   └── ui/               # Base UI components (Button, Card, etc.)
└── utils/                # Utilities and API client
    ├── api.ts            # API client with TypeScript interfaces
    └── helpers.ts        # Helper functions and constants
```

## Components

### UI Components

- **Button** - Primary, secondary, outline, ghost, and danger variants
- **Card** - Container with header, title, and content
- **InputField** - Form input with label, validation, and icons
- **SelectField** - Dropdown selection with options
- **Badge** - Status indicators with color variants

### Route Components

- **RouteCard** - Display route information in card format
- **RouteWizard** - Multi-step route creation flow
- **RouteStats** - Performance analytics and metrics
- **WebhookPreview** - Webhook URL and test commands
- **FiltersEditor** - Configure data filtering rules

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WEBHOOK_BASE_URL=http://localhost:3000/webhook
```

### API Integration

The frontend communicates with the SimpFlow backend through a type-safe API client:

```typescript
// Get all routes
const routes = await getRoutes()

// Create a new route
const route = await createRoute({
  name: "My Route",
  source: { type: "webhook", config: {} },
  target: { type: "http", config: { url: "https://api.example.com" } }
})

// Get route logs
const logs = await getRouteLogs(routeId)
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

### Code Style

- TypeScript for type safety
- Functional components with hooks
- TailwindCSS for styling
- Component composition over inheritance
- Consistent naming conventions

### Adding New Components

1. Create component in appropriate directory (`components/ui/` for base components)
2. Export from component file
3. Add TypeScript interfaces for props
4. Include JSDoc comments for documentation
5. Use TailwindCSS classes for styling

## Building for Production

```powershell
npm run build
npm run start
```

The application will be available at `http://localhost:3001`.

## Features Overview

### Dashboard
- Route overview with statistics
- Quick route creation
- Active/inactive route counts
- Recent activity summary

### Route Creation Wizard
- Step-by-step configuration
- Source selection (Webhook, GitHub, Stripe)
- Target configuration (HTTP, Slack, Discord, Email)
- Data filtering setup
- Configuration review

### Route Management
- Individual route details
- Performance analytics
- Request/response logs
- Webhook testing tools

### Documentation
- Getting started guide
- Supported integrations
- Filter configuration
- Troubleshooting tips

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the SimpFlow platform.
