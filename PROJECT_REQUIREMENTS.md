# E-Voting System - Functional and Non-Functional Requirements

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technologies, Languages & Frameworks](#technologies-languages--frameworks)
3. [Functional Requirements](#functional-requirements)
4. [Non-Functional Requirements](#non-functional-requirements)
5. [System Architecture](#system-architecture)

---

## 🎯 Project Overview

**VoteSecure** is a secure, web-based electronic voting system that enables voters, candidates, and administrators to participate in digital elections. The system provides role-based access control, phone verification, and admin approval workflows to ensure election integrity.

---

## 💻 Technologies, Languages & Frameworks

### **Backend Technologies**

#### **Core Runtime & Language**
- **Node.js** (v18.0.0+)
- **TypeScript** (v5.8.3)
- **JavaScript/ES2020**

#### **Web Framework**
- **Express.js** (v4.21.2) - RESTful API server

#### **Database**
- **MySQL** (v8.0.0+) - Relational database
- **Prisma** (v6.0.0) - ORM (Object-Relational Mapping)
  - Prisma Client for type-safe database access
  - Prisma Migrate for database schema management

#### **Authentication & Security**
- **JSON Web Token (JWT)** (v9.0.2) - Token-based authentication
- **bcryptjs** (v2.4.3) - Password hashing (10 salt rounds)
- **CORS** (v2.8.5) - Cross-Origin Resource Sharing

#### **Communication Services**
- **Twilio** (v5.4.1) - SMS OTP delivery service

#### **Utilities**
- **dotenv** (v16.4.5) - Environment variable management
- **date-fns** (v3.6.0) - Date manipulation utilities

#### **Development Tools**
- **ts-node** (v10.9.2) - TypeScript execution
- **ts-node-dev** (v2.0.0) - Development server with hot reload

---

### **Frontend Technologies**

#### **Core Framework**
- **React** (v18.3.1) - UI library
- **TypeScript** (v5.8.3) - Type-safe JavaScript
- **Vite** (v5.4.19) - Build tool and dev server

#### **UI Framework & Styling**
- **Tailwind CSS** (v3.4.17) - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Unstyled, accessible component primitives
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu, etc.
- **lucide-react** (v0.462.0) - Icon library
- **tailwindcss-animate** (v1.0.7) - Animation utilities
- **class-variance-authority** (v0.7.1) - Component variant management
- **clsx** (v2.1.1) - Conditional className utility
- **tailwind-merge** (v2.6.0) - Merge Tailwind classes

#### **Routing**
- **react-router-dom** (v6.30.1) - Client-side routing with protected routes

#### **State Management**
- **React Context API** - Built-in state management
  - AuthContext for authentication state
  - ElectionContext for election data
- **@tanstack/react-query** (v5.83.0) - Server state management (ready for API integration)

#### **Form Handling**
- **react-hook-form** (v7.61.1) - Form state management
- **@hookform/resolvers** (v3.10.0) - Form validation resolvers
- **zod** (v3.25.76) - Schema validation

#### **UI Components & Utilities**
- **recharts** (v2.15.4) - Chart library for results visualization
- **sonner** (v1.7.4) - Toast notification system
- **input-otp** (v1.4.2) - OTP input component
- **react-day-picker** (v8.10.1) - Date picker component
- **date-fns** (v3.6.0) - Date formatting utilities
- **next-themes** (v0.3.0) - Theme switching support
- **cmdk** (v1.1.1) - Command menu component
- **embla-carousel-react** (v8.6.0) - Carousel component
- **vaul** (v0.9.9) - Drawer component
- **react-resizable-panels** (v2.1.9) - Resizable panel layouts

#### **Development Tools**
- **ESLint** (v9.32.0) - Code linting
- **TypeScript ESLint** (v8.38.0) - TypeScript-specific linting
- **PostCSS** (v8.5.6) - CSS processing
- **Autoprefixer** (v10.4.21) - CSS vendor prefixing

---

### **Database Schema**

#### **Models**
- **User** - Stores user accounts (voters, candidates, admins)
- **OtpCode** - Stores OTP codes for phone verification

#### **Enums**
- **UserRole**: VOTER, CANDIDATE, ADMIN
- **OtpType**: REGISTRATION, LOGIN

---

## ✅ Functional Requirements

### **FR1: User Registration & Authentication**

#### **FR1.1: User Registration**
- **FR1.1.1**: System shall allow users to register with name, email, phone number, password, and role (VOTER or CANDIDATE)
- **FR1.1.2**: System shall validate that email and phone number are unique
- **FR1.1.3**: System shall hash passwords using bcrypt before storage
- **FR1.1.4**: System shall send OTP code to user's phone number via SMS (Twilio) upon registration
- **FR1.1.5**: System shall store OTP codes with expiration time (10 minutes)
- **FR1.1.6**: System shall mark new users as unverified (isVerified: false, isPhoneVerified: false)

#### **FR1.2: Phone Verification (OTP)**
- **FR1.2.1**: System shall allow users to verify phone number using OTP code
- **FR1.2.2**: System shall validate OTP code against stored codes
- **FR1.2.3**: System shall check OTP expiration time
- **FR1.2.4**: System shall mark OTP as used after successful verification
- **FR1.2.5**: System shall update user's isPhoneVerified status to true upon successful verification
- **FR1.2.6**: System shall prevent reuse of OTP codes

#### **FR1.3: User Login**
- **FR1.3.1**: System shall allow users to login using phone number and password
- **FR1.3.2**: System shall verify password against stored hash
- **FR1.3.3**: System shall require phone verification before allowing login
- **FR1.3.4**: System shall require admin approval before allowing login
- **FR1.3.5**: System shall generate JWT token upon successful login
- **FR1.3.6**: System shall return user information (id, name, email, phone, role) with token

#### **FR1.4: Authentication Middleware**
- **FR1.4.1**: System shall validate JWT tokens on protected routes
- **FR1.4.2**: System shall extract user information from JWT token
- **FR1.4.3**: System shall enforce role-based access control (RBAC)
- **FR1.4.4**: System shall return 401 Unauthorized for invalid/missing tokens
- **FR1.4.5**: System shall return 403 Forbidden for insufficient permissions

---

### **FR2: Voter Functionality**

#### **FR2.1: Voter Dashboard**
- **FR2.1.1**: System shall display voter dashboard with election information
- **FR2.1.2**: System shall show available elections to vote in
- **FR2.1.3**: System shall display voting history (if implemented)

#### **FR2.2: Cast Vote**
- **FR2.2.1**: System shall allow voters to select an election
- **FR2.2.2**: System shall display list of candidates for selected election
- **FR2.2.3**: System shall allow voters to cast a vote for a candidate
- **FR2.2.4**: System shall prevent duplicate voting (one vote per election per voter)
- **FR2.2.5**: System shall record vote timestamp

#### **FR2.3: View Results**
- **FR2.3.1**: System shall display election results to voters
- **FR2.3.2**: System shall show candidate vote counts
- **FR2.3.3**: System shall display results in chart/graph format
- **FR2.3.4**: System shall only show results for published elections

#### **FR2.4: Submit Nomination**
- **FR2.4.1**: System shall allow voters to submit nomination for candidacy
- **FR2.4.2**: System shall collect nomination information (manifesto, party, etc.)

---

### **FR3: Candidate Functionality**

#### **FR3.1: Candidate Dashboard**
- **FR3.1.1**: System shall display candidate dashboard
- **FR3.1.2**: System shall show elections where candidate is running
- **FR3.1.3**: System shall display candidate's vote count

#### **FR3.2: Cast Vote**
- **FR3.2.1**: System shall allow candidates to vote in elections (where they are not running)
- **FR3.2.2**: System shall prevent candidates from voting for themselves

#### **FR3.3: View Results**
- **FR3.3.1**: System shall display election results to candidates
- **FR3.3.2**: System shall show detailed vote breakdown

#### **FR3.4: Manage Candidacy**
- **FR3.4.1**: System shall allow candidates to update nomination information
- **FR3.4.2**: System shall display nomination status

---

### **FR4: Admin Functionality**

#### **FR4.1: Admin Dashboard**
- **FR4.1.1**: System shall display admin dashboard with system overview
- **FR4.1.2**: System shall show statistics (total voters, candidates, elections)
- **FR4.1.3**: System shall display pending actions (voter approvals)

#### **FR4.2: Voter Validation**
- **FR4.2.1**: System shall display list of pending voters awaiting approval
- **FR4.2.2**: System shall show voter details (name, email, phone, registration date)
- **FR4.2.3**: System shall allow admin to approve voters
- **FR4.2.4**: System shall update voter's isVerified status to true upon approval
- **FR4.2.5**: System shall allow admin to reject voters (if implemented)

#### **FR4.3: Manage Elections**
- **FR4.3.1**: System shall allow admin to create new elections
- **FR4.3.2**: System shall allow admin to edit election details
- **FR4.3.3**: System shall allow admin to set election start and end dates
- **FR4.3.4**: System shall allow admin to publish/unpublish election results
- **FR4.3.5**: System shall allow admin to activate/deactivate elections

#### **FR4.4: Manage Candidates**
- **FR4.4.1**: System shall allow admin to view all candidates
- **FR4.4.2**: System shall allow admin to approve/reject candidate nominations
- **FR4.4.3**: System shall allow admin to manage candidate information

#### **FR4.5: View Results**
- **FR4.5.1**: System shall display comprehensive election results to admin
- **FR4.5.2**: System shall show detailed vote counts and statistics
- **FR4.5.3**: System shall allow admin to export results (if implemented)

---

### **FR5: System Features**

#### **FR5.1: Role-Based Access Control (RBAC)**
- **FR5.1.1**: System shall enforce role-based route protection
- **FR5.1.2**: System shall redirect unauthorized users to appropriate dashboard
- **FR5.1.3**: System shall prevent access to routes not matching user role

#### **FR5.2: Protected Routes**
- **FR5.2.1**: System shall require authentication for protected routes
- **FR5.2.2**: System shall redirect unauthenticated users to login page
- **FR5.2.3**: System shall maintain user session using JWT tokens

#### **FR5.3: Landing Page**
- **FR5.3.1**: System shall display landing page with system information
- **FR5.3.2**: System shall show test credentials for demo purposes
- **FR5.3.3**: System shall provide navigation to login and registration

#### **FR5.4: Error Handling**
- **FR5.4.1**: System shall handle authentication errors gracefully
- **FR5.4.2**: System shall handle database errors with appropriate messages
- **FR5.4.3**: System shall return appropriate HTTP status codes
- **FR5.4.4**: System shall display user-friendly error messages

---

## 🔒 Non-Functional Requirements

### **NFR1: Security Requirements**

#### **NFR1.1: Authentication Security**
- **NFR1.1.1**: System shall use JWT tokens with expiration for session management
- **NFR1.1.2**: System shall hash passwords using bcrypt with 10 salt rounds
- **NFR1.1.3**: System shall never store plain-text passwords
- **NFR1.1.4**: System shall validate JWT tokens on every protected request
- **NFR1.1.5**: System shall use secure token signing with secret key

#### **NFR1.2: Authorization Security**
- **NFR1.2.1**: System shall implement role-based access control (RBAC)
- **NFR1.2.2**: System shall enforce authorization at both route and API level
- **NFR1.2.3**: System shall prevent privilege escalation attacks
- **NFR1.2.4**: System shall validate user permissions before allowing actions

#### **NFR1.3: Data Security**
- **NFR1.3.1**: System shall use parameterized queries (Prisma) to prevent SQL injection
- **NFR1.3.2**: System shall validate and sanitize all user inputs
- **NFR1.3.3**: System shall use HTTPS in production (recommended)
- **NFR1.3.4**: System shall store sensitive data (passwords) in encrypted form

#### **NFR1.4: Communication Security**
- **NFR1.4.1**: System shall use CORS to control cross-origin requests
- **NFR1.4.2**: System shall send OTP codes via secure SMS service (Twilio)
- **NFR1.4.3**: System shall expire OTP codes after 10 minutes
- **NFR1.4.4**: System shall prevent OTP code reuse

#### **NFR1.5: Access Control**
- **NFR1.5.1**: System shall require phone verification before account activation
- **NFR1.5.2**: System shall require admin approval for voter/candidate accounts
- **NFR1.5.3**: System shall prevent unverified users from accessing system features
- **NFR1.5.4**: System shall implement two-factor authentication via OTP

---

### **NFR2: Performance Requirements**

#### **NFR2.1: Response Time**
- **NFR2.1.1**: System shall respond to API requests within 2 seconds (95th percentile)
- **NFR2.1.2**: System shall load frontend pages within 3 seconds
- **NFR2.1.3**: System shall handle concurrent user requests efficiently

#### **NFR2.2: Scalability**
- **NFR2.2.1**: System shall support at least 1000 concurrent users
- **NFR2.2.2**: System shall be horizontally scalable (stateless backend)
- **NFR2.2.3**: System shall use database connection pooling (Prisma)
- **NFR2.2.4**: System shall optimize database queries for performance

#### **NFR2.3: Resource Usage**
- **NFR2.3.1**: System shall minimize frontend bundle size (Vite code splitting)
- **NFR2.3.2**: System shall use efficient database indexing
- **NFR2.3.3**: System shall implement lazy loading for components

---

### **NFR3: Reliability Requirements**

#### **NFR3.1: Availability**
- **NFR3.1.1**: System shall have 99% uptime (excluding planned maintenance)
- **NFR3.1.2**: System shall handle database connection failures gracefully
- **NFR3.1.3**: System shall implement error recovery mechanisms

#### **NFR3.2: Data Integrity**
- **NFR3.2.1**: System shall ensure data consistency using database transactions
- **NFR3.2.2**: System shall prevent duplicate votes using unique constraints
- **NFR3.2.3**: System shall maintain referential integrity in database
- **NFR3.2.4**: System shall use database migrations for schema changes

#### **NFR3.3: Error Handling**
- **NFR3.3.1**: System shall log errors for debugging and monitoring
- **NFR3.3.2**: System shall return appropriate error messages to users
- **NFR3.3.3**: System shall prevent system crashes from user errors

---

### **NFR4: Usability Requirements**

#### **NFR4.1: User Interface**
- **NFR4.1.1**: System shall provide intuitive and user-friendly interface
- **NFR4.1.2**: System shall be responsive and work on desktop and mobile devices
- **NFR4.1.3**: System shall use consistent design language (shadcn/ui components)
- **NFR4.1.4**: System shall provide clear navigation and breadcrumbs

#### **NFR4.2: Accessibility**
- **NFR4.2.1**: System shall use accessible UI components (Radix UI)
- **NFR4.2.2**: System shall support keyboard navigation
- **NFR4.2.3**: System shall provide appropriate ARIA labels
- **NFR4.2.4**: System shall maintain sufficient color contrast

#### **NFR4.3: User Experience**
- **NFR4.3.1**: System shall provide loading indicators for async operations
- **NFR4.3.2**: System shall show toast notifications for user actions
- **NFR4.3.3**: System shall provide clear error messages
- **NFR4.3.4**: System shall maintain user session across page refreshes

---

### **NFR5: Maintainability Requirements**

#### **NFR5.1: Code Quality**
- **NFR5.1.1**: System shall use TypeScript for type safety
- **NFR5.1.2**: System shall follow consistent coding standards (ESLint)
- **NFR5.1.3**: System shall have modular architecture (separation of concerns)
- **NFR5.1.4**: System shall use meaningful variable and function names

#### **NFR5.2: Documentation**
- **NFR5.2.1**: System shall have setup and installation documentation
- **NFR5.2.2**: System shall document API endpoints
- **NFR5.2.3**: System shall provide code comments for complex logic

#### **NFR5.3: Testing**
- **NFR5.3.1**: System shall be testable (modular structure)
- **NFR5.3.2**: System shall support unit testing (recommended)
- **NFR5.3.3**: System shall support integration testing (recommended)

---

### **NFR6: Compatibility Requirements**

#### **NFR6.1: Browser Compatibility**
- **NFR6.1.1**: System shall work on modern browsers (Chrome, Firefox, Safari, Edge)
- **NFR6.1.2**: System shall use progressive enhancement
- **NFR6.1.3**: System shall handle browser-specific differences

#### **NFR6.2: Platform Compatibility**
- **NFR6.2.1**: System shall run on Windows, macOS, and Linux
- **NFR6.2.2**: System shall support Node.js v18.0.0 and above
- **NFR6.2.3**: System shall support MySQL v8.0.0 and above

---

### **NFR7: Operational Requirements**

#### **NFR7.1: Deployment**
- **NFR7.1.1**: System shall support development and production environments
- **NFR7.1.2**: System shall use environment variables for configuration
- **NFR7.1.3**: System shall support database migrations
- **NFR7.1.4**: System shall provide seed scripts for test data

#### **NFR7.2: Monitoring**
- **NFR7.2.1**: System shall log important events (registration, login, voting)
- **NFR7.2.2**: System shall provide health check endpoint (/health)
- **NFR7.2.3**: System shall handle graceful shutdown

#### **NFR7.3: Backup & Recovery**
- **NFR7.3.1**: System shall support database backups (MySQL)
- **NFR7.3.2**: System shall maintain database migration history
- **NFR7.3.3**: System shall support data restoration

---

## 🏗️ System Architecture

### **Architecture Pattern**
- **Frontend**: Single Page Application (SPA) with client-side routing
- **Backend**: RESTful API with Express.js
- **Database**: Relational database (MySQL) with Prisma ORM
- **Authentication**: JWT-based stateless authentication

### **Technology Stack Summary**

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **UI Framework** | Tailwind CSS + shadcn/ui + Radix UI |
| **Routing** | React Router v6 |
| **State Management** | React Context API + React Query |
| **Form Handling** | React Hook Form + Zod |
| **Backend Framework** | Express.js + TypeScript |
| **Database** | MySQL 8.0+ |
| **ORM** | Prisma |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hashing** | bcryptjs |
| **SMS Service** | Twilio |
| **Development** | ts-node-dev, ESLint |

---

## 📊 Summary Statistics

- **Total Functional Requirements**: 50+
- **Total Non-Functional Requirements**: 40+
- **Programming Languages**: TypeScript, JavaScript, SQL
- **Frontend Dependencies**: 60+ packages
- **Backend Dependencies**: 10+ packages
- **Database Models**: 2 (User, OtpCode)
- **User Roles**: 3 (VOTER, CANDIDATE, ADMIN)
- **API Endpoints**: 6+ (Auth, Admin)
- **Frontend Pages**: 15+ pages

---

*This document is based on the current codebase analysis and may be updated as the system evolves.*

