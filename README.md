# PayPulse 🚀

PayPulse is a modern, professional, and audit-ready payroll management system designed for the digital-first era. Built with a robust multi-tenant architecture, it allows HR Admins to manage isolated company data while providing employees with a premium self-service portal.

![PayPulse Dashboard](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3)

## ✨ Features

- **Multi-Tenancy**: Complete data isolation between different HR Admins (Companies).
- **Proactive AI Agent**: Gemini-powered tax compliance agent to answer legal and deduction queries.
- **Smart Payroll**: One-click payroll runs with AI-driven anomaly detection.
- **Self-Service Portal**: Employees can view payslips, claim flexi-benefits (Internet, Health, etc.), and request on-demand salary advances (EWA).
- **Compliance Ready**: Automated generation of Appointment Letters, Form 16 (Part B), and Form T Statutory Registers (Labour Code 2026 Compliant).
- **Digital Investment Locker**: Employees can upload tax-saving proofs for HR review and approval.
- **Loan Management**: Internal company loan applications with automated EMI tracking.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS 4, Framer Motion, Lucide Icons.
- **Backend**: Express.js, Node.js.
- **Database**: Neon Postgres (Serverless).
- **Authentication**: Firebase Auth (Google & Email/Password).
- **AI**: Google Gemini AI.
- **Extras**: `jsPDF` for legal documents, `XLSX` for reports.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Neon Postgres account
- A Firebase project
- A Google Gemini API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/paypulse.git
   cd paypulse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your keys:
   ```env
   DATABASE_URL=your_postgres_url
   GEMINI_API_KEY=your_gemini_key
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run in Development**:
   ```bash
   npm run dev
   ```

## ☁️ Deployment (Render)

PayPulse is production-ready for **Render**.

1. Create a "Web Service" on Render.
2. Connect your GitHub repository.
3. The `render.yaml` file in this repo will automatically configure the build and start commands.
4. Add the environment variables listed above in the Render dashboard.

## 📄 License

Individual/Company Internal Use Only.

---

Built with ❤️ for a better payroll experience.
