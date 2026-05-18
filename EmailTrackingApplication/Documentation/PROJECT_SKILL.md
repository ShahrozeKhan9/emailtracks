# Email Tracking Application - Project Skill Guide

## Overview

This skill guide documents the Email Tracking Application project, including its architecture, key components, development practices, and common tasks.

## Project Information

- **Project Name**: Email Tracking Application
- **Type**: Full-Stack Web Application
- **Tech Stack**: 
  - Frontend: React.js
  - Backend: ASP.NET Core Web API
  - Database: SQL Server
  - Authentication: Database credentials with role-based access

## Directory Structure

```
EmailTrackingApplication/
├── Backend/
│   ├── EmailTrackingAPI/          # Main ASP.NET Core project
│   │   ├── Controllers/            # API endpoints
│   │   ├── Models/                 # Data models
│   │   ├── Services/               # Business logic
│   │   ├── Data/                   # Database context
│   │   ├── Program.cs              # Application entry point
│   │   ├── appsettings.json        # Configuration
│   │   └── EmailTrackingAPI.csproj
│   └── Database/
│       └── schema.sql              # Database schema and seed data
├── Frontend/
│   └── email-tracking-app/         # React application
│       ├── src/
│       │   ├── components/         # Reusable React components
│       │   ├── pages/              # Page components
│       │   ├── services/           # API calls and utilities
│       │   ├── App.jsx             # Root component
│       │   └── index.jsx           # Entry point
│       ├── public/                 # Static assets
│       └── package.json
└── Documentation/
    ├── SETUP_INSTRUCTIONS.md       # Installation guide
    ├── API_GUIDE.md                # API documentation
    └── PROJECT_SKILL.md            # This file
```

## Key Features

### 1. Authentication & Authorization
- **Login**: Username/email and password authentication
- **Role-Based Access**: 
  - `IsDirector = true`: Admin/Director access to all records
  - `IsDirector = false`: Employee access to own records only
- **Session Management**: localStorage-based user session

### 2. Company Management
- Add, edit, view, and delete company records
- Email validation for multiple email addresses
- Duplicate company name prevention (per user)
- Custom tracking columns (Column1-Column5)

### 3. Status Tracking
- Predefined status values: Not Sent, Pending, Sent, Responded, Follow-up Required, Closed
- Status updates with timestamp tracking
- Send Mail button: Updates status to "Pending" and records LastEmailSentAt

### 4. Access Control
- Employees see only their own records
- Directors see all records
- Backend enforces access rules
- Username tracking for record origin

## Backend Architecture

### ASP.NET Core Setup

**Program.cs Configuration**:
- DbContext registration with SQL Server
- Service dependency injection (IAuthenticationService, ICompanyService)
- CORS configuration for React frontend
- Swagger/OpenAPI documentation

**Controllers**:
- `AuthController`: Handles login (POST /auth/login)
- `CompaniesController`: CRUD operations and status management

**Services**:
- `AuthenticationService`: Authentication logic and password validation
- `CompanyService`: Company CRUD and business logic

**Database Context**:
- `ApplicationDbContext`: Entity Framework Core mapping and relationships
- Indexes on UserId and CompanyName for performance

### Database Schema

**Users Table**:
```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    Password NVARCHAR(MAX) NOT NULL,
    IsDirector BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT GETUTCDATE(),
    IsActive BIT NOT NULL DEFAULT 1
)
```

**Companies Table**:
```sql
CREATE TABLE Companies (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CompanyName NVARCHAR(255) NOT NULL,
    Region NVARCHAR(100) NOT NULL,
    Link NVARCHAR(MAX) NULL,
    Emails NVARCHAR(MAX) NOT NULL,
    Column1-Column5 NVARCHAR(MAX) NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Not Sent',
    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
    CreatedAt DATETIME NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME NOT NULL DEFAULT GETUTCDATE(),
    LastEmailSentAt DATETIME NULL
)
```

## Frontend Architecture

### React Component Hierarchy

```
App
├── LoginPage
│   └── Form submission → authAPI.login()
└── DashboardPage
    ├── Header (User info, Logout)
    ├── Toolbar (Title, Add Company button)
    ├── CompanyTable
    │   └── Row (Edit, Delete, Send Mail actions)
    ├── AddCompanyModal
    │   └── Form (Company details, emails)
    └── Toast (Success/Error messages)
```

### Component Descriptions

1. **App.jsx**: Root component, routing logic, auth state management
2. **LoginPage.jsx**: Login form with validation and error handling
3. **DashboardPage.jsx**: Main dashboard with company list and controls
4. **CompanyTable.jsx**: Editable table with inline editing capabilities
5. **AddCompanyModal.jsx**: Modal for adding new companies
6. **Toast.jsx**: Notification component for user feedback

### Services

1. **api.js**: API client functions for all backend endpoints
2. **authUtils.js**: User session management (localStorage)

## Development Workflow

### Adding a New Feature

1. **Backend**:
   - Add model/DTO in `Models/Models.cs`
   - Add service method in `Services/`
   - Add controller endpoint in `Controllers/`
   - Add database migration if needed

2. **Frontend**:
   - Add API call in `services/api.js`
   - Create component in `components/` or `pages/`
   - Update relevant pages to use new component
   - Test with various user roles

### Making Changes

**Backend Changes**:
```bash
cd Backend/EmailTrackingAPI
dotnet run
# Changes auto-reload with dotnet watch run
```

**Frontend Changes**:
```bash
cd Frontend/email-tracking-app
npm start
# Changes auto-reload in browser
```

## Common Tasks

### 1. Add a New User

Edit `Backend/Database/schema.sql`:
```sql
INSERT INTO Users (Username, Email, Password, IsDirector, IsActive)
VALUES ('newuser', 'newuser@example.com', 'password', 0, 1)
```

### 2. Change Database Connection

Edit `Backend/EmailTrackingAPI/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=EmailTrackingDB;Integrated Security=true;"
}
```

### 3. Change API Port

Edit `Backend/EmailTrackingAPI/Program.cs`:
```csharp
app.Urls.Add("http://localhost:YOUR_PORT");
```

And update Frontend `.env`:
```
REACT_APP_API_URL=http://localhost:YOUR_PORT/api
```

### 4. Add New Status Values

1. Add to `statusOptions` in `CompanyTable.jsx`
2. No database change needed (status is a string)

### 5. Add New Custom Column

1. Add column to `Companies` table
2. Add property to `Company` model
3. Add input field to `CompanyTable.jsx`
4. Add field to `UpdateCompanyRequest` model

## Validation Rules

### Frontend Validation
- Company Name: Required, non-empty
- Region: Required, non-empty
- Emails: Required, must be valid email format, comma/semicolon separated
- Columns 1-5: Optional, but all must be filled before Send Mail

### Backend Validation
- Email format validation (RFC-compliant)
- Duplicate company name per user
- Access control enforcement
- Required field validation

## Security Considerations

### Current Implementation
- Passwords stored in plain text (for demo only)
- No JWT or token-based auth (headers-based)
- CORS enabled for localhost:3000

### Production Recommendations
1. Implement password hashing (bcrypt or similar)
2. Use JWT tokens for session management
3. Add HTTPS enforcement
4. Implement rate limiting
5. Add request validation and sanitization
6. Use environment variables for sensitive config
7. Implement audit logging
8. Add input validation on both frontend and backend

## API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /auth/login | User authentication |
| GET | /companies | Get companies (filtered by role) |
| POST | /companies | Add new company |
| PUT | /companies/{id} | Update company |
| DELETE | /companies/{id} | Delete company |
| POST | /companies/check-duplicate | Check for duplicate |
| PUT | /companies/{id}/status | Update status |
| PUT | /companies/{id}/mark-as-pending | Mark as pending |

## Testing

### Backend Testing
- Use Postman or cURL to test API endpoints
- Verify access control (employee vs director)
- Test validation error scenarios

### Frontend Testing
- Test login with different user roles
- Test add/edit/delete functionality
- Test access restrictions (employee can't edit other's records)
- Test form validations
- Test responsiveness on different screen sizes

## Deployment

### Backend Deployment
```bash
cd Backend/EmailTrackingAPI
dotnet publish -c Release -o ./publish
# Deploy publish folder to server
```

### Frontend Deployment
```bash
cd Frontend/email-tracking-app
npm run build
# Deploy build folder to static hosting or CDN
```

## Troubleshooting Guide

### Issue: CORS Error
- **Cause**: Frontend and backend URLs don't match
- **Fix**: Update CORS settings in `Program.cs` and `.env`

### Issue: Login fails
- **Cause**: Wrong password or user not active
- **Fix**: Check database user records, verify IsActive = 1

### Issue: Can't see other users' records
- **Cause**: IsDirector flag not set correctly
- **Fix**: Update user record: `UPDATE Users SET IsDirector = 1 WHERE Id = 1`

### Issue: Send Mail button always disabled
- **Cause**: Not all 5 columns are filled
- **Fix**: Fill Column1 through Column5 before clicking Send Mail

## Performance Optimization

1. **Database Indexes**: Already created on UserId and CompanyName
2. **API Response Caching**: Can be added to GET endpoints
3. **Frontend Lazy Loading**: Consider for large company lists
4. **Query Optimization**: Use database indexes effectively

## Version Control

Important files to track:
- `/Backend/EmailTrackingAPI/` - All source code
- `/Frontend/email-tracking-app/src/` - React source
- `/Documentation/` - All documentation
- `*.json`, `*.csproj` - Configuration files

Ignore:
- `node_modules/` - Frontend dependencies
- `bin/`, `obj/` - Backend build outputs
- `.env` files with sensitive data (use .env.example)

## Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/dotnet/core/)
- [React Documentation](https://react.dev/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/sql-server/)

## Support & Contribution

For questions or issues:
1. Check SETUP_INSTRUCTIONS.md for setup help
2. Check API_GUIDE.md for API documentation
3. Review error messages in browser console or backend logs
4. Check database records for data verification

---

**Last Updated**: May 18, 2026  
**Version**: 1.0  
**Status**: Production Ready
