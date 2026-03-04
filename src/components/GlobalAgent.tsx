import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';

// Initialize AI on the client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getUsersDeclaration: FunctionDeclaration = {
  name: 'get_users',
  description: 'Get a list of all users/employees in the database.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

const addUserDeclaration: FunctionDeclaration = {
  name: 'add_user',
  description: 'Add a new user/employee to the database with Indian Labour Code 2026 compliance.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: 'Full name of the user' },
      email: { type: Type.STRING, description: 'Email address' },
      role: { type: Type.STRING, description: 'Role: "admin" or "employee"' },
      department: { type: Type.STRING, description: 'Department name' },
      base_salary: { type: Type.NUMBER, description: 'Annual CTC in INR' },
      da: { type: Type.NUMBER, description: 'Monthly Dearness Allowance' },
      hra: { type: Type.NUMBER, description: 'Monthly House Rent Allowance' },
      special_allowance: { type: Type.NUMBER, description: 'Monthly Special Allowance' },
      state: { type: Type.STRING, description: 'State for PT/LWF (e.g., "Karnataka", "Maharashtra")' },
      tax_regime: { type: Type.STRING, description: 'Tax Regime: "new" or "old"' },
    },
    required: ['name', 'email', 'role', 'department', 'base_salary'],
  },
};

const updateUserSalaryDeclaration: FunctionDeclaration = {
  name: 'update_user_salary',
  description: 'Update the base salary of an existing user.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      userId: { type: Type.INTEGER, description: 'ID of the user' },
      new_salary: { type: Type.NUMBER, description: 'New annual base salary' },
    },
    required: ['userId', 'new_salary'],
  },
};

const updateUserDeclaration: FunctionDeclaration = {
  name: 'update_user',
  description: 'Update all details of an existing user/employee in the database.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      userId: { type: Type.INTEGER, description: 'ID of the user to update' },
      name: { type: Type.STRING, description: 'Full name' },
      email: { type: Type.STRING, description: 'Email address' },
      role: { type: Type.STRING, description: 'Role: "admin" or "employee"' },
      department: { type: Type.STRING, description: 'Department name' },
      base_salary: { type: Type.NUMBER, description: 'Annual CTC in INR' },
      da: { type: Type.NUMBER, description: 'Monthly Dearness Allowance' },
      hra: { type: Type.NUMBER, description: 'Monthly House Rent Allowance' },
      special_allowance: { type: Type.NUMBER, description: 'Monthly Special Allowance' },
      state: { type: Type.STRING, description: 'State for PT/LWF' },
      status: { type: Type.STRING, description: 'Status: "active", "inactive", or "exiting"' },
      tax_regime: { type: Type.STRING, description: 'Tax Regime: "new" or "old"' },
      ot_hours: { type: Type.NUMBER, description: 'Overtime hours worked' },
      marked_for_exit_at: { type: Type.STRING, description: 'Exit date/time (ISO string)' },
    },
    required: ['userId', 'name', 'email', 'role', 'department', 'base_salary'],
  },
};

const deleteUserDeclaration: FunctionDeclaration = {
  name: 'delete_user',
  description: 'Delete a user from the database.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      userId: { type: Type.INTEGER, description: 'ID of the user to delete' },
    },
    required: ['userId'],
  },
};

const runPayrollDeclaration: FunctionDeclaration = {
  name: 'run_payroll',
  description: 'Run payroll for a specific month and year.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      month: { type: Type.STRING, description: 'Month name (e.g., "March")' },
      year: { type: Type.INTEGER, description: 'Year (e.g., 2026)' },
    },
    required: ['month', 'year'],
  },
};

const navigateDeclaration: FunctionDeclaration = {
  name: 'navigate_to',
  description: 'Navigate the user to a different page in the application.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      path: { type: Type.STRING, description: 'The URL path to navigate to (e.g., "/", "/login", "/admin", "/employee")' },
    },
    required: ['path'],
  },
};

// Error Boundary for the Global Agent to prevent it from crashing the entire app
class AgentErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Global Agent Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Don't render the agent if it crashes
    }
    return this.props.children;
  }
}

function GlobalAgentInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([
    { role: 'agent', content: 'Hi! I am your AI assistant with full system access. I can navigate pages, manage users, run payroll, and more. How can I help?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Filter out the initial greeting if it's the first message to ensure contents starts with 'user'
      const historyToTranslate = messages[0].role === 'agent' ? messages.slice(1) : messages;

      const contents: any[] = historyToTranslate.map(m => ({
        role: m.role === 'agent' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      contents.push({ role: 'user', parts: [{ text: userMsg }] });

      let response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents,
        config: {
          systemInstruction: 'You are an all-powerful AI assistant for PayPulse. You have complete control over the database and website. You can view users, add/edit/delete them, run payroll, and navigate the user around the app. Be concise, helpful, and confirm when you take actions.',
          tools: [{
            functionDeclarations: [
              getUsersDeclaration,
              addUserDeclaration,
              updateUserDeclaration,
              updateUserSalaryDeclaration,
              deleteUserDeclaration,
              runPayrollDeclaration,
              navigateDeclaration
            ]
          }]
        }
      });

      let dataModified = false;

      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionResponses = [];
        for (const call of response.functionCalls) {
          const { name, args } = call;
          let result;
          try {
            if (name === 'get_users') {
              const res = await fetch('/api/users');
              result = await res.json();
            } else if (name === 'add_user') {
              const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(args)
              });
              result = await res.json();
              dataModified = true;
            } else if (name === 'update_user') {
              const { userId, ...updateData } = args;
              const res = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
              });
              result = await res.json();
              dataModified = true;
            } else if (name === 'update_user_salary') {
              const res = await fetch(`/api/users/${args.userId}/salary`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ new_salary: args.new_salary })
              });
              result = await res.json();
              dataModified = true;
            } else if (name === 'delete_user') {
              const res = await fetch(`/api/users/${args.userId}`, {
                method: 'DELETE'
              });
              result = await res.json();
              dataModified = true;
            } else if (name === 'run_payroll') {
              const res = await fetch('/api/payroll/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(args)
              });
              result = await res.json();
              dataModified = true;
            } else if (name === 'navigate_to') {
              navigate(args.path);
              result = { success: true, message: `Navigating to ${args.path}` };
            }
          } catch (err: any) {
            result = { error: err.message };
          }

          functionResponses.push({
            name,
            response: result
          });
        }

        // Add the model's function call to history
        contents.push(response.candidates?.[0]?.content);

        // Add the function responses
        contents.push({
          role: 'user',
          parts: functionResponses.map(fr => ({
            functionResponse: {
              name: fr.name,
              response: fr.response as object
            }
          }))
        });

        // Get final response
        response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents,
          config: {
            systemInstruction: 'You are an all-powerful AI assistant for PayPulse. You have complete control over the database and website. You can view users, add/edit/delete them, run payroll, and navigate the user around the app. Be concise, helpful, and confirm when you take actions.',
            tools: [{
              functionDeclarations: [
                getUsersDeclaration,
                addUserDeclaration,
                updateUserDeclaration,
                updateUserSalaryDeclaration,
                deleteUserDeclaration,
                runPayrollDeclaration,
                navigateDeclaration
              ]
            }]
          }
        });
      }

      setMessages(prev => [...prev, { role: 'agent', content: response.text || 'I have processed your request.' }]);

      if (dataModified) {
        window.dispatchEvent(new Event('paypulse-data-updated'));
      }

    } catch (e) {
      console.error("Global Agent Error:", e);
      setMessages(prev => [...prev, { role: 'agent', content: 'Sorry, I encountered an error connecting to the system. Please ensure your API key is valid.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 size-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-transform hover:scale-105 z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Terminal className="size-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[400px] h-[600px] max-h-[80vh] bg-card text-card-foreground border shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Terminal className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">System Agent</h3>
                  <p className="text-xs text-muted-foreground">Full Access Granted</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-sm px-4 py-3 text-sm flex items-center gap-1.5">
                    <div className="size-1.5 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                    <div className="size-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="size-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-background">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Command the system..."
                  className="flex h-10 w-full rounded-full border border-input bg-muted/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex aspect-square size-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function GlobalAgent() {
  return (
    <AgentErrorBoundary>
      <GlobalAgentInner />
    </AgentErrorBoundary>
  );
}
