-- Email Tracking Application Database Schema
-- SQL Server

-- Create Users Table
CREATE TABLE [Users]
(
    [Id] INT PRIMARY KEY IDENTITY(1,1),
    [Username] NVARCHAR(100) NOT NULL UNIQUE,
    [Email] NVARCHAR(150) NOT NULL UNIQUE,
    [Password] NVARCHAR(MAX) NOT NULL,
    [IsDirector] BIT NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    [IsActive] BIT NOT NULL DEFAULT 1
);

-- Create Companies Table
CREATE TABLE [Companies]
(
    [Id] INT PRIMARY KEY IDENTITY(1,1),
    [CompanyName] NVARCHAR(255) NOT NULL,
    [Region] NVARCHAR(100) NOT NULL,
    [Link] NVARCHAR(MAX) NULL,
    [Emails] NVARCHAR(MAX) NOT NULL, -- Store as comma-separated or JSON
    [Column1] NVARCHAR(MAX) NULL,
    [Column2] NVARCHAR(MAX) NULL,
    [Column3] NVARCHAR(MAX) NULL,
    [Column4] NVARCHAR(MAX) NULL,
    [Column5] NVARCHAR(MAX) NULL,
    [Status] NVARCHAR(50) NOT NULL DEFAULT 'Not Sent',
    [UserId] INT NOT NULL,
    [CreatedAt] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    [LastEmailSentAt] DATETIME NULL,
    CONSTRAINT [FK_Companies_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]) ON DELETE CASCADE
);

-- Create Index on UserId for better query performance
CREATE INDEX [IX_Companies_UserId] ON [Companies]([UserId]);

-- Create Index on CompanyName and UserId for duplicate check
CREATE INDEX [IX_Companies_CompanyName_UserId] ON [Companies]([CompanyName], [UserId]);

-- Insert sample data (optional)
INSERT INTO [Users] ([Username], [Email], [Password], [IsDirector], [IsActive])
VALUES 
    ('director1', 'director@example.com', 'hashed_password_123', 1, 1),
    ('employee1', 'employee1@example.com', 'hashed_password_456', 0, 1),
    ('employee2', 'employee2@example.com', 'hashed_password_789', 0, 1);

INSERT INTO [Companies] ([CompanyName], [Region], [Link], [Emails], [Status], [UserId])
VALUES 
    ('TechCorp', 'North America', 'https://techcorp.com', 'contact@techcorp.com', 'Not Sent', 2),
    ('Global Solutions', 'Europe', 'https://globalsolutions.com', 'info@globalsolutions.com;support@globalsolutions.com', 'Not Sent', 2),
    ('Innovation Labs', 'Asia', 'https://innovationlabs.com', 'hello@innovationlabs.com', 'Pending', 3);
