# PromptTester - Quick Command Reference

Copy and paste these commands exactly.

---

## 🔧 ONE-TIME SETUP

### Install PostgreSQL
```bash
brew install postgresql
```

### Start PostgreSQL
```bash
brew services start postgresql
```

### Create Database
```bash
createdb -U puneetagarwal prompt_tester
```

### Verify Database
```bash
psql -U puneetagarwal -d prompt_tester -c "SELECT 1;"
```

---

## 📦 INSTALL DEPENDENCIES

### Backend
```bash
cd ~/Downloads/PromptTester/backend
pip3 install -r requirements.txt
```

### Frontend
```bash
cd ~/Downloads/PromptTester/frontend
npm install
```

---

## 🚀 START THE APP (Every Time)

### Terminal Tab 1: Backend
```bash
cd ~/Downloads/PromptTester/backend
nano .env  # Make sure OPENAI_API_KEY is set
python3 app.py
```

### Terminal Tab 2: Frontend (NEW TAB - Cmd+T)
```bash
cd ~/Downloads/PromptTester/frontend
npm start
```

Then browser opens at: **http://localhost:3000**

---

## 🧪 TESTING API

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

### Get All Prompts
```bash
curl http://localhost:5000/api/prompts
```

### Get All Test Cases
```bash
curl http://localhost:5000/api/test-cases
```

---

## 🛑 STOP THE APP

### Backend
In backend terminal: Press `Ctrl + C`

### Frontend
In frontend terminal: Press `Ctrl + C`

### PostgreSQL (Optional)
```bash
brew services stop postgresql
```

---

## 🗄️ DATABASE COMMANDS

### Connect to Database
```bash
psql -U puneetagarwal -d prompt_tester
```

### List All Tables
```
\dt
```

### View All Prompts
```
SELECT * FROM prompts;
```

### View All Test Cases
```
SELECT * FROM test_cases;
```

### Exit Database
```
\q
```

---

## 🔍 TROUBLESHOOTING COMMANDS

### Check if PostgreSQL is Running
```bash
brew services list | grep postgresql
```

### Check if Port 5000 is Available
```bash
lsof -i :5000
```

### Check if Port 3000 is Available
```bash
lsof -i :3000
```

### Reset Database (CAUTION: Deletes all data)
```bash
dropdb -U puneetagarwal prompt_tester
createdb -U puneetagarwal prompt_tester
```

### Verify .env File
```bash
cat ~/Downloads/PromptTester/backend/.env
```

---

## 📁 FILE LOCATIONS

```
PromptTester folder:
~/Downloads/PromptTester/

Backend:
~/Downloads/PromptTester/backend/

Frontend:
~/Downloads/PromptTester/frontend/

Config (.env):
~/Downloads/PromptTester/backend/.env
```

---

## 💾 SAVING YOUR WORK

### Backup Database
```bash
pg_dump -U puneetagarwal prompt_tester > prompt_tester_backup.sql
```

### Restore Database
```bash
psql -U puneetagarwal prompt_tester < prompt_tester_backup.sql
```

---

## 🎯 TYPICAL WORKFLOW

1. **Start terminals:**
   ```bash
   # Terminal 1: Backend
   cd ~/Downloads/PromptTester/backend
   python3 app.py
   
   # Terminal 2: Frontend (Cmd+T)
   cd ~/Downloads/PromptTester/frontend
   npm start
   ```

2. **Wait for browser to open**

3. **Add test cases** (Test Cases tab)

4. **Create prompt** (Dashboard tab → + New Prompt)

5. **Run tests** (Click prompt → Run Tests)

6. **View results** (See pass/fail for each test)

---

## 🆘 WHEN THINGS GO WRONG

### "ModuleNotFoundError: No module named 'flask'"
Solution:
```bash
cd ~/Downloads/PromptTester/backend
pip3 install -r requirements.txt
```

### "Cannot connect to database"
Solution:
```bash
brew services restart postgresql
psql -U puneetagarwal -d prompt_tester -c "SELECT 1;"
```

### "npm: command not found"
Solution: Install Node.js from https://nodejs.org/ (LTS version)

### "npm install hangs"
Solution:
```bash
npm cache clean --force
npm install
```

### "Port 5000 already in use"
Solution:
```bash
lsof -i :5000
# Kill the process (PID in output)
kill -9 <PID>
```

### "Frontend not connecting to backend"
Solution: Make sure both are running:
- Backend: Terminal shows "Running on http://127.0.0.1:5000"
- Frontend: Terminal shows "Compiled successfully"

---

## 📞 KEY WEBSITES

- **OpenAI Keys:** https://platform.openai.com/api-keys
- **Node.js:** https://nodejs.org/
- **Python Packages:** https://pypi.org/
- **PostgreSQL:** https://www.postgresql.org/

---

Print this page or keep it in Notes app for quick reference!
