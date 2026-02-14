# 🇮🇳 ScanGo: requirements.md
> **Theme**: AI for Bharat (Retail & Commerce)
> **Topic**: Project Dependencies & Installation Requirements

## 1. System Prerequisites
Before installing the project dependencies, ensure you have the following installed on your system:
-   **Node.js**: Latest LTS version (v18.x or v20.x recommended)
-   **Package Manager**: `npm` (comes with Node.js) or `yarn`

## 2. Project Dependencies
The project is divided into two main parts: the **Root Application** (Customer App & Main Backend) and the **Guard Application** (Employee Terminal). You must install dependencies for *both* directories.

### A. Root Application (Customer App + Server)
**Location**: `./` (Root Directory)
**command**: `npm install`

#### Production Dependencies
| Package | Version | Purpose |
| :--- | :--- | :--- |
| **@supabase/supabase-js** | `^2.93.3` | Database & Auth client |
| **express** | `^4.18.2` | Backend API framework |
| **groq-sdk** | `^0.37.0` | AI Inference (LLM) |
| **twilio** | `^4.20.0` | SMS Notifications |
| **ethers** | `^6.16.0` | Blockchain/Crypto utils |
| **lucide-react** | `^0.563.0` | Icons |
| **qrcode.react** | `^4.2.0` | QR Code Generation |
| **body-parser** | `^1.20.2` | Request parsing |
| **cors** | `^2.8.5` | Cross-Origin Resource Sharing |
| **dotenv** | `^17.2.3` | Environment variables |
| **selfsigned** | `^5.5.0` | SSL Certificate generation |
| **tsx** | `^4.21.0` | TypeScript execution (Server) |
| **@types/selfsigned** | `^2.0.4` | TypeScript types |

#### Development Dependencies
| Package | Version |
| :--- | :--- |
| **vite** | `^7.3.1` | Build tool & Dev server |
| **typescript** | `^5.9.3` | Static typing |
| **react** | `^19.2.4` | Frontend framework |
| **react-dom** | `^19.2.4` | React DOM bindings |
| **@vitejs/plugin-react** | `^5.1.2` | Vite React plugin |
| **@vitejs/plugin-basic-ssl**| `^2.1.4` | HTTPS for dev server |
| **@types/react** | `^19.2.10` | Types |
| **@types/react-dom** | `^19.2.3` | Types |

---

### B. Guard Application (Employee Terminal)
**Location**: `./scango-guard/`
**command**: `cd scango-guard && npm install`

#### Production Dependencies
| Package | Version | Purpose |
| :--- | :--- | :--- |
| **react** | `^18.2.0` | Frontend framework |
| **react-dom** | `^18.2.0` | React DOM bindings |
| **jsqr** | `^1.4.0` | QR Code Scanning/Parsing |
| **lucide-react** | `^0.344.0` | Icons |
| **@supabase/supabase-js** | `^2.39.7` | Database interactions |
| **ethers** | `^6.16.0` | Blockchain utils |
| **express** | `^4.18.2` | Local server |
| **body-parser** | `^1.20.2` | Request parsing |
| **cors** | `^2.8.5` | CORS support |
| **twilio** | `^4.20.0` | SMS features |

#### Development Dependencies
| Package | Version |
| :--- | :--- |
| **vite** | `^7.3.1` | Build tool |
| **typescript** | `^5.3.3` | Static typing |
| **@vitejs/plugin-react** | `^4.2.1` | Vite React plugin |
| **@vitejs/plugin-basic-ssl**| `^2.1.4` | HTTPS for dev server |
| **@types/react** | `^18.2.0` | Types |
| **@types/react-dom** | `^18.2.0` | Types |

## 3. Installation Summary
To get the entire system running, execute the following commands in the terminal:

```bash
# 1. Install Root Dependencies
npm install

# 2. Install Guard App Dependencies
cd scango-guard
npm install
cd ..
```
