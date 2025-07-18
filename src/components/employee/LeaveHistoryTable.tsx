import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft, Calendar, Clock, MessageCircle } from 'lucide-react';
import { LeaveRequest } from '../../types/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface LeaveHistoryTableProps {
  leaveRequests: LeaveRequest[];
  onClose: () => void;
}

const LeaveHistoryTable: React.FC<LeaveHistoryTableProps> = ({ leaveRequests, onClose }) => {
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

  const getLeaveTypeColor = (leaveType: string) => {
    switch (leaveType) {
      case 'Annual':
        return 'bg-primary text-primary-foreground';
      case 'Sick':
        return 'bg-warning text-warning-foreground';
      case 'Casual':
        return 'bg-success text-success-foreground';
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

  const sortedRequests = [...leaveRequests].sort((a, b) => 
    new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leave History</h1>
          <p className="text-muted-foreground">View all your leave requests and their status</p>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>All Leave Requests</span>
          </CardTitle>
          <CardDescription>
            Complete history of your leave applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedRequests.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Leave Requests</h3>
              <p className="text-muted-foreground">You haven't submitted any leave requests yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <Badge className={getLeaveTypeColor(request.leaveType)}>
                          {request.leaveType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{request.totalDays}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(request.appliedDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={request.reason}>
                          {request.reason}
                        </div>
                      </TableCell>
                      <TableCell>
                        {request.comments ? (
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                            <div className="max-w-xs truncate text-sm" title={request.comments}>
                              {request.comments}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">{sortedRequests.length}</div>
            <p className="text-xs text-muted-foreground">Total Requests</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">
              {sortedRequests.filter(r => r.status === 'Pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">
              {sortedRequests.filter(r => r.status === 'Approved').length}
            </div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {sortedRequests.filter(r => r.status === 'Rejected').length}
            </div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaveHistoryTable;