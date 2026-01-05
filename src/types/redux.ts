import { User, UserProfile, FamilyMember, Relationship, Memory, Album, DashboardData, RecentUpdate, OnlineUser } from './api';

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// User state interface
export interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

// Family state interface
export interface FamilyState {
  familyMembers: FamilyMember[];
  relationships: Relationship[];
  isLoading: boolean;
  error: string | null;
}

// Memory state interface
export interface MemoryState {
  memories: Memory[];
  albums: Album[];
  isLoading: boolean;
  uploadProgress: number;
  error: string | null;
}

// Dashboard state interface
export interface DashboardState {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  sectionLoading: {
    recentUpdates: boolean;
    upcomingEvents: boolean;
    memorySpotlight: boolean;
    treeStats: boolean;
    onlineUsers: boolean;
  };
  sectionErrors: {
    recentUpdates: string | null;
    upcomingEvents: string | null;
    memorySpotlight: string | null;
    treeStats: string | null;
    onlineUsers: string | null;
  };
}

// Tree state interface
export interface TreeState {
  selectedMemberId: string | null;
  searchQuery: string;
  searchResults: string[];
  zoomLevel: number; // 10-200%
  panOffset: { x: number; y: number };
  showFirstTimeTooltip: boolean;
}

// Root state interface combining all slices
export interface RootState {
  auth: AuthState;
  user: UserState;
  family: FamilyState;
  memory: MemoryState;
  dashboard: DashboardState;
  tree: TreeState;
}

// Redux action payload types
export interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  phoneNumber?: string;
  location?: string;
  biography?: string;
  occupation?: string;
  photoUrl?: string;
}

export interface AddFamilyMemberPayload {
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

export interface UpdateFamilyMemberPayload {
  memberId: string;
  memberData: {
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
  };
}

export interface UploadPhotosPayload {
  files: File[];
  memoryData: {
    albumId?: string;
    location?: string;
    dateTaken?: string;
    description?: string;
    taggedPeople?: string[];
  };
  onProgress?: (progress: number) => void;
}

export interface CreateMemoryPayload {
  albumId?: string;
  location?: string;
  dateTaken?: string;
  description?: string;
  photoUrls?: string[];
  taggedPeople?: string[];
}

export interface PerformSearchPayload {
  query: string;
  members: FamilyMember[];
}

export interface SetSectionErrorPayload {
  section: keyof DashboardState['sectionErrors'];
  error: string | null;
}

export interface PanPayload {
  deltaX: number;
  deltaY: number;
}

// Async thunk return types
export interface AsyncThunkConfig {
  state: RootState;
  rejectValue: string;
}

// Selector return types
export type AuthSelector<T> = (state: RootState) => T;
export type UserSelector<T> = (state: RootState) => T;
export type FamilySelector<T> = (state: RootState) => T;
export type MemorySelector<T> = (state: RootState) => T;
export type DashboardSelector<T> = (state: RootState) => T;
export type TreeSelector<T> = (state: RootState) => T;

// Memoized selector types
export interface MemberByIdSelector {
  (state: RootState, memberId: string): FamilyMember | undefined;
}

export interface SectionLoadingSelector {
  (state: RootState, section: keyof DashboardState['sectionLoading']): boolean;
}

export interface SectionErrorSelector {
  (state: RootState, section: keyof DashboardState['sectionErrors']): string | null;
}

// Redux middleware types
export interface SerializableCheckConfig {
  ignoredActions: string[];
  ignoredPaths: string[];
}

// Store configuration types
export interface StoreConfig {
  reducer: {
    auth: any;
    user: any;
    family: any;
    memory: any;
    dashboard: any;
    tree: any;
  };
  middleware: any;
  devTools: boolean;
}

// Action creator types
export interface ActionCreator<P = void> {
  (payload: P): {
    type: string;
    payload: P;
  };
}

export interface AsyncActionCreator<P = void, R = any> {
  (payload: P): any;
  pending: ActionCreator<void>;
  fulfilled: ActionCreator<R>;
  rejected: ActionCreator<string>;
}

// Thunk action types
export interface ThunkAction<R, S, E, A> {
  (dispatch: any, getState: () => S, extraArgument: E): R;
}

// Redux hooks types (will be defined in store configuration)
export interface TypedDispatch {
  <T extends any>(action: T): T;
}

export interface TypedSelector {
  <T>(selector: (state: RootState) => T): T;
}