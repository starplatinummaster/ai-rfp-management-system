# **AI-Powered RFP Management System**

A single-user web application that automates the end-to-end RFP (Request for Proposal) process using AI. This system helps procurement managers create RFPs, send them to vendors, receive messy email responses, extract structured data using AI, and compare proposals intelligently.

---

## 📋 **Table of Contents**

- [System Overview](#system-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [AI Service Deep Dive](#ai-service-deep-dive)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [UML Diagrams](#uml-diagrams)
- [Testing](#testing)

---

## 🎯 **System Overview**

The AI-Powered RFP Management System streamlines the procurement process by:

1. **Automating RFP Creation**: Convert natural language requirements into structured RFPs using AI
2. **Managing Vendors**: Centralized vendor database with categorization
3. **Email Integration**: Send RFPs via SMTP and receive responses via IMAP
4. **AI-Powered Parsing**: Extract structured data from unstructured vendor emails
5. **Intelligent Comparison**: AI-driven proposal scoring and vendor recommendations

**Key Innovation**: Transforms messy, unstructured vendor emails into structured, comparable data using Large Language Models (LLMs).

---

## ⭐ **Features**

### **1. AI-Powered RFP Creation**
- Natural language input → Structured JSON output
- Auto-generates: items, budget, timeline, terms
- Editable and resendable RFPs

### **2. Vendor Management**
- CRUD operations for vendors
- Category-based organization
- Email validation and duplicate prevention

### **3. Email Integration**
- **Outbound**: SMTP (Nodemailer) for sending RFPs
- **Inbound**: IMAP monitoring for vendor responses
- Automatic proposal creation from emails

### **4. AI Proposal Extraction**
- Parses unstructured email content
- Extracts: pricing, delivery dates, payment terms, warranty
- Handles various email formats and styles

### **5. Intelligent Comparison**
- Multi-dimensional scoring (price, timeline, terms)
- AI-generated vendor rankings
- Recommendation with reasoning

### **6. Proposal Archival**
- Archives old proposals when RFP is updated
- Maintains historical data
- Prevents comparison mismatches

---

## 🔧 **Tech Stack**

### **Frontend**
- **React.js** - UI framework
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Router** - Navigation

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Nodemailer** - Email sending
- **node-imap** - Email receiving

### **AI/ML**
- **Groq API** - LLM provider (Llama 3.1-8b-instant)
- **JSON Mode** - Structured output generation
- **Prompt Engineering** - Optimized for RFP domain

### **Key Libraries**
- `pg` - PostgreSQL client
- `dotenv` - Environment configuration
- `mailparser` - Email parsing
- `groq-sdk` - AI integration

---

## 🏗️ **Architecture**

### **Design Pattern: Model-View-Controller (MVC)**

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
│                  View Layer - Port 3000                  │
└─────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST API
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js/Express)               │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Controllers  │→ │   Services   │→ │    Models    │  │
│  │  (Routes)    │  │  (Business)  │  │   (Data)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         ↓                  ↓                  ↓          │
│  ┌──────────────────────────────────────────────────┐  │
│  │            AI Service (Groq LLM)                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                     │
│         (Users, Vendors, RFPs, Proposals)                │
└─────────────────────────────────────────────────────────┘
```

### **Backend Structure**

```
backend/
├── src/
│   ├── controllers/      # HTTP request handlers (Controller)
│   │   ├── rfpController.js
│   │   ├── vendorController.js
│   │   ├── proposalController.js
│   │   └── emailController.js
│   │
│   ├── services/         # Business logic (Service Layer)
│   │   ├── aiService.js         # AI integration
│   │   ├── rfpService.js        # RFP operations
│   │   ├── vendorService.js     # Vendor operations
│   │   ├── proposalService.js   # Proposal processing
│   │   └── emailService.js      # Email handling
│   │
│   ├── models/           # Data access (Model)
│   │   ├── User.js
│   │   ├── Vendor.js
│   │   ├── RFP.js
│   │   ├── Proposal.js
│   │   └── RFPVendor.js
│   │
│   ├── routes/           # API endpoints
│   ├── middleware/       # CORS, error handling
│   ├── utils/            # Helper functions
│   └── database.js       # PostgreSQL connection
│
└── server.js             # Application entry point
```

### **MVC Pattern Explanation**

**Model (Data Layer)**
- Direct database interaction
- CRUD operations
- Data validation
- Relationship management

**View (Frontend)**
- React components
- User interface
- Data presentation
- User interactions

**Controller (API Layer)**
- Route handling
- Request validation
- Response formatting
- Error handling

**Service Layer (Business Logic)**
- Complex operations
- AI integration
- Email processing
- Multi-model coordination

---

## 🤖 **AI Service Deep Dive**

### **Overview**
The AI Service (`aiService.js`) is the core intelligence layer that powers:
1. RFP structure generation
2. Proposal parsing
3. Scoring algorithms
4. Comparison and recommendations

### **AI Provider: Groq**
- **Model**: Llama 3.1-8b-instant
- **Why Groq**: Fast inference, free tier, JSON mode support
- **Alternative**: OpenAI GPT-4, Anthropic Claude

### **Core Functions**

#### **1. RFP Structure Generation**
```javascript
generateRFPStructure(description)
```
**Input**: Natural language description
```
"Need 50 laptops: Intel i7, 32GB RAM, 1TB SSD. Budget Rs 75L, 45 days delivery."
```

**Output**: Structured JSON
```json
{
  "items": [{
    "name": "Business Laptops",
    "quantity": 50,
    "specifications": "Intel i7, 32GB RAM, 1TB SSD"
  }],
  "budget": {"max": 7500000, "currency": "INR"},
  "timeline": {"deadline": "2026-02-15"},
  "terms": {"payment": "Net 30", "warranty": "3 years"}
}
```

**Prompt Engineering**:
- System role: "You are a JSON generator"
- Temperature: 0.1 (deterministic)
- Response format: JSON object mode
- Fallback: Regex extraction from markdown

#### **2. Proposal Parsing**
```javascript
parseProposal(emailContent, rfpRequirements)
```
**Input**: Unstructured email + RFP context
```
"Dell laptops Rs 72,50,000 total. Delivery 40 days. 50% advance payment."
```

**Output**: Structured proposal
```json
{
  "pricing": {"total": 7250000, "per_unit": 145000},
  "timeline": {"delivery_date": "2026-01-16"},
  "terms": {
    "payment": "50% advance, 50% on delivery",
    "warranty": "3 years comprehensive onsite"
  }
}
```

**Intelligent Features**:
- **Date parsing**: "tomorrow", "next week", "21 days" → actual dates
- **Price calculation**: Auto-calculates per-unit if only total given
- **Context awareness**: Uses RFP requirements for validation

#### **3. Proposal Scoring**
```javascript
scoreProposal(proposal, rfpRequirements)
```
**Scoring Dimensions**:
- **Price Score** (0-10): Comparison with budget
- **Timeline Score** (0-10): Delivery vs deadline
- **Terms Score** (0-10): Payment and warranty quality
- **Overall Score**: Weighted average

**Scoring Logic**:
```
Price Score:
  - Below budget: 9-10
  - At budget: 7-8
  - Above budget: 4-6
  - Missing: 0

Timeline Score:
  - Before deadline: 9-10
  - At deadline: 7-8
  - After deadline: 4-6
  - Missing: 0

Terms Score:
  - Has payment AND warranty: 8-10
  - Has one: 4-7
  - Missing: 0
```

#### **4. Proposal Comparison**
```javascript
compareProposals(proposals, rfpRequirements)
```
**Input**: Multiple proposals + RFP context

**Output**: Comprehensive comparison
```json
{
  "summary": "3 proposals received with varying pricing...",
  "recommendation": {
    "vendor_id": 2,
    "vendor_name": "TechCorp Solutions",
    "reason": "Best value with Rs 170000 savings (14% under budget)..."
  },
  "rankings": [
    {"vendor_id": 2, "rank": 1, "score": 9.2},
    {"vendor_id": 1, "rank": 2, "score": 8.5}
  ]
}
```

**AI Analysis Factors**:
- Overall score comparison
- Price competitiveness
- Delivery speed
- Payment terms favorability
- Warranty coverage
- Risk assessment

### **Prompt Engineering Best Practices**

1. **Clear Instructions**: "Return ONLY valid JSON, no explanations"
2. **Examples**: Provide sample input/output
3. **Constraints**: Specify exact JSON structure
4. **Context**: Include RFP requirements for validation
5. **Error Handling**: Regex fallback for malformed responses

### **AI Service Error Handling**

```javascript
try {
  const result = await groq.chat.completions.create({...});
  return JSON.parse(result.choices[0].message.content);
} catch (error) {
  // Fallback: Regex extraction
  // Log error for monitoring
  // Return default structure
}
```

---

## 💾 **Database Schema**

### **Entity Relationship Diagram**

```mermaid
erDiagram
    USERS ||--o{ RFPS : creates
    USERS ||--o{ VENDORS : manages
    RFPS ||--o{ RFP_VENDORS : "sent to"
    VENDORS ||--o{ RFP_VENDORS : receives
    RFPS ||--o{ PROPOSALS : "has responses"
    VENDORS ||--o{ PROPOSALS : submits
    
    USERS {
        int id PK
        string username
        string email
        string password_hash
        timestamp created_at
    }
    
    VENDORS {
        int id PK
        int user_id FK
        string name
        string email
        string phone
        string category
        timestamp created_at
    }
    
    RFPS {
        int id PK
        int user_id FK
        string title
        text description
        jsonb structured_requirements
        string status
        timestamp created_at
    }
    
    RFP_VENDORS {
        int id PK
        int rfp_id FK
        int vendor_id FK
        timestamp sent_at
        string email_status
        string email_message_id
    }
    
    PROPOSALS {
        int id PK
        int rfp_id FK
        int vendor_id FK
        text raw_email_content
        jsonb structured_proposal
        jsonb ai_scores
        boolean archived
        string processing_status
        timestamp received_at
    }
```

### **Key Design Decisions**

1. **JSONB Columns**: Store AI-generated structured data flexibly
2. **Archived Flag**: Soft delete for proposals when RFP updates
3. **Status Tracking**: Monitor email delivery and proposal processing
4. **Timestamps**: Audit trail for all operations

---

## ⚙️ **Setup Instructions**

### **Prerequisites**
- Node.js ≥ 18
- PostgreSQL ≥ 14
- Groq API key (free at groq.com)
- Gmail account (for SMTP/IMAP)

### **Installation**

#### **1. Clone Repository**
```bash
git clone <repository-url>
cd ai-rfp-management-system
```

#### **2. Database Setup**
```bash
# Create database
createdb rfp_management

# Run migrations
psql -d rfp_management -f db/migrations/initial_schema.sql

# Load seed data (optional)
psql -d rfp_management -f db/seeds/seed_data.sql
```

#### **3. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

**Environment Variables**:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rfp_management

# AI Provider
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email (IMAP)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASS=your-app-password
```

#### **4. Frontend Setup**
```bash
cd frontend
npm install
npm start
```

#### **5. Access Application**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

---

## 📡 **API Documentation**

Comprehensive API documentation available at: **[docs/api.docs.md](docs/api.docs.md)**

### **Quick Reference**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rfps` | POST | Create RFP from natural language |
| `/api/rfps/:id` | GET | Get RFP details |
| `/api/rfps/:id` | PUT | Update RFP (archives proposals) |
| `/api/rfps/send` | POST | Send RFP to vendors via email |
| `/api/rfps/:id/proposals` | GET | Get active proposals |
| `/api/rfps/:id/proposals/archived` | GET | Get archived proposals |
| `/api/rfps/:id/compare` | GET | AI comparison & recommendation |
| `/api/vendors` | POST | Create vendor |
| `/api/vendors` | GET | List all vendors |
| `/api/vendors/:id` | PUT | Update vendor |
| `/api/vendors/:id` | DELETE | Delete vendor |
| `/api/email/inbound` | POST | Process incoming vendor email |

---

## 📊 **UML Diagrams**

### **High-Level Design**

```mermaid
flowchart TD
    %% AI-Powered RFP Management System - Production HLD Flow
    
    A[User Dashboard] --> B{Choose Action}
    
    %% RFP Creation with Size Validation
    B -->|Create RFP| C[Enter Description]
    C --> C1[Validate Size < 50KB]
    C1 -->|Valid| D[Groq AI - Max 100KB JSON]
    C1 -->|Too Large| C2[Show Size Error]
    D --> E[Save RFP to DB]
    
    %% Vendor Management
    B -->|Add Vendors| F[Vendor Form]
    F --> G[Save Vendor to DB]
    
    %% Send RFP with Tracking
    B -->|Send RFP| H[Select Vendors]
    H --> I[Send Emails + Message ID]
    I --> I1[Update RFP_VENDORS Status]
    
    %% Receive Responses with Size Control
    J[Email Polling Service] --> K[New Response?]
    K -->|Yes| K1[Validate Email < 5MB]
    K -->|No| J
    K1 -->|Valid| L[Parse with AI - Max 500KB JSON]
    K1 -->|Too Large| K2[Truncate + Save Note]
    L --> M[Save Proposal to DB]
    K2 --> M
    
    %% View Comparison
    B -->|View Results| N[Generate AI Comparison]
    N --> O[Show Results Table]
    
    %% Database with JSONB
    E --> P[(PostgreSQL with JSONB)]
    G --> P
    I1 --> P
    M --> P
    
    %% External Services
    D -.->|Size-Limited Prompts| Q[Groq API]
    L -.->|Size-Limited Prompts| Q
    N -.->|Comparison Request| Q
    I -.->|SMTP + Message ID| R[Email Service]
    J -.->|IMAP Polling| R
    
    %% Error Handling
    C2 --> C
    K2 --> S[Log Truncation Event]
    
    %% Styling
    classDef validation fill:#ffeb3b
    classDef error fill:#f44336
    classDef database fill:#4caf50
    classDef external fill:#2196f3
    
    class C1,K1 validation
    class C2,K2,S error
    class P database
    class Q,R external
```

### **Entity Relationship Diagram**

```mermaid
erDiagram
    USERS ||--o{ RFPS : creates
    USERS ||--o{ VENDORS : manages
    RFPS ||--o{ RFP_VENDORS : "sent to"
    VENDORS ||--o{ RFP_VENDORS : receives
    RFPS ||--o{ PROPOSALS : "has responses"
    VENDORS ||--o{ PROPOSALS : submits
    
    USERS {
        int id PK
        string username
        string email
        string password_hash
        datetime created_at
        datetime updated_at
    }
    
    VENDORS {
        int id PK
        int user_id FK
        string name
        string email
        string phone
        string category
        datetime created_at
        datetime updated_at
    }
    
    RFPS {
        int id PK
        int user_id FK
        string title
        text description
        json structured_requirements
        string status
        datetime created_at
        datetime updated_at
    }
    
    RFP_VENDORS {
        int id PK
        int rfp_id FK
        int vendor_id FK
        datetime sent_at
        string email_status
        string email_message_id
        datetime created_at
    }
    
    PROPOSALS {
        int id PK
        int rfp_id FK
        int vendor_id FK
        text raw_email_content
        string email_subject
        json structured_proposal
        json ai_scores
        boolean archived
        string processing_status
        datetime received_at
        datetime created_at
        datetime updated_at
    }
```

---

## 🧪 **Testing**

### **Manual Testing**

1. **Create RFP**: Use natural language in RFP Management
2. **Add Vendors**: Register vendors in Vendor Management
3. **Send RFP**: Select vendors and send via email
4. **Simulate Response**: Use Vendor Simulator to create proposals
5. **Compare**: View AI-powered comparison in Proposal Comparison

### **Test Data**

Mock data available at: **[docs/TEST_DATA.txt](docs/TEST_DATA.txt)**

### **API Testing**

Use Postman or curl:
```bash
# Create RFP
curl -X POST http://localhost:5000/api/rfps \
  -H "Content-Type: application/json" \
  -d '{"description": "Need 10 laptops, Rs 20L budget, 2 weeks"}'

# Get proposals
curl http://localhost:5000/api/rfps/1/proposals

# Compare proposals
curl http://localhost:5000/api/rfps/1/compare
```

---

## 📚 **Additional Documentation**

- **Requirements**: [requirements.md](requirements.md)
- **API Reference**: [docs/api.docs.md](docs/api.docs.md)
- **Testing Guide**: [docs/TEST_DATA.txt](docs/TEST_DATA.txt)
- **ER Diagram**: [uml_diagrams/er_diagram.mmd](uml_diagrams/er_diagram.mmd)
- **HLD Diagram**: [uml_diagrams/hld.mmd](uml_diagrams/hld.mmd)

---

## 🚀 **Future Enhancements**

- Multi-user support with authentication
- Real-time notifications (WebSockets)
- Advanced vendor analytics dashboard
- PDF proposal generation
- Email template customization
- Vendor performance history tracking
- Integration with procurement systems (SAP, Oracle)

---

## 📝 **License**

MIT License

---

## 👨‍💻 **Author**

Developed as part of SDE Assignment - AI-Powered RFP Management System

---

## 🙏 **Acknowledgments**

- **Groq** for fast LLM inference
- **OpenAI** for AI capabilities inspiration
- **PostgreSQL** for robust data storage
- **React** and **Express** communities for excellent frameworks
