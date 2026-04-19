export type UserRole = 'reception' | 'governance' | 'maintenance';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in-progress' | 'completed' | 'cancelled';
export type Department = 'governance' | 'maintenance';

export interface Ticket {
  id: string;
  roomNumber: string;
  department: Department;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  openedBy: string;
  assignedTo?: string;
  createdAt: any; // Firebase Timestamp
  updatedAt?: any;
  completedAt?: any;
}
