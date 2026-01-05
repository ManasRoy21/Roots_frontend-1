// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  success: boolean;
}

// Error response interface
export interface ApiError {
  message: string;
  code?: string;
  status: number;
  details?: Record<string, any>;
}

// User interfaces
export interface User {
  id: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  authProvider: 'email' | 'google' | 'apple';
  photoUrl?: string | null;
  createdAt: string;
  lastLoginAt: string;
  emailVerified: boolean;
}

export interface UserProfile {
  userId: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  phoneNumber?: string;
  location?: string;
  biography?: string;
  occupation?: string;
  photoUrl?: string | null;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

// Authentication request/response interfaces
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface GoogleAuthRequest {
  token: string;
}

export interface AppleAuthRequest {
  token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  token: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// Family member request interfaces
export interface AddFamilyMemberRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  photoUrl?: string;
  biography?: string;
  occupation?: string;
  location?: string;
  isDeceased?: boolean;
  relatedTo?: string;
  relationshipType?: 'parent' | 'child' | 'spouse' | 'sibling' | 'grandparent' | 'grandchild' | 'aunt-uncle' | 'niece-nephew' | 'cousin' | 'other';
  specificLabel?: string;
}

export interface UpdateFamilyMemberRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  photoUrl?: string;
  biography?: string;
  occupation?: string;
  location?: string;
  isDeceased?: boolean;
}

// Memory/Photo request interfaces
export interface CreateMemoryRequest {
  albumId?: string;
  location?: string;
  dateTaken?: string;
  description?: string;
  taggedPeople?: string[];
}

export interface UploadPhotosRequest extends CreateMemoryRequest {
  files: File[];
}

export interface CreateAlbumRequest {
  name: string;
  description?: string;
}

// Event request interfaces
export interface CreateEventRequest {
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  attendees?: string[];
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  eventDate?: string;
  location?: string;
  attendees?: string[];
}

// Dashboard data response interface
export interface DashboardData {
  user: User;
  recentUpdates: Array<{
    id: string;
    type: 'member_added' | 'photo_uploaded' | 'event_created' | 'profile_updated';
    message: string;
    timestamp: string;
    userId: string;
    userName: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    eventDate: string;
    location?: string;
  }>;
  memorySpotlight: {
    id: string;
    photoUrl: string;
    description?: string;
    dateTaken?: string;
  } | null;
  treeStats: {
    memberCount: number;
    generationCount: number;
  };
  onlineUsers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    photoUrl?: string;
    lastSeen: string;
  }>;
}

// File upload interfaces
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface UploadProgressCallback {
  (progress: number): void;
}

// Search interfaces
export interface SearchQuery {
  query: string;
  filters?: {
    type?: 'member' | 'memory' | 'event';
    dateRange?: {
      start: string;
      end: string;
    };
    tags?: string[];
  };
}

export interface SearchResult {
  id: string;
  type: 'member' | 'memory' | 'event';
  title: string;
  description?: string;
  thumbnail?: string;
  relevanceScore: number;
}

// Pagination interfaces
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Invite interfaces
export interface InviteRequest {
  email: string;
  role?: 'member' | 'admin';
  message?: string;
}

export interface InviteResponse {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  inviteCode: string;
  expiresAt: string;
  createdAt: string;
}

export interface JoinFamilyRequest {
  inviteCode: string;
  userProfile: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    phoneNumber?: string;
    location?: string;
    biography?: string;
    occupation?: string;
  };
}

// Family Member interface
export interface FamilyMember {
  id: string;
  userId?: string | null;
  firstName: string;
  lastName: string;
  email?: string | null;
  phoneNumber?: string | null;
  dateOfBirth?: string;
  dateOfDeath?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  photoUrl?: string | null;
  biography?: string;
  occupation?: string;
  location?: string | null;
  isLiving: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Relationship interface
export interface Relationship {
  id: string;
  fromUserId: string;
  toUserId: string;
  relationshipType: 'parent' | 'child' | 'spouse' | 'sibling' | 'grandparent' | 'grandchild' | 'aunt-uncle' | 'niece-nephew' | 'cousin' | 'other';
  specificLabel?: string;
  createdAt: string;
}

// Memory interface
export interface Memory {
  id: string;
  albumId?: string;
  photoUrl: string;
  thumbnailUrl?: string;
  description?: string;
  location?: string;
  dateTaken?: string;
  taggedPeople: string[];
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

// Album interface
export interface Album {
  id: string;
  name: string;
  description?: string;
  coverPhotoUrl?: string;
  memoryCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Recent Update interface
export interface RecentUpdate {
  id: string;
  type: 'member_added' | 'photo_uploaded' | 'event_created' | 'profile_updated';
  message: string;
  timestamp: string;
  userId: string;
  userName: string;
}

// Online User interface
export interface OnlineUser {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
  lastSeen: string;
}