import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  Users,
  DollarSign,
  Bot,
  LogOut,
  Search,
  Plus,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Download,
  Printer,
  FileSpreadsheet,
  TrendingUp,
  UserCheck,
  Activity,
  Shield,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { GoogleGenAI } from "@google/genai";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import {
  AdminSidebar,
  DashboardHeader,
  StatCard,
  RevenueChart,
  QuickActions,
  RecentActivity,
  SystemStatus,
  Button
} from "@/components/mvpblocks/ui";

// Initialize AI on the client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function AdminDashboard({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/admin': return 'HR Dashboard';
      case '/admin/employees': return 'Employee Directory';
      case '/admin/payroll': return 'Payroll Management';
      case '/admin/documents': return 'Document Center';
      case '/admin/status': return 'System Status';
      case '/admin/analytics': return 'Analytics';
      case '/admin/settings': return 'Settings';
      default: return 'Admin Dashboard';
    }
  };

  return (
    <div className="flex bg-background font-sans text-foreground overflow-hidden min-h-screen">
      <AdminSidebar role="admin" user={user} onLogout={onLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title={getTitle()} />

        <main className="flex-1 overflow-y-auto p-2 pt-0 sm:p-4 md:p-6 custom-scrollbar relative">
          <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
            <AnimatePresence mode="wait">
              <motion.div key={location.pathname} className="h-full">
                <Routes location={location}>
                  <Route path="/" element={<HomeView adminId={user.id} />} />
                  <Route path="/employees" element={<EmployeesView adminId={user.id} />} />
                  <Route path="/payroll" element={<PayrollView adminId={user.id} />} />
                  <Route path="/documents" element={<DocumentsView adminId={user.id} />} />
                  <Route path="/status" element={<SystemStatusView />} />
                  <Route path="/analytics" element={<AnalyticsView />} />
                  <Route path="/settings" element={<SettingsView />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Placeholder Views for new routes ---
function SystemStatusView() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl font-semibold mb-6">System Status</h1>
      <SystemStatus />
    </motion.div>
  );
}

function AnalyticsView() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl font-semibold mb-6">Analytics & Reporting</h1>
      <div className="rounded-xl border bg-card p-6 shadow-sm flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <BarChart3 className="size-12 mx-auto mb-4 opacity-50" />
          <p>Advanced metrics & drill-down analytics coming soon.</p>
        </div>
      </div>
    </motion.div>
  );
}

function SettingsView() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-muted-foreground">Organization settings and integrations configuration page.</p>
      </div>
    </motion.div>
  );
}

function HomeView({ adminId }: { adminId: number }) {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activePayrollAmount: 0,
    payrollMonth: 'None',
    payrollYear: ''
  });

  useEffect(() => {
    fetch(`/api/admin/stats?admin_id=${adminId}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, [adminId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="px-2 sm:px-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome Admin
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Here's what's happening with your platform today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees.toString()}
          subValue="Active headcount"
          icon={Users}
          trend={{ value: '12%', positive: true }}
        />
        <StatCard
          title="Active Payroll"
          value={`₹${(stats.activePayrollAmount / 1000000).toFixed(1)}M`}
          subValue={`${stats.payrollMonth} ${stats.payrollYear}`}
          icon={DollarSign}
        />
        <StatCard
          title="Compliance Score"
          value="98.2%"
          subValue="Labour Code 2026"
          icon={Shield}
          trend={{ value: '0.4%', positive: true }}
        />
        <StatCard
          title="System Health"
          value="Optimal"
          subValue="All systems green"
          icon={Activity}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <RecentActivity />
        <SystemStatus />
      </div>
    </motion.div>
  );
}

// Keep original SidebarItem for compatibility if needed elsewhere, but it's not used in main anymore
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

function EmployeesView({ adminId }: { adminId: number }) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const fetchEmployees = () => {
    setLoading(true);
    fetch(`/api/users?admin_id=${adminId}`)
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data.filter((u: any) => u.role === "employee"));
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployees();

    const handleDataUpdate = () => {
      fetchEmployees();
    };

    window.addEventListener('paypulse-data-updated', handleDataUpdate);
    return () => window.removeEventListener('paypulse-data-updated', handleDataUpdate);
  }, [adminId]);

  const handleAddClick = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (emp: any) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
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
          <h1 className="text-2xl font-semibold tracking-tight">
            Employee Directory
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your team members and their compensation (Labour Code 2026 Compliant).
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 gap-2"
        >
          <Plus className="size-4" />
          Add Employee
        </button>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        employee={selectedEmployee}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEmployees}
        adminId={adminId}
      />

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search employees..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            Loading employees...
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Annual CTC</th>
                <th className="px-4 py-3 font-medium">State</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary/10 text-primary font-medium text-xs">
                        {emp.name.charAt(0)}
                      </div>
                      <div className="grid gap-0.5">
                        <p className="font-medium text-foreground leading-none">
                          {emp.name}
                        </p>
                        <p className="text-xs text-muted-foreground leading-none">
                          {emp.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {emp.department}
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">
                    ₹{emp.base_salary.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {emp.state}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEditClick(emp)}
                      className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}

function EmployeeModal({ isOpen, onClose, onSuccess, employee, adminId }: any) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    base_salary: "",
    da: "0",
    hra: "0",
    special_allowance: "0",
    state: "Karnataka",
    role: "employee",
    tax_regime: "new",
    ot_hours: "0",
    marked_for_exit_at: "",
    bank_account_number: "",
    ifsc_code: "",
    bank_branch: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      let bankInfo: any = {};
      if (employee.bank_info) {
        try { bankInfo = JSON.parse(employee.bank_info); } catch (e) { }
      }
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        department: employee.department || "",
        base_salary: employee.base_salary?.toString() || "",
        da: employee.da?.toString() || "0",
        hra: employee.hra?.toString() || "0",
        special_allowance: employee.special_allowance?.toString() || "0",
        state: employee.state || "Karnataka",
        role: employee.role || "employee",
        status: employee.status || "active",
        tax_regime: employee.tax_regime || "new",
        ot_hours: employee.ot_hours?.toString() || "0",
        marked_for_exit_at: employee.marked_for_exit_at || "",
        bank_account_number: bankInfo.account_number || "",
        ifsc_code: bankInfo.ifsc_code || "",
        bank_branch: bankInfo.branch || ""
      });
    } else {
      setFormData({
        name: "",
        email: "",
        department: "",
        base_salary: "",
        da: "0",
        hra: "0",
        special_allowance: "0",
        state: "Karnataka",
        role: "employee",
        status: "active",
        tax_regime: "new",
        ot_hours: "0",
        marked_for_exit_at: "",
        bank_account_number: "",
        ifsc_code: "",
        bank_branch: ""
      });
    }
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = employee ? `/api/users/${employee.id}` : "/api/users";
      const method = employee ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          admin_id: adminId,
          base_salary: parseFloat(formData.base_salary),
          da: parseFloat(formData.da),
          hra: parseFloat(formData.hra),
          special_allowance: parseFloat(formData.special_allowance),
          ot_hours: parseFloat(formData.ot_hours || "0"),
          bank_info: JSON.stringify({
            account_number: formData.bank_account_number,
            ifsc_code: formData.ifsc_code,
            branch: formData.bank_branch
          })
        })
      });
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const errorData = await res.json();
        alert(`Failed to save employee: ${errorData.error}`);
      }
    } catch (e: any) {
      console.error(e);
      alert(`Network error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card text-card-foreground w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border"
      >
        <div className="p-6 border-b flex items-center justify-between bg-muted/30">
          <h3 className="text-xl font-semibold tracking-tight">
            {employee ? "Edit Employee" : "Add New Employee"}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Zap className="size-5 rotate-45" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input
                required
                type="email"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <input
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Annual CTC (₹)</label>
              <input
                required
                type="number"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.base_salary}
                onChange={e => setFormData({ ...formData, base_salary: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tax Regime</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.tax_regime}
                onChange={e => setFormData({ ...formData, tax_regime: e.target.value })}
              >
                <option value="new">New Regime (2026)</option>
                <option value="old">Old Regime</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">OT Hours</label>
              <input
                type="number"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.ot_hours}
                onChange={e => setFormData({ ...formData, ot_hours: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="exiting">Exiting (F&F)</option>
              </select>
            </div>
            {formData.status === 'exiting' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Exit Date</label>
                <input
                  type="datetime-local"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.marked_for_exit_at}
                  onChange={e => setFormData({ ...formData, marked_for_exit_at: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="p-4 bg-muted/50 rounded-xl border space-y-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              Indian Labour Code Compliance (Monthly Components)
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">DA (₹)</label>
                <input
                  type="number"
                  className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.da}
                  onChange={e => setFormData({ ...formData, da: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">HRA (₹)</label>
                <input
                  type="number"
                  className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.hra}
                  onChange={e => setFormData({ ...formData, hra: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Special Allowance (₹)</label>
                <input
                  type="number"
                  className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.special_allowance}
                  onChange={e => setFormData({ ...formData, special_allowance: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">State (for PT/LWF)</label>
              <select
                className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
              >
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-xl border space-y-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              Bank & Disbursal Information
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">Account Number</label>
                <input
                  type="text"
                  className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.bank_account_number}
                  onChange={e => setFormData({ ...formData, bank_account_number: e.target.value })}
                  placeholder="e.g. 1029384756"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">IFSC Code</label>
                <input
                  type="text"
                  className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring uppercase"
                  value={formData.ifsc_code}
                  onChange={e => setFormData({ ...formData, ifsc_code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SBIN0001234"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Bank Branch</label>
                <input
                  type="text"
                  className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.bank_branch}
                  onChange={e => setFormData({ ...formData, bank_branch: e.target.value })}
                  placeholder="e.g. MG Road, Bengaluru"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              {loading ? "Saving..." : (employee ? "Save Changes" : "Add Employee")}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function PayrollView({ adminId }: { adminId: number }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [approving, setApproving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/payroll/runs?admin_id=${adminId}`);
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [adminId]);

  const generateBankTransferPDF = (payouts: any[]) => {
    const doc = new jsPDF();
    const today = format(new Date(), "dd MMMM yyyy");

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("BANK TRANSFER INSTRUCTIONS", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${today}`, 20, 35);
    doc.text("To: The Branch Manager,", 20, 45);
    doc.text("Bank of India / Disbursement Partner", 20, 50);

    doc.setFont("helvetica", "bold");
    doc.text("Subject: Request for Salary Disbursement for March 2026", 20, 65);

    doc.setFont("helvetica", "normal");
    const intro = "Dear Sir/Madam, please process the following salary payments from our corporate account. The individual employee bank details are provided below for your processing.";
    const splitIntro = doc.splitTextToSize(intro, 170);
    doc.text(splitIntro, 20, 75);

    // Table Header
    let y = 95;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 5, 170, 8, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("Employee Name", 25, y);
    doc.text("Account Number", 75, y);
    doc.text("IFSC", 130, y);
    doc.text("Amount (INR)", 165, y);

    y += 10;
    doc.setFont("helvetica", "normal");
    let grandTotal = 0;

    payouts.forEach((p: any) => {
      let bank = { account_number: "N/A", ifsc_code: "N/A" };
      if (p.bank_info) {
        try { bank = JSON.parse(p.bank_info); } catch (e) { }
      }

      doc.text(p.name, 25, y);
      doc.text(bank.account_number || "N/A", 75, y);
      doc.text(bank.ifsc_code || "N/A", 130, y);
      doc.text(p.net_pay.toLocaleString(), 165, y);

      grandTotal += p.net_pay;
      y += 8;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // Total
    doc.setDrawColor(0);
    doc.line(20, y, 190, y);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text("GRAND TOTAL", 25, y);
    doc.text(`INR ${grandTotal.toLocaleString()}`, 165, y);

    // Footer
    y += 25;
    doc.text("For PayPulse Enterprise,", 20, y);
    y += 20;
    doc.text("Authorized Signatory", 20, y);

    doc.save(`Bank_Transfer_Instructions_March_2026.pdf`);
  };

  const handleRunPayroll = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/payroll/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: "March", year: 2026, admin_id: adminId }),
      });
      const data = await res.json();
      setResult(data);
      fetchHistory(); // Refresh history list after run
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  const handleApproveAndPay = async () => {
    if (!result?.runId) return;
    setApproving(true);
    try {
      const res = await fetch(`/api/payroll/approve/${result.runId}`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        generateBankTransferPDF(data.payouts);
        alert("Payroll approved and marked as paid! Bank Transfer Instruction PDF has been downloaded.");
        setResult(null); // Reset for next run or redirect
      } else {
        alert("Failed to approve payroll.");
      }
    } catch (e) {
      console.error(e);
      alert("Error approving payroll.");
    } finally {
      setApproving(false);
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
        <h1 className="text-2xl font-semibold tracking-tight">Run Payroll</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Process salaries for March 2026.
        </p>
      </div>

      {!result ? (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 text-center">
          <div className="flex aspect-square size-16 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
            <DollarSign className="size-8" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight mb-2">
            Ready to run payroll?
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
            This will calculate prorated salaries, apply deductions, and run our
            AI anomaly detection before finalizing.
          </p>
          <button
            onClick={handleRunPayroll}
            disabled={running}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2 gap-2 mx-auto"
          >
            {running ? (
              <>Processing...</>
            ) : (
              <>
                <Zap className="size-4" />
                Run Payroll for March
              </>
            )}
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex aspect-square size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="size-6" />
              </div>
              <div className="grid gap-1">
                <h2 className="text-lg font-semibold tracking-tight leading-none">
                  Payroll Draft Generated
                </h2>
                <p className="text-sm text-muted-foreground leading-none">
                  Review the details before finalizing.
                </p>
              </div>
            </div>
            <div className="text-right grid gap-1">
              <p className="text-sm text-muted-foreground leading-none">
                Total Payout
              </p>
              <p className="text-2xl font-bold font-mono tracking-tight">
                $
                {result.totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {result.anomalyReport && (
            <div className="rounded-xl border border-destructive/50 bg-destructive/10 text-destructive p-6">
              <div className="flex items-center gap-2 font-semibold mb-2">
                <AlertTriangle className="size-5" />
                AI Anomaly Report
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {result.anomalyReport}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setResult(null)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Discard Draft
            </button>
            <button
              onClick={handleApproveAndPay}
              disabled={approving}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {approving ? "Approving..." : "Approve & Pay"}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function DocumentsView({ adminId }: { adminId: number }) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users?admin_id=${adminId}`)
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data.filter((u: any) => u.role === "employee"));
        setLoading(false);
      });
  }, [adminId]);

  const generateAppointmentLetter = (emp: any) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("APPOINTMENT LETTER", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Date: ${format(new Date(), "dd MMMM yyyy")}`, 20, 40);
    doc.text(`To,`, 20, 50);
    doc.text(`${emp.name}`, 20, 55);
    doc.text(`${emp.email}`, 20, 60);

    doc.setFontSize(14);
    doc.text("Subject: Offer of Appointment", 20, 75);

    doc.setFontSize(12);
    const text = `Dear ${emp.name},

We are pleased to offer you the position of ${emp.department} at PayPulse Enterprise. 

Your annual CTC will be INR ${emp.base_salary.toLocaleString()}. 

This appointment is subject to the new Indian Labour Code 2026 guidelines. Your compensation structure is designed to ensure that at least 50% of your total remuneration constitutes 'Wages' for statutory purposes.

Please sign and return a copy of this letter as a token of your acceptance.

Yours Sincerely,
HR Department
PayPulse Enterprise`;

    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, 90);

    doc.save(`Appointment_Letter_${emp.name.replace(/\s+/g, "_")}.pdf`);
  };

  const generateForm16 = async (emp: any) => {
    // Fetch payslips to get aggregate data
    const res = await fetch(`/api/payslips/${emp.id}`);
    const payslips = await res.json();

    const totalGross = payslips.reduce((sum: number, p: any) => sum + p.gross_pay, 0);
    const totalNet = payslips.reduce((sum: number, p: any) => sum + p.net_pay, 0);
    const totalTax = totalGross - totalNet; // Simplified for demo

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
    doc.text(`Employee: ${emp.name}`, 25, 75);
    doc.text(`PAN: ABCDE1234F`, 25, 85);

    doc.text("Summary of Salary Paid and Tax Deducted", 20, 110);
    doc.rect(20, 115, 170, 60);
    doc.text(`1. Gross Salary:`, 25, 125);
    doc.text(`INR ${totalGross.toLocaleString()}`, 150, 125, { align: "right" });
    doc.text(`2. Total Deductions:`, 25, 140);
    doc.text(`INR ${totalTax.toLocaleString()}`, 150, 140, { align: "right" });
    doc.text(`3. Net Salary Paid:`, 25, 155);
    doc.text(`INR ${totalNet.toLocaleString()}`, 150, 155, { align: "right" });

    doc.save(`Form16_PartB_${emp.name.replace(/\s+/g, "_")}.pdf`);
  };

  const generateFormT = () => {
    const data = employees.map(emp => ({
      "Employee Name": emp.name,
      "Department": emp.department,
      "Annual CTC": emp.base_salary,
      "State": emp.state,
      "Status": emp.status,
      "Wages (50% Rule)": emp.base_salary * 0.5,
      "Allowances": emp.base_salary * 0.5
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Form T - Register of Wages");
    XLSX.writeFile(wb, "Statutory_Register_Form_T.xlsx");
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
          <h1 className="text-2xl font-semibold tracking-tight">
            Document Center
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Generate legal and statutory documents locally (Labour Code 2026 Compliant).
          </p>
        </div>
        <button
          onClick={generateFormT}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2"
        >
          <FileSpreadsheet className="size-4" />
          Export Form T (Excel)
        </button>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading...</div>
        ) : (
          employees.map((emp) => (
            <div key={emp.id} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex aspect-square size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{emp.name}</h3>
                  <p className="text-xs text-muted-foreground">{emp.department} • {emp.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => generateAppointmentLetter(emp)}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1 gap-2"
                >
                  <FileText className="size-3.5" />
                  Appointment Letter
                </button>
                <button
                  onClick={() => generateForm16(emp)}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1 gap-2"
                >
                  <Zap className="size-3.5" />
                  Form 16 (Part B)
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function TaxAgentView() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [
      {
        role: "agent",
        content:
          "Hello! I am your AI Tax Compliance Agent. How can I help you with payroll taxes today?",
      },
    ],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      // Filter out initial greeting to ensure contents starts with 'user'
      const historyToTranslate = messages[0].role === "agent" ? messages.slice(1) : messages;

      const contents: any[] = historyToTranslate.map(m => ({
        role: m.role === "agent" ? "model" : "user",
        parts: [{ text: m.content }]
      }));
      contents.push({ role: "user", parts: [{ text: userMsg }] });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          systemInstruction: "You are an expert Tax Compliance Agent for PayPulse, a modern payroll system. Answer the following question concisely and professionally.",
        },
      });
      setMessages((prev) => [...prev, { role: "agent", content: response.text || "I'm sorry, I couldn't generate a response." }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: "agent", content: "Error: Could not connect to the AI service. Please check your API key." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 sm:space-y-6 h-[calc(100vh-8rem)] flex flex-col"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Bot className="size-6 text-primary" />
          Auto-Pilot Tax Agent
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Ask questions about local tax laws, compliance, and deductions.
        </p>
      </div>

      <div className="flex-1 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground rounded-lg px-4 py-3 text-sm flex items-center gap-1.5">
                <div className="size-1.5 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                <div
                  className="size-1.5 bg-muted-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="size-1.5 bg-muted-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-muted/30">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about tax brackets, remote worker laws..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

function ReviewInvestmentsView() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProofs = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/investments');
    const data = await res.json();
    setProofs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProofs();
  }, []);

  const handleReview = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/investments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Review Investment Proofs</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Verify and approve employee tax-saving investment submissions.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading proofs...</div>
        ) : proofs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <CheckCircle2 className="size-12 text-muted-foreground/20 mx-auto mb-4" />
            <p>All caught up! No pending proofs to review.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">FY</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {proofs.map((p) => (
                <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary/10 text-primary font-medium text-xs">
                        {p.employee_name.charAt(0)}
                      </div>
                      <p className="font-medium">{p.employee_name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">₹{p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.financial_year}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => window.open(p.receipt_url, '_blank')}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                    >
                      View Receipt
                    </button>
                    <button
                      onClick={() => handleReview(p.id, 'rejected')}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-rose-50 hover:text-rose-600 h-8 px-3"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleReview(p.id, 'approved')}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
