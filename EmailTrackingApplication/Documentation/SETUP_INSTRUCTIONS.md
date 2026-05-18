# Email Tracking Application - Setup Instructions

## Project Overview

The Email Tracking Application is a full-stack web application built with:
- **Frontend**: React.js (Single Page Application)
- **Backend**: ASP.NET Core Web API
- **Database**: SQL Server
- **Authentication**: Database credentials with role-based access (IsDirector flag)

## Prerequisites

Before you begin, ensure you have the following installed:

### Backend Requirements
- **.NET 8.0 SDK** - Download from [Microsoft .NET](https://dotnet.microsoft.com/download)
- **SQL Server** - [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-express) or higher
- **SQL Server Management Studio (SSMS)** - Optional but recommended

### Frontend Requirements
- **Node.js** (v16 or higher) - Download from [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)

## Project Structure

```
EmailTrackingApplication/
├── Backend/
│   ├── EmailTrackingAPI/
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs
│   │   │   └── CompaniesController.cs
│   │   ├── Models/
│   │   │   └── Models.cs
│   │   ├── Services/
│   │   │   ├── AuthenticationService.cs
│   │   │   └── CompanyService.cs
│   │   ├── Data/
│   │   │   └── ApplicationDbContext.cs
│   │   ├── Program.cs
│   │   ├── appsettings.json
│   │   └── EmailTrackingAPI.csproj
│   └── Database/
│       └── schema.sql
├── Frontend/
│   └── email-tracking-app/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Toast.jsx
│       │   │   ├── Toast.css
│       │   │   ├── AddCompanyModal.jsx
│       │   │   ├── AddCompanyModal.css
│       │   │   ├── CompanyTable.jsx
│       │   │   └── CompanyTable.css
│       │   ├── pages/
│       │   │   ├── LoginPage.jsx
│       │   │   ├── LoginPage.css
│       │   │   ├── DashboardPage.jsx
│       │   │   └── DashboardPage.css
│       │   ├── services/
│       │   │   ├── api.js
│       │   │   └── authUtils.js
│       │   ├── App.jsx
│       │   ├── App.css
│       │   ├── index.jsx
│       │   └── index.css
│       ├── public/
│       │   └── index.html
│       ├── package.json
│       └── .env
└── Documentation/
    ├── SETUP_INSTRUCTIONS.md (this file)
    ├── API_GUIDE.md
    └── PROJECT_SKILL.md
```

## Step-by-Step Setup

### Step 1: Set Up the Database

1. **Open SQL Server Management Studio (SSMS)**
2. **Connect to your SQL Server instance**
3. **Create the database and tables**:
   - Open a New Query window
   - Copy and paste the entire content from `Backend/Database/schema.sql`
   - Click "Execute" to create the database, tables, and sample data

**Sample Login Credentials** (from schema.sql):
- Username: `director1` | Password: `hashed_password_123` | Role: Director
- Username: `employee1` | Password: `hashed_password_456` | Role: Employee
- Username: `employee2` | Password: `hashed_password_789` | Role: Employee

### Step 2: Set Up the Backend (ASP.NET Core)

1. **Navigate to the backend directory**:
   ```bash
   cd EmailTrackingApplication\Backend\EmailTrackingAPI
   ```

2. **Restore NuGet packages**:
   ```bash
   dotnet restore
   ```

3. **Update the database connection string** in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=EmailTrackingDB;Integrated Security=true;TrustServerCertificate=true;"
   }
   ```
   Replace `YOUR_SERVER_NAME` with your SQL Server instance name (e.g., `localhost` or `.\SQLEXPRESS`)

4. **Run the backend**:
   ```bash
   dotnet run
   ```
   The API will start on `http://localhost:5000` or `https://localhost:5001`

### Step 3: Set Up the Frontend (React)

1. **Navigate to the frontend directory**:
   ```bash
   cd EmailTrackingApplication\Frontend\email-tracking-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify the API URL** in `.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   PORT=3000
   ```
   Adjust if your backend is running on a different port.

4. **Start the development server**:
   ```bash
   npm start
   ```
   The application will automatically open in your browser at `http://localhost:3000`

## Features

### User Authentication
- Login with username/email and password
- Role-based access control (IsDirector flag)
- Session storage in localStorage

### Dashboard
- **For Employees**: View only their own records
- **For Directors**: View all users' records

### Company Management
- **Add Company**: Create new company records with validation
- **Edit Company**: Modify company details and custom columns
- **Delete Company**: Remove companies (with confirmation)
- **Send Mail Status**: Mark records as "Pending" when mail is sent

### Column Logic
- 5 Custom Columns (Column1-Column5) for tracking
- Send Mail button disabled until all 5 columns are filled
- Status tracking with predefined status options

### Access Control
- Employees can only modify their own records
- Directors can modify any record
- Backend enforces all access rules

## API Endpoints

### Authentication
- **POST** `/api/auth/login` - User login

### Companies
- **GET** `/api/companies` - Get companies (filtered by user role)
- **POST** `/api/companies` - Add new company
- **PUT** `/api/companies/{id}` - Update company
- **DELETE** `/api/companies/{id}` - Delete company
- **POST** `/api/companies/check-duplicate` - Check for duplicate company name
- **PUT** `/api/companies/{id}/status` - Update company status
- **PUT** `/api/companies/{id}/mark-as-pending` - Mark company as pending (update status and LastEmailSentAt)

For detailed API documentation, see `API_GUIDE.md`

## Troubleshooting

### Backend Won't Start
- **Issue**: Connection string error
  - **Solution**: Check SQL Server connection string in `appsettings.json`
  - **Solution**: Ensure SQL Server is running
  - **Solution**: Verify the database name matches (default: `EmailTrackingDB`)

- **Issue**: Port already in use
  - **Solution**: Change the port in `Program.cs` or `appsettings.json`
  - **Solution**: Kill the process using the port: `netstat -ano | findstr :5000` (Windows)

### Frontend Won't Connect to Backend
- **Issue**: "Failed to fetch" errors
  - **Solution**: Verify backend is running on the correct port
  - **Solution**: Check `.env` file has correct `REACT_APP_API_URL`
  - **Solution**: Check CORS settings in `Program.cs`

- **Issue**: CORS errors
  - **Solution**: Backend should have CORS enabled for `http://localhost:3000`
  - **Solution**: Restart the backend after making CORS changes

### Database Issues
- **Issue**: Login fails with valid credentials
  - **Solution**: Check that users are inserted in the database
  - **Solution**: Verify `IsActive` is set to 1 for the user
  - **Solution**: Check the `IsDirector` flag is correct

## Development

### Making Changes

#### Backend Changes
1. Edit files in `Backend/EmailTrackingAPI`
2. The backend should auto-reload if you're using `dotnet watch run`
3. If not, restart with `dotnet run`

#### Frontend Changes
1. Edit files in `Frontend/email-tracking-app/src`
2. The development server will automatically reload in your browser
3. Check the browser console for any errors

### Building for Production

#### Backend
```bash
cd Backend/EmailTrackingAPI
dotnet publish -c Release
```

#### Frontend
```bash
cd Frontend/email-tracking-app
npm run build
```

## Additional Notes

- **Passwords**: In the demo, passwords are stored in plain text. For production, implement proper password hashing.
- **Emails**: The "Send Mail" button doesn't send actual emails. It only updates the status to "Pending".
- **Session Storage**: User session is stored in localStorage. Clear browser data to logout.
- **HTTPS**: In production, enforce HTTPS for secure communication.

## Support

For issues or questions, refer to the project documentation files or check the API_GUIDE.md for detailed API information.
