# Sehat Saheli 🌸

> AI-powered multilingual health companion PWA for adolescent girls in low-connectivity rural areas

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript + TailwindCSS + ShadCN + React Query + Zustand + Framer Motion |
| Backend | FastAPI + SQLAlchemy (Async) + MySQL/PostgreSQL + Alembic + JWT Auth |
| AI | Google Gemini API |
| PWA | Service Workers + IndexedDB (Dexie.js) + Workbox |

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- MySQL 8.0+

### Backend Setup

```bash
cd backend

# Create virtual environment (optional)
python -m venv venv
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your database credentials and Gemini API key

# Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS sehat_saheli CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations
alembic upgrade head

# Seed database with quiz, learn, flashcard, and health camp data
# (Also auto-seeds on first app startup)
python -m app.seeds.seed_data

# Start development server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Architecture

```
sehat-saheli/
├── frontend/          # Next.js PWA
│   ├── src/
│   │   ├── app/       # Pages (App Router)
│   │   │   ├── (auth)/     # Login & Register (public)
│   │   │   └── (main)/     # Authenticated pages (guarded)
│   │   ├── components/  # UI components
│   │   │   ├── chat/    # Chat feature (messages, input, typing)
│   │   │   ├── layout/  # TopBar, BottomNav, Toast, OfflineBanner
│   │   │   └── ui/      # ShadCN primitives (Button, Card, Input...)
│   │   ├── lib/       # Utilities, API, stores, i18n
│   │   │   ├── api/   # Axios client + typed endpoint wrappers
│   │   │   └── stores/  # Zustand (auth, UI, toast)
│   │   ├── providers/ # React context providers
│   │   └── types/     # TypeScript definitions
│   └── public/        # Static assets + PWA manifest
│
├── backend/           # FastAPI API
│   ├── app/
│   │   ├── api/v1/    # Route handlers
│   │   │   ├── auth.py       # Register, login, profile
│   │   │   ├── chat.py       # Chat sessions & AI messages
│   │   │   ├── quiz.py       # Quiz categories & attempts
│   │   │   ├── learn.py      # Health education articles
│   │   │   ├── flashcards.py # Flashcard decks & cards
│   │   │   └── dashboard.py  # Cycle tracking & analytics
│   │   ├── core/      # Config, security, middleware
│   │   ├── models/    # SQLAlchemy ORM models
│   │   ├── schemas/   # Pydantic validation
│   │   ├── services/  # Business logic (AI, auth, chat)
│   │   └── seeds/     # Seed data (quiz, learn, flashcards)
│   └── alembic/       # Database migrations
```

## Features

### Phase 1 ✅ (Shipped)
- 🤖 **AI Chatbot** — Culturally-safe health conversations in 8 languages
- 🔐 **Auth** — Phone + password registration/login with JWT
- 💬 **Chat History** — Session management with AI-generated titles
- 🌙 **Dark Mode** — Full app-wide dark theme with toggle
- 📱 **PWA** — Installable, offline-first progressive web app
- 🍞 **Toast Notifications** — Global toast system for all actions

### Phase 2 ✅ (Shipped)
- 🧠 **Quiz Engine** — Category-based quizzes with scoring, accuracy tracking, and animated UI
- 📚 **Health Education** — Browse categories and read articles on body, nutrition, hygiene
- 🃏 **Flashcards** — Study decks with 3D flip animation and progress tracking
- ❤️ **Health Dashboard** — Menstrual cycle tracker with logging, prediction, and analytics
- 🌐 **Multilingual Content** — Quiz, learn, and flashcard content in English + Hindi

### Phase 3 ✅ (Shipped)
- 🏥 **Health Camps** — Live government health camp alerts with state filtering, expandable cards, contact links
- 🎨 **Component Dark Mode** — All base UI components (Card, Input, Label) now dark-mode native
- 📅 **Themed Date Picker** — Dark mode calendar picker with custom styling
- 🌱 **Auto Seed** — Database auto-seeds on first startup (no manual scripts needed)

## API Endpoints

| Feature | Method | Endpoint | Description |
|---------|--------|----------|-------------|
| Auth | POST | `/api/v1/auth/register` | Register new user |
| Auth | POST | `/api/v1/auth/login` | Login |
| Auth | GET | `/api/v1/auth/me` | Get profile |
| Chat | POST | `/api/v1/chat/sessions` | Create chat session |
| Chat | GET | `/api/v1/chat/sessions` | List sessions |
| Chat | POST | `/api/v1/chat/sessions/{id}/messages` | Send message + AI response |
| Chat | DELETE | `/api/v1/chat/sessions/{id}` | Delete session |
| Quiz | GET | `/api/v1/quiz/categories` | List quiz categories |
| Quiz | GET | `/api/v1/quiz/category/{slug}` | Get quizzes by category |
| Quiz | POST | `/api/v1/quiz/{id}/attempt` | Submit quiz answer |
| Quiz | GET | `/api/v1/quiz/stats` | Get user quiz stats |
| Learn | GET | `/api/v1/learn/categories` | List learn categories |
| Learn | GET | `/api/v1/learn/category/{slug}` | Get articles |
| Learn | GET | `/api/v1/learn/articles/{id}` | Get single article |
| Flashcards | GET | `/api/v1/flashcards/decks` | List flashcard decks |
| Flashcards | GET | `/api/v1/flashcards/decks/{slug}` | Get deck cards |
| Dashboard | POST | `/api/v1/cycles` | Log period |
| Dashboard | GET | `/api/v1/cycles` | Get cycle history |
| Dashboard | GET | `/api/v1/cycles/predict` | Predict next cycle |
| Dashboard | GET | `/api/v1/cycles/analytics` | Get analytics |
| Health Camps | GET | `/api/v1/health-camps` | List camps (filterable) |
| Health Camps | GET | `/api/v1/health-camps/{id}` | Camp details |

## Languages Supported

| Code | Language | Native Name |
|------|----------|-------------|
| en | English | English |
| hi | Hindi | हिन्दी |
| mr | Marathi | मराठी |
| bn | Bengali | বাংলা |
| ta | Tamil | தமிழ் |
| te | Telugu | తెలుగు |
| kn | Kannada | ಕನ್ನಡ |
| gu | Gujarati | ગુજરાતી |

## License

MIT
