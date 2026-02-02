# API Endpoints Documentation

**Base URL:** `http://localhost:3000/api`

All endpoints (except auth/register and auth/login) require Bearer token authentication via `Authorization: Bearer {accessToken}` header.

---

## Authentication Endpoints

### 1. Register User
- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Description:** Register a new user with email and password
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "fullName": "John Doe"
  }
  ```
- **Response:** User object with tokens
- **Security:** Password is hashed server-side using bcrypt (≥10 salt rounds)

### 2. Login
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Description:** Login with email and password
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:** User object with `accessToken` and `refreshToken`

### 3. Login with Google OAuth
- **Method:** `POST`
- **Endpoint:** `/auth/google`
- **Description:** Authenticate using Google OAuth token
- **Request Body:**
  ```json
  {
    "token": "google_oauth_token"
  }
  ```
- **Response:** User object with tokens

### 4. Login with Apple Sign-In
- **Method:** `POST`
- **Endpoint:** `/auth/apple`
- **Description:** Authenticate using Apple Sign-In token
- **Request Body:**
  ```json
  {
    "token": "apple_signin_token"
  }
  ```
- **Response:** User object with tokens

### 5. Logout
- **Method:** `POST`
- **Endpoint:** `/auth/logout`
- **Description:** Logout current user and invalidate session
- **Authentication:** Required
- **Request Body:** Empty object `{}`
- **Response:** Success message

### 6. Request Password Reset
- **Method:** `POST`
- **Endpoint:** `/auth/forgot-password`
- **Description:** Request password reset email
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:** Confirmation message

### 7. Reset Password
- **Method:** `POST`
- **Endpoint:** `/auth/reset-password`
- **Description:** Reset password using reset token
- **Request Body:**
  ```json
  {
    "token": "reset_token_from_email",
    "newPassword": "newSecurePassword123"
  }
  ```
- **Response:** Success message
- **Security:** New password is hashed server-side

### 8. Refresh Token
- **Method:** `POST`
- **Endpoint:** `/auth/refresh`
- **Description:** Get new access token using refresh token
- **Request Body:**
  ```json
  {
    "refreshToken": "refresh_token_from_storage"
  }
  ```
- **Response:** New `accessToken`

---

## User Profile Endpoints

### 1. Get User Profile
- **Method:** `GET`
- **Endpoint:** `/users/{userId}`
- **Description:** Get user profile by ID
- **Authentication:** Required
- **Response:** User profile object

### 2. Update User Profile
- **Method:** `PUT`
- **Endpoint:** `/users/profile`
- **Description:** Update user profile information
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "fullName": "Jane Doe",
    "userId": "jane123abc",
    "bio": "Family enthusiast",
    "location": "New York, NY"
  }
  ```
- **Response:** Updated user profile
- **Note:** `userId` must be unique, alphanumeric only, max 20 characters

### 3. Check User ID Availability
- **Method:** `GET`
- **Endpoint:** `/users/check-userid/{userId}`
- **Description:** Check if a User ID is available
- **Authentication:** Required
- **Path Parameters:**
  - `userId` (string) - User ID to check (alphanumeric, lowercase)
- **Response:**
  ```json
  {
    "available": true,
    "userId": "jane123abc"
  }
  ```
- **Error Codes:**
  - `400` - Invalid User ID format
  - `409` - User ID already taken

### 4. Upload Profile Photo
- **Method:** `POST`
- **Endpoint:** `/users/photo`
- **Description:** Upload and set profile photo (auto-compressed to 800x800px)
- **Authentication:** Required
- **Content-Type:** `multipart/form-data`
- **Request Body:** Form data with `photo` file
- **Response:**
  ```json
  {
    "photoUrl": "https://cdn.example.com/photos/user123.jpg"
  }
  ```

---

## Family Member Endpoints

### 1. Add Family Member
- **Method:** `POST`
- **Endpoint:** `/family/members`
- **Description:** Add a new family member to the tree
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "firstName": "Jane",
    "lastName": "Doe",
    "userId": "jane123abc",
    "dateOfBirth": "1990-05-15",
    "gender": "female",
    "relationship": "sister",
    "tag": "Grandmother",
    "photoUrl": "https://cdn.example.com/photos/jane.jpg"
  }
  ```
- **Response:** Created family member object with ID
- **Field Requirements:**
  - `userId` - Optional, alphanumeric only, lowercase, max 20 characters, must be unique
  - `firstName` - Required
  - `lastName` - Required
  - `relationship` - Required: "parent", "spouse", "child", or "sibling"
- **Error Codes:**
  - `400` - Invalid family member data
  - `401` - Authentication required
  - `409` - User ID already exists
  - `500` - Server error

### 2. Update Family Member
- **Method:** `PUT`
- **Endpoint:** `/family/members/{memberId}`
- **Description:** Update existing family member information
- **Authentication:** Required
- **Request Body:** Same as Add Family Member (partial updates allowed)
- **Response:** Updated family member object
- **Error Codes:**
  - `400` - Invalid data
  - `401` - Authentication required
  - `404` - Family member not found
  - `500` - Server error

### 3. Get All Family Members
- **Method:** `GET`
- **Endpoint:** `/family/members`
- **Description:** Get all family members for current user's tree
- **Authentication:** Required
- **Response:** Array of family member objects
- **Retry Logic:** 3 retries with exponential backoff (1s, 2s, 4s)

### 4. Search Family Members
- **Method:** `GET`
- **Endpoint:** `/family/members/search`
- **Description:** Search family members by name
- **Authentication:** Required
- **Query Parameters:**
  - `q` (string) - Search query
- **Response:** Array of matching family member objects
- **Retry Logic:** 3 retries with exponential backoff

---

## Relationship Endpoints

### 1. Get All Relationships
- **Method:** `GET`
- **Endpoint:** `/family/relationships`
- **Description:** Get all relationships in the family tree
- **Authentication:** Required
- **Response:** Array of relationship objects
  ```json
  [
    {
      "id": "rel123",
      "parentId": "member1",
      "childId": "member2",
      "type": "parent-child"
    }
  ]
  ```
- **Retry Logic:** 3 retries with exponential backoff

---

## Friends & Relatives Import Endpoints

### 1. Get Existing Friends (Not in Family Tree)
- **Method:** `GET`
- **Endpoint:** `/family/existing-friends`
- **Description:** Get all registered users who are friends and not part of the current user's family tree
- **Authentication:** Required
- **Response:** Array of user objects
  ```json
  [
    {
      "id": "user123",
      "userId": "maria123abc",
      "firstName": "Maria",
      "lastName": "Garcia",
      "email": "maria.garcia@example.com",
      "photoUrl": "https://cdn.example.com/photos/maria.jpg"
    }
  ]
  ```
- **Use Case:** For adding existing app users (who are already friends) as relatives
- **Retry Logic:** 3 retries with exponential backoff
- **Error Codes:**
  - `401` - Authentication required
  - `500` - Server error

### 2. Get Friend Details by ID
- **Method:** `GET`
- **Endpoint:** `/family/friends/{friendId}`
- **Description:** Get detailed information for a specific friend (existing user not in family tree)
- **Authentication:** Required
- **Path Parameters:**
  - `friendId` (string) - User ID of the friend
- **Response:** Detailed friend object
  ```json
  {
    "id": "user123",
    "userId": "maria123abc",
    "firstName": "Maria",
    "lastName": "Garcia",
    "email": "maria.garcia@example.com",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-05-15",
    "gender": "female",
    "photoUrl": "https://cdn.example.com/photos/maria.jpg",
    "biography": "Family enthusiast",
    "occupation": "Teacher",
    "location": "New York, NY"
  }
  ```
- **Use Case:** Import detailed profile information when adding friend as relative
- **Retry Logic:** 3 retries with exponential backoff
- **Error Codes:**
  - `401` - Authentication required
  - `404` - Friend not found
  - `500` - Server error

### 3. Get Relative Details by ID
- **Method:** `GET`
- **Endpoint:** `/family/relatives/{relativeId}`
- **Description:** Get detailed information for a specific relative (family member in tree)
- **Authentication:** Required
- **Path Parameters:**
  - `relativeId` (string) - Family member ID
- **Response:** Detailed family member object
  ```json
  {
    "id": "member123",
    "userId": "john123abc",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1985-03-20",
    "dateOfDeath": null,
    "gender": "male",
    "photoUrl": "https://cdn.example.com/photos/john.jpg",
    "biography": "Loving father and husband",
    "occupation": "Engineer",
    "location": "San Francisco, CA",
    "isDeceased": false,
    "createdBy": "user789",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:45:00Z"
  }
  ```
- **Use Case:** Import detailed profile information for existing family members
- **Retry Logic:** 3 retries with exponential backoff
- **Error Codes:**
  - `401` - Authentication required
  - `404` - Relative not found
  - `500` - Server error

---

## Friend Request Endpoints

### 1. Send Friend Request
- **Method:** `POST`
- **Endpoint:** `/family/friend-requests`
- **Description:** Send a friend request to another user by their User ID
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "userId": "maria123abc"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Friend request sent successfully",
    "requestId": "req123",
    "recipientUserId": "maria123abc",
    "status": "pending"
  }
  ```
- **Use Case:** Discord-style friend request system - send request before adding to family tree
- **Retry Logic:** 3 retries with exponential backoff
- **Error Codes:**
  - `400` - Invalid User ID format
  - `401` - Authentication required
  - `404` - User not found with that User ID
  - `409` - Friend request already exists or users are already friends
  - `500` - Server error

### 2. Get Pending Friend Requests (Received)
- **Method:** `GET`
- **Endpoint:** `/family/friend-requests/received`
- **Description:** Get all pending friend requests received by current user
- **Authentication:** Required
- **Response:** Array of friend request objects
  ```json
  [
    {
      "id": "req123",
      "senderId": "user456",
      "senderUserId": "john123abc",
      "senderName": "John Doe",
      "senderPhotoUrl": "https://cdn.example.com/photos/john.jpg",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
  ```
- **Retry Logic:** 3 retries with exponential backoff
- **Error Codes:**
  - `401` - Authentication required
  - `500` - Server error

### 3. Get Sent Friend Requests
- **Method:** `GET`
- **Endpoint:** `/family/friend-requests/sent`
- **Description:** Get all friend requests sent by current user
- **Authentication:** Required
- **Response:** Array of friend request objects
  ```json
  [
    {
      "id": "req123",
      "recipientId": "user789",
      "recipientUserId": "maria123abc",
      "recipientName": "Maria Garcia",
      "recipientPhotoUrl": "https://cdn.example.com/photos/maria.jpg",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
  ```
- **Retry Logic:** 3 retries with exponential backoff
- **Error Codes:**
  - `401` - Authentication required
  - `500` - Server error

### 4. Accept Friend Request
- **Method:** `POST`
- **Endpoint:** `/family/friend-requests/{requestId}/accept`
- **Description:** Accept a pending friend request
- **Authentication:** Required
- **Path Parameters:**
  - `requestId` (string) - Friend request ID
- **Request Body:** Empty object `{}`
- **Response:**
  ```json
  {
    "message": "Friend request accepted",
    "friendId": "user456",
    "friendUserId": "john123abc",
    "friendName": "John Doe"
  }
  ```
- **Use Case:** Once accepted, the friend appears in "Find Existing User" list
- **Retry Logic:** 3 retries with exponential backoff
- **Error Codes:**
  - `401` - Authentication required
  - `404` - Friend request not found
  - `409` - Friend request already processed
  - `500` - Server error

### 5. Decline Friend Request
- **Method:** `POST`
- **Endpoint:** `/family/friend-requests/{requestId}/decline`
- **Description:** Decline a pending friend request
- **Authentication:** Required
- **Path Parameters:**
  - `requestId` (string) - Friend request ID
- **Request Body:** Empty object `{}`
- **Response:**
  ```json
  {
    "message": "Friend request declined"
  }
  ```
- **Retry Logic:** 3 retries with exponential backoff
- **Error Codes:**
  - `401` - Authentication required
  - `404` - Friend request not found
  - `409` - Friend request already processed
  - `500` - Server error

### 6. Cancel Friend Request
- **Method:** `DELETE`
- **Endpoint:** `/family/friend-requests/{requestId}`
- **Description:** Cancel a sent friend request
- **Authentication:** Required
- **Path Parameters:**
  - `requestId` (string) - Friend request ID
- **Response:**
  ```json
  {
    "message": "Friend request cancelled"
  }
  ```
- **Use Case:** Sender can cancel their own pending requests
- **Retry Logic:** 3 retries with exponential backoff
- **Error Codes:**
  - `401` - Authentication required
  - `403` - Not authorized to cancel this request
  - `404` - Friend request not found
  - `500` - Server error

### 7. Remove Friend
- **Method:** `DELETE`
- **Endpoint:** `/family/friends/{friendId}`
- **Description:** Remove a friend connection
- **Authentication:** Required
- **Path Parameters:**
  - `friendId` (string) - User ID of the friend to remove
- **Response:**
  ```json
  {
    "message": "Friend removed successfully"
  }
  ```
- **Use Case:** Unfriend a user (they will no longer appear in "Find Existing User")
- **Retry Logic:** 3 retries with exponential backoff
- **Error Codes:**
  - `401` - Authentication required
  - `404` - Friend not found
  - `500` - Server error

---

## Invitation Endpoints

### 1. Validate Invite Code
- **Method:** `POST`
- **Endpoint:** `/invites/validate`
- **Description:** Validate an invite code format and existence
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "inviteCode": "ABC123"
  }
  ```
- **Response:** Tree information if valid
- **Error Codes:**
  - `404` - Invalid invite code
  - `410` - Invite code expired
  - `409` - Already a member of this tree
  - `401` - Authentication required
  - `500` - Server error

### 2. Join Family Tree
- **Method:** `POST`
- **Endpoint:** `/invites/join`
- **Description:** Join a family tree using an invite code
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "inviteCode": "ABC123"
  }
  ```
- **Response:** Joined tree information
- **Error Codes:** Same as Validate Invite Code
- **Retry Logic:** 3 retries with exponential backoff

### 3. Get Pending Invitations
- **Method:** `GET`
- **Endpoint:** `/invites/pending`
- **Description:** Get all pending invitations for current user
- **Authentication:** Required
- **Response:** Array of pending invitation objects
- **Retry Logic:** 3 retries with exponential backoff

### 4. Accept Invitation
- **Method:** `POST`
- **Endpoint:** `/invites/{invitationId}/accept`
- **Description:** Accept a pending invitation
- **Authentication:** Required
- **Request Body:** Empty object `{}`
- **Response:** Accepted invitation result
- **Error Codes:**
  - `404` - Invitation not found
  - `409` - Invitation already processed
  - `401` - Authentication required
  - `500` - Server error
- **Retry Logic:** 3 retries with exponential backoff

### 5. Decline Invitation
- **Method:** `POST`
- **Endpoint:** `/invites/{invitationId}/decline`
- **Description:** Decline a pending invitation
- **Authentication:** Required
- **Request Body:** Empty object `{}`
- **Response:** Declined invitation result
- **Error Codes:** Same as Accept Invitation
- **Retry Logic:** 3 retries with exponential backoff

---

## Memory & Photo Endpoints

### 1. Upload Photos and Create Memory
- **Method:** `POST`
- **Endpoint:** `/memories/upload`
- **Description:** Upload multiple photos and create a memory
- **Authentication:** Required
- **Content-Type:** `multipart/form-data`
- **Request Body:** Form data with:
  - `photos` (File[]) - Array of photo files (auto-compressed to 1200x1200px)
  - `albumId` (string, optional) - Album ID
  - `location` (string, optional) - Location name
  - `dateTaken` (string, optional) - ISO date string
  - `description` (string, optional) - Memory description
  - `taggedPeople` (JSON string, optional) - Array of tagged family member IDs
- **Response:**
  ```json
  {
    "id": "memory123",
    "photoUrls": ["url1", "url2"],
    "albumId": "album123",
    "location": "New York",
    "dateTaken": "2024-01-15",
    "description": "Family gathering",
    "taggedPeople": ["member1", "member2"],
    "partialFailures": [],
    "hasPartialFailures": false
  }
  ```
- **Error Codes:**
  - `400` - Invalid photo or memory data
  - `401` - Authentication required
  - `413` - File size too large (max 10MB per photo)
  - `500` - Server error
- **Retry Logic:** 3 retries with exponential backoff
- **Progress Tracking:** `onUploadProgress` callback available

### 2. Create Memory (without photos)
- **Method:** `POST`
- **Endpoint:** `/memories`
- **Description:** Create a memory with existing photo URLs
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "photoUrls": ["url1", "url2"],
    "albumId": "album123",
    "location": "New York",
    "dateTaken": "2024-01-15",
    "description": "Family gathering",
    "taggedPeople": ["member1", "member2"]
  }
  ```
- **Response:** Created memory object
- **Error Codes:**
  - `400` - Invalid memory data
  - `401` - Authentication required
  - `500` - Server error
- **Retry Logic:** 3 retries with exponential backoff

### 3. Get All Albums
- **Method:** `GET`
- **Endpoint:** `/albums`
- **Description:** Get all albums for current user
- **Authentication:** Required
- **Response:** Array of album objects
- **Retry Logic:** 3 retries with exponential backoff

---

## Error Handling

All endpoints follow consistent error handling:

- **Validation Errors (400):**
  ```json
  {
    "message": "Invalid family member data",
    "errors": {
      "firstName": "First name is required",
      "dateOfBirth": "Invalid date format"
    }
  }
  ```

- **Authentication Errors (401):**
  ```json
  {
    "message": "Authentication required"
  }
  ```

- **Not Found Errors (404):**
  ```json
  {
    "message": "Resource not found"
  }
  ```

- **Server Errors (500+):**
  ```json
  {
    "message": "Server error. Please try again later."
  }
  ```

---

## Retry Logic

Services implement exponential backoff retry logic for network resilience:
- **Max Retries:** 3 attempts
- **Backoff Strategy:** 1s → 2s → 4s delays
- **Retry Conditions:**
  - Network errors (no response)
  - 5xx server errors (500-599)
- **No Retry For:**
  - 4xx client errors (400-499)
  - Successful responses (2xx)

---

## Authentication Flow

1. User registers or logs in → receives `accessToken` and `refreshToken`
2. Store tokens in `localStorage`
3. **User sets up unique User ID** (alphanumeric, lowercase, max 20 chars)
4. Include `Authorization: Bearer {accessToken}` in all authenticated requests
5. When token expires, use `refreshToken` to get new `accessToken`
6. On logout, tokens are invalidated server-side

---

## User ID System

### Overview
Every user and family member can have a unique User ID for easy identification and friend requests.

### User ID Requirements
- **Format:** Alphanumeric only (a-z, 0-9)
- **Case:** Lowercase only (automatically converted)
- **Length:** 3-20 characters
- **Uniqueness:** Must be unique across all users
- **Examples:** `john123`, `maria_garcia` → `mariagarcia`, `user123abc`

### User ID Usage
1. **Friend Requests:** Send requests using User ID instead of email
2. **Search:** Find users by their User ID
3. **Profile Display:** Show User ID with @ prefix (e.g., `@john123`)
4. **Family Members:** Optionally assign User IDs to family members for identification

### User ID Validation
- Check availability before setting: `GET /users/check-userid/{userId}`
- Frontend auto-formats input (lowercase, strips special chars)
- Backend validates uniqueness and format
- Returns `409 Conflict` if User ID already exists

### Friend Request Flow with User ID
1. User A enters User B's User ID (e.g., `maria123abc`)
2. System sends friend request to User B
3. User B receives notification and can accept/decline
4. Once accepted, User B appears in User A's "Find Existing User" list
5. User A can then add User B to their family tree with appropriate relationship

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production:
- Suggested: 100 requests per minute per user
- Implement token bucket or sliding window algorithm

---

## CORS Configuration

Ensure backend CORS settings allow:
- Origin: Frontend URL (e.g., `http://localhost:5173`)
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization
- Credentials: Include

---

## Environment Configuration

Set `VITE_API_BASE_URL` in `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

Default fallback: `http://localhost:3000/api`

---

## Mock Mode

When `VITE_MOCK_API=true` in `.env`, the app uses mock data instead of real API calls. Useful for development without backend server.

---

## Database Schema Requirements

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(20) UNIQUE NOT NULL,  -- New: Unique User ID
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  photo_url TEXT,
  bio TEXT,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_email (email)
);
```

### Family Members Table
```sql
CREATE TABLE family_members (
  id VARCHAR(36) PRIMARY KEY,
  tree_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(20),  -- New: Optional User ID for family members
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  date_of_death DATE,
  gender ENUM('male', 'female', 'other', 'prefer-not-to-say'),
  photo_url TEXT,
  biography TEXT,
  occupation VARCHAR(255),
  location VARCHAR(255),
  is_deceased BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tree_id) REFERENCES family_trees(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_tree_id (tree_id)
);
```

### Friend Requests Table
```sql
CREATE TABLE friend_requests (
  id VARCHAR(36) PRIMARY KEY,
  sender_id VARCHAR(36) NOT NULL,
  recipient_id VARCHAR(36) NOT NULL,
  status ENUM('pending', 'accepted', 'declined', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_friend_request (sender_id, recipient_id),
  INDEX idx_recipient_status (recipient_id, status),
  INDEX idx_sender_status (sender_id, status)
);
```

### Friends Table
```sql
CREATE TABLE friends (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  friend_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_friendship (user_id, friend_id),
  INDEX idx_user_id (user_id),
  INDEX idx_friend_id (friend_id)
);
```

### Migration Notes
1. Add `user_id` column to existing `users` table with UNIQUE constraint
2. Add `user_id` column to existing `family_members` table (optional)
3. Create `friend_requests` table with proper indexes
4. Create `friends` table with bidirectional friendship support
5. Add indexes for performance optimization
6. Ensure `user_id` uniqueness constraint across system
7. Set up foreign key constraints with CASCADE delete for data integrity

---

## API Implementation Checklist

### User ID Feature
- [ ] Add `user_id` field to User model
- [ ] Implement User ID validation (alphanumeric, lowercase, 3-20 chars)
- [ ] Create User ID uniqueness check endpoint
- [ ] Update user registration to generate/accept User ID
- [ ] Update user profile update to allow User ID changes (with validation)
- [ ] Add User ID to all user response objects

### Friend Request System
- [ ] Create Friend Request model with status tracking
- [ ] Implement send friend request endpoint (by User ID)
- [ ] Implement get received friend requests endpoint
- [ ] Implement get sent friend requests endpoint
- [ ] Implement accept friend request endpoint
- [ ] Implement decline friend request endpoint
- [ ] Implement cancel friend request endpoint
- [ ] Implement remove friend endpoint
- [ ] Add friend request notifications
- [ ] Update existing friends endpoint to include User ID

### Family Member Updates
- [ ] Add optional `user_id` field to Family Member model
- [ ] Update add family member endpoint to accept User ID
- [ ] Update family member responses to include User ID
- [ ] Implement User ID search for family members

### Testing Requirements
- [ ] Test User ID uniqueness validation
- [ ] Test User ID format validation
- [ ] Test friend request creation and status transitions
- [ ] Test duplicate friend request prevention
- [ ] Test friend request acceptance flow
- [ ] Test friend request decline flow
- [ ] Test friend removal
- [ ] Test User ID search functionality
- [ ] Test backward compatibility with existing data

---

## Frontend-Backend Integration Notes

### User ID Display
- Frontend displays User IDs with `@` prefix (e.g., `@john123`)
- Backend stores without prefix (e.g., `john123`)
- Frontend strips `@` before sending to backend

### Friend Request Workflow
1. **Send Request:** User enters recipient's User ID → Frontend sends to `POST /family/friend-requests`
2. **Receive Notification:** Backend sends real-time notification to recipient
3. **View Requests:** Recipient views in notifications or dedicated page
4. **Accept/Decline:** Recipient chooses action → Updates friend request status
5. **Add to Tree:** Once friends, sender can add recipient to family tree via "Find Existing User"

### Search Functionality
- "Find Existing User" searches both User ID and name
- Results display User ID prominently with `@` prefix
- Falls back to email if User ID not set (backward compatibility)

### Validation Rules
- User ID must be unique across all users
- User ID can only be set once (or with admin approval for changes)
- User ID format enforced on both frontend and backend
- Frontend provides real-time availability checking
