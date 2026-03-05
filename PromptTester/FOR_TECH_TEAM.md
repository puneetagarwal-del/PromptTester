# PromptTester - For Your Tech Team

This document is for your tech team to understand the app and productionize it.

---

## 📊 WHAT IS THIS?

A prompt testing framework that:
- Creates and manages prompt versions
- Runs semantic similarity scoring tests
- Compares expected vs actual LLM outputs
- Stores results in PostgreSQL
- Displays results in React UI

---

## 🏗️ ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Port 3000)               │
│  Dashboard → Prompts → Test Cases → Results                 │
└────────────────────────┬────────────────────────────────────┘
                         │ (HTTP/API calls)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  FLASK BACKEND (Port 5000)                  │
│  ├─ /api/prompts      (CRUD prompts)                        │
│  ├─ /api/test-cases   (CRUD test cases)                     │
│  ├─ /api/test-runs    (Execute tests)                       │
│  └─ /api/results      (Get results)                         │
│                                                              │
│  Services:                                                  │
│  ├─ test_runner.py    (Calls OpenAI, runs prompts)         │
│  ├─ database.py       (SQLAlchemy models)                  │
│  └─ app.py            (Flask routes)                        │
└────────────────────────┬────────────────────────────────────┘
                         │ (SQL queries)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   POSTGRESQL (Port 5432)                    │
│  Tables:                                                    │
│  ├─ prompts      (prompt_id, name, content, created_at)    │
│  ├─ test_cases   (id, test_id, input, expected_output)     │
│  ├─ test_runs    (id, prompt_id, passed, failed, rate)     │
│  └─ test_results (id, run_id, test_id, similarity, output) │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 CODE STRUCTURE

### Frontend (React)
```
frontend/
├── src/
│   ├── App.js              (Main app, routes, state)
│   ├── App.css             (Styling)
│   ├── pages/
│   │   ├── Dashboard.js    (List prompts, add new)
│   │   ├── PromptDetail.js (View results, run tests)
│   │   └── TestCaseManager.js (Add/manage test cases)
│   └── index.js            (Entry point)
├── public/
│   └── index.html
└── package.json

Key Libraries:
- React 18
- Axios (HTTP calls)
```

### Backend (Python/Flask)
```
backend/
├── app.py              (Flask routes, main app)
├── database.py         (SQLAlchemy models, connection)
├── test_runner.py      (OpenAI integration, scoring)
├── requirements.txt
├── .env                (API keys, DB URL)
└── Dockerfile

Key Libraries:
- Flask (HTTP server)
- SQLAlchemy (ORM)
- psycopg2 (PostgreSQL driver)
- openai (OpenAI API client)
```

---

## 🔄 DATA FLOW

### Running Tests

```
User clicks "Run Tests"
  ↓
POST /api/test-runs {prompt_id}
  ↓
Backend fetches prompt from DB
  ↓
Backend fetches all test cases from DB
  ↓
For each test case:
  ├─ Get input from test case
  ├─ Replace {input} in prompt template
  ├─ Call OpenAI API (run_prompt)
  ├─ Get actual output
  ├─ Call OpenAI API (calculate_similarity)
  ├─ Get similarity score (0-1)
  ├─ Decide: passed if score > 0.7
  └─ Store result in DB
  ↓
Return summary: {total, passed, failed, results}
  ↓
Frontend displays results with charts
```

---

## 🔐 DATABASE SCHEMA

### Prompts
```sql
CREATE TABLE prompts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

### Test Cases
```sql
CREATE TABLE test_cases (
    id SERIAL PRIMARY KEY,
    test_id VARCHAR(255) UNIQUE NOT NULL,
    input_text TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
```

### Test Runs
```sql
CREATE TABLE test_runs (
    id SERIAL PRIMARY KEY,
    prompt_id INTEGER NOT NULL,
    total_tests INTEGER NOT NULL,
    passed INTEGER NOT NULL,
    failed INTEGER NOT NULL,
    pass_rate FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
```

### Test Results
```sql
CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    test_run_id INTEGER NOT NULL,
    test_case_id VARCHAR(255) NOT NULL,
    passed BOOLEAN NOT NULL,
    similarity_score FLOAT NOT NULL,
    actual_output TEXT NOT NULL,
    reasoning TEXT,
    created_at TIMESTAMP DEFAULT now()
);
```

---

## 🚀 PRODUCTIONIZATION CHECKLIST

### Immediate (First Week)

- [ ] Deploy backend to production server (AWS, Heroku, etc.)
- [ ] Deploy PostgreSQL to production (AWS RDS, Azure Database, etc.)
- [ ] Update frontend `.env` to point to production API
- [ ] Deploy frontend (Vercel, AWS S3, etc.)
- [ ] Set up CORS for production domain
- [ ] Use production OpenAI API key (set rate limits)

### Security (Second Week)

- [ ] Add user authentication (JWT, OAuth, etc.)
- [ ] Add rate limiting to API endpoints
- [ ] Validate/sanitize all user inputs
- [ ] Set up HTTPS/SSL
- [ ] Add logging and monitoring
- [ ] Store API keys in secure vault (not .env files)

### Performance (Third Week)

- [ ] Add API caching (Redis)
- [ ] Add database indexing (on frequently queried columns)
- [ ] Add request pagination (limit results)
- [ ] Set up async task queue (Celery) for long-running tests
- [ ] Add frontend code splitting/lazy loading
- [ ] Set up CDN for static assets

### Optional Enhancements

- [ ] Rewrite frontend in Angular (as your team prefers)
- [ ] Add user roles/permissions
- [ ] Add test scheduling (run tests on schedule)
- [ ] Add webhooks (notify on test failures)
- [ ] Add comparison view (compare 2 prompt versions)
- [ ] Add analytics/trends (track performance over time)
- [ ] Add batch testing (test multiple prompts at once)

---

## 🔧 TECH DECISIONS

### Why Flask?
- Simple, lightweight
- Easy to understand and modify
- Team can rewrite in FastAPI, Django, Node.js later if needed

### Why SQLAlchemy?
- ORM - easier than raw SQL
- Easy to migrate to different DB
- Built-in validation

### Why React?
- You said frontend, React is standard
- Easy to rewrite in Angular later
- Component-based makes scaling easy

### Why PostgreSQL?
- Your team already uses it
- Scalable, reliable
- JSONB support if needed

### Why OpenAI API?
- Your only API option
- Simple to integrate
- Good documentation

---

## 🔄 SCALING CONSIDERATIONS

### For 100+ Prompts

1. **Database:**
   - Add indexes on frequently queried columns
   - Consider partitioning test_results table
   - Archive old test runs

2. **Backend:**
   - Add async job queue (Celery) for test execution
   - Add API caching (Redis)
   - Add rate limiting
   - Split into microservices if needed

3. **Frontend:**
   - Add pagination to prompt list
   - Add filtering/sorting
   - Add infinite scroll for results
   - Code splitting for faster loading

---

## 🐛 DEBUGGING

### Backend Logs

```bash
# Check Flask debug logs
tail -f /path/to/app.log

# Check database queries
psql -U user -d prompt_tester -c "SELECT * FROM prompts;"

# Test OpenAI connection
python3 -c "from test_runner import run_prompt; print(run_prompt('test: {input}', 'hello'))"
```

### Frontend Issues

```bash
# Check browser console (F12 in Chrome)
# Check network tab to see API calls
# Check if backend is running: curl http://localhost:5000/api/health
```

---

## 🚢 DEPLOYMENT OPTIONS

### Option 1: Docker Compose (Simple)
```bash
docker-compose up
```
Runs both backend and PostgreSQL in containers.

### Option 2: Cloud Platform (Recommended)
- **Backend:** Heroku, AWS Lambda, Google Cloud Run, Azure
- **Database:** AWS RDS, Azure Database for PostgreSQL
- **Frontend:** Vercel, Netlify, AWS S3 + CloudFront

### Option 3: On-Premise (Your Setup)
- Backend: Python application server (Gunicorn, etc.)
- Database: PostgreSQL server
- Frontend: Nginx reverse proxy
- Use Docker for containerization

---

## 📞 KEY CONTACT POINTS

- **Frontend API calls:** `frontend/src/pages/*.js` - look for `axios.get/post`
- **Backend routes:** `backend/app.py` - all @app.route endpoints
- **Database:** `backend/database.py` - all SQLAlchemy models
- **OpenAI logic:** `backend/test_runner.py` - run_prompt() and calculate_similarity()

---

## 🎯 NEXT STEPS FOR TECH TEAM

1. Clone/download this repo
2. Review the code structure above
3. Set up local environment:
   ```bash
   cd backend && pip install -r requirements.txt
   cd ../frontend && npm install
   ```
4. Add your own OpenAI API key to `.env`
5. Start databases and servers as in main README
6. Test the workflows
7. Plan productionization roadmap
8. Start with deployment, then add enhancements

---

## 📚 USEFUL LINKS

- **OpenAI API:** https://platform.openai.com/docs
- **Flask:** https://flask.palletsprojects.com/
- **React:** https://react.dev/
- **PostgreSQL:** https://www.postgresql.org/docs/
- **SQLAlchemy:** https://docs.sqlalchemy.org/

---

Good luck! This is a solid foundation to build from.
