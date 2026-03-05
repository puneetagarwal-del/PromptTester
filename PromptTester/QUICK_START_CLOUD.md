# PromptTester - QUICK START (Cloud Version - NO ADMIN NEEDED!)

**Simplified setup using cloud PostgreSQL** - no local database installation!

---

## ⚡ SUPER QUICK (5 STEPS, 10 MINUTES)

### 1. Create Cloud Database (5 min)

**Go to:** https://neon.tech

- Click "Sign Up"
- Use email or GitHub
- Account created automatically
- **Copy your connection string** (it's on the dashboard)

---

### 2. Download App

**Already downloaded PromptTester folder** ✓

---

### 3. Add Cloud Database URL

```bash
cd ~/Downloads/PromptTester/backend
nano .env
```

**Replace this line:**
```
DATABASE_URL=postgresql://your-neon-connection-string-here
```

**With your Neon connection string** (from Step 1)

**Save:** `Ctrl+O`, `Enter`, `Ctrl+X`

---

### 4. Install Packages

**Backend:**
```bash
cd ~/Downloads/PromptTester/backend
pip3 install -r requirements.txt
```

**Frontend:**
```bash
cd ~/Downloads/PromptTester/frontend
npm install
```

---

### 5. Add OpenAI Key & Run

```bash
# Edit .env and add your OpenAI API key
nano ~/Downloads/PromptTester/backend/.env

# Terminal Tab 1: Start backend
cd ~/Downloads/PromptTester/backend
python3 app.py

# Terminal Tab 2: Start frontend (Cmd+T)
cd ~/Downloads/PromptTester/frontend
npm start
```

**Browser opens at:** http://localhost:3000 ✓

---

## 🎯 THAT'S IT!

Your app is now running with **cloud PostgreSQL**.

No admin password needed. No local database.

---

## ❓ QUESTIONS?

See: `SETUP_CLOUD_POSTGRES.md` (full guide with troubleshooting)

---

**Let's go!** 🚀
