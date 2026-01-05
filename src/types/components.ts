import React from 'react';

// Base component props that all components can extend
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

// Button component props
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

// Input component props
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string | null;
  required?: boolean;
  name?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

// Select component props
export interface SelectProps extends BaseComponentProps {
  label?: string;
  options?: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string | null;
  placeholder?: string;
  required?: boolean;
  name?: string;
  id?: string;
  'aria-label'?: string;
}

// Toggle component props
export interface ToggleProps extends BaseComponentProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  'aria-label'?: string;
}

// Date input component props
export interface DateInputProps extends BaseComponentProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  label?: string;
  required?: boolean;
  name?: string;
  id?: string;
}

// Image upload component props
export interface ImageUploadProps extends BaseComponentProps {
  onUpload?: (file: File | null, error: string | null) => void;
  preview?: string | null;
  maxSize?: number; // in MB
  error?: string | null;
}

// Modal component props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

// Form error component props
export interface FormErrorProps extends BaseComponentProps {
  message?: string;
}

// Loading spinner component props
export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  'aria-label'?: string;
}

// Search input component props
export interface SearchInputProps extends BaseComponentProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  resultsCount?: number | null;
}

// Tree canvas component props
export interface TreeCanvasProps extends BaseComponentProps {
  members: FamilyMember[];
  relationships: Relationship[];
  rootMemberId: string;
  onMemberClick?: (memberId: string) => void;
  onPlaceholderClick?: (type: 'father' | 'mother' | 'spouse' | 'child', memberId: string) => void;
  rootCardRef?: React.RefObject<HTMLDivElement>;
}

// Tree node data structure interface
export interface TreeNodeData {
  member: FamilyMember;
  parents: TreeNodeData[];
  children: TreeNodeData[];
  spouse: TreeNodeData | null;
  siblings?: TreeNodeData[];
  level?: number;
  position?: { x: number; y: number };
}

// Tree node component props (updated)
export interface TreeNodeProps extends BaseComponentProps {
  node: TreeNodeData;
  allMembers: FamilyMember[];
  relationships: Relationship[];
  isRoot?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  onMemberClick?: (memberId: string) => void;
  onPlaceholderClick?: (type: 'father' | 'mother' | 'spouse' | 'child', memberId: string) => void;
  showPlaceholders?: boolean;
  depth?: number;
  maxDepth?: number;
  zoomLevel?: number;
  searchResults?: string[];
  rootCardRef?: React.RefObject<HTMLDivElement>;
}

// Member card component props (updated)
export interface MemberCardProps extends BaseComponentProps {
  member: FamilyMember;
  relationshipLabel?: string;
  isRoot?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  onClick?: (memberId: string) => void;
}

// Add relative modal props
export interface AddRelativeModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AddRelativeSubmissionData) => void;
  relationshipType?: 'parent' | 'spouse' | 'child' | 'sibling' | null;
  relatedToMember?: FamilyMember | null;
}

// Add relative submission data interface
export interface AddRelativeSubmissionData {
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  status: 'living' | 'deceased';
  specificLabel: string | null;
  photoUrl: string | null;
}

// Create event modal props
export interface CreateEventModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

// Invite external guests modal props
export interface InviteExternalGuestsModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

// Family member interface
export interface FamilyMember {
  id: string;
  userId?: string | null;
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

// Tree statistics interface
export interface TreeStatistics {
  memberCount: number;
  generationCount: number;
  oldestMember?: FamilyMember;
  youngestMember?: FamilyMember;
  largestGeneration?: number;
}

// Memory/Photo interfaces
export interface Memory {
  id: string;
  uploadedBy: string;
  albumId?: string | null;
  location?: string | null;
  dateTaken?: string | null;
  description?: string | null;
  photoUrls: string[];
  taggedPeople: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  id: string;
  name: string;
  description?: string;
  coverPhotoUrl?: string | null;
  createdBy: string;
  createdAt: string;
  photoCount: number;
}

// Event interfaces
export interface FamilyEvent {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  createdBy: string;
  attendees: string[];
  createdAt: string;
  updatedAt: string;
}

// Dashboard data interfaces
export interface RecentUpdate {
  id: string;
  type: 'member_added' | 'photo_uploaded' | 'event_created' | 'profile_updated';
  message: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface OnlineUser {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  lastSeen: string;
}