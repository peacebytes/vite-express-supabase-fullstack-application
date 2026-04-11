# Product Requirements Document — AI Tools Manager

## 1. Overview

AI Tools Manager is a web application that helps software engineering teams discover, organize, and manage AI-powered tools. Tools are grouped into categories targeting different roles (developers, QA, managers, DevOps, etc.).

## 2. Goals

- Provide a centralized catalog of AI tools for engineering teams
- Allow categorization by role and business size
- Track subscription models (free vs pay-as-you-go)
- Simple admin interface for CRUD operations
- Role-based access control (admin vs read-only)

## 3. Users

| Role | Description |
|------|-------------|
| Admin | Full access to manage categories and AI tools |
| Read-only | Can view categories and AI tools, but cannot create, edit, or delete |

## 4. Data Model

### Categories
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | Primary key, auto-generated |
| name | Text | Required |
| description | Text | Optional |
| business_size | Enum | Required — `small`, `medium`, `big` |
| created_at | Timestamp | Auto-generated |

### AI Tools
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | Primary key, auto-generated |
| name | Text | Required |
| description | Text | Optional |
| url | Text | Optional |
| learning_notes | Text | Optional (URL) |
| youtube_link | Text | Optional (URL) |
| how_to_article | Text | Optional (URL) |
| subscription | Enum | Required — `free`, `pay-as-you-go` |
| category_id | UUID | FK → categories.id, nullable |
| created_at | Timestamp | Auto-generated |

### Users
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | Primary key, auto-generated |
| username | Text | Required, unique |
| password_hash | Text | Required (bcrypt) |
| role | Enum | Required — `admin`, `readonly` (default: `readonly`) |
| created_at | Timestamp | Auto-generated |

## 5. Functional Requirements

### 5.1 Authentication
- **FR-1**: Users can log in with username/password
- **FR-2**: Passwords are stored as bcrypt hashes
- **FR-3**: Login returns user info including role (`admin` or `readonly`)

### 5.2 Authorization
- **FR-4**: Admin users have full CRUD access to categories and AI tools
- **FR-5**: Read-only users can only view categories and AI tools
- **FR-6**: Write endpoints (POST/PUT/DELETE) are protected by role-based middleware
- **FR-7**: Frontend hides add/edit/delete UI for read-only users

### 5.3 Category Management
- **FR-8**: List all categories with name, description, and business size
- **FR-9**: Create a new category with name, description, and business size (admin only)
- **FR-10**: Edit an existing category (admin only)
- **FR-11**: Delete a category — associated tools get `category_id` set to NULL (admin only)

### 5.4 AI Tool Management
- **FR-12**: List all AI tools with category name, subscription type
- **FR-13**: Filter AI tools by category
- **FR-14**: Create a new AI tool with name, description, URL, learning notes, youtube link, how-to article, subscription, and category (admin only)
- **FR-15**: Edit an existing AI tool (admin only)
- **FR-16**: Delete an AI tool (admin only)

## 6. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/login | Authenticate user (returns role) |
| GET | /api/categories | List categories |
| GET | /api/categories/:id | Get single category |
| POST | /api/categories | Create category (admin only) |
| PUT | /api/categories/:id | Update category (admin only) |
| DELETE | /api/categories/:id | Delete category (admin only) |
| GET | /api/ai-tools | List tools (optional `?category_id=`) |
| GET | /api/ai-tools/:id | Get single tool |
| POST | /api/ai-tools | Create tool (admin only) |
| PUT | /api/ai-tools/:id | Update tool (admin only) |
| DELETE | /api/ai-tools/:id | Delete tool (admin only) |

Write endpoints require `x-user-role: admin` header. Unauthorized requests receive `403 Forbidden`.

Full interactive API docs available at `/api-docs` (Swagger UI).

## 7. Non-Functional Requirements

- **NFR-1**: Backend responds within 500ms for all CRUD operations
- **NFR-2**: Frontend is a single-page application with client-side routing
- **NFR-3**: Application is containerized for cloud deployment
- **NFR-4**: Database hosted on Supabase (managed Postgres)

## 8. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL) |
| API Docs | Swagger / OpenAPI 3.0 |
| Deployment | Google Cloud Run + Firebase Hosting |
