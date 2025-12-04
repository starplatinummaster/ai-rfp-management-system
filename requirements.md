# 🛠️ Installation Requirements - AI-Powered RFP Management System

Complete installation guide for Windows development environment using VS Code.

---

## 📋 **Quick Summary**

| Tool | Required | Purpose |
|------|----------|---------|
| Node.js | ✅ Yes | React + Backend API |
| Git | ✅ Yes | GitHub repo management |
| PostgreSQL | ✅ Yes | Database for RFPs, vendors, responses |
| VS Code | ✅ Yes | IDE (Integrated Development Environment) |
| REST Client / Postman | ✅ Yes | API testing |
| Groq API Key | ✅ Yes | AI features (Free alternative to OpenAI) |
| SMTP/Email Service | ✅ Yes | Email send/receive |
| Windows Build Tools | ⚠️ Optional | IMAP, Nodemailer dependencies |

---

## ✅ **1. Node.js (Required)**

Node.js is essential for both frontend (React) and backend (Express) development.

### Installation:
👉 **Download:** https://nodejs.org (LTS version recommended)

### What it installs:
- `node` - JavaScript runtime
- `npm` - Node Package Manager

### Verify installation:
```bash
node -v
npm -v
```

**Expected output:** v18.x.x or higher

---

## ✅ **2. Git (Required)**

Git is required for version control and GitHub repository management.

### Installation:
👉 **Download:** https://git-scm.com/download/win

### Verify installation:
```bash
git --version
```

**Expected output:** git version 2.x.x

---

## ✅ **3. PostgreSQL (Required)**

PostgreSQL is the recommended database for this RFP system.

### Installation:
👉 **Download:** https://www.postgresql.org/download/windows/

### What it installs:
- PostgreSQL Database Server
- pgAdmin GUI (Database management tool)

### Default Configuration:
- **Port:** 5432
- **Username:** postgres
- **Password:** (set during installation)

### After Installation:
1. Open pgAdmin
2. Create a new database named: `rfp_system`
3. Note your credentials for `.env` file

---

## ✅ **4. VS Code Extensions (Highly Recommended)**

Open VS Code → Extensions (Ctrl+Shift+X) → Search and Install:

### 🔹 JavaScript/Node.js Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **JavaScript (ES6) Snippets** - Code snippets

### 🔹 React Development
- **Reactjs Code Snippets** - React snippets
- **ES7+ React/Redux/React-Native snippets** - Modern React snippets

### 🔹 Backend Development
- **REST Client** - Test APIs directly in VS Code (Alternative to Postman)
- **Thunder Client** - Another great API testing tool

### 🔹 General Productivity
- **GitLens** - Enhanced Git capabilities
- **DotENV** - .env file syntax highlighting
- **Material Icon Theme** - Better file icons
- **Error Lens** - Inline error messages

---

## ✅ **5. Email Integration Setup**

### Option A: Gmail SMTP (Recommended for Testing)

#### Requirements:
1. **Gmail Account**
2. **Enable 2-Factor Authentication**
3. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Create app password for "Mail"
   - Save the 16-character password

#### Enable IMAP:
1. Gmail Settings → See all settings
2. Forwarding and POP/IMAP tab
3. Enable IMAP
4. Save Changes

#### Configuration (for .env):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password

IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASS=your-16-char-app-password
```


## ✅ **6. AI Provider - Groq (100% FREE)**

Groq offers **FREE, FAST AI API** with no credit card required.

### Why Groq?
✔️ **Completely Free** - No credit card needed  
✔️ **Fast Inference** - Faster than OpenAI  
✔️ **High Rate Limits** - Perfect for development  
✔️ **Good Quality** - Excellent for RFP parsing  

### Setup:
1. **Sign up:** https://console.groq.com
2. **Create API Key:** Dashboard → API Keys → Create
3. **Copy your key** (starts with `gsk_...`)

### Available Models:
- `llama-3.1-8b-instant` - Fast, good quality
- `llama-3.1-70b-versatile` - Better quality
- `mixtral-8x7b-32768` - Large context window

### Configuration (for .env):
```env
GROQ_API_KEY=gsk_your_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```


---

## ✅ **7. Windows Build Tools (Optional)**

Some Node modules (like `node-imap`) may require build tools.

### Installation:
Run **PowerShell as Administrator**:
```powershell
npm install --global --production windows-build-tools
```

**Note:** This can take 5-10 minutes. Only install if you encounter build errors with IMAP modules.

---

## ✅ **8. API Testing Tools**

### Option A: VS Code REST Client Extension (Recommended)
Already listed in VS Code extensions above. Allows API testing directly in `.http` files.

### Option B: Postman (Popular Alternative)
👉 **Download:** https://www.postman.com/downloads/

**Choose one** - both work great!

---

## ✅ **9. GitHub Desktop (Optional)**

Makes Git commits and pushes easier with a GUI.

👉 **Download:** https://desktop.github.com/

**Alternative:** Use Git commands in terminal (more professional).

---

## 📦 **NPM Packages (Auto-installed)**

These will be installed automatically when you run `npm install` in backend/frontend:

### Backend Dependencies:
```json
{
  "express": "Server framework",
  "dotenv": "Environment variables",
  "nodemailer": "Email sending",
  "node-imap": "Email receiving",
  "pg": "PostgreSQL client",
  "cors": "Cross-origin requests",
  "groq-sdk": "Groq AI SDK",
  "body-parser": "Parse request bodies"
}
```

### Frontend Dependencies:
```json
{
  "react": "UI library",
  "react-dom": "React rendering",
  "axios": "HTTP requests",
  "react-router-dom": "Routing",
  "tailwindcss": "CSS framework"
}
```

---

## 🔐 **Environment Variables Template**

Create `.env` file in `/backend`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rfp_system
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Server
PORT=5000
NODE_ENV=development

# AI Provider (Groq - FREE)
GROQ_API_KEY=gsk_your_api_key_here
GROQ_MODEL=llama-3.1-8b-instant

# Email SMTP (Sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email IMAP (Receiving)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASS=your-app-password
IMAP_TLS=true

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## ✅ **Installation Checklist**

Print this and check off as you install:

- [ ] Node.js installed (`node -v` works)
- [ ] Git installed (`git --version` works)
- [ ] PostgreSQL installed and running
- [ ] Database `rfp_system` created in pgAdmin
- [ ] VS Code extensions installed
- [ ] Gmail app password generated
- [ ] IMAP enabled in Gmail
- [ ] Groq API key obtained
- [ ] `.env` file created with all credentials
- [ ] Postman or REST Client ready for testing

---

## 🚀 **Next Steps**

After installing everything:

1. Clone repository: `git clone <your-repo-url>`
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Create `.env` file with your credentials
5. Start backend: `npm start`
6. Start frontend: `npm start`

---

## ❓ **Troubleshooting**

### "npm not recognized"
- Restart terminal/VS Code after Node.js installation
- Add Node.js to PATH manually if needed

### PostgreSQL connection error
- Check if PostgreSQL service is running (Windows Services)
- Verify credentials in `.env` match pgAdmin

### IMAP/SMTP authentication error
- Use app password, not regular Gmail password
- Enable "Less secure app access" if using old Gmail account