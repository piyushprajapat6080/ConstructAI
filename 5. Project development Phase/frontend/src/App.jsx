import React, { useState, useEffect } from 'react';
import Sidebar, { NAVIGATION_ITEMS } from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import AccessDenied from './components/AccessDenied';
import { ToastProvider, useToast } from './components/Toast';
import SafetyMonitorView from './views/SafetyMonitorView';
import CrackDetectionView from './views/CrackDetectionView';
import RealEstateValuationView from './views/RealEstateValuationView';
import ProjectPlannerView from './views/ProjectPlannerView';
import KnowledgeAssistantView from './views/KnowledgeAssistantView';
import ChatbotView from './views/ChatbotView';
import DailySiteAssistantView from './views/DailySiteAssistantView';
import WeatherAdvisorView from './views/WeatherAdvisorView';
import EnterpriseStaffProvisioning from './components/EnterpriseStaffProvisioning';
import DashboardOverviewView from './views/DashboardOverviewView';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { api } from './api/client';

function MainApp() {
  const [token, setToken] = useState(() => localStorage.getItem('constructai_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('constructai_user');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    if (user && user.default_view && user.default_view !== 'planner' && user.default_view !== 'safety') {
      return user.default_view;
    }
    return 'overview';
  });
  
  const [isOnline, setIsOnline] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    // Check backend health
    api.checkHealth()
      .then((res) => {
        setIsOnline(res.status === 'healthy');
      })
      .catch(() => {
        setIsOnline(false);
      });
  }, []);

  const handleLoginSuccess = (authData) => {
    setToken(authData.access_token);
    setUser(authData.user);
    setActiveTab('overview');
    addToast({
      type: 'success',
      title: `Access Granted: ${authData.user.role}`,
      message: `Welcome, ${authData.user.name} [${authData.user.employee_id}]. Terminal clearance verified.`
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('constructai_token');
    localStorage.removeItem('constructai_user');
    localStorage.removeItem('constructai_role');
    setToken(null);
    setUser(null);
    addToast({
      type: 'info',
      title: 'Terminal Session Closed',
      message: 'You have been securely logged out.'
    });
  };

  // Quick Elevate to Admin (Convenient for Live Viva & Demo)
  const handleElevateToAdmin = async () => {
    try {
      const res = await api.login({
        username: 'admin@constructai.internal',
        password: 'AdminAccessKey#2026',
        role: 'Project Admin / Director'
      });
      handleLoginSuccess(res);
    } catch (_) {
      // Fallback local elevation
      const adminUser = {
        id: 'USR-DIR-001',
        name: 'Project Director',
        role: 'Project Admin / Director',
        role_title: 'Executive Root Admin',
        employee_id: 'DIR-EXEC-001',
        department: 'Executive Directorate & Operations',
        permissions: ['admin:all'],
        default_view: 'overview'
      };
      setUser(adminUser);
      localStorage.setItem('constructai_user', JSON.stringify(adminUser));
      addToast({
        type: 'success',
        title: 'Elevated to Project Admin',
        message: 'Unrestricted clearance granted.'
      });
    }
  };

  // If user is not authenticated, show modern industrial login screen
  if (!token || !user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // RBAC Permission Check
  const currentNav = NAVIGATION_ITEMS.find((item) => item.id === activeTab) || NAVIGATION_ITEMS[0];
  const isAllowed = currentNav.rolesAllowed.includes(user.role);

  const renderActiveView = () => {
    if (!isAllowed) {
      return (
        <AccessDenied
          moduleName={currentNav.label}
          userRole={user.role}
          requiredRole={currentNav.requiredRole}
          onSwitchToAdmin={handleElevateToAdmin}
          onSwitchRole={handleLogout}
        />
      );
    }

    switch (activeTab) {
      case 'overview':
      case 'dashboard':
        return (
          <DashboardOverviewView
            user={user}
            setActiveTab={setActiveTab}
            isOnline={isOnline}
            onElevateToAdmin={handleElevateToAdmin}
          />
        );
      case 'provisioning':
        return <EnterpriseStaffProvisioning />;
      case 'safety':
        return <SafetyMonitorView />;
      case 'crack':
        return <CrackDetectionView />;
      case 'valuation':
        return <RealEstateValuationView />;
      case 'planner':
        return <ProjectPlannerView />;
      case 'knowledge':
        return <KnowledgeAssistantView />;
      case 'chatbot':
        return <ChatbotView />;
      case 'daily':
        return <DailySiteAssistantView />;
      case 'weather':
        return <WeatherAdvisorView />;
      default:
        return (
          <DashboardOverviewView
            user={user}
            setActiveTab={setActiveTab}
            isOnline={isOnline}
            onElevateToAdmin={handleElevateToAdmin}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-slate-800">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
          }}
          isOnline={isOnline}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          isOnline={isOnline}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar for mobile only */}
        <div className="lg:hidden bg-industrial-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-extrabold tracking-wider text-sm">
              CONSTRUCT<span className="text-construction-500">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-sky-400 font-mono font-semibold">
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Global Desktop Header */}
        <Header 
          activeTab={activeTab} 
          user={user}
          onLogout={handleLogout}
        />

        {/* Dynamic Main View Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
