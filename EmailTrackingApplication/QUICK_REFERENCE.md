# Quick Reference Guide

## Quick Start Commands

### Backend Setup
```bash
cd Backend/EmailTrackingAPI
dotnet restore
# Update appsettings.json with your SQL Server connection string
dotnet run
# Backend runs on http://localhost:5000
```

### Frontend Setup
```bash
cd Frontend/email-tracking-app
npm install
# Ensure .env has correct REACT_APP_API_URL
npm start
# Frontend opens at http://localhost:3000
```

### Database Setup
1. Open SQL Server Management Studio
2. Create new query
3. Execute contents of `Backend/Database/schema.sql`

---

## Demo Credentials

### Director Account
- **Username**: director1
- **Password**: hashed_password_123
- **Access**: Can see and manage all records

### Employee Accounts
- **Username**: employee1 / **Password**: hashed_password_456
- **Username**: employee2 / **Password**: hashed_password_789
- **Access**: Can only see and manage own records

---

## Project Structure at a Glance

```
EmailTrackingApplication/
├── Backend/
│   ├── EmailTrackingAPI/       # ASP.NET Core API
│   │   ├── Controllers/        # API endpoints
│   │   ├── Models/             # Data models
│   │   ├── Services/           # Business logic
│   │   └── Data/               # Database context
│   └── Database/
│       └── schema.sql          # Create database and tables
├── Frontend/
│   └── email-tracking-app/     # React application
│       ├── src/components/     # UI components
│       ├── src/pages/          # Page components
│       └── src/services/       # API calls
└── Documentation/              # Guides and docs
```

---

## Key Files to Remember

| Purpose | File | Location |
|---------|------|----------|
| Database | schema.sql | `Backend/Database/` |
| Backend Config | appsettings.json | `Backend/EmailTrackingAPI/` |
| Frontend Config | .env | `Frontend/email-tracking-app/` |
| API Documentation | API_GUIDE.md | `Documentation/` |
| Setup Guide | SETUP_INSTRUCTIONS.md | `Documentation/` |

---

## Common Tasks

### Add a New User
Edit `Backend/Database/schema.sql` and run:
```sql
INSERT INTO Users (Username, Email, Password, IsDirector, IsActive)
VALUES ('username', 'email@domain.com', 'password', 0, 1)
-- Change 0 to 1 for director, 1 for employee
```

### Change Database Connection
Edit `Backend/EmailTrackingAPI/appsettings.json`:
```json
"DefaultConnection": "Server=YOUR_SERVER;Database=EmailTrackingDB;..."
```

### Change API Port
Edit `Backend/EmailTrackingAPI/Program.cs`:
```csharp
app.Urls.Add("http://localhost:5001");
```
Then update Frontend `.env`:
```
REACT_APP_API_URL=http://localhost:5001/api
```

### Make Backend Changes Auto-Reload
```bash
dotnet watch run
```

### Make Frontend Changes Auto-Reload
```bash
npm start
```
(Already set up - changes auto-reload in browser)

---

## API Endpoints Quick Reference

### Authentication
```
POST /api/auth/login
  Body: {usernameOrEmail: "...", password: "..."}
  Returns: {userId, username, email, isDirector}
```

### Get Companies
```
GET /api/companies
  Headers: userId=X, isDirector=true/false
  Returns: List of companies (filtered by role)
```

### Add Company
```
POST /api/companies
  Headers: userId=X
  Body: {companyName, region, link, emails}
  Returns: New company object
```

### Update Company
```
PUT /api/companies/{id}
  Headers: userId=X, isDirector=true/false
  Body: {companyName, region, link, emails, column1-5, status}
  Returns: Success/error message
```

### Delete Company
```
DELETE /api/companies/{id}
  Headers: userId=X, isDirector=true/false
  Returns: Success/error message
```

### Mark as Pending
```
PUT /api/companies/{id}/mark-as-pending
  Headers: userId=X, isDirector=true/false
  Returns: Success/error message (updates status to Pending)
```

---

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Backend won't start | Check SQL Server is running, verify connection string |
| Frontend won't connect | Ensure backend is running, check REACT_APP_API_URL in .env |
| CORS errors | Verify localhost:3000 is in CORS config, restart backend |
| Login fails | Check user exists in database with IsActive=1 |
| Send Mail button disabled | Fill all 5 columns first |
| Can't see other users' records | Must be logged in as director (IsDirector=1) |

---

## Development Tools

### Testing the API
**Using Postman**:
1. Import endpoints from `API_GUIDE.md`
2. Set environment variables: userId, isDirector
3. Test each endpoint

**Using cURL**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"director1","password":"hashed_password_123"}'
```

### Debugging
- **Frontend**: Open browser DevTools (F12), check Console tab
- **Backend**: Check console output where `dotnet run` is executing
- **Database**: Use SQL Server Management Studio to verify data

---

## File Purposes

### Controllers
- **AuthController.cs**: Handles `/api/auth/login`
- **CompaniesController.cs**: Handles all company operations

### Services
- **AuthenticationService.cs**: Authentication logic
- **CompanyService.cs**: Company CRUD and business logic

### Models
- **Models.cs**: All DTOs and database models

### Frontend Components
- **LoginPage.jsx**: Login form
- **DashboardPage.jsx**: Main dashboard
- **CompanyTable.jsx**: Editable company table
- **AddCompanyModal.jsx**: Modal for adding companies
- **Toast.jsx**: Notification system

---

## Database Tables

### Users
- Id, Username, Email, Password, IsDirector, CreatedAt, IsActive

### Companies
- Id, CompanyName, Region, Link, Emails, Column1-5, Status, UserId, CreatedAt, UpdatedAt, LastEmailSentAt

---

## Access Control Rules

| Action | Employee | Director |
|--------|----------|----------|
| View own records | ✅ | ✅ |
| View all records | ❌ | ✅ |
| Edit own records | ✅ | ✅ |
| Edit any record | ❌ | ✅ |
| Delete own records | ✅ | ✅ |
| Delete any record | ❌ | ✅ |
| Add records | ✅ | ✅ |
| See usernames | ❌ | ✅ |

---

## Useful Links

- [ASP.NET Core Docs](https://docs.microsoft.com/en-us/dotnet/core/)
- [React Docs](https://react.dev/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [SQL Server Docs](https://docs.microsoft.com/en-us/sql/sql-server/)

---

## Key Concepts

### IsDirector Flag
- Director (true): Full access to all records
- Employee (false): Access only to own records

### Status Values
- **Not Sent**: Company not contacted yet
- **Pending**: Email marked as sent but awaiting response
- **Sent**: Email sent successfully
- **Responded**: Company responded to email
- **Follow-up Required**: Need to follow up
- **Closed**: Interaction complete

### Send Mail Logic
- ❌ Does NOT send actual emails
- ✅ Updates status to "Pending"
- ✅ Records LastEmailSentAt timestamp
- ✅ Can only be clicked when all 5 columns are filled

---

## Production Checklist

- [ ] Update database connection string
- [ ] Implement password hashing
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up environment variables
- [ ] Enable logging and monitoring
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Set up CI/CD pipeline
- [ ] Configure backup strategy
- [ ] Test all access control rules
- [ ] Review security settings

---

**Quick Reference Version**: 1.0  
**Last Updated**: May 18, 2026
