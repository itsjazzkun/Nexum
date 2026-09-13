
# Nexum

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,js,jwt,bcrypt" />
</p>

<p align="center">
  A RESTful backend API for collaborative project management.
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/itsjazzkun/Nexum?style=flat-square" />
  <img src="https://img.shields.io/github/stars/itsjazzkun/Nexum?style=flat-square" />
  <img src="https://img.shields.io/github/forks/itsjazzkun/Nexum?style=flat-square" />
</p>

---

## 🧩 Overview

**Nexum** is a RESTful backend API built for collaborative project management.

It provides the backend infrastructure required to manage users, projects, project members, roles, tasks, subtasks, notes, and file attachments.

The application is built using Node.js and Express, with MongoDB and Mongoose handling data persistence.

Authentication is implemented using JWT access and refresh tokens, with email verification, password recovery, password management, request validation, cookies, and role-based authorization.

The API follows a modular architecture separating routes, controllers, models, middleware, validators, database configuration, and utilities.

---

## ⚙️ Architecture

| Component | Purpose |
| --- | --- |
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **MongoDB** | Primary database |
| **Mongoose** | Database modeling and queries |
| **JWT** | Authentication and authorization |
| **bcrypt** | Password hashing |
| **Nodemailer** | Email delivery |
| **Mailgen** | Email generation |
| **Express Validator** | Request validation |
| **Cookie Parser** | Cookie handling |
| **CORS** | Cross-origin request handling |
| **Multer** | File upload handling |

---

## 🔄 Flow

```text
                         ┌──────────────┐
                         │    Client    │
                         │  Web / App   │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │   Express    │
                         │   REST API   │
                         └──────┬───────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
        ┌──────────┐      ┌──────────┐      ┌──────────┐
        │   Auth   │      │ Projects │      │  Tasks   │
        │  Routes  │      │  Routes  │      │  Routes  │
        └────┬─────┘      └────┬─────┘      └────┬─────┘
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                       ┌───────────────┐
                       │  Middleware   │
                       │               │
                       │ JWT / RBAC    │
                       │ Validation    │
                       └───────┬───────┘
                               │
                               ▼
                       ┌───────────────┐
                       │  Controllers  │
                       └───────┬───────┘
                               │
                               ▼
                       ┌───────────────┐
                       │   Mongoose    │
                       └───────┬───────┘
                               │
                               ▼
                       ┌───────────────┐
                       │    MongoDB    │
                       └───────────────┘
````

---

## ✨ Features

### 🔐 Authentication

Nexum provides a complete authentication system:

* User registration
* User login
* JWT access tokens
* JWT refresh tokens
* Logout
* Current authenticated user
* Change password
* Email verification
* Resend email verification
* Forgot password
* Password reset
* Password hashing with bcrypt
* Cookie-based authentication

Authentication endpoints are available under:

```text
/api/v1/auth/
```

---

### 🛡️ Role-Based Access Control

Nexum implements role-based permissions across the application.

| Role            | Access                       |
| --------------- | ---------------------------- |
| `admin`         | Full system access           |
| `project_admin` | Project-level administration |
| `member`        | Project member access        |

```text
                         ADMIN
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
         Projects       Members         Tasks
             │                           │
             └─────────────┬─────────────┘
                           │
                           ▼
                    PROJECT ADMIN
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                  Tasks        Subtasks
                    │
                    ▼
                  MEMBER
                    │
              ┌─────┴─────┐
              ▼           ▼
           Projects      Tasks


---

## 📁 Project Management

Projects are the primary organizational units within Nexum.

Implemented functionality includes:

* Create projects
* Retrieve projects
* Retrieve project details
* Update projects
* Delete projects
* Project aggregation pipelines
* Project member management
* Add project members
* Remove project members
* Update member roles
* Project-level permissions
* Project request validation

---

## 👥 Project Members

Projects support multiple users with different permission levels.

Members can be associated with projects and assigned appropriate roles.

Supported operations include:

* List project members
* Add members
* Remove members
* Update member roles
* Validate member access
* Enforce project permissions

---

## 📋 Task Management

Tasks represent individual units of work within projects.

A task can contain:

* Title
* Description
* Assignee
* Status
* Subtasks
* Attachments
* Project reference

Tasks are associated with projects and users through MongoDB relationships.

Nexum uses Mongoose population and aggregation pipelines to retrieve related project and user information.

### Task Lifecycle

```text
┌──────────┐
│   TODO   │
└────┬─────┘
     │
     ▼
┌─────────────┐
│ IN_PROGRESS │
└──────┬──────┘
       │
       ▼
┌──────────┐
│   DONE   │
└──────────┘
```

Implemented functionality includes:

* Create tasks
* Retrieve all project tasks
* Retrieve individual tasks
* Update tasks
* Delete tasks
* Task population
* Task aggregation
* Task permissions
* Task controller architecture
* Task route architecture

---

## ☑️ Subtasks

Tasks can contain smaller units of work through subtasks.

Supported functionality includes:

* Create subtasks
* Retrieve subtasks
* Update subtasks
* Delete subtasks
* Associate subtasks with tasks
* Track subtask status

---

## 📎 File Uploads

Nexum uses Multer for handling file uploads.

The upload system provides the backend foundation for attaching files to tasks and other project resources.

```text
Client
  │
  │ multipart/form-data
  ▼
Multer
  │
  ▼
Upload Middleware
  │
  ▼
Controller
  │
  ▼
Resource
```

---

## 📝 Project Notes

Projects support persistent notes for documentation and collaboration.

Implemented operations include:

* Create notes
* Retrieve notes
* Update notes
* Delete notes
* Project-level note access
* Note permissions

---

## 🔌 API Reference

All API endpoints are versioned under:

```text
/api/v1
```

---

### 🔐 Authentication

| Method | Endpoint                                       | Description                    |
| ------ | ---------------------------------------------- | ------------------------------ |
| `POST` | `/api/v1/auth/register`                        | Register a new user            |
| `POST` | `/api/v1/auth/login`                           | Authenticate user              |
| `POST` | `/api/v1/auth/logout`                          | Logout authenticated user      |
| `POST` | `/api/v1/auth/refresh-token`                   | Refresh access token           |
| `POST` | `/api/v1/auth/change-password`                 | Change password                |
| `POST` | `/api/v1/auth/forgot-password`                 | Request password reset         |
| `POST` | `/api/v1/auth/reset-password/:resetToken`      | Reset password                 |
| `POST` | `/api/v1/auth/resend-email-verification`       | Resend verification email      |
| `GET`  | `/api/v1/auth/current-user`                    | Get current authenticated user |
| `GET`  | `/api/v1/auth/verify-email/:verificationToken` | Verify email                   |

---

### 📁 Projects

| Method   | Endpoint                                      | Description                  |
| -------- | --------------------------------------------- | ---------------------------- |
| `GET`    | `/api/v1/projects/`                           | Retrieve accessible projects |
| `POST`   | `/api/v1/projects/`                           | Create project               |
| `GET`    | `/api/v1/projects/:projectId`                 | Retrieve project             |
| `PUT`    | `/api/v1/projects/:projectId`                 | Update project               |
| `DELETE` | `/api/v1/projects/:projectId`                 | Delete project               |
| `GET`    | `/api/v1/projects/:projectId/members`         | Retrieve project members     |
| `POST`   | `/api/v1/projects/:projectId/members`         | Add project member           |
| `PUT`    | `/api/v1/projects/:projectId/members/:userId` | Update member role           |
| `DELETE` | `/api/v1/projects/:projectId/members/:userId` | Remove project member        |

---

### 📋 Tasks

| Method   | Endpoint                                      | Description            |
| -------- | --------------------------------------------- | ---------------------- |
| `GET`    | `/api/v1/tasks/:projectId`                    | Retrieve project tasks |
| `POST`   | `/api/v1/tasks/:projectId`                    | Create task            |
| `GET`    | `/api/v1/tasks/:projectId/t/:taskId`          | Retrieve task          |
| `PUT`    | `/api/v1/tasks/:projectId/t/:taskId`          | Update task            |
| `DELETE` | `/api/v1/tasks/:projectId/t/:taskId`          | Delete task            |
| `POST`   | `/api/v1/tasks/:projectId/t/:taskId/subtasks` | Create subtask         |
| `PUT`    | `/api/v1/tasks/:projectId/st/:subTaskId`      | Update subtask         |
| `DELETE` | `/api/v1/tasks/:projectId/st/:subTaskId`      | Delete subtask         |

---

### 📝 Notes

| Method   | Endpoint                             | Description            |
| -------- | ------------------------------------ | ---------------------- |
| `GET`    | `/api/v1/notes/:projectId`           | Retrieve project notes |
| `POST`   | `/api/v1/notes/:projectId`           | Create note            |
| `GET`    | `/api/v1/notes/:projectId/n/:noteId` | Retrieve note          |
| `PUT`    | `/api/v1/notes/:projectId/n/:noteId` | Update note            |
| `DELETE` | `/api/v1/notes/:projectId/n/:noteId` | Delete note            |

---

### 💚 Health Check

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| `GET`  | `/api/v1/healthcheck/` | Check API health |

---

## 🔒 Security

Nexum implements multiple layers of security throughout the API.

* JWT authentication
* Access and refresh tokens
* bcrypt password hashing
* Role-based authorization
* Request validation
* Email verification
* Password reset
* Protected routes
* Cookie handling
* CORS configuration
* Project-level permissions
* Task-level permissions
* File upload handling

Protected requests pass through authentication and authorization middleware before reaching the corresponding controller.

---

## 🌍 Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USER=your_email
MAIL_PASSWORD=your_email_password
```

Never commit `.env` files or production credentials to version control.

---

## 🧰 Prerequisites

* Node.js 20+
* npm
* MongoDB
* SMTP / email provider

---

## 🚀 Quick Start

### Clone

```bash
git clone https://github.com/itsjazzkun/Nexum.git
cd Nexum
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file in the project root and configure the required environment variables.

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

---

## 🗂️ Project Structure

```text
Nexum/
│
├── public/
│   └── images/
│
├── src/
│   ├── controllers/
│   │
│   ├── db/
│   │
│   ├── middlewares/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── utils/
│   │
│   ├── validators/
│   │
│   ├── app.js
│   └── index.js
│
├── .gitignore
├── package.json
├── package-lock.json
├── PRD.md
└── README.md
```

---

## 🔄 Request Lifecycle

```text
Client Request
      │
      ▼
Express Router
      │
      ▼
Request Validation
      │
      ▼
JWT Authentication
      │
      ▼
Role Authorization
      │
      ▼
Controller
      │
      ▼
Mongoose
      │
      ▼
MongoDB
      │
      ▼
JSON Response
```

---

## 🏗️ Backend Architecture

Nexum follows a modular backend structure:

```text
                    ┌───────────────┐
                    │    Routes     │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Middleware   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Controllers  │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    Models     │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    MongoDB    │
                    └───────────────┘
```

The architecture separates routing, validation, authentication, authorization, business logic, and persistence into dedicated modules.

---

## 📊 Project Status

### ✅ Completed

#### Authentication

* [x] User registration
* [x] User login
* [x] JWT authentication
* [x] Access tokens
* [x] Refresh tokens
* [x] Logout
* [x] Current user
* [x] Change password
* [x] Email verification
* [x] Resend verification
* [x] Forgot password
* [x] Password reset

#### Projects

* [x] Project model
* [x] Project controllers
* [x] Create projects
* [x] Retrieve projects
* [x] Update projects
* [x] Delete projects
* [x] Project aggregation
* [x] Project validators
* [x] Project routes
* [x] Project permissions
* [x] Project member management

#### Roles & Permissions

* [x] Admin role
* [x] Project admin role
* [x] Member role
* [x] Role-based authorization
* [x] Project-level permissions
* [x] Protected routes

#### Tasks

* [x] Task controller architecture
* [x] Task creation
* [x] Retrieve all tasks
* [x] Task population
* [x] Task retrieval by ID
* [x] Task aggregation pipeline
* [x] Task routes
* [x] Task permissions

#### Files

* [x] Multer integration
* [x] Backend upload handling
* [x] Task attachment foundation

#### Subtasks

* [x] Subtask creation
* [x] Subtask retrieval
* [x] Subtask updates
* [x] Subtask deletion
* [x] Subtask status handling

#### Notes

* [x] Note model
* [x] Create notes
* [x] Retrieve notes
* [x] Update notes
* [x] Delete notes
* [x] Note permissions

#### Infrastructure

* [x] Express application setup
* [x] MongoDB connection
* [x] Mongoose integration
* [x] API versioning
* [x] Middleware architecture
* [x] Controller architecture
* [x] Route architecture
* [x] Validator architecture
* [x] Health-check endpoint

---

## 🗺️ Roadmap

Nexum's planned backend functionality has been implemented across authentication, project management, role-based permissions, task management, subtasks, file uploads, notes, and supporting infrastructure.

### 🔐 Authentication

* [x] User registration
* [x] User login
* [x] JWT authentication
* [x] Access token system
* [x] Refresh token system
* [x] Logout
* [x] Current user
* [x] Change password
* [x] Email verification
* [x] Password recovery
* [x] Password reset

### 📁 Project Management

* [x] Project models
* [x] Project controllers
* [x] Create projects
* [x] Retrieve projects
* [x] Update projects
* [x] Delete projects
* [x] Project aggregation
* [x] Project validators
* [x] Project routes
* [x] Project permissions
* [x] Project member management

### 🛡️ Authorization

* [x] Admin permissions
* [x] Project admin permissions
* [x] Member permissions
* [x] Role-based authorization
* [x] Protected project routes
* [x] Project-level access control
* [x] Task-level access control

### 📋 Task Management

* [x] Task controllers
* [x] Task creation
* [x] Task retrieval
* [x] Task updates
* [x] Task deletion
* [x] Task population
* [x] Task aggregation
* [x] Task permissions

### ☑️ Subtasks

* [x] Subtask creation
* [x] Subtask retrieval
* [x] Subtask updates
* [x] Subtask deletion
* [x] Subtask status management

### 📎 File Management

* [x] Multer integration
* [x] File upload handling
* [x] Task attachment support

### 📝 Notes

* [x] Note management
* [x] Note retrieval
* [x] Note updates
* [x] Note deletion
* [x] Note permissions

### 🏗️ Infrastructure

* [x] Express setup
* [x] MongoDB integration
* [x] Mongoose integration
* [x] API versioning
* [x] Middleware architecture
* [x] Controller architecture
* [x] Route architecture
* [x] Validator architecture
* [x] Health-check endpoint

---

## 📜 License

ISC

---

## 👨‍💻 Author

**itsjazzkun**

<p align="center">
  Built with Node.js, Express and MongoDB.
</p>
```
