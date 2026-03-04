import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Please update your .env file.");
}

const sql = neon(process.env.DATABASE_URL!);

// Initialize DB schema (Postgres syntax)
async function initDb() {
  await sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL, 
    department TEXT,
    status TEXT DEFAULT 'active',
    base_salary REAL DEFAULT 0,
    da REAL DEFAULT 0,
    hra REAL DEFAULT 0,
    special_allowance REAL DEFAULT 0,
    state TEXT DEFAULT 'Karnataka',
    bank_info TEXT,
    tax_id TEXT,
    tax_regime TEXT DEFAULT 'new',
    ot_hours REAL DEFAULT 0,
    marked_for_exit_at TIMESTAMP,
    admin_id INTEGER
  )`;

  await sql`CREATE TABLE IF NOT EXISTS salary_templates (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    base_pay REAL NOT NULL,
    allowances TEXT,
    deductions TEXT
  )`;

  await sql`CREATE TABLE IF NOT EXISTS payroll_runs (
    id SERIAL PRIMARY KEY,
    month TEXT NOT NULL,
    year INTEGER NOT NULL,
    status TEXT DEFAULT 'draft',
    total_amount REAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_id INTEGER
  )`;

  // Migration: Add admin_id to users if not exists
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_id INTEGER`;
  } catch (e) {
    // Fallback for older Postgres versions if IF NOT EXISTS fails
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='admin_id') THEN 
          ALTER TABLE users ADD COLUMN admin_id INTEGER; 
        END IF; 
      END $$;
    `;
  }

  // Migration: Add admin_id to payroll_runs if not exists
  try {
    await sql`ALTER TABLE payroll_runs ADD COLUMN IF NOT EXISTS admin_id INTEGER`;
  } catch (e) {
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payroll_runs' AND column_name='admin_id') THEN 
          ALTER TABLE payroll_runs ADD COLUMN admin_id INTEGER; 
        END IF; 
      END $$;
    `;
  }

  await sql`CREATE TABLE IF NOT EXISTS payslips (
    id SERIAL PRIMARY KEY,
    payroll_run_id INTEGER REFERENCES payroll_runs(id),
    user_id INTEGER REFERENCES users(id),
    gross_pay REAL,
    net_pay REAL,
    allowances TEXT,
    deductions TEXT,
    status TEXT DEFAULT 'pending'
  )`;

  await sql`CREATE TABLE IF NOT EXISTS benefits_wallet (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    balance REAL DEFAULT 0,
    month TEXT,
    year INTEGER
  )`;

  await sql`CREATE TABLE IF NOT EXISTS benefit_claims (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount REAL,
    category TEXT,
    status TEXT DEFAULT 'pending',
    receipt_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  await sql`CREATE TABLE IF NOT EXISTS investment_proofs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    receipt_url TEXT,
    status TEXT DEFAULT 'pending',
    financial_year TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  await sql`CREATE TABLE IF NOT EXISTS loans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    principal REAL NOT NULL,
    interest_rate REAL DEFAULT 0,
    tenure_months INTEGER NOT NULL,
    emi REAL NOT NULL,
    remaining_balance REAL NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  // Seed initial data if empty
  const userResults = await sql`SELECT COUNT(*) as count FROM users`;
  if (parseInt(userResults[0].count as string) === 0) {
    await sql`INSERT INTO users(name, email, role, department, base_salary) VALUES('Sarah Admin', 'admin@paypulse.com', 'admin', 'HR', 120000)`;
    await sql`INSERT INTO users(name, email, role, department, base_salary) VALUES('Alex Employee', 'alex@paypulse.com', 'employee', 'Engineering', 85000)`;
    await sql`INSERT INTO users(name, email, role, department, base_salary) VALUES('David Finance', 'david@paypulse.com', 'admin', 'Finance', 110000)`;
    await sql`INSERT INTO users(name, email, role, department, base_salary) VALUES('Jane Designer', 'jane@paypulse.com', 'employee', 'Design', 75000)`;

    // Get seeded user IDs for wallet (Sarah is 1, Alex is 2, David is 3, Jane is 4)
    await sql`INSERT INTO benefits_wallet(user_id, balance, month, year) VALUES(2, 200, 'March', 2026)`;
    await sql`INSERT INTO benefits_wallet(user_id, balance, month, year) VALUES(4, 200, 'March', 2026)`;
  }
}

async function startServer() {
  await initDb();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // --- API Routes ---

  // Get all users
  app.get('/api/users', async (req, res) => {
    try {
      const { admin_id } = req.query;
      let users;
      if (admin_id) {
        users = await sql`SELECT * FROM users WHERE admin_id = ${admin_id} OR id = ${admin_id} ORDER BY id DESC`;
      } else {
        users = await sql`SELECT * FROM users ORDER BY id DESC`;
      }
      res.json(users);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Get single user by ID
  app.get('/api/users/:id', async (req, res) => {
    try {
      const results = await sql`SELECT * FROM users WHERE id = ${req.params.id}`;
      res.json(results[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Get user by email
  app.get('/api/users/by-email/:email', async (req, res) => {
    try {
      const queryEmail = req.params.email.trim().toLowerCase();
      const results = await sql`SELECT * FROM users WHERE LOWER(TRIM(email)) = ${queryEmail}`;
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Add user
  app.post('/api/users', async (req, res) => {
    const { name, email, role, department, base_salary, da, hra, special_allowance, state, tax_regime, status, ot_hours, marked_for_exit_at, bank_info, admin_id } = req.body;
    try {
      const cleanEmail = email.trim().toLowerCase();

      // Global uniqueness check
      const existing = await sql`SELECT id FROM users WHERE LOWER(TRIM(email)) = ${cleanEmail}`;
      if (existing.length > 0) {
        return res.status(400).json({ error: `The email ${cleanEmail} is already registered in our system.` });
      }

      const results = await sql`
        INSERT INTO users(name, email, role, department, base_salary, da, hra, special_allowance, state, tax_regime, status, ot_hours, marked_for_exit_at, bank_info, admin_id)
  VALUES(${name}, ${cleanEmail}, ${role}, ${department}, ${base_salary}, ${da || 0}, ${hra || 0}, ${special_allowance || 0}, ${state || 'Karnataka'}, ${tax_regime || 'new'}, ${status || 'active'}, ${ot_hours || 0}, ${marked_for_exit_at || null}, ${bank_info || null}, ${admin_id || null})
        RETURNING id
  `;
      res.json({ id: results[0].id });
    } catch (e: any) {
      console.error("POST /api/users error:", e);
      res.status(400).json({ error: e.message });
    }
  });

  // Update user
  app.put('/api/users/:id', async (req, res) => {
    const { name, email, role, department, base_salary, da, hra, special_allowance, state, status, tax_regime, ot_hours, marked_for_exit_at, bank_info } = req.body;
    try {
      const cleanEmail = email.trim().toLowerCase();

      // Uniqueness check for email (excluding current user)
      const existing = await sql`SELECT id FROM users WHERE LOWER(TRIM(email)) = ${cleanEmail} AND id != ${req.params.id}`;
      if (existing.length > 0) {
        return res.status(400).json({ error: `The email ${cleanEmail} is already taken by another user.` });
      }

      await sql`
        UPDATE users 
        SET name = ${name}, email = ${cleanEmail}, role = ${role}, department = ${department}, base_salary = ${base_salary}, da = ${da}, hra = ${hra}, special_allowance = ${special_allowance}, state = ${state}, status = ${status}, tax_regime = ${tax_regime}, ot_hours = ${ot_hours}, marked_for_exit_at = ${marked_for_exit_at || null}, bank_info = ${bank_info || null}
        WHERE id = ${req.params.id}
`;
      res.json({ success: true });
    } catch (e: any) {
      console.error("PUT /api/users error:", e);
      res.status(400).json({ error: e.message });
    }
  });

  // Update user salary
  app.patch('/api/users/:id/salary', async (req, res) => {
    const { new_salary } = req.body;
    try {
      await sql`UPDATE users SET base_salary = ${new_salary} WHERE id = ${req.params.id} `;
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Delete user
  app.delete('/api/users/:id', async (req, res) => {
    try {
      await sql`DELETE FROM users WHERE id = ${req.params.id} `;
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Run Payroll (Draft)
  app.post('/api/payroll/run', async (req, res) => {
    const { month, year, admin_id } = req.body;

    try {
      const users = await sql`SELECT * FROM users WHERE status = 'active' AND role = 'employee' AND admin_id = ${admin_id}`;

      // Save draft
      const runResults = await sql`
        INSERT INTO payroll_runs(month, year, status, admin_id) VALUES(${month}, ${year}, 'draft', ${admin_id})
        RETURNING id
      `;
      const runId = runResults[0].id;

      let totalAmount = 0;

      for (const user of users) {
        // Monthly breakdown
        const monthlyCTC = user.base_salary / 12;
        const basic = monthlyCTC * 0.4;
        const da = user.da || 0;
        const hra = user.hra || (monthlyCTC * 0.2);
        const specialAllowance = user.special_allowance || (monthlyCTC - basic - da - hra);

        // 1. Overtime (OT) Engine: 2x regular wage
        const hourlyRate = monthlyCTC / 160;
        const otPay = (user.ot_hours || 0) * hourlyRate * 2;

        // 2. 50% Wage Rule (New Labour Code 2026)
        let wagesForSocialSecurity = basic + da;
        const threshold = monthlyCTC * 0.5;
        if (wagesForSocialSecurity < threshold) {
          wagesForSocialSecurity = threshold;
        }

        // 3. Statutory Deductions
        const epf = wagesForSocialSecurity * 0.12;
        const grossPay = monthlyCTC + otPay;

        let esi = 0;
        if (grossPay < 21000) {
          esi = grossPay * 0.0075;
        }

        let pt = 0;
        if (grossPay > 15000) {
          pt = 200;
        }

        const lwf = 20;

        // 4. Dual-Tax Regime Logic (FY 2025-26)
        let annualTaxableIncome = user.base_salary;
        let tds = 0;

        if (user.tax_regime === 'new') {
          annualTaxableIncome = Math.max(0, annualTaxableIncome - 75000);
          if (annualTaxableIncome > 400000) {
            if (annualTaxableIncome <= 800000) tds = (annualTaxableIncome - 400000) * 0.05;
            else if (annualTaxableIncome <= 1200000) tds = (400000 * 0.05) + (annualTaxableIncome - 800000) * 0.10;
            else if (annualTaxableIncome <= 1600000) tds = (400000 * 0.05) + (400000 * 0.10) + (annualTaxableIncome - 1200000) * 0.15;
            else if (annualTaxableIncome <= 2000000) tds = (400000 * 0.05) + (400000 * 0.10) + (400000 * 0.15) + (annualTaxableIncome - 1600000) * 0.20;
            else tds = (400000 * 0.05) + (400000 * 0.10) + (400000 * 0.15) + (400000 * 0.20) + (annualTaxableIncome - 2000000) * 0.25;
          }
        } else {
          annualTaxableIncome = Math.max(0, annualTaxableIncome - 150000 - 25000 - 50000);
          if (annualTaxableIncome > 250000) {
            if (annualTaxableIncome <= 500000) tds = (annualTaxableIncome - 250000) * 0.05;
            else if (annualTaxableIncome <= 1000000) tds = (250000 * 0.05) + (annualTaxableIncome - 500000) * 0.20;
            else tds = (250000 * 0.05) + (500000 * 0.20) + (annualTaxableIncome - 1000000) * 0.30;
          }
        }

        const monthlyTDS = tds / 12;

        // 5. F&F (Full & Final) Logic
        let ffBonus = 0;
        if (user.status === 'exiting' && user.marked_for_exit_at) {
          const exitDate = new Date(user.marked_for_exit_at);
          const now = new Date();
          const diffHours = (now.getTime() - exitDate.getTime()) / (1000 * 60 * 60);
          if (diffHours <= 48) ffBonus = monthlyCTC * 0.5;
        }

        // 6. Loan EMI Deduction
        const activeLoans = await sql`SELECT * FROM loans WHERE user_id = ${user.id} AND status = 'active'`;
        const activeLoan = activeLoans[0];
        let emiDeduction = 0;
        if (activeLoan) {
          emiDeduction = Math.min(activeLoan.emi, activeLoan.remaining_balance);
          await sql`UPDATE loans SET remaining_balance = remaining_balance - ${emiDeduction} WHERE id = ${activeLoan.id} `;
          if (activeLoan.remaining_balance - emiDeduction <= 0) {
            await sql`UPDATE loans SET status = 'closed', remaining_balance = 0 WHERE id = ${activeLoan.id} `;
          }
        }

        const totalDeductions = epf + esi + pt + lwf + monthlyTDS + emiDeduction;
        const netPay = grossPay + ffBonus - totalDeductions;
        totalAmount += netPay;

        await sql`
          INSERT INTO payslips(payroll_run_id, user_id, gross_pay, net_pay, allowances, deductions)
VALUES(${runId}, ${user.id}, ${grossPay + ffBonus}, ${netPay}, ${JSON.stringify({ basic, da, hra, specialAllowance, otPay, ffBonus })}, ${JSON.stringify({ epf, esi, pt, lwf, tds: monthlyTDS, statutory_wage: wagesForSocialSecurity, loan_emi: emiDeduction })})
        `;
      }

      await sql`UPDATE payroll_runs SET total_amount = ${totalAmount} WHERE id = ${runId} `;

      res.json({ runId, totalAmount, employeeCount: users.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Approve and Finalize Payroll
  app.post('/api/payroll/approve/:runId', async (req, res) => {
    try {
      const runId = req.params.runId;

      // Update run status
      await sql`UPDATE payroll_runs SET status = 'paid' WHERE id = ${runId}`;

      // Update associated payslips status
      await sql`UPDATE payslips SET status = 'paid' WHERE payroll_run_id = ${runId}`;

      // Fetch detailed payout data for PDF generation (including bank info)
      const payouts = await sql`
        SELECT 
          u.name, 
          u.email, 
          u.bank_info,
          p.net_pay,
          p.gross_pay
        FROM payslips p
        JOIN users u ON p.user_id = u.id
        WHERE p.payroll_run_id = ${runId}
      `;

      res.json({ success: true, payouts });
    } catch (e: any) {
      console.error("Approve payroll error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  // Get Payroll Runs
  app.get('/api/payroll/runs', async (req, res) => {
    try {
      const { admin_id } = req.query;
      let runs;
      if (admin_id) {
        runs = await sql`SELECT * FROM payroll_runs WHERE admin_id = ${admin_id} ORDER BY created_at DESC`;
      } else {
        runs = await sql`SELECT * FROM payroll_runs ORDER BY created_at DESC`;
      }
      res.json(runs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Get Payslips for a user
  app.get('/api/payslips/:userId', async (req, res) => {
    try {
      const payslips = await sql`
        SELECT p.*, r.month, r.year 
        FROM payslips p 
        JOIN payroll_runs r ON p.payroll_run_id = r.id 
        WHERE p.user_id = ${req.params.userId}
        ORDER BY r.created_at DESC
      `;
      res.json(payslips);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Get Benefits Wallet
  app.get('/api/benefits/:userId', async (req, res) => {
    try {
      const wallets = await sql`SELECT * FROM benefits_wallet WHERE user_id = ${req.params.userId} ORDER BY id DESC LIMIT 1`;
      const claims = await sql`SELECT * FROM benefit_claims WHERE user_id = ${req.params.userId} ORDER BY created_at DESC`;
      res.json({ wallet: wallets[0], claims });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ESS: Get Investment Proofs
  app.get('/api/investments/:userId', async (req, res) => {
    try {
      const proofs = await sql`SELECT * FROM investment_proofs WHERE user_id = ${req.params.userId} ORDER BY created_at DESC`;
      res.json(proofs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ESS: Submit Investment Proof
  app.post('/api/investments', async (req, res) => {
    const { userId, category, amount, receipt_url, financial_year } = req.body;
    try {
      await sql`INSERT INTO investment_proofs(user_id, category, amount, receipt_url, financial_year) VALUES(${userId}, ${category}, ${amount}, ${receipt_url}, ${financial_year})`;
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // ESS: Get Loans
  app.get('/api/loans/:userId', async (req, res) => {
    try {
      const loans = await sql`SELECT * FROM loans WHERE user_id = ${req.params.userId} ORDER BY created_at DESC`;
      res.json(loans);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ESS: Apply for Loan
  app.post('/api/loans', async (req, res) => {
    const { userId, principal, tenure_months } = req.body;
    const emi = principal / tenure_months;
    try {
      await sql`INSERT INTO loans(user_id, principal, tenure_months, emi, remaining_balance) VALUES(${userId}, ${principal}, ${tenure_months}, ${emi}, ${principal})`;
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Admin: Get all investment proofs for review
  app.get('/api/admin/investments', async (req, res) => {
    try {
      const { admin_id } = req.query;
      if (!admin_id) return res.status(400).json({ error: "admin_id required" });

      const proofs = await sql`
        SELECT i.*, u.name as employee_name 
        FROM investment_proofs i 
        JOIN users u ON i.user_id = u.id 
        WHERE i.status = 'pending' AND u.admin_id = ${admin_id}
  `;
      res.json(proofs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Admin: Review Investment Proof
  app.patch('/api/admin/investments/:id', async (req, res) => {
    const { status } = req.body;
    try {
      await sql`UPDATE investment_proofs SET status = ${status} WHERE id = ${req.params.id} `;
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Submit Benefit Claim
  app.post('/api/benefits/claim', async (req, res) => {
    const { userId, amount, category } = req.body;
    try {
      const wallets = await sql`SELECT * FROM benefits_wallet WHERE user_id = ${userId} ORDER BY id DESC LIMIT 1`;
      const wallet = wallets[0];

      if (!wallet || wallet.balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      await sql`UPDATE benefits_wallet SET balance = balance - ${amount} WHERE id = ${wallet.id} `;
      await sql`INSERT INTO benefit_claims(user_id, amount, category) VALUES(${userId}, ${amount}, ${category})`;

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Admin Dashboard Stats
  app.get('/api/admin/stats', async (req, res) => {
    try {
      const { admin_id } = req.query;
      if (!admin_id) return res.status(400).json({ error: "admin_id required" });

      const employees = await sql`SELECT COUNT(*) FROM users WHERE status = 'active' AND role = 'employee' AND admin_id = ${admin_id}`;
      const employeeCount = employees[0].count;

      const payrolls = await sql`SELECT total_amount, month, year FROM payroll_runs WHERE admin_id = ${admin_id} ORDER BY created_at DESC LIMIT 1`;
      const activePayroll = payrolls.length > 0 ? payrolls[0] : { total_amount: 0, month: 'None', year: '' };

      res.json({
        totalEmployees: parseInt(employeeCount as string),
        activePayrollAmount: activePayroll.total_amount,
        payrollMonth: activePayroll.month,
        payrollYear: activePayroll.year
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Employee Dashboard Stats
  app.get('/api/employee/stats/:id', async (req, res) => {
    try {
      const payslips = await sql`
        SELECT p.net_pay, r.month, r.year 
        FROM payslips p 
        JOIN payroll_runs r ON p.payroll_run_id = r.id 
        WHERE p.user_id = ${req.params.id}
        ORDER BY r.created_at DESC LIMIT 1
      `;
      const latestPayslip = payslips.length > 0 ? payslips[0] : null;

      const wallets = await sql`SELECT balance FROM benefits_wallet WHERE user_id = ${req.params.id} ORDER BY id DESC LIMIT 1`;
      const benefitBalance = wallets.length > 0 ? wallets[0].balance : 0;

      res.json({
        latestNetPay: latestPayslip ? latestPayslip.net_pay : 0,
        latestMonth: latestPayslip ? latestPayslip.month : 'N/A',
        benefitBalance: benefitBalance
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Production logic: Serve static files and catch-all for SPA
  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));

    // Catch-all route must be AFTER all API routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
