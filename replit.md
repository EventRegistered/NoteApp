# Notes Application

## Overview
A full-stack notes application with user authentication, built with React (frontend) and Express.js (backend) using PostgreSQL database.

## Project Architecture

### Frontend (React + Vite)
- **Port**: 5000 (bound to 0.0.0.0)
- **Location**: `/frontend`
- **Stack**: React 18, React Router, React Query, Axios, TailwindCSS
- **Build Tool**: Vite

### Backend (Express.js)
- **Port**: 4000 (bound to localhost)
- **Location**: `/backend`
- **Stack**: Express.js, Sequelize ORM, JWT Authentication
- **Database**: PostgreSQL (Replit's built-in database)

## Key Features
- User registration and login with JWT authentication
- Create, read, update, delete notes
- Soft delete functionality for notes
- Role-based user system

## Running the Application
The workflow runs both frontend and backend together:
```bash
cd backend && npm run dev & cd frontend && npm run dev
```

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `JWT_SECRET` - Secret for JWT token signing
- `PORT` - Backend port (4000)
- `NODE_ENV` - Environment mode (development)

## Database Schema
- **Users**: UserId, FullName, Email, PasswordHash, Role, timestamps
- **Notes**: NoteId, UserId (FK), Title, Content, Deleted, DeletedAt, timestamps

## Recent Changes
- 2025-12-12: Initial import and setup for Replit environment
  - Converted from MS SQL Server to PostgreSQL
  - Updated Vite config for Replit proxy support
  - Configured frontend to listen on 0.0.0.0:5000
  - Backend binds to localhost:4000
