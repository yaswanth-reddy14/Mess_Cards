# Mess Cards

Mess Cards is a full-stack web app for managing and discovering mess services.

- Owners can create and manage messes, menus, and plans.
- Students can browse messes, view details, add reviews, and save favorites.
- Authentication is handled with JWT (email + password).

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- React Toastify

### Backend
- Django
- Django REST Framework
- SimpleJWT
- PostgreSQL (production) / SQLite (local fallback)
- Cloudinary (media storage)

## Project Structure

```text
MESS_CARDS/
|-- Backend/
|   |-- config/
|   |-- users/
|   |-- messes/
|   |-- reviews/
|   |-- recommendations/
|   |-- manage.py
|   `-- requirements.txt
`-- Frontend/
    |-- src/
    |-- package.json
    `-- .env.example
```

## Features

- Role-based access: OWNER, STUDENT
- JWT login and refresh
- Mess CRUD for owners
- Day-wise menu management
- Mess plans/packages with items
- Open/close mess toggle
- Student browsing and location filter
- Reviews (one review per student per mess)
- Favorites management
- Recommendation endpoint (authenticated)

## Local Setup

### 1) Clone repository

```bash
git clone https://github.com/yaswanth-reddy14/Mess_Cards.git
cd Mess_Cards
```

### 2) Backend setup (Django)

```bash
cd Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000/`

### 3) Frontend setup (React)

Open a new terminal:

```bash
cd Frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173/`

## Environment Variables

### Backend (`Backend/.env`)

Use `Backend/.env.example` as reference.

Important keys:

- `DEBUG`
- `SECRET_KEY`
- `DATABASE_URL` (optional for local; SQLite is used if missing)
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `CSRF_TRUSTED_ORIGINS`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Frontend (`Frontend/.env`)

Use `Frontend/.env.example`:

- `VITE_API_URL=http://127.0.0.1:8000/api/`

## API Overview

Base URL: `/api`

### Auth
- `POST /auth/register/`
- `POST /auth/login/`
- `POST /auth/refresh/`
- `GET /auth/me/`
- `PATCH /auth/me/`
- `POST /auth/change-password/`

### Messes
- `GET /messes/`
- `POST /messes/`
- `GET /messes/<uuid:pk>/`
- `PUT/PATCH /messes/<uuid:pk>/`
- `DELETE /messes/<uuid:pk>/`
- `PATCH /messes/<uuid:mess_id>/toggle-status/`

### Menus
- `GET /messes/<uuid:mess_id>/menus/`
- `POST /messes/<uuid:mess_id>/menus/`
- `GET /messes/<uuid:mess_id>/menus/<uuid:pk>/`
- `PUT/PATCH /messes/<uuid:mess_id>/menus/<uuid:pk>/`
- `DELETE /messes/<uuid:mess_id>/menus/<uuid:pk>/`

### Plans
- `GET /messes/<uuid:mess_id>/plans/`
- `POST /messes/<uuid:mess_id>/plans/`
- `GET /messes/<uuid:mess_id>/plans/<id>/`
- `PUT/PATCH /messes/<uuid:mess_id>/plans/<id>/`
- `DELETE /messes/<uuid:mess_id>/plans/<id>/`

### Reviews and Favorites
- `GET /messes/<uuid:mess_id>/reviews/`
- `POST /messes/<uuid:mess_id>/reviews/`
- `POST /messes/<uuid:mess_id>/favorites/`
- `GET /favorites/`
- `DELETE /favorites/<int:pk>/`

### Recommendations
- `POST /recommendations/recommend/`

## Deployment Notes

- Backend is configured for services like Render (`Backend/build.sh` included).
- Frontend can be deployed on Vercel.
- Ensure production values for CORS, CSRF, hosts, database, and Cloudinary.

## Scripts

### Backend

```bash
python manage.py runserver
python manage.py migrate
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

