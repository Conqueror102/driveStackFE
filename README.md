# DriveStack Frontend Setup

## Requirements
- Node.js 20+
- Backend API running locally or via a deployed instance

## Getting Started

1. Set your environment variables (see `.env.local.example`):
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Architecture & State
- **Server State**: Managed via TanStack Query (React Query)
- **Client State**: Zustand (authentication, upload tracking)
- **Styling**: Tailwind CSS + shadcn/ui

## Key Features
- Multi-account aggregation dashboard
- Concurrent XHR uploads with native progress events
- Global drop-target upload integration
- Strict UI typing and Zod schema validations
