# PromptTester - Complete Setup Guide for Mac

This is a complete, working app for testing prompts. Follow these exact steps on your Mac.

---

## 🎯 WHAT YOU'LL HAVE

- **Backend:** Python API running on port 5000
- **Frontend:** React app running on port 3000
- **Database:** PostgreSQL running on port 5432
- **All working together:** Create prompts → Add test cases → Run tests → See results

---

## ⏱️ ESTIMATED TIME: 30 minutes

---

## 📋 PREREQUISITES

You need:
1. **Mac (what you have)** ✓
2. **Terminal** ✓
3. **Your OpenAI API Key** (from https://platform.openai.com/api-keys)

---

## 🚀 STEP-BY-STEP SETUP

### STEP 1: Get Your OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (looks like: `sk-proj-abc123...`)
4. **Save it somewhere safe** - you'll need it in a few minutes

---

### STEP 2: Install PostgreSQL on Mac

**Open Terminal and type:**

```bash
brew install postgresql
```

**Press Enter** (takes 2-3 minutes)

You should see: `==> Caveats` and `==> Summary`

---

### STEP 3: Start PostgreSQL

**Type in Terminal:**

```bash
brew services start postgresql
```

**Press Enter**

You should see: `Successfully started postgresql`

---

### STEP 4: Create the Database

**Type in Terminal:**

```bash
createdb -U puneetagarwal prompt_tester
```

**Press Enter**

(If it asks for password, just press Enter - there's no password yet)

---

### STEP 5: Verify PostgreSQL is Working

**Type in Terminal:**

```bash
psql -U puneetagarwal -d prompt_tester -c "SELECT 1;"
```

**Press Enter**

You should see:
```
 ?column? 
----------
        1
(1 row)
```

If yes, PostgreSQL is working! ✓

---

### STEP 6: Install Python Packages

**Navigate to backend folder:**

```bash
cd ~/Downloads/PromptTester/backend
```

**Press Enter**

**Install dependencies:**

```bash
pip3 install -r requirements.txt
```

**Press Enter** (takes 1-2 minutes)

You should see: `Successfully installed ...`

---

### STEP 7: Add Your OpenAI API Key

**Edit the .env file:**

```bash
nano .env
```

**Press Enter**

You'll see the file open. **Find this line:**

```
OPENAI_API_KEY=sk-your-openai-key-here
```

**Delete** `sk-your-openai-key-here` and **paste your actual key** from Step 1.

It should look like:
```
OPENAI_API_KEY=sk-proj-abc123xyz789...
```

**Save the file:**
- Press: `Ctrl + O` (Control + Letter O)
- Press: `Enter`
- Press: `Ctrl + X` (to exit)

---

### STEP 8: Start the Backend

**Still in the backend folder, type:**

```bash
python3 app.py
```

**Press Enter**

You should see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

**IMPORTANT: Keep this Terminal window OPEN. Don't close it.**

---

### STEP 9: Open a NEW Terminal Tab

**Press:** `Cmd + T` (opens new Terminal tab)

**This new tab is for the frontend**

---

### STEP 10: Install Node Dependencies

**Navigate to frontend:**

```bash
cd ~/Downloads/PromptTester/frontend
```

**Press Enter**

**Install dependencies:**

```bash
npm install
```

**Press Enter** (takes 3-5 minutes - this is normal)

Wait for it to finish. You should see:
```
added X packages
```

---

### STEP 11: Start the Frontend

**In the same Terminal tab, type:**

```bash
npm start
```

**Press Enter**

Wait 10-20 seconds. Your browser should **automatically open** with:

```
http://localhost:3000
```

You'll see the **PromptTester Dashboard**!

---

## ✅ YOU'RE DONE WITH SETUP!

If you see the PromptTester dashboard in your browser, everything is working!

---

## 🎮 HOW TO USE IT

### 1. Add Test Cases

1. Click **"Test Cases"** tab
2. Fill in:
   - **Test ID:** `test_001`
   - **Input:** `What is 2+2?`
   - **Expected Output:** `4`
3. Click **"Add Test Case"**
4. Add more test cases (repeat 2-3 times)

### 2. Create a Prompt

1. Click **"Dashboard"** tab
2. Click **"+ New Prompt"**
3. Fill in:
   - **Name:** `math_helper_v1`
   - **Prompt:** `You are a helpful math assistant. Answer: {input}`
4. Click **"Create"**

### 3. Run Tests

1. Click on the prompt card
2. Click **"Run Tests"**
3. Wait 30-60 seconds
4. See results! (Pass rate, each test result)

---

## ❌ TROUBLESHOOTING

### Issue: "psql: command not found"

**Solution:** Homebrew isn't set up. Try:

```bash
/usr/local/bin/psql --version
```

If that works, add to PATH:

```bash
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

### Issue: "Database already exists"

**Solution:** It's fine! Skip the `createdb` step and continue.

---

### Issue: "Cannot find module 'react'"

**Solution:** Make sure you're in the frontend folder and ran `npm install`:

```bash
cd ~/Downloads/PromptTester/frontend
npm install
```

---

### Issue: "OPENAI_API_KEY not found"

**Solution:** Check your .env file:

```bash
cat ~/Downloads/PromptTester/backend/.env
```

Make sure you see your actual key (starts with `sk-proj-`), not the placeholder.

---

### Issue: Backend shows "Error running prompt"

**Solution:** Your OpenAI API key is wrong or you're out of credits. Verify:

```bash
curl -X GET http://localhost:5000/api/health
```

Should return: `{"status":"healthy"}`

---

### Issue: Frontend won't load

**Solution:** Make sure both terminals are running:
1. Check backend terminal - should say "Running on http://127.0.0.1:5000"
2. Check frontend terminal - should say "Compiled successfully"

---

## 📁 FILE STRUCTURE

```
PromptTester/
├── backend/
│   ├── app.py          (Main Flask app)
│   ├── database.py     (Database models)
│   ├── test_runner.py  (Test execution)
│   ├── requirements.txt
│   ├── .env            (Your API key goes here)
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── PromptDetail.js
│   │   │   └── TestCaseManager.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
└── docker-compose.yml
```

---

## 🔧 TERMINAL SETUP (For Reference)

**You should have 2 Terminal tabs open:**

**Tab 1 (Backend):**
```
cd ~/Downloads/PromptTester/backend
python3 app.py
```

**Tab 2 (Frontend):**
```
cd ~/Downloads/PromptTester/frontend
npm start
```

---

## 📊 TESTING IT WORKS

**Quick test:**

1. Add a simple prompt: `Answer briefly: {input}`
2. Add a test case:
   - Input: `Say hello`
   - Expected: `Hi`
3. Run tests
4. You should see results in 30-60 seconds

---

## 🎉 NEXT STEPS

Once working locally, give to your tech team:

1. The entire `PromptTester/` folder
2. Tell them: "PostgreSQL, Python, Node.js backend + frontend"
3. They can:
   - Deploy to production
   - Rewrite frontend in Angular
   - Add authentication
   - Scale database
   - etc.

---

## ❓ QUESTIONS?

Check these first:

1. **Is PostgreSQL running?**
   ```bash
   brew services list | grep postgresql
   ```

2. **Is backend running?**
   - Check terminal tab - should say "Running on http://127.0.0.1:5000"

3. **Is frontend running?**
   - Check terminal tab - should say "Compiled successfully"

4. **Is API key correct?**
   ```bash
   cat ~/Downloads/PromptTester/backend/.env | grep OPENAI
   ```

---

## 🎯 YOU'RE READY!

The app is fully working. Enjoy testing your prompts!
