import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Gift,
  Wallet,
  LogOut,
  Download,
  Plus,
  Zap,
  CheckCircle2,
  Briefcase,
  ShieldCheck,
  CreditCard,
  UserCircle,
  Upload,
  History,
  AlertCircle,
  TrendingUp,
  Star,
  Clock,
  Award
} from "lucide-react";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import {
  AdminSidebar,
  DashboardHeader,
  StatCard,
  Card,
  Button
} from "@/components/mvpblocks/ui";
import { cn } from "@/lib/utils";

export default function EmployeeDashboard({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] = useState("home");

  const getTitle = () => {
    switch (activeTab) {
      case 'home': return 'My Dashboard';
      case 'payslips': return 'Salary & Payslips';
      case 'benefits': return 'Flexi-Benefits';
      case 'ewa': return 'On-Demand Pay';
      case 'documents': return 'My Documents';
      case 'investments': return 'Tax & Investments';
      case 'loans': return 'Loans & Advances';
      case 'profile': return 'My Profile';
      default: return 'Employee Portal';
    }
  };

  return (
    <div className="flex bg-background font-sans text-foreground overflow-hidden min-h-screen">
      <AdminSidebar role="employee" user={user} onLogout={onLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title={getTitle()} />

        <main className="flex-1 overflow-y-auto p-2 pt-0 sm:p-4 md:p-6 custom-scrollbar relative">
          <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === "home" && <EmployeeHomeView user={user} />}
              {activeTab === "payslips" && <PayslipsView user={user} />}
              {activeTab === "benefits" && <BenefitsView user={user} />}
              {activeTab === "ewa" && <EWAView user={user} />}
              {activeTab === "documents" && <DocumentsView user={user} />}
              {activeTab === "investments" && <InvestmentsView user={user} />}
              {activeTab === "loans" && <LoansView user={user} />}
              {activeTab === "profile" && <ProfileView user={user} />}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

function EmployeeHomeView({ user }: { user: any }) {
  const [stats, setStats] = useState({
    latestNetPay: 0,
    latestMonth: 'N/A',
    benefitBalance: 0
  });

  useEffect(() => {
    fetch(`/api/employee/stats/${user.id}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, [user.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="px-2 sm:px-0 flex items-center justify-between mt-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl gradient-text">Welcome back, {user.name}!</h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">Here's what's happening with your profile today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20">
          <Star className="text-amber-400 fill-amber-400" size={18} />
          <span className="text-sm font-bold">Top Performer • Q1 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title={`Net Pay (${stats.latestMonth.substring(0, 3)})`}
          value={`₹${stats.latestNetPay.toLocaleString()}`}
          subValue={stats.latestMonth !== 'N/A' ? `For ${stats.latestMonth}` : 'No slips yet'}
          icon={Wallet}
        />
        <StatCard
          title="Benefit Balance"
          value={`₹${stats.benefitBalance.toLocaleString()}`}
          subValue="Expires in 28 days"
          icon={Gift}
        />
        <StatCard
          title="Leave Balance"
          value="14 Days"
          subValue="4 Sick, 10 Casual"
          icon={Clock}
        />
        <StatCard
          title="Tax Saved"
          value="₹12,400"
          subValue="FY 2025-26"
          icon={ShieldCheck}
          trend={{ value: '15%', positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Quick Actions" className="lg:col-span-1">
          <div className="grid grid-cols-1 gap-3 mt-2">
            <Button variant="outline" className="justify-start gap-3 h-12 glass border-white/5 hover:bg-primary/20 hover:border-primary/30">
              <Download size={18} className="text-primary" />
              Download Latest Payslip
            </Button>
            <Button variant="outline" className="justify-start gap-3 h-12 glass border-white/5 hover:bg-emerald-400/10 hover:border-emerald-400/30">
              <Plus size={18} className="text-emerald-400" />
              Claim Flexi-Benefit
            </Button>
            <Button variant="outline" className="justify-start gap-3 h-12 glass border-white/5 hover:bg-amber-400/10 hover:border-amber-400/30">
              <TrendingUp size={18} className="text-amber-400" />
              Request Advance Pay
            </Button>
          </div>
        </Card>

        <Card title="Upcoming Tasks" className="lg:col-span-2">
          <div className="space-y-4 mt-2">
            {[
              { task: 'Upload Investment Proofs', due: 'March 15, 2026', priority: 'High', color: 'text-rose-400' },
              { task: 'Fill Q1 Performance Review', due: 'March 20, 2026', priority: 'Medium', color: 'text-amber-400' },
              { task: 'Update Emergency Contact', due: 'March 31, 2026', priority: 'Low', color: 'text-blue-400' },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl glass border-white/5 group hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn('w-2 h-2 rounded-full', t.priority === 'High' ? 'bg-rose-400' : t.priority === 'Medium' ? 'bg-amber-400' : 'bg-blue-400')} />
                  <div>
                    <p className="font-semibold">{t.task}</p>
                    <p className="text-xs text-muted-foreground italic">Due by {t.due}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">Start</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

// Keep original SidebarItem for compatibility if needed elsewhere
function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      data-active={active}
      className={`flex w-full items-center gap-2 rounded-md p-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 ${active
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }`}
    >
      {React.cloneElement(icon, { size: 16 })}
      <span className="truncate">{label}</span>
    </button>
  );
}

// --- Views ---

function PayslipsView({ user }: { user: any; key?: string }) {
  const [payslips, setPayslips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchPayslips = () => {
    setLoading(true);
    fetch(`/api/payslips/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPayslips(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPayslips();

    const handleDataUpdate = () => {
      fetchPayslips();
    };

    window.addEventListener('paypulse-data-updated', handleDataUpdate);
    return () => window.removeEventListener('paypulse-data-updated', handleDataUpdate);
  }, [user.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Your Payslips</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and download your monthly compensation details (Labour Code 2026 Compliant).
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground text-sm">
          Loading payslips...
        </div>
      ) : payslips.length === 0 ? (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-12 text-center">
          <FileText className="size-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold tracking-tight">
            No payslips yet
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            Your payslips will appear here once payroll is run.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {payslips.map((p) => {
            const allowances = JSON.parse(p.allowances || "{}");
            const deductions = JSON.parse(p.deductions || "{}");
            const isExpanded = expandedId === p.id;

            return (
              <div
                key={p.id}
                className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div
                  className="p-6 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex aspect-square size-14 flex-col items-center justify-center rounded-xl bg-muted/50 border border-border">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">
                        {p.month.substring(0, 3)}
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {p.year}
                      </span>
                    </div>
                    <div className="grid gap-1">
                      <h3 className="text-lg font-semibold tracking-tight leading-none">
                        Salary for {p.month} {p.year}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Gross:{" "}
                          <span className="font-mono text-foreground">
                            ₹{p.gross_pay.toLocaleString()}
                          </span>
                        </span>
                        <span>•</span>
                        <span className="text-primary font-medium">
                          Net:{" "}
                          <span className="font-mono">
                            ₹{p.net_pay.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2">
                      <Download className="size-4" />
                      PDF
                    </button>
                    <Plus className={`size-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-45' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t bg-muted/30"
                    >
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <Plus className="size-4 text-emerald-500" />
                            Earnings & Allowances
                          </h4>
                          <div className="space-y-2">
                            <BreakdownRow label="Basic Salary" value={allowances.basic} />
                            <BreakdownRow label="DA (Dearness Allowance)" value={allowances.da} />
                            <BreakdownRow label="HRA" value={allowances.hra} />
                            <BreakdownRow label="Special Allowance" value={allowances.specialAllowance} />
                            <div className="pt-2 border-t mt-2 flex justify-between font-semibold text-sm">
                              <span>Total Gross</span>
                              <span className="font-mono">₹{p.gross_pay.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <Plus className="size-4 text-rose-500 rotate-45" />
                            Statutory Deductions
                          </h4>
                          <div className="space-y-2">
                            <BreakdownRow label="EPF (12% of Wages)" value={deductions.epf} />
                            <BreakdownRow label="ESI (0.75% of Gross)" value={deductions.esi} />
                            <BreakdownRow label="Professional Tax (PT)" value={deductions.pt} />
                            <BreakdownRow label="LWF (Labour Welfare Fund)" value={deductions.lwf} />
                            <BreakdownRow label="Income Tax (TDS)" value={deductions.tds} />
                            <div className="pt-2 border-t mt-2 flex justify-between font-semibold text-sm text-rose-600">
                              <span>Total Deductions</span>
                              <span className="font-mono">-₹{(p.gross_pay - p.net_pay).toLocaleString()}</span>
                            </div>
                          </div>
                          {deductions.statutory_wage && (
                            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                              <p className="text-[10px] uppercase font-bold text-primary tracking-wider mb-1">50% Wage Rule Compliance</p>
                              <p className="text-xs text-muted-foreground">
                                Your statutory wage was calculated at <span className="font-mono font-medium text-foreground">₹{deductions.statutory_wage.toLocaleString()}</span> (50% of CTC) for social security contributions.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

function BreakdownRow({ label, value }: { label: string, value: number }) {
  if (value === undefined || value === null) return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground">₹{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
  );
}

function BenefitsView({ user }: { user: any; key?: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const fetchBenefits = () => {
    setLoading(true);
    fetch(`/api/benefits/${user.id}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBenefits();

    const handleDataUpdate = () => {
      fetchBenefits();
    };

    window.addEventListener('paypulse-data-updated', handleDataUpdate);
    return () => window.removeEventListener('paypulse-data-updated', handleDataUpdate);
  }, [user.id]);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await fetch("/api/benefits/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          amount: 50,
          category: "Internet Allowance",
        }),
      });
      // Refresh
      const res = await fetch(`/api/benefits/${user.id}`);
      const d = await res.json();
      setData(d);
    } catch (e) {
      console.error(e);
    } finally {
      setClaiming(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-muted-foreground text-sm">
        Loading benefits...
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Flexi-Benefits Wallet
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Allocate your monthly allowance to perks you actually want.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wallet Balance */}
        <div className="lg:col-span-1">
          <div className="bg-primary text-primary-foreground rounded-xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Gift className="size-32" />
            </div>
            <p className="text-primary-foreground/80 font-medium mb-2 relative z-10 text-sm">
              Available Balance
            </p>
            <h2 className="text-5xl font-bold font-mono tracking-tight relative z-10">
              ${data?.wallet?.balance || 0}
            </h2>
            <p className="text-xs text-primary-foreground/70 mt-4 relative z-10">
              Resets on April 1st, 2026
            </p>
          </div>
        </div>

        {/* Claim Options */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            Popular Categories
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <ClaimCard
              title="Internet & Phone"
              desc="Up to $100/mo"
              icon="📱"
              onClaim={handleClaim}
              disabled={claiming || (data?.wallet?.balance || 0) < 50}
            />
            <ClaimCard
              title="Health & Wellness"
              desc="Gym, Yoga, Apps"
              icon="🧘‍♀️"
              onClaim={handleClaim}
              disabled={claiming || (data?.wallet?.balance || 0) < 50}
            />
            <ClaimCard
              title="Learning Stipend"
              desc="Courses, Books"
              icon="📚"
              onClaim={handleClaim}
              disabled={claiming || (data?.wallet?.balance || 0) < 50}
            />
            <ClaimCard
              title="Home Office"
              desc="Equipment, Desk"
              icon="🪑"
              onClaim={handleClaim}
              disabled={claiming || (data?.wallet?.balance || 0) < 50}
            />
          </div>

          <h3 className="text-lg font-semibold tracking-tight mt-10 mb-4">
            Recent Claims
          </h3>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            {data?.claims?.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                No claims yet this month.
              </div>
            ) : (
              <ul className="divide-y">
                {data?.claims?.map((c: any) => (
                  <li
                    key={c.id}
                    className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex aspect-square size-10 items-center justify-center rounded-full bg-muted text-lg">
                        {c.category.includes("Internet") ? "📱" : "🧾"}
                      </div>
                      <div className="grid gap-0.5">
                        <p className="font-medium text-sm text-foreground leading-none">
                          {c.category}
                        </p>
                        <p className="text-xs text-muted-foreground leading-none">
                          {format(new Date(c.created_at), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right grid gap-0.5">
                      <p className="font-medium font-mono text-sm text-foreground leading-none">
                        -${c.amount}
                      </p>
                      <p className="text-xs text-primary flex items-center gap-1 justify-end leading-none">
                        <CheckCircle2 className="size-3" /> Approved
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ClaimCard({ title, desc, icon, onClaim, disabled }: any) {
  return (
    <div
      className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 hover:border-primary/50 transition-colors group cursor-pointer"
      onClick={!disabled ? onClaim : undefined}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-muted text-2xl border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
          {icon}
        </div>
        <button
          disabled={disabled}
          className="flex aspect-square size-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:hover:bg-muted disabled:hover:text-muted-foreground"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <h4 className="font-semibold tracking-tight leading-none mb-1">
        {title}
      </h4>
      <p className="text-xs text-muted-foreground leading-none">{desc}</p>
    </div>
  );
}

function EWAView({ user }: { user: any; key?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          On-Demand Pay (EWA)
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Access your earned wages before payday.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-8 border-b bg-muted/30 flex flex-col items-center text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Available to withdraw
          </p>
          <h2 className="text-6xl font-bold font-mono tracking-tight text-foreground mb-4">
            $1,240.00
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            You've worked 12 days this month. You can withdraw up to 30% of your
            accrued earnings for a flat $2.99 fee.
          </p>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Withdrawal Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                $
              </span>
              <input
                type="number"
                defaultValue={500}
                max={1240}
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-lg font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-8"
              />
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transfer Fee</span>
              <span className="font-medium text-foreground">$2.99</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Deducted from next paycheck
              </span>
              <span className="font-medium text-foreground">$502.99</span>
            </div>
          </div>

          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 w-full">
            Transfer to Bank Account
          </button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Funds will arrive in your account ending in •••• 4829 within 10
            minutes.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function DocumentsView({ user }: { user: any }) {
  const generateAppointmentLetter = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("APPOINTMENT LETTER", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Date: ${format(new Date(), "dd MMMM yyyy")}`, 20, 40);
    doc.text(`To,`, 20, 50);
    doc.text(`${user.name}`, 20, 55);
    doc.text(`${user.email}`, 20, 60);

    doc.setFontSize(14);
    doc.text("Subject: Offer of Appointment", 20, 75);

    doc.setFontSize(12);
    const text = `Dear ${user.name},

We are pleased to offer you the position of ${user.department} at PayPulse Enterprise. 

Your annual CTC will be INR ${user.base_salary.toLocaleString()}. 

This appointment is subject to the new Indian Labour Code 2026 guidelines. Your compensation structure is designed to ensure that at least 50% of your total remuneration constitutes 'Wages' for statutory purposes.

Please sign and return a copy of this letter as a token of your acceptance.

Yours Sincerely,
HR Department
PayPulse Enterprise`;

    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, 90);

    doc.save(`Appointment_Letter_${user.name.replace(/\s+/g, "_")}.pdf`);
  };

  const generateForm16 = async () => {
    const res = await fetch(`/api/payslips/${user.id}`);
    const payslips = await res.json();

    const totalGross = payslips.reduce((sum: number, p: any) => sum + p.gross_pay, 0);
    const totalNet = payslips.reduce((sum: number, p: any) => sum + p.net_pay, 0);
    const totalTax = totalGross - totalNet;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("FORM NO. 16", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text("[See rule 31(1)(a)]", 105, 25, { align: "center" });
    doc.text("PART B (Annexure)", 105, 30, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Certificate under section 203 of the Income-tax Act, 1961 for tax deducted at source on salary`, 20, 45);

    doc.rect(20, 55, 170, 40);
    doc.text(`Employer: PayPulse Enterprise`, 25, 65);
    doc.text(`Employee: ${user.name}`, 25, 75);
    doc.text(`PAN: ABCDE1234F`, 25, 85);

    doc.text("Summary of Salary Paid and Tax Deducted", 20, 110);
    doc.rect(20, 115, 170, 60);
    doc.text(`1. Gross Salary:`, 25, 125);
    doc.text(`INR ${totalGross.toLocaleString()}`, 150, 125, { align: "right" });
    doc.text(`2. Total Deductions:`, 25, 140);
    doc.text(`INR ${totalTax.toLocaleString()}`, 150, 140, { align: "right" });
    doc.text(`3. Net Salary Paid:`, 25, 155);
    doc.text(`INR ${totalNet.toLocaleString()}`, 150, 155, { align: "right" });

    doc.save(`Form16_PartB_${user.name.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Access and download your official employment documents.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex aspect-square size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Appointment Letter</h3>
              <p className="text-sm text-muted-foreground">Official offer and terms of employment.</p>
            </div>
          </div>
          <button
            onClick={generateAppointmentLetter}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
          >
            <Download className="size-4" />
            Download PDF
          </button>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex aspect-square size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Zap className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Form 16 (Part B)</h3>
              <p className="text-sm text-muted-foreground">Annual summary of salary and tax deductions.</p>
            </div>
          </div>
          <button
            onClick={generateForm16}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
          >
            <Download className="size-4" />
            Download PDF
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileView({ user }: { user: any }) {
  const [taxRegime, setTaxRegime] = useState(user.tax_regime || 'new');
  const [loading, setLoading] = useState(false);

  const handleSwitchRegime = async (newRegime: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          tax_regime: newRegime
        })
      });
      if (res.ok) {
        setTaxRegime(newRegime);
        alert(`Tax regime switched to ${newRegime === 'new' ? 'New (2026)' : 'Old'} regime.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your personal details and tax preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Tax Regime Switch</h3>
          <div className="p-4 bg-muted/50 rounded-lg border flex items-center justify-between">
            <div>
              <p className="font-medium">Current Selection: <span className="text-primary uppercase">{taxRegime} Regime</span></p>
              <p className="text-xs text-muted-foreground mt-1">
                {taxRegime === 'new'
                  ? 'You are currently on the New Tax Regime (2026) with ₹75,000 standard deduction.'
                  : 'You are currently on the Old Tax Regime with 80C, 80D, and HRA exemptions.'}
              </p>
            </div>
            <div className="flex bg-background border rounded-lg p-1">
              <button
                onClick={() => handleSwitchRegime('new')}
                disabled={loading}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${taxRegime === 'new' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
              >
                New (2026)
              </button>
              <button
                onClick={() => handleSwitchRegime('old')}
                disabled={loading}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${taxRegime === 'old' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
              >
                Old Regime
              </button>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 italic">
            * Note: Tax regime can typically only be switched once per financial year. This change will reflect in your next payroll cycle.
          </p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Full Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Department</p>
              <p className="font-medium">{user.department}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">State (PT/LWF)</p>
              <p className="font-medium">{user.state}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InvestmentsView({ user }: { user: any }) {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState({
    category: 'LIC',
    amount: '',
    financial_year: '2025-26'
  });

  const fetchProofs = async () => {
    setLoading(true);
    const res = await fetch(`/api/investments/${user.id}`);
    const data = await res.json();
    setProofs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProofs();
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
          amount: parseFloat(formData.amount),
          receipt_url: 'https://picsum.photos/seed/receipt/400/600' // Placeholder
        })
      });
      if (res.ok) {
        setShowUpload(false);
        fetchProofs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Digital Investment Locker</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Upload and manage your tax-saving investment proofs for HR review.
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          <Upload className="size-4" />
          Upload Proof
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold tracking-tight">Submitted Proofs</h3>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : proofs.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center bg-muted/20">
              <ShieldCheck className="size-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No investment proofs uploaded yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {proofs.map(p => (
                <div key={p.id} className="rounded-xl border bg-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{p.category}</p>
                      <p className="text-xs text-muted-foreground">FY {p.financial_year} • ₹{p.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      p.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                      {p.status}
                    </span>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Download className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-sm font-semibold mb-4">Tax Saving Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Section 80C</span>
                <span className="font-mono">₹{proofs.filter(p => p.category === 'LIC' || p.category === 'PPF').reduce((sum, p) => sum + p.amount, 0).toLocaleString()} / 1.5L</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Section 80D</span>
                <span className="font-mono">₹{proofs.filter(p => p.category === 'Medical').reduce((sum, p) => sum + p.amount, 0).toLocaleString()} / 25k</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">HRA Exemption</span>
                <span className="font-mono">₹{proofs.filter(p => p.category === 'Rent').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <div className="flex gap-3">
              <AlertCircle className="size-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Deadline Approaching</p>
                <p className="text-xs text-amber-700">Please upload all proofs for FY 2025-26 by March 15th to avoid higher TDS deductions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-card border shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-semibold text-lg">Upload Investment Proof</h3>
                <button onClick={() => setShowUpload(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="size-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="LIC">LIC / Life Insurance</option>
                    <option value="PPF">PPF / NSC</option>
                    <option value="Rent">House Rent Receipts</option>
                    <option value="Medical">Medical Insurance (80D)</option>
                    <option value="Education">Tuition Fees</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <input
                    required
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Financial Year</label>
                  <input
                    disabled
                    className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm"
                    value={formData.financial_year}
                  />
                </div>
                <div className="pt-4 border-t flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUpload(false)}
                    className="flex-1 h-10 rounded-md border border-input bg-background hover:bg-accent text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
                  >
                    Submit Proof
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LoansView({ user }: { user: any }) {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [formData, setFormData] = useState({
    principal: '',
    tenure: '12'
  });

  const fetchLoans = async () => {
    setLoading(true);
    const res = await fetch(`/api/loans/${user.id}`);
    const data = await res.json();
    setLoans(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLoans();
  }, [user.id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          principal: parseFloat(formData.principal),
          tenure_months: parseInt(formData.tenure)
        })
      });
      if (res.ok) {
        setShowApply(false);
        fetchLoans();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Salary Advance & Loans</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Access internal company loans with automated EMI deductions.
          </p>
        </div>
        <button
          onClick={() => setShowApply(true)}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          <Plus className="size-4" />
          Apply for Loan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-lg font-semibold tracking-tight">Active Loans</h3>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : loans.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center bg-muted/20">
              <CreditCard className="size-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">You have no active loans or advances.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {loans.map(l => (
                <div key={l.id} className="rounded-xl border bg-card overflow-hidden shadow-sm">
                  <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex aspect-square size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CreditCard className="size-5" />
                      </div>
                      <div>
                        <p className="font-semibold">Company Advance</p>
                        <p className="text-xs text-muted-foreground">ID: LN-{l.id.toString().padStart(4, '0')}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${l.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
                      }`}>
                      {l.status}
                    </span>
                  </div>
                  <div className="p-6 grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Principal</p>
                      <p className="font-mono font-semibold">₹{l.principal.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Monthly EMI</p>
                      <p className="font-mono font-semibold text-primary">₹{l.emi.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Remaining</p>
                      <p className="font-mono font-semibold">₹{l.remaining_balance.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${((l.principal - l.remaining_balance) / l.principal) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-medium">
                      <span>{Math.round(((l.principal - l.remaining_balance) / l.principal) * 100)}% Repaid</span>
                      <span>{l.tenure_months} Months Tenure</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-sm font-semibold mb-4">Loan Eligibility</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-emerald-500" />
                <p className="text-xs text-muted-foreground">Eligible for up to <span className="font-bold text-foreground">₹{(user.base_salary * 0.2).toLocaleString()}</span></p>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-emerald-500" />
                <p className="text-xs text-muted-foreground">Interest rate: <span className="font-bold text-foreground">0% (Company Perk)</span></p>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-emerald-500" />
                <p className="text-xs text-muted-foreground">Max tenure: <span className="font-bold text-foreground">24 Months</span></p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/30 p-6">
            <h3 className="text-sm font-semibold mb-2">How it works</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Once approved, the loan amount is credited to your bank account. The EMI is automatically deducted from your monthly payslip until the balance is zero.
            </p>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-card border shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-semibold text-lg">Apply for Loan / Advance</h3>
                <button onClick={() => setShowApply(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="size-5" />
                </button>
              </div>
              <form onSubmit={handleApply} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Loan Amount (₹)</label>
                  <input
                    required
                    type="number"
                    max={user.base_salary * 0.2}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.principal}
                    onChange={e => setFormData({ ...formData, principal: e.target.value })}
                    placeholder="Max ₹{(user.base_salary * 0.2).toLocaleString()}"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tenure (Months)</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.tenure}
                    onChange={e => setFormData({ ...formData, tenure: e.target.value })}
                  >
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    <option value="18">18 Months</option>
                    <option value="24">24 Months</option>
                  </select>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Estimated Monthly EMI</span>
                    <span className="font-bold">₹{formData.principal ? (parseFloat(formData.principal) / parseInt(formData.tenure)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Interest Rate</span>
                    <span className="font-bold text-emerald-600">0%</span>
                  </div>
                </div>
                <div className="pt-4 border-t flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowApply(false)}
                    className="flex-1 h-10 rounded-md border border-input bg-background hover:bg-accent text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const X = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);