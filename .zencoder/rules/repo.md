---
description: Repository Information Overview
alwaysApply: true
---

# Repository Information Overview

## Repository Summary
**ScanGo** is a retail automation ecosystem designed to bridge physical shopping and digital convenience. It includes a customer-facing mobile application for scanning products and an employee terminal for security verification and checkout assistance.

## Repository Structure
- **[./](./)**: Main Customer Application (Frontend + Backend).
- **[./scango-guard/](./scango-guard/)**: Employee Terminal (Guard/Cashier) subproject.
- **[./server/](./server/)**: Shared backend services for the main application.
- **[./services/](./services/)**: Frontend service layer for API and database interactions.
- **[./scripts/](./scripts/)**: Utility scripts for data generation and system verification.
- **[./data/](./data/)**: Local data definitions and database interactions.

### Main Repository Components
- **Customer App**: A React-based PWA for product scanning, AI-powered assistance, and digital checkout.
- **Guard Terminal**: A specialized interface for employees to verify customer purchases via QR code scanning.
- **Shared Backend**: Node.js/Express API handling AI inference (Groq), authentication (Supabase), and blockchain integrations.

## Projects

### ScanGo Main (Customer App & Backend)
**Configuration File**: [./package.json](./package.json)

#### Language & Runtime
**Language**: TypeScript  
**Version**: ES2022  
**Build System**: Vite  
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- `@supabase/supabase-js`: Database and authentication.
- `express`: Backend API framework.
- `groq-sdk`: AI assistant integration.
- `ethers`: Blockchain interactions.
- `react` (v19): Frontend UI library.
- `lucide-react`: UI icons.
- `twilio`: SMS and verification services.

**Development Dependencies**:
- `vite`: Build tool.
- `typescript`: Language support.
- `tsx`: TypeScript execution for the server.

#### Build & Installation
```bash
# Install dependencies
npm install

# Start backend server
npm run server

# Start frontend in development mode
npm run dev

# Build for production
npm run build
```

#### Testing
**Framework**: Manual verification scripts.
**Test Location**: [./scripts/](./scripts/)
**Naming Convention**: `verify_*.ts`, `test_*.ts`
**Run Command**:
```bash
# Example verification script
npx tsx scripts/verify_workflow.ts
```

### ScanGo Guard (Employee Terminal)
**Configuration File**: [./scango-guard/package.json](./scango-guard/package.json)

#### Language & Runtime
**Language**: TypeScript / JavaScript  
**Version**: ES2022 (Frontend), Node.js (Backend)  
**Build System**: Vite  
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- `react` (v18): Frontend UI library.
- `jsqr`: QR code scanning library.
- `express`: Backend API framework.
- `@supabase/supabase-js`: Database interaction.

#### Build & Installation
```bash
# Navigate to subproject
cd scango-guard

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

#### Testing
**Approach**: Integrated verification with main system scripts.
