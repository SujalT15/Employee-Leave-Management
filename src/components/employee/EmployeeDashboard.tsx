import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Clock, TrendingUp, Plus, Eye } from 'lucide-react';
import { mockLeaveRequests, mockLeaveBalances } from '../../data/mockData';
import { LeaveRequest, LeaveBalance } from '../../types/types';
import LeaveApplicationForm from './LeaveApplicationForm';
import LeaveHistoryTable from './LeaveHistoryTable';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Get employee's leave requests and balance
  const employeeRequests = mockLeaveRequests.filter(req => req.employeeId === user?.id);
  const employeeBalance = mockLeaveBalances.find(balance => balance.employeeId === user?.id);

  const pendingRequests = employeeRequests.filter(req => req.status === 'Pending');
  const approvedRequests = employeeRequests.filter(req => req.status === 'Approved');
  const rejectedRequests = employeeRequests.filter(req => req.status === 'Rejected');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-success text-success-foreground';
      case 'Rejected':
        return 'bg-destructive text-destructive-foreground';
      case 'Pending':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (showApplicationForm) {
    return (
      <LeaveApplicationForm
        onClose={() => setShowApplicationForm(false)}
        employeeBalance={employeeBalance}
      />
    );
  }

  if (showHistory) {
    return (
      <LeaveHistoryTable
        leaveRequests={employeeRequests}
        onClose={() => setShowHistory(false)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Manage your leave requests and check your balance</p>
        </div>
        <Button
          onClick={() => setShowApplicationForm(true)}
          className="bg-gradient-primary hover:bg-primary-hover"
        >
          <Plus className="mr-2 h-4 w-4" />
          Apply for Leave
        </Button>
      </div>

      {/* Leave Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casual Leave</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {employeeBalance?.casualLeavesRemaining || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              of {employeeBalance?.totalCasualLeaves || 0} remaining
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {employeeBalance?.sickLeavesRemaining || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              of {employeeBalance?.totalSickLeaves || 0} remaining
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Leave</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {employeeBalance?.annualLeavesRemaining || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              of {employeeBalance?.totalAnnualLeaves || 0} remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leave Requests */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Leave Requests</CardTitle>
              <CardDescription>Your latest leave applications</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(true)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employeeRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium">{request.leaveType} Leave</div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {request.reason}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{request.totalDays} day(s)</div>
                  <div className="text-xs text-muted-foreground">
                    Applied: {formatDate(request.appliedDate)}
                  </div>
                </div>
              </div>
            ))}
            {employeeRequests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No leave requests found. Apply for your first leave!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Pending Requests</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{approvedRequests.length}</div>
            <p className="text-xs text-muted-foreground">Approved Requests</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{rejectedRequests.length}</div>
            <p className="text-xs text-muted-foreground">Rejected Requests</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;