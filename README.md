# AI Tools Manager

A full-stack application to manage AI tools for software engineering teams, organized by categories.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **API Docs**: Swagger UI at `/api-docs`

## Prerequisites

- Node.js 20+
- npm
- A [Supabase](https://supabase.com) account (free tier)
- Docker (for cloud deployment)
- Google Cloud CLI (for cloud deployment)

---

## Database Setup (Supabase)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Copy your **Project URL** and **anon/public key** from **Settings → API**

---

## Local Development

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your Supabase URL and key
npm install
npm run dev
```

Backend runs at `http://localhost:3001`. Swagger docs at `http://localhost:3001/api-docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`. API calls are proxied to the backend via Vite config.

### Default Accounts

| Username | Password | Role | Access |
|----------|----------|------|--------|
| `admin` | `SPRINGc@n@d4` | Admin | Full CRUD access |
| `user` | `SPRINGcanada` | Read-only | View only (no add/edit/delete) |

---

## Cloud Deployment (Google Cloud — Free Tier)

### Prerequisites

```bash
# Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
# Enable required APIs
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
```

### Deploy Backend to Cloud Run

```bash
cd backend

# Build and deploy
gcloud run deploy ai-tools-backend \
  --source . \
  --region us-central1 \
  --port 3001 \
  --allow-unauthenticated \
  --set-env-vars "SUPABASE_URL=https://your-project.supabase.co,SUPABASE_KEY=your-anon-key"
```

Note the deployed URL (e.g., `https://ai-tools-backend-xxxxx-uc.a.run.app`).

### Deploy Frontend to Cloud Run

1. Update the `VITE_API_URL` default value in `frontend/Dockerfile` with your backend URL:
   ```dockerfile
   ARG VITE_API_URL=https://ai-tools-backend-xxxxx-uc.a.run.app
   ```

2. Deploy:
   ```bash
   cd frontend
   gcloud run deploy ai-tools-frontend \
     --source . \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Alternative: Deploy Frontend to Firebase Hosting

```bash
cd frontend
npm run build

# Install Firebase CLI
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to "dist", configure as SPA

firebase deploy
```

> **Note**: When using Firebase Hosting, set `VITE_API_URL` to your Cloud Run backend URL before building:
> ```bash
> VITE_API_URL=https://ai-tools-backend-xxxxx-uc.a.run.app npm run build
> ```

---

## Project Structure

```
├── backend/
│   ├── index.js           # Express server + all API routes
│   ├── swagger.js         # OpenAPI/Swagger config
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Router + navigation + auth guard
│   │   ├── api.js         # API client (sends role header)
│   │   ├── main.jsx       # Entry point
│   │   ├── index.css      # Global styles
│   │   └── pages/
│   │       ├── Login.jsx       # Login page
│   │       ├── Categories.jsx  # Role-aware UI
│   │       └── AiTools.jsx     # Role-aware UI
│   ├── index.html
│   ├── vite.config.js
│   ├── nginx.conf
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
├── docs/
│   └── PRD.md             # Product Requirements Document
├── supabase-schema.sql    # Database schema + seed data
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/login | Authenticate (returns user with role) |
| GET | /api/categories | List categories |
| GET | /api/categories/:id | Get category |
| POST | /api/categories | Create category (admin only) |
| PUT | /api/categories/:id | Update category (admin only) |
| DELETE | /api/categories/:id | Delete category (admin only) |
| GET | /api/ai-tools | List tools (`?category_id=` to filter) |
| GET | /api/ai-tools/:id | Get tool |
| POST | /api/ai-tools | Create tool (admin only) |
| PUT | /api/ai-tools/:id | Update tool (admin only) |
| DELETE | /api/ai-tools/:id | Delete tool (admin only) |

Write endpoints (POST/PUT/DELETE) require the `x-user-role: admin` header. Read-only users receive a `403 Forbidden` response.

Full interactive docs: `http://localhost:3001/api-docs`
