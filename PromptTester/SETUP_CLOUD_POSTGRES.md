# PromptTester - Cloud PostgreSQL Setup (NO ADMIN NEEDED!)

Using **Neon.tech** instead of local PostgreSQL. Much simpler!

---

## ✅ BENEFITS

- ✅ **No admin password needed**
- ✅ **No local installation**
- ✅ **Free tier available**
- ✅ **Already in the cloud** (easier for tech team to productionize)
- ✅ **Same database** - everything works the same way

---

## 🎯 COMPLETE SETUP (5 MINUTES)

### STEP 1: Create Free Neon Account

**Go to:** https://neon.tech

**Click:** "Sign Up" (top right)

**Sign up with:**
- Email, or
- GitHub account (easier)

**Wait:** Account created automatically (1 minute)

You'll see a **Project** page with a database already created.

---

### STEP 2: Get Connection String

**On the Neon dashboard:**

1. **Look for "Connection string"** (usually shows on the page)
2. **It looks like:**
   ```
   postgresql://neon_user:password@neon-host.neon.tech/neon_db?sslmode=require
   ```
3. **Copy the ENTIRE string** (right-click → Copy)

---

### STEP 3: Add to Your App

**Navigate to backend folder:**

```bash
cd ~/Downloads/PromptTester/backend
```

**Edit .env file:**

```bash
nano .env
```

**Find this line:**

```
DATABASE_URL=postgresql://your-neon-connection-string-here
```

**Replace** `postgresql://your-neon-connection-string-here` with your **actual Neon connection string** from Step 2.

**It should look like:**

```
DATABASE_URL=postgresql://neon_user:abc123@neon-host.neon.tech/neon_db?sslmode=require
```

**Save:**
- Press: `Ctrl + O`
- Press: `Enter`
- Press: `Ctrl + X`

---

### STEP 4: Install Backend Packages

```bash
pip3 install -r requirements.txt
```

---

### STEP 5: Test Database Connection

**Type this command:**

```bash
python3 -c "from database import init_db; init_db(); print('Database connected!')"
```

**If you see:**
```
Database connected!
```

✓ **You're good!** Database tables are created.

If you see an error, check:
- Is the connection string correct?
- Did you paste the entire string?
- Is there a space at the beginning or end?

---

### STEP 6: Install Frontend Packages

```bash
cd ~/Downloads/PromptTester/frontend
npm install
```

---

### STEP 7: Add Your OpenAI API Key

**Edit .env in backend:**

```bash
nano ~/Downloads/PromptTester/backend/.env
```

**Find:**
```
OPENAI_API_KEY=sk-your-openai-key-here
```

**Replace with your actual key from:** https://platform.openai.com/api-keys

**Save:**
- Press: `Ctrl + O`
- Press: `Enter`
- Press: `Ctrl + X`

---

### STEP 8: Run the App

**Terminal Tab 1: Backend**

```bash
cd ~/Downloads/PromptTester/backend
python3 app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
```

**Terminal Tab 2: Frontend (Press Cmd+T for new tab)**

```bash
cd ~/Downloads/PromptTester/frontend
npm start
```

Browser opens at: **http://localhost:3000**

---

## ✅ DONE!

App is now running with **cloud PostgreSQL**!

---

## 🔍 VERIFY IT WORKS

1. Click "Test Cases" tab
2. Add a test case
3. Go to "Dashboard" tab
4. Create a prompt
5. Run tests
6. See results!

---

## ❌ TROUBLESHOOTING

### "Error: no such table: prompts"

**Solution:** Database wasn't initialized. Run:

```bash
python3 -c "from database import init_db; init_db()"
```

Then start the app again.

---

### "Connection refused"

**Solution:** Check your connection string in .env:

```bash
cat ~/Downloads/PromptTester/backend/.env | grep DATABASE_URL
```

Make sure:
- It's the full string from Neon
- No spaces at beginning or end
- Includes `?sslmode=require` at the end

---

### "FATAL: password authentication failed"

**Solution:** Wrong connection string. Go back to Neon dashboard and copy the correct one.

---

### "psycopg2.OperationalError"

**Solution:** 
1. Check internet connection (need to reach Neon servers)
2. Verify connection string is correct
3. Check Neon dashboard to ensure project is active

---

## 📝 NEON ACCOUNT MANAGEMENT

### Free Tier Includes

- ✅ 3 projects
- ✅ 10 GB storage
- ✅ Up to 5 connections
- ✅ Free forever

### View Your Database (Web Dashboard)

1. Go to: https://console.neon.tech
2. **SQL Editor** tab - write queries
3. **Connections** - view/copy connection strings
4. **Monitoring** - see usage

---

## 🚀 FOR YOUR TECH TEAM

**Upgrade later:**
- Neon has paid tiers ($15-50/month)
- Or switch to AWS RDS / Azure Database
- Code doesn't change - just update DATABASE_URL

**Easy migration:**
```bash
# Export from Neon
pg_dump <connection-string> > backup.sql

# Import to new database
psql <new-connection-string> < backup.sql
```

---

## 💾 NEON CONNECTION STRING FORMATS

**Standard:**
```
postgresql://user:password@host/database
```

**With SSL (what Neon uses):**
```
postgresql://user:password@host/database?sslmode=require
```

**Both work!** Copy exactly what Neon gives you.

---

## ✨ ADVANTAGES VS LOCAL

| Feature | Local | Neon (Cloud) |
|---------|-------|--------------|
| Admin password | ❌ Needed | ✅ Not needed |
| Installation | ❌ Complex | ✅ 1 click |
| Backups | ❌ Manual | ✅ Automatic |
| Access from anywhere | ❌ No | ✅ Yes |
| Tech team setup | ❌ Repeat installation | ✅ Just change URL |
| Cost | Free | Free (forever) |

---

## 🎉 READY TO START?

1. Create Neon account (5 min): https://neon.tech
2. Copy connection string (1 min)
3. Add to .env (1 min)
4. Run app (1 min)

**Total: 10 minutes** (vs 30 with local PostgreSQL)

---

**Go to Neon.tech and sign up NOW!** 🚀
