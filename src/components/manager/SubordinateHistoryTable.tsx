import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft, Users, Calendar } from 'lucide-react';
import { LeaveRequest, User } from '../../types/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface SubordinateHistoryTableProps {
  subordinateRequests: LeaveRequest[];
  subordinates: User[];
  onClose: () => void;
}

const SubordinateHistoryTable: React.FC<SubordinateHistoryTableProps> = ({ 
  subordinateRequests, 
  subordinates, 
  onClose 
}) => {
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

  const sortedRequests = [...subordinateRequests].sort((a, b) => 
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
          <h1 className="text-3xl font-bold text-foreground">Team History</h1>
          <p className="text-muted-foreground">Complete leave history for your team members</p>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Team Leave History</span>
          </CardTitle>
          <CardDescription>
            All leave requests from your direct reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.employeeName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.leaveType}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{request.totalDays}</span>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubordinateHistoryTable;