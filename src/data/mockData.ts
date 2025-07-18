import { User, LeaveRequest, LeaveBalance } from '../types/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ravi Verma',
    email: 'admin@company.com',
    password: 'admin123',
    role: 'Admin',
    department: 'Human Resources',
    position: 'HR Director',
    joinDate: '2020-01-15'
  },
  {
    id: '2',
    name: 'Amit Sharma',
    email: 'amit.sharma@company.com',
    password: 'manager123',
    role: 'Manager',
    department: 'Engineering',
    position: 'Engineering Manager',
    joinDate: '2021-03-10'
  },
  {
    id: '3',
    name: 'Priya Mehta',
    email: 'priya.mehta@company.com',
    password: 'employee123',
    role: 'Employee',
    managerId: '2',
    department: 'Engineering',
    position: 'Software Developer',
    joinDate: '2022-06-01'
  },
  {
    id: '4',
    name: 'Rahul Singh',
    email: 'rahul.singh@company.com',
    password: 'employee123',
    role: 'Employee',
    managerId: '2',
    department: 'Engineering',
    position: 'Senior Developer',
    joinDate: '2021-09-15'
  },
  {
    id: '5',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@company.com',
    password: 'employee123',
    role: 'Employee',
    managerId: '2',
    department: 'Engineering',
    position: 'Frontend Developer',
    joinDate: '2023-01-20'
  }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '3',
    employeeName: 'Priya Mehta',
    leaveType: 'Annual',
    startDate: '2024-08-15',
    endDate: '2024-08-20',
    reason: 'Family vacation',
    status: 'Pending',
    appliedDate: '2024-07-25',
    totalDays: 5
  },
  {
    id: '2',
    employeeId: '4',
    employeeName: 'Rahul Singh',
    leaveType: 'Sick',
    startDate: '2024-07-10',
    endDate: '2024-07-12',
    reason: 'Flu symptoms',
    status: 'Approved',
    appliedDate: '2024-07-09',
    reviewedBy: '2',
    reviewedDate: '2024-07-09',
    comments: 'Approved. Get well soon!',
    totalDays: 3
  },
  {
    id: '3',
    employeeId: '5',
    employeeName: 'Sneha Iyer',
    leaveType: 'Casual',
    startDate: '2024-07-20',
    endDate: '2024-07-20',
    reason: 'Personal work',
    status: 'Rejected',
    appliedDate: '2024-07-15',
    reviewedBy: '2',
    reviewedDate: '2024-07-16',
    comments: 'Please reschedule due to important project deadline',
    totalDays: 1
  },
  {
    id: '4',
    employeeId: '3',
    employeeName: 'Priya Mehta',
    leaveType: 'Casual',
    startDate: '2024-06-15',
    endDate: '2024-06-16',
    reason: 'Wedding ceremony',
    status: 'Approved',
    appliedDate: '2024-06-01',
    reviewedBy: '2',
    reviewedDate: '2024-06-02',
    comments: 'Approved. Congratulations!',
    totalDays: 2
  },
  {
    id: '5',
    employeeId: '4',
    employeeName: 'Rahul Singh',
    leaveType: 'Annual',
    startDate: '2024-09-01',
    endDate: '2024-09-10',
    reason: 'Planned vacation',
    status: 'Pending',
    appliedDate: '2024-07-28',
    totalDays: 10
  }
];

export const mockLeaveBalances: LeaveBalance[] = [
  {
    id: '1',
    employeeId: '3',
    casualLeavesRemaining: 10,
    sickLeavesRemaining: 8,
    annualLeavesRemaining: 15,
    totalCasualLeaves: 12,
    totalSickLeaves: 10,
    totalAnnualLeaves: 20,
    year: 2024
  },
  {
    id: '2',
    employeeId: '4',
    casualLeavesRemaining: 12,
    sickLeavesRemaining: 7,
    annualLeavesRemaining: 10,
    totalCasualLeaves: 12,
    totalSickLeaves: 10,
    totalAnnualLeaves: 20,
    year: 2024
  },
  {
    id: '3',
    employeeId: '5',
    casualLeavesRemaining: 11,
    sickLeavesRemaining: 10,
    annualLeavesRemaining: 20,
    totalCasualLeaves: 12,
    totalSickLeaves: 10,
    totalAnnualLeaves: 20,
    year: 2024
  }
];
