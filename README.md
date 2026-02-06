# ScanGo - Smart Shopping System

ScanGo is a comprehensive smart shopping application designed to streamline the retail experience for both customers and store staff. It features a mobile-first customer application and a dedicated terminal for guards and cashiers.

## 🚀 Features

### For Customers
- **Multi-Store Selection**: Choose from various registered store locations.
- **Smart Scanner**: Real-time barcode scanning to add products directly to the digital cart.
- **Cart Management**: Track items, quantities, and total savings in real-time.
- **Seamless Checkout**: Multiple payment methods with instant digital receipt generation.
- **QR Verification**: Post-checkout QR codes for quick exit verification.
- **Order History**: Access and view past shopping trips.
- **AI Chat Assistant**: Integrated support for product inquiries and store assistance.

### For Employees
- **Dual Mode Terminal**: Switch between Guard and Cashier modes.
- **Verification System**: Scan customer QR codes to verify purchases and prevent shrinkage.
- **Order Management**: Assist customers with their checkout process.

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database**: [Supabase](https://supabase.com/)
- **AI/ML**: [Groq SDK](https://groq.com/)
- **Integrations**: 
  - [Twilio](https://www.twilio.com/) (Communications)
  - [Ethers.js](https://docs.ethers.org/) (Blockchain/Crypto)
  - [Lucide React](https://lucide.dev/) (Icons)

## 📦 Project Structure

The project is organized into two main parts:

1.  **Main Application (Root)**: The primary customer-facing React application.
2.  **ScanGo Guard (`/scango-guard`)**: A specialized terminal for store employees.
3.  **Server (`/server`)**: Shared backend services and API routes.

## 🚦 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd scango
    ```

2.  Install dependencies for the main app:
    ```bash
    npm install
    ```

3.  Install dependencies for the guard terminal:
    ```bash
    cd scango-guard
    npm install
    cd ..
    ```

4.  Set up environment variables:
    Create a `.env` file in the root and `.env.local` in `scango-guard/` with your Supabase and API credentials.

### Running the Application

- **Start Frontend (Main App)**:
  ```bash
  npm run dev
  ```

- **Start Backend Server**:
  ```bash
  npm run server
  ```

- **Start Guard Terminal**:
  ```bash
  cd scango-guard
  npm run dev
  ```

## 📄 License

This project is proprietary. All rights reserved.
