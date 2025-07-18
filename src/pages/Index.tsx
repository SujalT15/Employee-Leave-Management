import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import Navbar from '../components/layout/Navbar';
import EmployeeDashboard from '../components/employee/EmployeeDashboard';
import ManagerDashboard from '../components/manager/ManagerDashboard';
import AdminDashboard from '../components/admin/AdminDashboard';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'Employee':
        return <EmployeeDashboard />;
      case 'Manager':
        return <ManagerDashboard />;
      case 'Admin':
        return <AdminDashboard />;
      default:
        return <EmployeeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Index;
