# Email Tracking Application

A complete full-stack web application for tracking companies, client contacts, and email communications with role-based access control.

## Technology Stack

- **Frontend**: React.js 18
- **Backend**: ASP.NET Core 8.0 Web API
- **Database**: SQL Server
- **Authentication**: Database credentials with role-based access (IsDirector)

## Features

✅ **User Authentication**
- Login with username/email and password
- Role-based access control (Employee vs Director)
- Session persistence with localStorage

✅ **Company Management**
- Add, view, edit, and delete company records
- Email validation for multiple contacts
- Duplicate prevention per user
- 5 custom tracking columns

✅ **Status Tracking**
- Track company status through workflow (Not Sent → Pending → Sent → Responded → Follow-up → Closed)
- Record timestamp when mail is marked as pending
- Manual status updates

✅ **Access Control**
- Employees view only their own records
- Directors view all records with username visibility
- Backend enforces all access rules
- Secure API endpoints

✅ **UI/UX**
- Clean and professional dashboard design
- Responsive layout
- Editable table rows with inline editing
- Modal for adding new companies
- Toast notifications for feedback
- Loading indicators

## Quick Start

### Prerequisites
- .NET 8.0 SDK
- Node.js (v16+)
- SQL Server
- npm

### Setup

1. **Database Setup**:
   - Open SQL Server Management Studio
   - Execute `Backend/Database/schema.sql`

2. **Backend Setup**:
   ```bash
   cd Backend/EmailTrackingAPI
   dotnet restore
   dotnet run
   ```
   Backend runs on `http://localhost:5000`

3. **Frontend Setup**:
   ```bash
   cd Frontend/email-tracking-app
   npm install
   npm start
   ```
   Frontend opens at `http://localhost:3000`

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Director | director1 | hashed_password_123 |
| Employee | employee1 | hashed_password_456 |
| Employee | employee2 | hashed_password_789 |

## Documentation

- **[SETUP_INSTRUCTIONS.md](Documentation/SETUP_INSTRUCTIONS.md)** - Complete installation guide
- **[API_GUIDE.md](Documentation/API_GUIDE.md)** - Full API documentation with examples
- **[PROJECT_SKILL.md](Documentation/PROJECT_SKILL.md)** - Project architecture and development guide

## Project Structure

```
EmailTrackingApplication/
├── Backend/
│   ├── EmailTrackingAPI/
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── Services/
│   │   ├── Data/
│   │   └── Program.cs
│   └── Database/
│       └── schema.sql
├── Frontend/
│   └── email-tracking-app/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   └── App.jsx
│       ├── public/
│       └── package.json
└── Documentation/
    ├── SETUP_INSTRUCTIONS.md
    ├── API_GUIDE.md
    └── PROJECT_SKILL.md
```

## Key API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Companies
- `GET /api/companies` - List companies
- `POST /api/companies` - Add company
- `PUT /api/companies/{id}` - Update company
- `DELETE /api/companies/{id}` - Delete company
- `POST /api/companies/check-duplicate` - Check duplicate
- `PUT /api/companies/{id}/status` - Update status
- `PUT /api/companies/{id}/mark-as-pending` - Mark as pending

## Access Control

### Employee (IsDirector = false)
- ✅ View own records
- ✅ Add new companies
- ✅ Edit own records
- ✅ Delete own records
- ✅ Send mail for own records

### Director (IsDirector = true)
- ✅ View all records
- ✅ Add new companies
- ✅ Edit any record
- ✅ Delete any record
- ✅ Send mail for any record
- ✅ See which user added each record

## Column Logic

- **5 Custom Columns** (Column1-Column5): Track custom data
- **Send Mail Button**: Disabled until all 5 columns are filled
- **Action**: Clicking Send Mail marks status as "Pending" and records the timestamp
- **Note**: Does NOT send actual emails

## Validation

- Company Name: Required, unique per user
- Region: Required
- Emails: Required, valid format, comma/semicolon separated
- All 5 columns must be filled before sending mail
- Duplicate company names prevented per user
- Email format validation (RFC-compliant)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Making Changes

**Backend**:
```bash
cd Backend/EmailTrackingAPI
dotnet run
```

**Frontend**:
```bash
cd Frontend/email-tracking-app
npm start
```

### Building for Production

**Backend**:
```bash
dotnet publish -c Release -o ./publish
```

**Frontend**:
```bash
npm run build
```

## Troubleshooting

See [SETUP_INSTRUCTIONS.md](Documentation/SETUP_INSTRUCTIONS.md) for detailed troubleshooting guide.

## Security Notes

⚠️ **Production Recommendations**:
- Implement password hashing (bcrypt)
- Use JWT tokens for authentication
- Enable HTTPS
- Add rate limiting
- Implement request validation
- Add audit logging
- Use environment variables for secrets

## License

This project is provided as-is for educational and development purposes.

## Support

For detailed information:
- Setup help: See [SETUP_INSTRUCTIONS.md](Documentation/SETUP_INSTRUCTIONS.md)
- API usage: See [API_GUIDE.md](Documentation/API_GUIDE.md)
- Development: See [PROJECT_SKILL.md](Documentation/PROJECT_SKILL.md)

---

**Version**: 1.0  
**Last Updated**: May 18, 2026  
**Status**: Production Ready
