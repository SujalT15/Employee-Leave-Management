import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { LeaveBalance } from '../../types/types';
import { toast } from '../../hooks/use-toast';

interface LeaveApplicationFormProps {
  onClose: () => void;
  employeeBalance?: LeaveBalance;
}

const LeaveApplicationForm: React.FC<LeaveApplicationFormProps> = ({ onClose, employeeBalance }) => {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return daysDiff > 0 ? daysDiff : 0;
  };

  const totalDays = calculateDays(formData.startDate, formData.endDate);

  const getAvailableLeaves = (leaveType: string) => {
    if (!employeeBalance) return 0;
    switch (leaveType) {
      case 'Casual':
        return employeeBalance.casualLeavesRemaining;
      case 'Sick':
        return employeeBalance.sickLeavesRemaining;
      case 'Annual':
        return employeeBalance.annualLeavesRemaining;
      default:
        return 0;
    }
  };

  const availableLeaves = getAvailableLeaves(formData.leaveType);
  const isExceedingLimit = totalDays > availableLeaves;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isExceedingLimit) {
      toast({
        title: "Insufficient Leave Balance",
        description: `You only have ${availableLeaves} ${formData.leaveType.toLowerCase()} leaves remaining.`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Leave Application Submitted",
      description: "Your leave request has been submitted successfully and is pending approval.",
    });
    
    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Apply for Leave</h1>
          <p className="text-muted-foreground">Submit your leave application</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Balance Info */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Leave Balance</CardTitle>
            <CardDescription>Your available leaves for 2024</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Casual Leave</span>
              <span className="font-semibold text-success">{employeeBalance?.casualLeavesRemaining || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Sick Leave</span>
              <span className="font-semibold text-warning">{employeeBalance?.sickLeavesRemaining || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Annual Leave</span>
              <span className="font-semibold text-primary">{employeeBalance?.annualLeavesRemaining || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle>Leave Application Form</CardTitle>
            <CardDescription>Fill in the details for your leave request</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select value={formData.leaveType} onValueChange={(value) => handleInputChange('leaveType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Casual">Casual Leave</SelectItem>
                      <SelectItem value="Sick">Sick Leave</SelectItem>
                      <SelectItem value="Annual">Annual Leave</SelectItem>
                      <SelectItem value="Maternity">Maternity Leave</SelectItem>
                      <SelectItem value="Paternity">Paternity Leave</SelectItem>
                      <SelectItem value="Emergency">Emergency Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Available Leaves</Label>
                  <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formData.leaveType ? `${availableLeaves} days remaining` : 'Select leave type'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="pl-10"
                      min={today}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="pl-10"
                      min={formData.startDate || today}
                      required
                    />
                  </div>
                </div>
              </div>

              {totalDays > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Days:</span>
                    <span className={`text-lg font-bold ${isExceedingLimit ? 'text-destructive' : 'text-success'}`}>
                      {totalDays} day(s)
                    </span>
                  </div>
                </div>
              )}

              {isExceedingLimit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You are requesting {totalDays} days but only have {availableLeaves} {formData.leaveType.toLowerCase()} leaves remaining.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Leave</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Please provide a reason for your leave request..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isExceedingLimit}
                  className="bg-gradient-primary hover:bg-primary-hover"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaveApplicationForm;