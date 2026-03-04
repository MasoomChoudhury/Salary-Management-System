/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './lib/firebase';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelection';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import GlobalAgent from './components/GlobalAgent';

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<{ id: number; name: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We strictly wait for onAuthStateChanged to finalize the user object
    // to prevent "stale" state from previous sessions.
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      setFirebaseUser(currentUser);

      if (!currentUser) {
        setUser(null);
        localStorage.removeItem('paypulse_user');
        setIsLoading(false);
        return;
      }

      // 1. Check if user exists in our DB by email
      try {
        const queryEmail = currentUser.email?.trim().toLowerCase();
        const res = await fetch(`/api/users/by-email/${encodeURIComponent(queryEmail || '')}`);
        if (res.ok) {
          const dbUser = await res.json();
          const mappedUser = {
            ...dbUser,
            email: queryEmail
          };
          setUser(mappedUser);
          localStorage.setItem('paypulse_user', JSON.stringify(mappedUser));
        } else {
          // New user -> clear any stale state
          setUser(null);
          localStorage.removeItem('paypulse_user');
        }
      } catch (e) {
        console.error("Failed to fetch user from DB", e);
        setUser(null);
      }

      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleRoleSelect = async (role: 'admin' | 'employee') => {
    if (firebaseUser) {
      try {
        setIsLoading(true);
        // Create user in NeonDB
        const queryEmail = firebaseUser.email?.trim().toLowerCase();
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: queryEmail,
            role: role,
            department: role === 'admin' ? 'HR' : 'Engineering', // Default
            base_salary: role === 'admin' ? 120000 : 60000,
            status: 'active'
          })
        });

        if (res.ok) {
          const data = await res.json();
          const mappedUser = {
            id: data.id,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            role: role,
            email: queryEmail
          };
          setUser(mappedUser);
          localStorage.setItem('paypulse_user', JSON.stringify(mappedUser));
        } else {
          const errData = await res.json();
          console.error("Failed to create user", errData);

          // If the reason it failed is because the email actually already exists 
          // (e.g. race condition or case sensitivity issue previously missed), try linking manually
          if (errData.error?.includes('duplicate key value')) {
            const fallbackRes = await fetch(`/api/users/by-email/${encodeURIComponent(queryEmail || '')}`);
            if (fallbackRes.ok) {
              const dbUser = await fallbackRes.json();
              const mappedUser = {
                id: dbUser.id,
                name: dbUser.name,
                role: dbUser.role,
                email: queryEmail
              };
              setUser(mappedUser);
              localStorage.setItem('paypulse_user', JSON.stringify(mappedUser));
              return;
            }
          }

          alert(`Could not complete setup: ${errData.error}`);
        }
      } catch (e: any) {
        console.error("Failed to execute role selection", e);
        alert(`Network error: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('paypulse_user');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={firebaseUser ? <Navigate to="/select-role" /> : <Login />}
        />
        <Route
          path="/select-role"
          element={firebaseUser ? (user ? <Navigate to={`/${user.role}`} /> : <RoleSelection onSelect={handleRoleSelect} />) : <Navigate to="/login" />}
        />
        <Route
          path="/admin/*"
          element={user?.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/select-role" />}
        />
        <Route
          path="/employee/*"
          element={user?.role === 'employee' ? <EmployeeDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/select-role" />}
        />
      </Routes>
      <GlobalAgent />
    </BrowserRouter>
  );
}

