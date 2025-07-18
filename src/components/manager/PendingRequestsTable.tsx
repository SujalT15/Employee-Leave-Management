import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { LeaveRequest } from '../../types/types';
import { toast } from '../../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface PendingRequestsTableProps {
  pendingRequests: LeaveRequest[];
  onClose: () => void;
}

const PendingRequestsTable: React.FC<PendingRequestsTableProps> = ({ pendingRequests, onClose }) => {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const handleApprove = async (request: LeaveRequest) => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Request Approved",
      description: `${request.employeeName}'s leave request has been approved.`,
    });
    
    setIsProcessing(false);
    setSelectedRequest(null);
    setComments('');
  };

  const handleReject = async (request: LeaveRequest) => {
    if (!comments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Request Rejected",
      description: `${request.employeeName}'s leave request has been rejected.`,
    });
    
    setIsProcessing(false);
    setSelectedRequest(null);
    setComments('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pending Requests</h1>
          <p className="text-muted-foreground">Review and approve leave requests from your team</p>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Awaiting Approval</span>
            {pendingRequests.length > 0 && (
              <Badge variant="secondary">{pendingRequests.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Leave requests that need your immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">No pending requests to review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.employeeName}</TableCell>
                      <TableCell>
                        <Badge className={getLeaveTypeColor(request.leaveType)}>
                          {request.leaveType}
                        </Badge>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                            >
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Review Leave Request</DialogTitle>
                              <DialogDescription>
                                Review and approve/reject this leave request
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedRequest && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Employee</label>
                                    <p className="text-sm text-muted-foreground">{selectedRequest.employeeName}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Leave Type</label>
                                    <p className="text-sm text-muted-foreground">{selectedRequest.leaveType}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Duration</label>
                                    <p className="text-sm text-muted-foreground">
                                      {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Total Days</label>
                                    <p className="text-sm text-muted-foreground">{selectedRequest.totalDays} days</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium">Reason</label>
                                  <p className="text-sm text-muted-foreground mt-1">{selectedRequest.reason}</p>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Comments</label>
                                  <Textarea
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Add your comments (required for rejection)..."
                                    className="min-h-[80px]"
                                  />
                                </div>

                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleReject(selectedRequest)}
                                    disabled={isProcessing}
                                    className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    {isProcessing ? 'Processing...' : 'Reject'}
                                  </Button>
                                  <Button
                                    onClick={() => handleApprove(selectedRequest)}
                                    disabled={isProcessing}
                                    className="bg-success hover:bg-success/90 text-success-foreground"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {isProcessing ? 'Processing...' : 'Approve'}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingRequestsTable;