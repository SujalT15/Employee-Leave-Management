export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'Manager' | 'Employee';
  managerId?: string;
  department?: string;
  position?: string;
  joinDate?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Casual' | 'Sick' | 'Annual' | 'Maternity' | 'Paternity' | 'Emergency';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  comments?: string;
  totalDays: number;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  casualLeavesRemaining: number;
  sickLeavesRemaining: number;
  annualLeavesRemaining: number;
  totalCasualLeaves: number;
  totalSickLeaves: number;
  totalAnnualLeaves: number;
  year: number;
}

export interface LeaveTypeBalance {
  type: string;
  remaining: number;
  total: number;
}

export interface DashboardStats {
  totalEmployees?: number;
  pendingRequests?: number;
  approvedRequests?: number;
  rejectedRequests?: number;
  totalRequests?: number;
  leaveBalance?: LeaveBalance;
}