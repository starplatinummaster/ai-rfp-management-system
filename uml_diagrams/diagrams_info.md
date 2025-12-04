# 📊 **UML Diagrams - AI-Powered RFP Management System**

This directory contains the **FINAL PRODUCTION** system design diagrams for the AI-Powered RFP Management System.

---

## 📋 **Final Database Schema (5 Tables)**

### 1. **ER Diagram** (`er_diagram.mmd`)
**Production-Ready Entity Relationship Diagram** with overflow protection.

#### **Core Tables:**
- **USERS** - User authentication and management
- **RFPS** - RFP records with AI-generated structured requirements
- **VENDORS** - Vendor master list with contact information
- **RFP_VENDORS** - Junction table tracking which vendors received which RFPs
- **PROPOSALS** - Vendor responses with AI-parsed structured data and scores

#### **Key Relationships:**
- One-to-Many: Users → RFPs, Users → Vendors
- Many-to-Many: RFPs ↔ Vendors (via RFP_VENDORS junction table)
- One-to-Many: RFPs → Proposals, Vendors → Proposals

#### **Critical Fields Added:**
- `email_message_id` - Email tracking and threading
- `email_subject` - Email parsing context
- `processing_status` - AI pipeline status tracking

---

### 2. **High Level Design** (`hld.mmd`)
**Activity Flow Diagram** showing the complete system workflow and component interactions.

#### **Main Flows:**

##### **🔄 RFP Creation Flow:**
1. User enters natural language description
2. AI service (Groq) generates structured RFP JSON
3. User reviews and approves
4. RFP saved to database

##### **📧 RFP Distribution Flow:**
1. User selects RFP and target vendors
2. SMTP service sends emails
3. Email status logged and tracked
4. RFP status updated to 'Sent'

##### **📥 Email Receiving Flow:**
1. IMAP polling service monitors inbox
2. New vendor responses extracted
3. AI service parses unstructured emails
4. Structured proposal data saved

##### **📊 Proposal Comparison Flow:**
1. User requests comparison for RFP
2. AI service analyzes all proposals
3. Generates scores and recommendation
4. Displays comparison matrix

#### **System Components:**
- **Frontend**: React.js UI components
- **Backend**: Node.js + Express API
- **Database**: PostgreSQL with structured schema
- **AI Service**: Groq API for NLP processing
- **Email Service**: SMTP/IMAP for email handling
- **Background Services**: Schedulers and queues

---

## 🚨 **CRITICAL: Overflow Prevention**

### **High-Risk Fields & Solutions:**

#### **1. `raw_email_content` (TEXT)**
**Risk:** Large emails with attachments (10MB+)
**Solution:**
```javascript
const MAX_EMAIL_SIZE = 5 * 1024 * 1024; // 5MB limit
if (emailContent.length > MAX_EMAIL_SIZE) {
    const truncated = emailContent.substring(0, MAX_EMAIL_SIZE);
    return truncated + "\n\n[EMAIL TRUNCATED - ORIGINAL SIZE: " + emailContent.length + " bytes]";
}
```

#### **2. `structured_proposal` (JSONB)**
**Risk:** Massive AI-generated JSON (500KB+)
**Solution:**
```javascript
const AI_PROMPT = `Parse email into JSON. Keep under 100KB. Focus on: pricing, timeline, key terms only.`;
const MAX_JSON_SIZE = 500 * 1024; // 500KB
if (JSON.stringify(proposalData).length > MAX_JSON_SIZE) {
    throw new Error("Proposal too complex - manual review required");
}
```

#### **3. `structured_requirements` (JSONB)**
**Risk:** Complex RFP requirements (100KB+)
**Solution:**
```javascript
const RFP_PROMPT = `Generate concise RFP structure. Max 50KB JSON. Include: items, budget, timeline only.`;
const MAX_RFP_JSON = 100 * 1024; // 100KB
```

### **PostgreSQL Optimizations:**
```sql
-- Use JSONB for better performance
structured_proposal JSONB,
structured_requirements JSONB,
-- Set work memory for JSON operations
SET work_mem = '256MB';
```

---

## 🔧 **Technical Architecture**

### **Data Flow:**
```
User Input → Size Validation → AI Processing → Structured Data → Database Storage → UI Display
```

### **AI Integration Points:**
1. **RFP Generation**: Natural language → Structured JSON (max 100KB)
2. **Email Parsing**: Unstructured email → Proposal data (max 500KB)
3. **Comparison Analysis**: Multiple proposals → Scores + Recommendation

### **External Dependencies:**
- **Groq AI API**: Free AI service for NLP tasks
- **Email Provider**: Gmail SMTP/IMAP or SendGrid
- **PostgreSQL**: Primary database with JSONB support

---

## 📈 **Scalability Considerations**

### **Current Design (Single User):**
- Simple authentication (optional)
- Direct database access
- Synchronous AI processing

### **Future Enhancements:**
- Multi-tenant architecture
- Async AI processing queues
- Caching layer (Redis)
- Microservices architecture
- Real-time notifications (WebSocket)

---

## 🎯 **Key Design Decisions**

### **Database Design:**
- **5-table normalized structure** for data integrity
- **JSONB fields** for flexible AI-generated content with size limits
- **Audit trails** with created_at/updated_at timestamps
- **Status tracking** for email delivery and AI processing
- **Junction table** (RFP_VENDORS) for proper many-to-many relationships

### **AI Integration:**
- **Groq API** chosen for cost-effectiveness (free tier)
- **Size-limited prompts** for consistent, bounded AI outputs
- **Error handling** for AI service failures and oversized content
- **Processing status tracking** for pipeline management

### **Email Handling:**
- **IMAP polling** for reliable email reception
- **SMTP delivery** with message ID tracking
- **Email subject preservation** for parsing context
- **Size truncation** for large email content

### **Overflow Protection:**
- **Application-layer validation** before database insertion
- **AI prompt engineering** to limit output size
- **Graceful degradation** for oversized content
- **User-friendly error messages** for size limits

---

## 🚀 **Implementation Priority**

### **Phase 1 (MVP):**
1. **Database schema** with size constraints
2. **RFP creation** with AI (100KB limit)
3. **Vendor management** (basic CRUD)
4. **Email sending** with message ID tracking

### **Phase 2 (Core Features):**
1. **Email receiving** with size validation (5MB limit)
2. **AI proposal extraction** with JSON size limits (500KB)
3. **Comparison functionality** with dynamic generation
4. **UI for all workflows** with loading states

### **Phase 3 (Production Ready):**
1. **Advanced error handling** for oversized content
2. **Performance monitoring** for large JSON operations
3. **Email templates** and delivery optimization
4. **Database indexing** for JSONB queries

### **Backend Implementation Notes:**
- **Always validate sizes** before AI processing
- **Use JSONB** instead of JSON for better performance
- **Implement graceful truncation** for oversized content
- **Add database monitoring** for query performance
- **Use connection pooling** for concurrent operations

---

## 📝 **Viewing the Diagrams**

To view these Mermaid diagrams:

1. **VS Code**: Install "Mermaid Preview" extension
2. **Online**: Copy content to [mermaid.live](https://mermaid.live)
3. **GitHub**: Diagrams render automatically in markdown
4. **Local**: Use Mermaid CLI or browser extensions

---

## 🔄 **Diagram Updates**

These diagrams should be updated when:
- Database schema changes
- New system components added
- Workflow modifications
- Integration changes
- Performance optimizations

**Last Updated**: December 2024  
**Version**: 2.0 (Production Ready)  
**Status**: Final Schema with Overflow Protection