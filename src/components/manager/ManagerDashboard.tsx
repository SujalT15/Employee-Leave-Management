import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users, Clock, CheckCircle, XCircle, Eye, UserCheck } from 'lucide-react';
import { mockLeaveRequests, mockUsers } from '../../data/mockData';
import { LeaveRequest } from '../../types/types';
import PendingRequestsTable from './PendingRequestsTable';
import SubordinateHistoryTable from './SubordinateHistoryTable';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'pending' | 'history'>('dashboard');

  // Get subordinates (employees reporting to this manager)
  const subordinates = mockUsers.filter(u => u.managerId === user?.id);
  const subordinateIds = subordinates.map(s => s.id);

  // Get leave requests from subordinates
  const subordinateRequests = mockLeaveRequests.filter(req => subordinateIds.includes(req.employeeId));
  const pendingRequests = subordinateRequests.filter(req => req.status === 'Pending');
  const approvedRequests = subordinateRequests.filter(req => req.status === 'Approved');
  const rejectedRequests = subordinateRequests.filter(req => req.status === 'Rejected');

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

  if (activeView === 'pending') {
    return (
      <PendingRequestsTable
        pendingRequests={pendingRequests}
        onClose={() => setActiveView('dashboard')}
      />
    );
  }

  if (activeView === 'history') {
    return (
      <SubordinateHistoryTable
        subordinateRequests={subordinateRequests}
        subordinates={subordinates}
        onClose={() => setActiveView('dashboard')}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.name} - Review and manage your team's leave requests</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setActiveView('pending')}
            className="flex items-center space-x-2"
          >
            <Clock className="h-4 w-4" />
            <span>Pending Requests</span>
            {pendingRequests.length > 0 && (
              <Badge variant="secondary">{pendingRequests.length}</Badge>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveView('history')}
          >
            <Eye className="mr-2 h-4 w-4" />
            Team History
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{subordinates.length}</div>
            <p className="text-xs text-muted-foreground">Direct reports</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{approvedRequests.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{rejectedRequests.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Pending Requests */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Pending Requests</span>
              </CardTitle>
              <CardDescription>Leave requests awaiting your approval</CardDescription>
            </div>
            {pendingRequests.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveView('pending')}
              >
                View All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg bg-warning/5">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium">{request.employeeName}</div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    <Badge variant="outline">{request.leaveType}</Badge>
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
            {pendingRequests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
                <p>No pending requests. All caught up!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Team Overview */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Team Overview</span>
          </CardTitle>
          <CardDescription>Your direct reports and their recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subordinates.map((subordinate) => {
              const subordinateReqs = subordinateRequests.filter(req => req.employeeId === subordinate.id);
              const recentReq = subordinateReqs.sort((a, b) => 
                new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
              )[0];

              return (
                <div key={subordinate.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium">{subordinate.name}</div>
                      <Badge variant="outline">{subordinate.position}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {subordinate.department} • Joined {formatDate(subordinate.joinDate || '')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {subordinateReqs.length} total requests
                    </div>
                    {recentReq && (
                      <div className="text-xs text-muted-foreground">
                        Last: {recentReq.leaveType} ({formatDate(recentReq.appliedDate)})
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {subordinates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <p>No team members assigned yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard;