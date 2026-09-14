import React from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminOverview } from './pages/AdminOverview';
import { AdminFleet } from './pages/AdminFleet';
import { AdminShipments } from './pages/AdminShipments';
import { AdminLiveOps } from './pages/AdminLiveOps';
import { AdminMatching } from './pages/AdminMatching';
import { AdminFinance } from './pages/AdminFinance';
import { AdminSupport } from './pages/AdminSupport';
import { AdminInsights } from './pages/AdminInsights';
import { AdminAuditLog } from './pages/AdminAuditLog';
import { AdminUsers } from './pages/AdminUsers';
import { AdminSettings } from './pages/AdminSettings';

const AdminAppContent: React.FC = () => {
  const { isAuthenticated, activePage } = useAdmin();

  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  const getPageInfo = () => {
    switch (activePage) {
      case 'overview':
        return { 
          title: 'Network Command Center', 
          subtitle: 'Real-time telemetry, operational metrics & corridor health' 
        };
      case 'fleet':
        return { 
          title: 'Fleet Operations', 
          subtitle: 'Commercial vehicle registry, carrier capacity & active payloads' 
        };
      case 'shipments':
        return { 
          title: 'Shipments & Manifests', 
          subtitle: 'Shipper freight bookings, route transit progress & proof of delivery' 
        };
      case 'live_ops':
        return { 
          title: 'Live Operations & Dispatch', 
          subtitle: 'Real-time national GPS radar & continuous telemetry feed' 
        };
      case 'matching':
        return { 
          title: 'Matching Monitor', 
          subtitle: 'Multi-factor algorithm diagnostics & 6-factor weight analytics' 
        };
      case 'finance':
        return { 
          title: 'Financial Clearinghouse', 
          subtitle: 'Platform take-rate, carrier disbursements & escrow settlements' 
        };
      case 'support':
        return { 
          title: 'Disputes & Carrier Support', 
          subtitle: 'Shipment SLA violations, cargo damages & carrier ticket triage' 
        };
      case 'insights':
        return { 
          title: 'Network Intelligence', 
          subtitle: 'Volume trends, empty-mile avoidance & sustainability benchmarks' 
        };
      case 'audit':
        return { 
          title: 'Operational Audit Log', 
          subtitle: 'Tamper-evident administrative action log & security events' 
        };
      case 'users':
        return { 
          title: 'User Management', 
          subtitle: 'Shippers, certified fleet operators & verified commercial drivers' 
        };
      case 'settings':
        return { 
          title: 'System Settings', 
          subtitle: 'Dispatch thresholds, matching rules & API connections' 
        };
      default:
        return { 
          title: 'Admin Console', 
          subtitle: 'COLLABFLEET Network Operations' 
        };
    }
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return <AdminOverview />;
      case 'fleet':
        return <AdminFleet />;
      case 'shipments':
        return <AdminShipments />;
      case 'live_ops':
        return <AdminLiveOps />;
      case 'matching':
        return <AdminMatching />;
      case 'finance':
        return <AdminFinance />;
      case 'support':
        return <AdminSupport />;
      case 'insights':
        return <AdminInsights />;
      case 'audit':
        return <AdminAuditLog />;
      case 'users':
        return <AdminUsers />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <AdminLayout title={title} subtitle={subtitle}>
      {renderActivePage()}
    </AdminLayout>
  );
};

export const App: React.FC = () => {
  return (
    <AdminProvider>
      <AdminAppContent />
    </AdminProvider>
  );
};

export default App;
