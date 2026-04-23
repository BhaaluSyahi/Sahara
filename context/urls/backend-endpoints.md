# Backend Endpoints Analysis

## Authentication Router (/api/v1/auth)

### POST /api/v1/auth/register
- **Purpose**: Register new user (employee or volunteer)
- **Request Body**: UserRegisterRequest {email, password, role}
- **Response**: TokenResponse {access_token}
- **Authentication**: None required

### POST /api/v1/auth/login
- **Purpose**: Login user
- **Request Body**: UserLoginRequest {email, password}
- **Response**: TokenResponse {access_token}
- **Authentication**: None required

## Requests Router (/api/v1/requests)

### POST /api/v1/requests/
- **Purpose**: Create new request
- **Request Body**: RequestCreate
- **Response**: RequestResponse
- **Authentication**: Required (JWT)

### GET /api/v1/requests/{request_id}
- **Purpose**: Get request details
- **Path Params**: request_id (UUID)
- **Response**: RequestResponse
- **Authentication**: None required

### PUT /api/v1/requests/{request_id}
- **Purpose**: Update request (creator only)
- **Path Params**: request_id (UUID)
- **Request Body**: RequestUpdate
- **Response**: RequestResponse
- **Authentication**: Required (JWT, owner only)

### DELETE /api/v1/requests/{request_id}
- **Purpose**: Delete request (mark as deleted)
- **Path Params**: request_id (UUID)
- **Response**: {status: "deleted"}
- **Authentication**: Required (JWT, owner only)

### GET /api/v1/requests/my
- **Purpose**: Get current user's requests
- **Query Params**: 
  - status (optional): "open", "closed", "deleted"
  - title (optional): partial title search
- **Response**: list[RequestResponse]
- **Authentication**: Required (JWT)

### POST /api/v1/requests/{request_id}/join
- **Purpose**: Join request (volunteer only)
- **Path Params**: request_id (UUID)
- **Response**: ParticipantResponse
- **Authentication**: Required (JWT, volunteer only)

### GET /api/v1/requests/{request_id}/participants
- **Purpose**: Get all participants for a request
- **Path Params**: request_id (UUID)
- **Response**: list[ParticipantResponse]
- **Authentication**: None required

## Volunteers Router (/api/v1/volunteers)

### POST /api/v1/volunteers/profile
- **Purpose**: Create or update volunteer profile
- **Request Body**: VolunteerProfileCreate
- **Response**: VolunteerProfileResponse
- **Authentication**: Required (JWT, volunteer only)

### GET /api/v1/volunteers/profile
- **Purpose**: Get volunteer profile
- **Response**: VolunteerProfileResponse
- **Authentication**: Required (JWT, volunteer only)

### PUT /api/v1/volunteers/profile
- **Purpose**: Update volunteer profile
- **Request Body**: VolunteerProfileUpdate
- **Response**: VolunteerProfileResponse
- **Authentication**: Required (JWT, volunteer only)

## Organizations Router (/api/v1/organizations)

### POST /api/v1/organizations/
- **Purpose**: Create organization (employee only)
- **Request Body**: OrganizationCreate
- **Response**: OrganizationResponse
- **Authentication**: Required (JWT, employee only)

### GET /api/v1/organizations/
- **Purpose**: Get all organizations (public endpoint)
- **Response**: list[OrganizationResponse]
- **Authentication**: None required
- **Status**: ✅ ADDED - Fixed missing endpoint

### GET /api/v1/organizations/{org_id}
- **Purpose**: Get organization details
- **Path Params**: org_id (UUID)
- **Response**: OrganizationResponse
- **Authentication**: None required

### PUT /api/v1/organizations/{org_id}
- **Purpose**: Update organization (creator only)
- **Path Params**: org_id (UUID)
- **Request Body**: OrganizationUpdate
- **Response**: OrganizationResponse
- **Authentication**: Required (JWT, owner only)

### POST /api/v1/organizations/{org_id}/documents
- **Purpose**: Upload document for organization
- **Path Params**: org_id (UUID)
- **Request Body**: multipart/form-data (file)
- **Response**: DocumentUploadResponse
- **Authentication**: Required (JWT)

### POST /api/v1/organizations/{org_id}/members
- **Purpose**: Add volunteer to organization (admin/subadmin only)
- **Path Params**: org_id (UUID)
- **Request Body**: MembershipCreate
- **Response**: MembershipResponse
- **Authentication**: Required (JWT, admin/subadmin only)

### GET /api/v1/organizations/{org_id}/members
- **Purpose**: Get all members of organization
- **Path Params**: org_id (UUID)
- **Response**: list[MembershipResponse]
- **Authentication**: None required

### GET /api/v1/organizations/my
- **Purpose**: Get organizations created by current user (employee)
- **Response**: list[OrganizationResponse]
- **Authentication**: Required (JWT, employee only)

## Ratings Router (/api/v1/ratings)

### POST /api/v1/ratings/
- **Purpose**: Create rating (bidirectional)
- **Request Body**: RatingCreate
- **Response**: RatingResponse
- **Authentication**: Required (JWT)

### GET /api/v1/ratings/{target_type}/{target_id}
- **Purpose**: Get all ratings for target
- **Path Params**: 
  - target_type: "organization" or "volunteer"
  - target_id (UUID)
- **Response**: {ratings: [], average_rating: float, count: int}
- **Authentication**: None required

## Realtime Router (/api/v1/realtime)

### POST /api/v1/realtime/token
- **Purpose**: Generate Supabase realtime token
- **Response**: {token, expires_at, permissions, tables}
- **Authentication**: Required (JWT)

### GET /api/v1/realtime/status
- **Purpose**: Get realtime connection status
- **Response**: {status, user_id, role, supported_tables, features}
- **Authentication**: Required (JWT)

## Summary
- Total Backend Endpoints: 20 (including newly added organizations list)
- All endpoints properly secured with appropriate role-based access
- Comprehensive CRUD operations for all entities
- Realtime capabilities for live updates
- ✅ All frontend endpoints now have matching backend implementations
