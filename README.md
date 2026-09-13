# Nexum — Project Management Backend

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,js" />
</p>

RESTful backend API for collaborative project management with authentication, role-based access control, projects, tasks, subtasks, notes, and file attachments.

---

## Overview

Nexum is a RESTful backend service for collaborative project management.

The API provides user authentication, project management, team member management, role-based permissions, task management, subtasks, project notes, and file attachments.

The backend is built with Node.js and Express, using MongoDB with Mongoose for persistence.

The complete product requirements, endpoint specification, permission matrix, data models, and security requirements are defined in the [PRD](./PRD.md).

---

## Architecture

| Component         | Purpose                             |
| ----------------- | ----------------------------------- |
| Node.js           | JavaScript runtime                  |
| Express.js        | REST API framework                  |
| MongoDB           | Primary database                    |
| Mongoose          | MongoDB ODM                         |
| JWT               | Authentication and token management |
| bcrypt            | Password hashing                    |
| Nodemailer        | Email delivery                      |
| Mailgen           | Email generation                    |
| Express Validator | Request validation                  |
| Multer            | File uploads                        |
| Cookie Parser     | Cookie handling                     |
| CORS              | Cross-origin requests               |

---

## Flow

```text
     ┌─────────┐     ┌──────────┐     ┌────────────┐
     │ Client  │────▶│ Express  │────▶│ Middleware │
     │         │     │   API    │     │ JWT / RBAC │
     └─────────┘     └──────────┘     └──────┬─────┘
                                             │
                              ┌──────────────┼──────────────┐
                              │              │              │
                              ▼              ▼              ▼
                         ┌─────────┐   ┌──────────┐   ┌─────────┐
                         │  Auth   │   │ Projects │   │  Tasks  │
                         └────┬────┘   └─────┬────┘   └────┬────┘
                              │              │              │
                              └──────────────┼──────────────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │ Controllers │
                                      └──────┬──────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │  Mongoose   │
                                      └──────┬──────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │   MongoDB   │
                                      └─────────────┘
```

---

## Prerequisites

- Node.js
- npm
- MongoDB
- SMTP provider

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/itsjazzkun/Nexum.git
cd Nexum
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

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

### 4. Development

```bash
npm run dev
```

### 5. Production

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

---

## Project Structure

```text
Nexum/
├── public/
│   └── images/                  # Uploaded files
│
├── src/
│   ├── controllers/             # Request handlers
│   ├── db/                      # Database configuration
│   ├── middlewares/             # Authentication / authorization
│   ├── models/                  # Mongoose models
│   ├── routes/                  # API routes
│   ├── utils/                   # Shared utilities
│   ├── validators/              # Request validators
│   ├── app.js                   # Express application
│   └── index.js                 # Application entry point
│
├── .gitignore
├── package.json
├── package-lock.json
├── PRD.md
└── README.md
```

---

## API Reference

### Authentication

| Method | Endpoint                                       | Description               |
| ------ | ---------------------------------------------- | ------------------------- |
| `POST` | `/api/v1/auth/register`                        | User registration         |
| `POST` | `/api/v1/auth/login`                           | User authentication       |
| `POST` | `/api/v1/auth/logout`                          | User logout               |
| `GET`  | `/api/v1/auth/current-user`                    | Get current user          |
| `POST` | `/api/v1/auth/change-password`                 | Change password           |
| `POST` | `/api/v1/auth/refresh-token`                   | Refresh access token      |
| `GET`  | `/api/v1/auth/verify-email/:verificationToken` | Verify email              |
| `POST` | `/api/v1/auth/forgot-password`                 | Request password reset    |
| `POST` | `/api/v1/auth/reset-password/:resetToken`      | Reset password            |
| `POST` | `/api/v1/auth/resend-email-verification`       | Resend verification email |

### Projects

| Method   | Endpoint                                      | Description              |
| -------- | --------------------------------------------- | ------------------------ |
| `GET`    | `/api/v1/projects/`                           | List accessible projects |
| `POST`   | `/api/v1/projects/`                           | Create project           |
| `GET`    | `/api/v1/projects/:projectId`                 | Get project details      |
| `PUT`    | `/api/v1/projects/:projectId`                 | Update project           |
| `DELETE` | `/api/v1/projects/:projectId`                 | Delete project           |
| `GET`    | `/api/v1/projects/:projectId/members`         | List project members     |
| `POST`   | `/api/v1/projects/:projectId/members`         | Add project member       |
| `PUT`    | `/api/v1/projects/:projectId/members/:userId` | Update member role       |
| `DELETE` | `/api/v1/projects/:projectId/members/:userId` | Remove project member    |

### Tasks

| Method   | Endpoint                                      | Description        |
| -------- | --------------------------------------------- | ------------------ |
| `GET`    | `/api/v1/tasks/:projectId`                    | List project tasks |
| `POST`   | `/api/v1/tasks/:projectId`                    | Create task        |
| `GET`    | `/api/v1/tasks/:projectId/t/:taskId`          | Get task details   |
| `PUT`    | `/api/v1/tasks/:projectId/t/:taskId`          | Update task        |
| `DELETE` | `/api/v1/tasks/:projectId/t/:taskId`          | Delete task        |
| `POST`   | `/api/v1/tasks/:projectId/t/:taskId/subtasks` | Create subtask     |
| `PUT`    | `/api/v1/tasks/:projectId/st/:subTaskId`      | Update subtask     |
| `DELETE` | `/api/v1/tasks/:projectId/st/:subTaskId`      | Delete subtask     |

### Notes

| Method   | Endpoint                             | Description        |
| -------- | ------------------------------------ | ------------------ |
| `GET`    | `/api/v1/notes/:projectId`           | List project notes |
| `POST`   | `/api/v1/notes/:projectId`           | Create note        |
| `GET`    | `/api/v1/notes/:projectId/n/:noteId` | Get note details   |
| `PUT`    | `/api/v1/notes/:projectId/n/:noteId` | Update note        |
| `DELETE` | `/api/v1/notes/:projectId/n/:noteId` | Delete note        |

### Health Check

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| `GET`  | `/api/v1/healthcheck/` | System health status |

---

## Permission Matrix

| Feature                    | Admin | Project Admin | Member |
| -------------------------- | ----- | ------------- | ------ |
| Create Project             | ✓     | ✗             | ✗      |
| Update/Delete Project      | ✓     | ✗             | ✗      |
| Manage Project Members     | ✓     | ✗             | ✗      |
| Create/Update/Delete Tasks | ✓     | ✓             | ✗      |
| View Tasks                 | ✓     | ✓             | ✓      |
| Update Subtask Status      | ✓     | ✓             | ✓      |
| Create/Delete Subtasks     | ✓     | ✓             | ✗      |
| Create/Update/Delete Notes | ✓     | ✗             | ✗      |
| View Notes                 | ✓     | ✓             | ✓      |

---

## Security

- JWT-based authentication with refresh tokens
- Role-based authorization
- Request validation
- Email verification
- Password reset
- bcrypt password hashing
- CORS configuration
- Secure file upload handling with Multer
- Protected project and task routes

---

## Current Status

The core authentication and project-management layers are implemented.

The current implementation has progressed into task management, including task controller structure, task creation, task listing, population, and aggregation-based task retrieval.

The remaining work follows the feature scope defined in the [PRD](./PRD.md).

---

## Roadmap

- [x] User authentication
- [x] Email verification
- [x] Password management
- [x] JWT access and refresh tokens
- [x] Project management
- [x] Project aggregation
- [x] Project validation
- [x] Project member management
- [x] Role-based permissions
- [x] Project routes
- [x] Task controller foundation
- [x] Task creation
- [x] Task listing
- [x] Task population
- [x] Task retrieval and aggregation
- [x] Multer file upload foundation
- [ ] Task updates
- [ ] Task deletion
- [ ] Subtask management
- [ ] Project notes
- [ ] Final API integration

---

## License

ISC

---

Built with Node.js, Express and MongoDB.
