# Project Details: Salary Management System (PayPulse)

Welcome to the **Salary Management System**, a modern, full-stack web application designed for automated payroll processing, employee self-service, and financial management.

This document provides a comprehensive overview of the project's architecture, technologies, and integration patterns, specifically focusing on **Neon DB** and **Firebase Authentication**.

---

## 🚀 Tech Stack

- **Frontend**: [React](https://react.dev/) (v19) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4), Lucide Icons, Framer Motion
- **Backend**: [Express](https://expressjs.com/) (Node.js) with [tsx](https://github.com/privatenumber/tsx)
- **Database**: [Neon Postgres](https://neon.tech/) (Serverless Postgres)
- **Authentication**: [Firebase Auth](https://firebase.google.com/products/auth)
- **Tooling**: TypeScript, Prettier/ESLint

---

## 🐘 Neon DB Integration (The Database)

**Neon DB** is a serverless Postgres database. Unlike traditional Postgres which runs on a fixed server, Neon scales resources up and down based on demand.

### 1. Connecting to Neon
We use the `@neondatabase/serverless` package, which allows us to connect to Postgres over HTTP/WebSockets, making it extremely fast for serverless environments.

In `server.ts`:
```typescript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
```

### 2. Schema Management
The project handles its own schema initialization. When the server starts (`initDb()` function), it checks if tables exist and creates them if they don't. This ensures the database is always in the correct state without needing manual migrations initially.

Key Tables:
- `users`: Core employee/admin data (salary details, bank info, tax regime).
- `payroll_runs`: History of payroll processing cycles.
- `payslips`: Detailed breakdown of earnings and deductions for each employee per month.
- `loans` & `benefit_claims`: Financial products managed within the app.

### 3. Executing Queries
We use **Tagged Templates** for SQL queries. This is safe, readable, and prevents SQL injection automatically.

Example (Fetching users):
```typescript
const users = await sql`SELECT * FROM users WHERE admin_id = ${admin_id}`;
```

---

## 🔐 Firebase Authentication (The Guard)

**Firebase Auth** handles user login and session management. It removes the need to store passwords in our database.

### 1. Configuration
Client-side setup is in `src/lib/firebase.ts`. It uses environment variables (VITE_FIREBASE_*) for security.

### 2. How it works in this project:
1. **Login**: User logs in via the Firebase UI (Frontend).
2. **Token**: Firebase provides a unique ID (UID) for the user.
3. **Database Sync**: We use the user's email or UID to link the Firebase session with our own `users` table in Neon DB.
4. **Roles**: We store the `role` (Admin/Employee) in the Neon DB `users` table. After a user logs in via Firebase, we fetch their profile from our API to determine what they can see.

---

## 🛠️ Core Payroll Logic

The "Brain" of the system is the **Payroll Engine** located in `server.ts` under the `/api/payroll/run` route. It handles:

1. **New Labour Code 2026 Compliance**: Implements the "50% Wage Rule" where Basic + DA must be at least 50% of the CTC.
2. **Statutory Deductions**: Calculations for EPF (12%), ESI, PT, and LWF.
3. **Dual-Tax Regime**: Logic to calculate TDS based on both "Old" and "New" Indian Income Tax regimes.
4. **Overtime (OT)**: Automated calculation at 2x the regular hourly wage.
5. **F&F (Full & Final)**: Logic for exiting employees, including bonuses for fast settlement.

---

## 📂 Project Structure

- `/src`: Frontend React code.
  - `/components`: UI building blocks (using Radix UI and Tailwind).
  - `/pages`: Main dashboard views (Admin, Employee, Settings).
  - `/lib`: Helper libraries (Firebase, local utils).
- `server.ts`: The main API server and Database controller.
- `package.json`: Dependency list and scripts.
- `.env`: Secret configuration (Database URLs, Firebase Keys).

---

## 🏃 How to Run the Project

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Copy `.env.example` to `.env` and fill in your:
   - `DATABASE_URL` (From Neon Console)
   - Firebase Config (From Firebase Console)

3. **Development Mode**:
   ```bash
   npm run dev
   ```
   *This starts the Express server which also serves the Vite frontend.*

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```
