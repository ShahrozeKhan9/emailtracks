# Email Tracking Application - API Guide

## Base URL
- Development: `http://localhost:5000/api`
- Production: Replace with your production server URL

## Response Format

All endpoints return JSON responses in the following format:

```json
{
  "success": true,
  "message": "Operation successful.",
  "data": {}
}
```

## Authentication Endpoints

### 1. Login
**Endpoint**: `POST /auth/login`

**Description**: Authenticates a user with username/email and password.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "usernameOrEmail": "director1",
  "password": "hashed_password_123"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "userId": 1,
    "username": "director1",
    "email": "director@example.com",
    "isDirector": true
  }
}
```

**Response** (Error - 401):
```json
{
  "success": false,
  "message": "Invalid username/email or password."
}
```

---

## Company Endpoints

### 1. Get Companies
**Endpoint**: `GET /companies`

**Description**: Retrieves companies based on user role.
- Employees get only their own records
- Directors get all records

**Request Headers**:
```
userId: 1
isDirector: false
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Companies retrieved successfully.",
  "data": [
    {
      "id": 1,
      "companyName": "TechCorp",
      "region": "North America",
      "link": "https://techcorp.com",
      "emails": "contact@techcorp.com",
      "column1": "Value1",
      "column2": "Value2",
      "column3": "Value3",
      "column4": "Value4",
      "column5": "Value5",
      "status": "Pending",
      "userId": 2,
      "createdAt": "2024-05-18T10:30:00Z",
      "updatedAt": "2024-05-18T10:30:00Z",
      "lastEmailSentAt": "2024-05-18T11:00:00Z",
      "username": "employee1"
    }
  ]
}
```

---

### 2. Add Company
**Endpoint**: `POST /companies`

**Description**: Creates a new company record.

**Request Headers**:
```
Content-Type: application/json
userId: 2
```

**Request Body**:
```json
{
  "companyName": "Global Solutions",
  "region": "Europe",
  "link": "https://globalsolutions.com",
  "emails": "info@globalsolutions.com;support@globalsolutions.com"
}
```

**Validation Rules**:
- Company Name: Required
- Region: Required
- Link: Optional
- Emails: Required, must be valid email(s), comma or semicolon separated
- Company Name must be unique per user

**Response** (Success - 201):
```json
{
  "success": true,
  "message": "Company added successfully.",
  "data": {
    "id": 2,
    "companyName": "Global Solutions",
    "region": "Europe",
    "link": "https://globalsolutions.com",
    "emails": "info@globalsolutions.com;support@globalsolutions.com",
    "column1": null,
    "column2": null,
    "column3": null,
    "column4": null,
    "column5": null,
    "status": "Not Sent",
    "userId": 2,
    "createdAt": "2024-05-18T12:00:00Z",
    "updatedAt": "2024-05-18T12:00:00Z",
    "lastEmailSentAt": null,
    "username": "employee1"
  }
}
```

**Response** (Error - 409 Conflict - Duplicate):
```json
{
  "success": false,
  "message": "This company already exists."
}
```

**Response** (Error - 400 Bad Request - Invalid Email):
```json
{
  "success": false,
  "message": "Invalid email format. Please enter valid email(s)."
}
```

---

### 3. Update Company
**Endpoint**: `PUT /companies/{id}`

**Description**: Updates company information. Employees can only update their own records, directors can update any record.

**Request Headers**:
```
Content-Type: application/json
userId: 2
isDirector: false
```

**Request Body**:
```json
{
  "companyName": "Global Solutions Inc",
  "region": "Europe",
  "link": "https://globalsolutions.com",
  "emails": "info@globalsolutions.com;support@globalsolutions.com",
  "column1": "Contacted",
  "column2": "Proposal Sent",
  "column3": "In Discussion",
  "column4": "Negotiating",
  "column5": "Pending",
  "status": "Pending"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Company updated successfully."
}
```

**Response** (Error - 404 Not Found):
```json
{
  "success": false,
  "message": "Company not found or you don't have permission to update it."
}
```

**Response** (Error - 400 Bad Request - Invalid Email):
```json
{
  "success": false,
  "message": "Invalid email format. Please enter valid email(s)."
}
```

---

### 4. Delete Company
**Endpoint**: `DELETE /companies/{id}`

**Description**: Deletes a company record. Employees can only delete their own records, directors can delete any record.

**Request Headers**:
```
userId: 2
isDirector: false
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Company deleted successfully."
}
```

**Response** (Error - 404 Not Found):
```json
{
  "success": false,
  "message": "Company not found or you don't have permission to delete it."
}
```

---

### 5. Check Duplicate Company
**Endpoint**: `POST /companies/check-duplicate`

**Description**: Checks if a company name already exists for the user.

**Request Headers**:
```
Content-Type: application/json
userId: 2
```

**Request Body**:
```json
{
  "companyName": "TechCorp"
}
```

**Response** (Success - Exists):
```json
{
  "success": true,
  "message": "This company already exists.",
  "data": {
    "exists": true,
    "message": "This company already exists."
  }
}
```

**Response** (Success - Available):
```json
{
  "success": true,
  "message": "Company name is available.",
  "data": {
    "exists": false,
    "message": "Company name is available."
  }
}
```

---

### 6. Update Status
**Endpoint**: `PUT /companies/{id}/status`

**Description**: Updates the status of a company. Employees can only update their own records, directors can update any record.

**Request Headers**:
```
Content-Type: application/json
userId: 2
isDirector: false
```

**Request Body**:
```json
{
  "status": "Sent"
}
```

**Valid Status Values**:
- `Not Sent`
- `Pending`
- `Sent`
- `Responded`
- `Follow-up Required`
- `Closed`

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Status updated successfully."
}
```

**Response** (Error - 404 Not Found):
```json
{
  "success": false,
  "message": "Company not found or you don't have permission to update it."
}
```

---

### 7. Mark as Pending (Send Mail Status)
**Endpoint**: `PUT /companies/{id}/mark-as-pending`

**Description**: Marks a company as "Pending" and records the current timestamp in `LastEmailSentAt`. This endpoint is called when the "Send Mail" button is clicked. All 5 custom columns must be filled before this action can be performed.

**Request Headers**:
```
userId: 2
isDirector: false
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Status updated to Pending and LastEmailSentAt recorded."
}
```

**Response** (Error - 404 or Validation Failed):
```json
{
  "success": false,
  "message": "Company not found, you don't have permission, or not all required columns are filled."
}
```

---

## Error Responses

### Common Error Codes

| HTTP Status | Message | Cause |
|------------|---------|-------|
| 200 OK | Success | Operation completed successfully |
| 201 Created | Success | Resource created successfully |
| 400 Bad Request | Invalid input | Validation failed or missing required fields |
| 401 Unauthorized | Invalid credentials | Login failed |
| 404 Not Found | Resource not found | Company or record not found |
| 409 Conflict | Duplicate entry | Company name already exists for user |
| 500 Internal Server Error | Server error | Unexpected server error |

---

## Security Rules

### Access Control
1. **Normal User**:
   - Can only view their own companies
   - Can only update their own companies
   - Can only delete their own companies
   - Can only send mail for their own companies

2. **Director**:
   - Can view all companies from all users
   - Can update any company
   - Can delete any company
   - Can send mail for any company
   - Can see the username of who added each record

### Backend Enforcement
- All access rules are enforced on the backend
- The `userId` and `isDirector` headers determine access level
- Backend validates ownership before allowing modifications
- Directors can bypass normal user restrictions

---

## Rate Limiting & Performance

- No rate limiting implemented in this version
- For production, implement appropriate rate limiting
- Database indexes are created for common queries (UserId, CompanyName+UserId)

---

## Example Workflow

### 1. User Logs In
```
POST /auth/login
Body: {usernameOrEmail: "employee1", password: "hashed_password_456"}
Response: {userId: 2, isDirector: false}
```

### 2. Get Companies
```
GET /companies
Headers: {userId: 2, isDirector: false}
Response: List of companies added by employee1
```

### 3. Add a Company
```
POST /companies
Headers: {userId: 2}
Body: {companyName: "NewCorp", region: "Asia", link: "...", emails: "..."}
Response: New company created
```

### 4. Update Company Columns
```
PUT /companies/3
Headers: {userId: 2, isDirector: false}
Body: {column1: "Val1", column2: "Val2", column3: "Val3", column4: "Val4", column5: "Val5"}
Response: Company updated
```

### 5. Send Mail (Mark as Pending)
```
PUT /companies/3/mark-as-pending
Headers: {userId: 2, isDirector: false}
Response: Status updated to Pending
```

---

## Frontend Integration

The frontend uses the following service (from `services/api.js`):
- Automatically adds `userId` and `isDirector` headers to all requests
- Stores user session in localStorage
- Handles JWT/auth token in localStorage
- Redirects to login if unauthorized

---

## Testing with Tools

### Using cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"director1","password":"hashed_password_123"}'

# Get Companies
curl -X GET http://localhost:5000/api/companies \
  -H "userId: 1" \
  -H "isDirector: true"
```

### Using Postman
1. Set base URL: `http://localhost:5000/api`
2. Create collection with environment variables: `userId`, `isDirector`
3. Test each endpoint with proper headers and request bodies
4. Use the login response to populate userId and isDirector

---

## Version

- API Version: 1.0
- Last Updated: May 18, 2026
