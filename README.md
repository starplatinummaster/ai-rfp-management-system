# **AI-Powered RFP Management System**

A single-user web application that automates the end-to-end RFP (Request for Proposal) process using AI. This system helps procurement managers create RFPs, send them to vendors, receive messy email responses, extract structured data using AI, and compare proposals intelligently.

---

## ⭐ **Features**

### **1. Create RFPs (AI-Powered)**
- User enters procurement needs in natural language
- System uses LLM (OpenAI/Anthropic) to generate a structured RFP JSON schema

### **2. Vendor Management**
- Add, edit, and list vendors
- Select vendors to send RFPs

### **3. Send RFPs via Email**
- Email vendors using SMTP (Nodemailer) or SendGrid
- Attach structured RFP details

### **4. Receive Vendor Responses**
- Read inbound email using IMAP or email provider webhook
- Store vendor replies (text + attachments)

### **5. AI Extraction of Vendor Proposals**
- Use LLM to parse unstructured email into structured proposal data:
  - Pricing
  - Terms
  - Timeline
  - Warranty
  - Notes

### **6. Proposal Comparison**
- Table comparison across vendors
- AI-generated:
  - Summary
  - Scores
  - Vendor recommendation

---

## 📂 **Project Structure**

```
/frontend        → React UI
/backend         → Node.js + Express API
/database        → SQL/Mongo migrations & schema
.env.example     → Env variables template
README.md
```

---

## 🔧 **Tech Stack**

### **Frontend**
- React.js
- Axios
- Tailwind / Material UI (optional)

### **Backend**
- Node.js + Express.js
- Nodemailer / SendGrid for email
- IMAP or SendGrid Inbound Parse for receiving replies

### **Database**
- PostgreSQL (recommended) OR MongoDB

### **AI Provider**
- OpenAI (GPT-4.1 / GPT-3.5 / o3-mini) OR Anthropic Claude

### **Key Libraries**
- `openai` / `anthropic`
- `nodemailer`
- `node-imap`
- `multer` (if attachments needed)
- `pg` or `mongoose`

---

## ⚙️ **Setup Instructions**

### **1. Prerequisites**
- Node.js ≥ 18
- PostgreSQL / MongoDB
- OpenAI API key
- Email credentials (SMTP or SendGrid)

---

### **2. Installation**

#### **Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

#### **Frontend**
```bash
cd frontend
npm install
npm start
```

---

## 📧 **Email Configuration**

### **SMTP (Nodemailer Example)**
In `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### **IMAP (Receiving Email)**
```env
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASS=your-app-password
```

### **OpenAI API**
```env
OPENAI_API_KEY=sk-...
```

---

## 🧪 **How to Run Locally**

1. Start database (PostgreSQL/Mongo)
2. Run backend: `cd backend && npm start`
3. Run frontend: `cd frontend && npm start`
4. Access UI at: `http://localhost:3000/`

---

## 📡 **API Documentation**

### **POST /api/rfp/create**
Create structured RFP from natural language.

**Request Body:**
```json
{
  "description": "We need 20 laptops, 15 monitors, budget $50k, delivery in 30 days"
}
```

### **POST /api/vendors**
Add vendor.

**Request Body:**
```json
{
  "name": "Vendor Name",
  "email": "vendor@example.com",
  "category": "Electronics"
}
```

### **POST /api/rfp/send**
Send an RFP to selected vendors.

**Request Body:**
```json
{
  "rfpId": "123",
  "vendorIds": ["1", "2", "3"]
}
```

### **POST /api/email/inbound**
Webhook/IMAP-triggered endpoint to store vendor email.

### **GET /api/rfp/:id/proposals**
Get parsed vendor proposals.

---

## 🧠 **Decisions & Assumptions**

- Single user only; no authentication needed
- Vendor responses assumed to be plain text or simple attachments
- AI used for:
  - RFP structuring
  - Email parsing
  - Proposal comparison and recommendation
- Email polling every 30 seconds if using IMAP
- Structure of RFP is JSON-based with fields like items, budget, terms, and timeline

---

## 🤖 **AI Tools Usage**

Used ChatGPT / Claude for:
- Brainstorming schema design
- Drafting comparison logic
- Idea generation for parsing prompts
- Regex cleanup
- Boilerplate code generation

Prompts refined to improve:
- JSON formatting
- Field extraction accuracy
- Proposal scoring clarity

---

## 🎥 **Demo Video Requirements**

Your video must show:
1. Creating RFP from natural language
2. Managing vendors
3. Sending RFP email
4. Receiving vendor response + auto parsing
5. Comparison table + AI recommendation
6. Short code walkthrough

---

## 🚀 **Future Enhancements**

- Multi-user support with authentication
- Real-time notifications
- Advanced vendor analytics
- PDF proposal generation
- Email template customization
- Vendor performance history tracking

---

## 📝 **License**

MIT License

---

## 👨‍💻 **Author**

[Your Name]

---

## 🙏 **Acknowledgments**

- OpenAI / Anthropic for AI capabilities
- Open source community for libraries and tools
